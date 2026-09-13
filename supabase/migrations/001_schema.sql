create extension if not exists "uuid-ossp";

create table public.users (
  id uuid primary key references auth.users on delete cascade,
  tipo text not null check (tipo in ('motorista','embarcador')),
  nome text not null, email text unique, telefone text unique,
  cpf_cnpj text unique, verificado boolean default false,
  avatar_url text, created_at timestamptz default now()
);

create table public.motoristas (
  user_id uuid primary key references public.users on delete cascade,
  cnh text, cidade_base text, uf_base char(2),
  raio_atuacao_km int default 100, aceita_carga_perigosa boolean default false
);

create table public.veiculos (
  id uuid primary key default uuid_generate_v4(),
  motorista_id uuid references public.users on delete cascade,
  tipo text not null, carroceria text not null, placa text,
  capacidade_kg int, ano int, created_at timestamptz default now()
);

create table public.embarcadores (
  user_id uuid primary key references public.users on delete cascade,
  razao_social text, nome_fantasia text, segmento text, endereco text
);

create table public.fretes (
  id uuid primary key default uuid_generate_v4(),
  embarcador_id uuid references public.users on delete cascade,
  origem_cidade text not null, origem_uf char(2) not null,
  destino_cidade text not null, destino_uf char(2) not null,
  tipo_carga text not null, tipo_veiculo text not null, carroceria text not null,
  peso_kg int not null, valor_oferecido numeric(12,2),
  data_coleta date not null, descricao text,
  status text default 'aberto' check (status in ('aberto','negociando','fechado','cancelado','entregue')),
  created_at timestamptz default now()
);
create index fretes_busca_idx on fretes (origem_uf, destino_uf, data_coleta, status);
create index fretes_emb_idx on fretes (embarcador_id, status);

create table public.propostas (
  id uuid primary key default uuid_generate_v4(),
  frete_id uuid references public.fretes on delete cascade,
  motorista_id uuid references public.users on delete cascade,
  valor numeric(12,2) not null, mensagem text,
  status text default 'pendente' check (status in ('pendente','aceita','recusada','cancelada')),
  created_at timestamptz default now(), unique(frete_id, motorista_id)
);

create table public.conversas (
  id uuid primary key default uuid_generate_v4(),
  frete_id uuid references public.fretes on delete cascade,
  embarcador_id uuid references public.users,
  motorista_id uuid references public.users,
  created_at timestamptz default now(), unique(frete_id, motorista_id)
);

create table public.mensagens (
  id uuid primary key default uuid_generate_v4(),
  conversa_id uuid references public.conversas on delete cascade,
  autor_id uuid references public.users,
  conteudo text not null, lida boolean default false,
  created_at timestamptz default now()
);

create table public.avaliacoes (
  id uuid primary key default uuid_generate_v4(),
  frete_id uuid references public.fretes on delete cascade,
  avaliador_id uuid references public.users,
  avaliado_id uuid references public.users,
  nota int check (nota between 1 and 5), comentario text,
  created_at timestamptz default now(), unique(frete_id, avaliador_id)
);

create table public.notificacoes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade,
  tipo text not null, titulo text not null, corpo text,
  payload jsonb, lida boolean default false, created_at timestamptz default now()
);

create table public.documentos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade,
  tipo text not null, url text not null,
  status text default 'pendente' check (status in ('pendente','aprovado','rejeitado')),
  created_at timestamptz default now()
);

create table public.push_tokens (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade,
  token text not null, plataforma text, created_at timestamptz default now(),
  unique(user_id, token)
);
