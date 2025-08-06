-- Profile-Tabelle (Admin-Flag)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "self read" on public.profiles for select using (auth.uid() = id);

-- Hilfsfunktion
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- Kategorien
create table if not exists public.categories (
  id bigserial primary key,
  name text unique,
  slug text unique,
  subdomain text unique,
  created_at timestamptz default now()
);
alter table public.categories enable row level security;
create policy "categories are public" on public.categories for select using (true);

insert into public.categories (name,slug,subdomain) values
  ('Finanzen','finanzen','finanzen'),
  ('Alltag','alltag','alltag'),
  ('Gesundheit','gesundheit','gesundheit'),
  ('Technologie','technologie','technologie'),
  ('Karriere','karriere','karriere'),
  ('Bildung','bildung','bildung'),
  ('Reisen','reisen','reisen'),
  ('Recht','recht','recht'),
  ('Sport','sport','sport'),
  ('Lifestyle','lifestyle','lifestyle'),
  ('Auto','auto','auto'),
  ('Wissenschaft','wissenschaft','wissenschaft')
on conflict do nothing;

-- Artikel
create extension if not exists pgcrypto;
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text,
  slug text unique,
  excerpt text,
  content_html text,
  category_id bigint references public.categories(id),
  status text check (status in ('draft','published')),
  views bigint default 0,
  author_id uuid references auth.users(id),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.articles enable row level security;

-- RLS: lesen = published
create policy "read published" on public.articles
  for select using (status = 'published' or public.is_admin());

-- schreiben/löschen nur Admin
create policy "write admin" on public.articles
  for insert with check (public.is_admin());
create policy "update admin" on public.articles
  for update using (public.is_admin());
create policy "delete admin" on public.articles
  for delete using (public.is_admin());