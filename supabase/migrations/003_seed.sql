insert into public.users (id, tipo, nome, email, telefone, cpf_cnpj, verificado) values
  ('00000000-0000-0000-0000-000000000001','embarcador','Transportadora Alfa LTDA','alfa@teste.com','+5511999990001','12345678000190',true),
  ('00000000-0000-0000-0000-000000000002','embarcador','Frigorífico Beta SA','beta@teste.com','+5511999990002','12345678000191',true),
  ('00000000-0000-0000-0000-000000000003','embarcador','AgroGamma Exportadora','gamma@teste.com','+5511999990003','12345678000192',true),
  ('00000000-0000-0000-0000-000000000011','motorista','João da Silva','joao@teste.com','+5511999990011','12345678901',true),
  ('00000000-0000-0000-0000-000000000012','motorista','Carlos Oliveira','carlos@teste.com','+5511999990012','12345678902',true),
  ('00000000-0000-0000-0000-000000000013','motorista','Marcos Pereira','marcos@teste.com','+5511999990013','12345678903',true)
on conflict do nothing;

insert into public.embarcadores (user_id, razao_social, nome_fantasia, segmento, endereco) values
  ('00000000-0000-0000-0000-000000000001','Transportadora Alfa LTDA','Alfa Log','geral','Av. Paulista 1000, SP'),
  ('00000000-0000-0000-0000-000000000002','Frigorífico Beta SA','Beta Cool','refrigerada','Rod. BR-116 km 20, CWB'),
  ('00000000-0000-0000-0000-000000000003','AgroGamma Exportadora','Gamma Agro','granel','Av. das Nações 500, ROO')
on conflict do nothing;

insert into public.motoristas (user_id, cnh, cidade_base, uf_base, raio_atuacao_km, aceita_carga_perigosa) values
  ('00000000-0000-0000-0000-000000000011','12345678901','São Paulo','SP',500,false),
  ('00000000-0000-0000-0000-000000000012','12345678902','Curitiba','PR',700,true),
  ('00000000-0000-0000-0000-000000000013','12345678903','Goiânia','GO',900,false)
on conflict do nothing;

insert into public.veiculos (motorista_id, tipo, carroceria, placa, capacidade_kg, ano) values
  ('00000000-0000-0000-0000-000000000011','carreta','bau','ABC1D23',27000,2021),
  ('00000000-0000-0000-0000-000000000011','truck','sider','DEF4G56',12000,2019),
  ('00000000-0000-0000-0000-000000000012','carreta','graneleiro','GHI7J89',32000,2022),
  ('00000000-0000-0000-0000-000000000013','truck','bau','JKL1M23',14000,2020)
on conflict do nothing;

insert into public.fretes
  (embarcador_id, origem_cidade, origem_uf, destino_cidade, destino_uf,
   tipo_carga, tipo_veiculo, carroceria, peso_kg, valor_oferecido,
   data_coleta, descricao, status)
values
  ('00000000-0000-0000-0000-000000000001','São Paulo','SP','Rio de Janeiro','RJ','geral','truck','bau',12000,1800,'2025-11-05','Coleta às 07h','aberto'),
  ('00000000-0000-0000-0000-000000000001','São Paulo','SP','Curitiba','PR','geral','carreta','bau',24000,4200,'2025-11-06','Paletizada','aberto'),
  ('00000000-0000-0000-0000-000000000001','Campinas','SP','Belo Horizonte','MG','geral','truck','sider',13500,2600,'2025-11-07','2 pontos descarga','aberto'),
  ('00000000-0000-0000-0000-000000000001','São Paulo','SP','Porto Alegre','RS','geral','carreta','bau',26000,6500,'2025-11-10','BR-116','aberto'),
  ('00000000-0000-0000-0000-000000000001','Santos','SP','Salvador','BA','geral','carreta','graneleiro',28000,8900,'2025-11-12','Conteinerizada','aberto'),
  ('00000000-0000-0000-0000-000000000001','Ribeirão Preto','SP','Brasília','DF','geral','truck','bau',11000,3100,'2025-11-08','Doc em ordem','aberto'),
  ('00000000-0000-0000-0000-000000000001','São Paulo','SP','Florianópolis','SC','geral','carreta','sider',22000,5100,'2025-11-09','Coleta no CD','aberto'),
  ('00000000-0000-0000-0000-000000000002','Curitiba','PR','São Paulo','SP','refrigerada','carreta','sider',20000,3800,'2025-11-05','Baú -18','aberto'),
  ('00000000-0000-0000-0000-000000000002','Joinville','SC','Porto Alegre','RS','refrigerada','truck','sider',9000,2200,'2025-11-07','Carnes','aberto'),
  ('00000000-0000-0000-0000-000000000002','Curitiba','PR','Campinas','SP','refrigerada','carreta','sider',21000,3600,'2025-11-08','Termógrafo','aberto'),
  ('00000000-0000-0000-0000-000000000002','Londrina','PR','Ribeirão Preto','SP','refrigerada','truck','sider',10000,2400,'2025-11-09','Frios','aberto'),
  ('00000000-0000-0000-0000-000000000002','Ponta Grossa','PR','Santos','SP','refrigerada','carreta','sider',22000,4100,'2025-11-11','Exportação','aberto'),
  ('00000000-0000-0000-0000-000000000002','Curitiba','PR','Goiânia','GO','refrigerada','carreta','sider',23000,5800,'2025-11-13','Rota longa','aberto'),
  ('00000000-0000-0000-0000-000000000003','Rondonópolis','MT','Santos','SP','granel','carreta','graneleiro',32000,9200,'2025-11-06','Soja','aberto'),
  ('00000000-0000-0000-0000-000000000003','Sorriso','MT','Paranaguá','PR','granel','carreta','graneleiro',33000,10500,'2025-11-08','Milho','aberto'),
  ('00000000-0000-0000-0000-000000000003','Rio Verde','GO','Santos','SP','granel','carreta','graneleiro',31000,7300,'2025-11-09','Soja','aberto'),
  ('00000000-0000-0000-0000-000000000003','Dourados','MS','Paranaguá','PR','granel','carreta','graneleiro',32000,6900,'2025-11-10','Milho safrinha','aberto'),
  ('00000000-0000-0000-0000-000000000003','Cuiabá','MT','São Paulo','SP','granel','carreta','graneleiro',30000,7600,'2025-11-12','Algodão','aberto'),
  ('00000000-0000-0000-0000-000000000003','Uberlândia','MG','Santos','SP','granel','carreta','graneleiro',29000,5200,'2025-11-14','Açúcar','aberto'),
  ('00000000-0000-0000-0000-000000000001','São Paulo','SP','Curitiba','PR','geral','carreta','bau',24000,4200,'2025-10-20','Entregue','entregue')
on conflict do nothing;

do $$
declare v_frete uuid;
begin
  select id into v_frete from public.fretes where status='entregue' limit 1;
  if v_frete is not null then
    insert into public.propostas (frete_id, motorista_id, valor, mensagem, status)
    values (v_frete,'00000000-0000-0000-0000-000000000011',4200,'Disponível','aceita') on conflict do nothing;
    insert into public.avaliacoes (frete_id, avaliador_id, avaliado_id, nota, comentario) values
      (v_frete,'00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000011',5,'Pontual'),
      (v_frete,'00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000001',5,'Pagou em dia')
    on conflict do nothing;
  end if;
end $$;
