create extension if not exists pg_net;

create or replace function public.notify_novo_frete()
returns trigger language plpgsql security definer as $$
declare v_url text; v_key text;
begin
  v_url := current_setting('app.supabase_url', true);
  v_key := current_setting('app.service_role_key', true);
  if v_url is null or v_key is null then return new; end if;
  perform net.http_post(
    url := v_url || '/functions/v1/matching-frete',
    headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key),
    body := jsonb_build_object('record', row_to_json(new))
  );
  return new;
end; $$;

drop trigger if exists trg_notify_novo_frete on public.fretes;
create trigger trg_notify_novo_frete
after insert on public.fretes
for each row when (new.status='aberto')
execute function public.notify_novo_frete();
