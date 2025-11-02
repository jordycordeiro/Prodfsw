-- =========================================================
-- PRODOC - MIGRAÇÃO ÚNICA / IDPOTENTE
-- Tabelas + RLS + Funções + Permissões
-- =========================================================

-- 0) Extensões úteis
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- 1) PROFILES
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  role       text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from information_schema.columns
                 where table_schema='public' and table_name='profiles' and column_name='email')
  then alter table public.profiles add column email text; end if;

  if not exists (select 1 from information_schema.columns
                 where table_schema='public' and table_name='profiles' and column_name='updated_at')
  then alter table public.profiles add column updated_at timestamptz not null default now(); end if;
end$$;

-- Semeia perfis a partir do auth.users (idempotente)
insert into public.profiles (id, email)
select u.id, u.email
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- 1.1) Função utilitária: is_admin()
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- 2) TEMPLATES
create table if not exists public.templates (
  id           uuid primary key default gen_random_uuid(),
  set_id       uuid,
  kind         text,
  title        text not null,
  sex          text,
  content_md   text,
  content_json jsonb,
  order_index  integer,
  version      integer not null default 1,
  status       text not null default 'draft' check (status in ('draft','published')),
  created_by   uuid default auth.uid(),
  updated_by   uuid default auth.uid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='templates' and column_name='version')
  then alter table public.templates add column version integer not null default 1; end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='templates' and column_name='status')
  then alter table public.templates add column status text not null default 'draft' check (status in ('draft','published')); end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='templates' and column_name='created_by')
  then alter table public.templates add column created_by uuid default auth.uid(); end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='templates' and column_name='updated_by')
  then alter table public.templates add column updated_by uuid default auth.uid(); end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='templates' and column_name='updated_at')
  then alter table public.templates add column updated_at timestamptz not null default now(); end if;
end$$;

alter table public.templates enable row level security;

-- Limpa políticas antigas (se existirem) e recria
do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='templates' and policyname='templates_select_admin_or_owner') then
    drop policy "templates_select_admin_or_owner" on public.templates;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='templates' and policyname='templates_insert_admin_or_owner') then
    drop policy "templates_insert_admin_or_owner" on public.templates;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='templates' and policyname='templates_update_admin_or_owner') then
    drop policy "templates_update_admin_or_owner" on public.templates;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='templates' and policyname='templates_delete_admin') then
    drop policy "templates_delete_admin" on public.templates;
  end if;
end$$;

create policy "templates_select_admin_or_owner"
on public.templates
for select
to authenticated
using ( public.is_admin() or created_by = auth.uid() );

create policy "templates_insert_admin_or_owner"
on public.templates
for insert
to authenticated
with check ( public.is_admin() or created_by = auth.uid() );

create policy "templates_update_admin_or_owner"
on public.templates
for update
to authenticated
using ( public.is_admin() or created_by = auth.uid() )
with check ( public.is_admin() or created_by = auth.uid() );

create policy "templates_delete_admin"
on public.templates
for delete
to authenticated
using ( public.is_admin() );

-- 3) BROADCASTS + USER_INBOX
create table if not exists public.broadcasts (
  id           uuid primary key default gen_random_uuid(),
  template_id  uuid not null references public.templates(id) on delete cascade,
  version      integer not null,
  note         text,
  created_by   uuid not null default auth.uid(),
  created_at   timestamptz not null default now(),
  unique (template_id, version)
);

create table if not exists public.user_inbox (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  broadcast_id  uuid not null references public.broadcasts(id) on delete cascade,
  status        text not null default 'new' check (status in ('new','applied','ignored')),
  submenu_id    uuid,
  created_at    timestamptz not null default now(),
  applied_at    timestamptz
);

alter table public.broadcasts enable row level security;
alter table public.user_inbox enable row level security;

do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='broadcasts' and policyname='broadcasts_select_admin_or_creator') then
    drop policy "broadcasts_select_admin_or_creator" on public.broadcasts;
  end if;
end$$;

create policy "broadcasts_select_admin_or_creator"
on public.broadcasts
for select
to authenticated
using ( public.is_admin() or created_by = auth.uid() );

do $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='user_inbox' and policyname='user_inbox_select_owner') then
    drop policy "user_inbox_select_owner" on public.user_inbox;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='user_inbox' and policyname='user_inbox_update_owner') then
    drop policy "user_inbox_update_owner" on public.user_inbox;
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='user_inbox' and policyname='user_inbox_insert_admin') then
    drop policy "user_inbox_insert_admin" on public.user_inbox;
  end if;
end$$;

create policy "user_inbox_select_owner"
on public.user_inbox
for select
to authenticated
using ( user_id = auth.uid() );

create policy "user_inbox_update_owner"
on public.user_inbox
for update
to authenticated
using ( user_id = auth.uid() )
with check ( user_id = auth.uid() );

create policy "user_inbox_insert_admin"
on public.user_inbox
for insert
to authenticated
with check ( public.is_admin() );

-- 4) RPC: publish_template
drop function if exists public.publish_template(uuid, integer, text);

create function public.publish_template(
  p_template_id uuid,
  p_version     integer,
  p_note        text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_bcast_id uuid;
begin
  if not public.is_admin() then
    raise exception 'only admin can publish' using errcode='42501';
  end if;

  insert into public.broadcasts (template_id, version, note, created_by)
  values (p_template_id, p_version, p_note, auth.uid())
  on conflict (template_id, version) do update
    set note = excluded.note
  returning id into v_bcast_id;

  insert into public.user_inbox (user_id, broadcast_id)
  select p.id, v_bcast_id
  from public.profiles p
  where p.id <> auth.uid()
    and not exists (
      select 1 from public.user_inbox ui
      where ui.user_id = p.id and ui.broadcast_id = v_bcast_id
    );

  return v_bcast_id;
end;
$$;

-- 5) RPC: apply_inbox_item
drop function if exists public.apply_inbox_item(uuid, uuid);

create function public.apply_inbox_item(
  p_inbox_id  uuid,
  p_submenu_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
begin
  select user_id into v_owner from public.user_inbox where id = p_inbox_id;
  if v_owner is null then
    raise exception 'inbox item not found' using errcode='23503';
  end if;

  if not (public.is_admin() or v_owner = auth.uid()) then
    raise exception 'forbidden' using errcode='42501';
  end if;

  update public.user_inbox
  set status = 'applied',
      submenu_id = coalesce(p_submenu_id, submenu_id),
      applied_at = now()
  where id = p_inbox_id;
end;
$$;

-- 6) Grants
grant execute on function public.publish_template(uuid, integer, text) to authenticated;
grant execute on function public.apply_inbox_item(uuid, uuid)         to authenticated;

-- 7) Índices úteis
create index if not exists idx_templates_created_by on public.templates(created_by);
create index if not exists idx_broadcasts_template   on public.broadcasts(template_id, version);
create index if not exists idx_user_inbox_user       on public.user_inbox(user_id);
create index if not exists idx_user_inbox_bcast      on public.user_inbox(broadcast_id);

-- FIM
