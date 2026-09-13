import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors = { "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type" };
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { record: frete } = await req.json();
    if (!frete?.id) return json({ ok:false, erro:"sem frete" });
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: veiculos } = await supabase.from("veiculos")
      .select("motorista_id, tipo, carroceria, capacidade_kg")
      .eq("tipo", frete.tipo_veiculo).eq("carroceria", frete.carroceria)
      .gte("capacidade_kg", frete.peso_kg);
    if (!veiculos?.length) return json({ ok:true, notificados:0 });
    const ids = [...new Set(veiculos.map((v:any)=>v.motorista_id))];
    const { data: motoristas } = await supabase.from("motoristas").select("user_id, uf_base").in("user_id", ids);
    const elegiveis = (motoristas??[]).filter((m:any)=>m.uf_base===frete.origem_uf || m.uf_base===frete.destino_uf);
    if (!elegiveis.length) return json({ ok:true, notificados:0 });
    await supabase.from("notificacoes").insert(elegiveis.map((m:any)=>({
      user_id:m.user_id, tipo:"novo_frete", titulo:"Novo frete compatível",
      corpo:`${frete.origem_uf} → ${frete.destino_uf} (${frete.tipo_veiculo}/${frete.carroceria})`,
      payload:{ frete_id: frete.id },
    })));
    const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-push`;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    await Promise.all(elegiveis.map((m:any)=>fetch(url,{
      method:"POST",
      headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${serviceKey}` },
      body: JSON.stringify({ user_id:m.user_id, titulo:"Novo frete compatível", corpo:`${frete.origem_uf} → ${frete.destino_uf}`, payload:{ frete_id: frete.id } }),
    })));
    return json({ ok:true, notificados: elegiveis.length });
  } catch (e) { return json({ ok:false, erro:String(e) }, 500); }
});
function json(body: unknown, status=200) {
  return new Response(JSON.stringify(body), { status, headers:{...cors,"Content-Type":"application/json"} });
}
