import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors = { "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type" };
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const { user_id, titulo, corpo, payload } = await req.json();
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  await supabase.from("notificacoes").insert({ user_id, tipo:"push", titulo, corpo, payload });
  const { data: tokens } = await supabase.from("push_tokens").select("token").eq("user_id", user_id);
  if (tokens?.length) {
    const messages = tokens.map((t: any) => ({ to: t.token, title: titulo, body: corpo, data: payload ?? {} }));
    await fetch("https://exp.host/--/api/v2/push/send", {
      method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(messages),
    });
  }
  return new Response(JSON.stringify({ ok:true }), { headers: {...cors,"Content-Type":"application/json"} });
});
