alter table users enable row level security;
alter table motoristas enable row level security;
alter table embarcadores enable row level security;
alter table veiculos enable row level security;
alter table fretes enable row level security;
alter table propostas enable row level security;
alter table conversas enable row level security;
alter table mensagens enable row level security;
alter table avaliacoes enable row level security;
alter table notificacoes enable row level security;
alter table documentos enable row level security;
alter table push_tokens enable row level security;

create policy users_read on users for select using (auth.role()='authenticated');
create policy users_self_insert on users for insert with check (auth.uid()=id);
create policy users_self_update on users for update using (auth.uid()=id);

create policy mot_read on motoristas for select using (auth.role()='authenticated');
create policy mot_self on motoristas for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

create policy emb_read on embarcadores for select using (auth.role()='authenticated');
create policy emb_self on embarcadores for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

create policy vei_read on veiculos for select using (auth.role()='authenticated');
create policy vei_self on veiculos for all using (auth.uid()=motorista_id) with check (auth.uid()=motorista_id);

create policy fretes_read on fretes for select using (auth.role()='authenticated');
create policy fretes_ins on fretes for insert with check (auth.uid()=embarcador_id);
create policy fretes_upd on fretes for update using (auth.uid()=embarcador_id);
create policy fretes_del on fretes for delete using (auth.uid()=embarcador_id);

create policy prop_read on propostas for select using (
  auth.uid()=motorista_id or auth.uid() in (select embarcador_id from fretes where fretes.id=propostas.frete_id)
);
create policy prop_ins on propostas for insert with check (auth.uid()=motorista_id);
create policy prop_upd on propostas for update using (
  auth.uid()=motorista_id or auth.uid() in (select embarcador_id from fretes where fretes.id=propostas.frete_id)
);

create policy conv_read on conversas for select using (auth.uid()=embarcador_id or auth.uid()=motorista_id);
create policy conv_ins on conversas for insert with check (auth.uid()=embarcador_id or auth.uid()=motorista_id);

create policy msg_read on mensagens for select using (
  auth.uid() in (select embarcador_id from conversas where conversas.id=mensagens.conversa_id)
  or auth.uid() in (select motorista_id from conversas where conversas.id=mensagens.conversa_id)
);
create policy msg_ins on mensagens for insert with check (auth.uid()=autor_id);

create policy aval_read on avaliacoes for select using (auth.role()='authenticated');
create policy aval_ins on avaliacoes for insert with check (auth.uid()=avaliador_id);

create policy notif_own on notificacoes for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy doc_read on documentos for select using (auth.uid()=user_id);
create policy doc_ins on documentos for insert with check (auth.uid()=user_id);
create policy push_own on push_tokens for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
