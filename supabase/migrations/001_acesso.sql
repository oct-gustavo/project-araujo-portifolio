-- =====================================================================
-- 001_acesso.sql — acesso ao painel (login, bloqueio por tentativas, 2FA)
-- Rode uma vez no SQL Editor do projeto NOVO do Supabase.
-- Todas as tabelas ficam com RLS ligado e SEM políticas: só o servidor
-- (chave service_role) consegue ler ou gravar. O navegador nunca acessa.
-- =====================================================================

-- Quem pode entrar no painel (só você).
create table if not exists public.usuarios_admin (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null unique,
  criado_em   timestamptz not null default now()
);

-- Contagem de tentativas erradas (senha ou código), por e-mail e por IP.
-- "chave" é um hash HMAC, então nem o e-mail nem o IP ficam gravados em texto.
create table if not exists public.tentativas_login (
  chave          text primary key,
  falhas         integer not null default 0,
  bloqueado_ate  timestamptz,
  atualizado_em  timestamptz not null default now()
);

-- Códigos de backup do 2FA: só o hash (scrypt + salt) fica gravado.
create table if not exists public.codigos_backup (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid not null references auth.users (id) on delete cascade,
  hash        text not null,
  salt        text not null,
  usado_em    timestamptz,
  criado_em   timestamptz not null default now()
);

create index if not exists codigos_backup_disponiveis
  on public.codigos_backup (usuario_id)
  where usado_em is null;

-- RLS ligado, sem políticas = acesso negado para anon e authenticated.
alter table public.usuarios_admin   enable row level security;
alter table public.tentativas_login enable row level security;
alter table public.codigos_backup   enable row level security;

revoke all on public.usuarios_admin, public.tentativas_login, public.codigos_backup
  from anon, authenticated;

-- ---------------------------------------------------------------------
-- registrar_falha_login: soma uma falha de forma atômica e bloqueia ao
-- chegar no limite (padrão: 3 falhas = 15 minutos de bloqueio).
-- Falhas com mais de 1 hora são esquecidas. Durante o bloqueio, novas
-- tentativas não somam nem estendem o tempo.
-- ---------------------------------------------------------------------
create or replace function public.registrar_falha_login(
  p_chave   text,
  p_max     integer default 3,
  p_minutos integer default 15
)
returns table (total_falhas integer, bloqueio_ate timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_falhas integer;
  v_bloq   timestamptz;
begin
  insert into public.tentativas_login as t (chave, falhas, bloqueado_ate, atualizado_em)
  values (p_chave, 1, null, now())
  on conflict (chave) do update
    set falhas = case
                   when t.bloqueado_ate > now() then t.falhas
                   when t.bloqueado_ate is not null
                     or t.atualizado_em < now() - interval '1 hour' then 1
                   else t.falhas + 1
                 end,
        bloqueado_ate = case when t.bloqueado_ate > now() then t.bloqueado_ate else null end,
        atualizado_em = now()
  returning t.falhas, t.bloqueado_ate into v_falhas, v_bloq;

  if v_bloq is null and v_falhas >= p_max then
    update public.tentativas_login as t
       set bloqueado_ate = now() + make_interval(mins => p_minutos)
     where t.chave = p_chave
    returning t.bloqueado_ate into v_bloq;
  end if;

  return query select v_falhas, v_bloq;
end;
$$;

revoke execute on function public.registrar_falha_login(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.registrar_falha_login(text, integer, integer)
  to service_role;

-- ---------------------------------------------------------------------
-- Depois de criar seu usuário em Authentication > Users > Add user,
-- rode a linha abaixo trocando pelo seu e-mail exclusivo deste sistema:
--
-- insert into public.usuarios_admin (id, email)
-- select id, email from auth.users where email = 'SEU-EMAIL-AQUI';
-- ---------------------------------------------------------------------
