-- =====================================================================
-- 002_configuracoes.sql — configurações do painel e tipos de negócio
-- Rode uma vez no SQL Editor, depois do 001_acesso.sql.
-- Pode rodar de novo sem problema (não duplica nada).
-- =====================================================================

-- Uma linha só (id = 1) com as preferências do painel.
create table if not exists public.configuracoes (
  id                smallint primary key default 1 check (id = 1),
  meta_semanal      integer not null default 50 check (meta_semanal between 1 and 500),
  cidade_padrao     text not null default '' check (char_length(cidade_padrao) <= 80),
  -- rigida: site fraco = não abre, sem HTTPS ou sem versão para celular
  -- branda: site fraco = só quando não abre
  regra_site_fraco  text not null default 'rigida' check (regra_site_fraco in ('rigida', 'branda')),
  atualizado_em     timestamptz not null default now()
);

insert into public.configuracoes (id) values (1) on conflict do nothing;

-- Opções que aparecem no cadastro de lead.
create table if not exists public.tipos_negocio (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null check (char_length(btrim(nome)) between 1 and 60),
  ordem      integer not null default 0,
  criado_em  timestamptz not null default now()
);

create unique index if not exists tipos_negocio_nome_unico on public.tipos_negocio (lower(btrim(nome)));

insert into public.tipos_negocio (nome, ordem) values
  ('Imobiliária', 1), ('Corretor de imóveis', 2), ('Salão de beleza', 3), ('Clínica', 4),
  ('Restaurante', 5), ('Oficina mecânica', 6), ('Pet shop', 7), ('Padaria', 8)
on conflict do nothing;

-- Mesmo padrão do 001: RLS ligado, sem políticas, só o servidor acessa.
alter table public.configuracoes enable row level security;
alter table public.tipos_negocio enable row level security;
revoke all on public.configuracoes, public.tipos_negocio from anon, authenticated;

-- Permissões explícitas para a chave do servidor (service_role) em todas as tabelas do projeto,
-- para não depender do padrão do Supabase.
grant usage on schema public to service_role;
grant select, insert, update, delete on
  public.usuarios_admin, public.tentativas_login, public.codigos_backup,
  public.configuracoes, public.tipos_negocio
to service_role;
grant execute on function public.registrar_falha_login(text, integer, integer) to service_role;
