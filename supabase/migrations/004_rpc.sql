create or replace function aceitar_proposta(p_id uuid)
returns void language plpgsql security definer as $$
declare v_frete uuid; v_mot uuid; v_emb uuid;
begin
  select frete_id, motorista_id into v_frete, v_mot from propostas where id=p_id;
  if v_frete is null then raise exception 'proposta não encontrada'; end if;
  select embarcador_id into v_emb from fretes where id=v_frete;
  if v_emb <> auth.uid() then raise exception 'não autorizado'; end if;
  update propostas set status='aceita' where id=p_id;
  update propostas set status='recusada' where frete_id=v_frete and id<>p_id;
  update fretes set status='fechado' where id=v_frete;
  insert into conversas (frete_id, embarcador_id, motorista_id)
  values (v_frete, v_emb, v_mot)
  on conflict (frete_id, motorista_id) do nothing;
end; $$;
