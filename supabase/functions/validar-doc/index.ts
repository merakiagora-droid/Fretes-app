import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const cors = { "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type" };
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { cpf_cnpj } = await req.json();
    const doc = String(cpf_cnpj||"").replace(/\D/g,"");
    if (doc.length !== 11 && doc.length !== 14)
      return new Response(JSON.stringify({ valido:false, erro:"tamanho inválido" }), { headers: {...cors,"Content-Type":"application/json"} });
    const url = doc.length===11
      ? `https://brasilapi.com.br/api/cpf/v1/${doc}`
      : `https://brasilapi.com.br/api/cnpj/v1/${doc}`;
    const r = await fetch(url);
    if (!r.ok) return new Response(JSON.stringify({ valido:false, erro:"não encontrado" }), { headers: {...cors,"Content-Type":"application/json"} });
    const data = await r.json();
    return new Response(JSON.stringify({ valido:true, nome: data.nome||data.razao_social }), { headers: {...cors,"Content-Type":"application/json"} });
  } catch (e) {
    return new Response(JSON.stringify({ valido:false, erro:String(e) }), { headers: {...cors,"Content-Type":"application/json"} });
  }
});
