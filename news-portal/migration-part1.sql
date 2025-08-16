-- TEIL 1: Tabellen erstellen
-- Führe diesen Teil zuerst aus

-- 1. Artikel-Gesamtzähler
create table if not exists public.article_views_total (
  article_id uuid primary key references articles(id) on delete cascade,
  views bigint not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Zeitlich granulare Views
create table if not exists public.article_views_daily (
  article_id uuid references articles(id) on delete cascade,
  day date not null,
  views bigint not null default 0,
  created_at timestamptz default now(),
  primary key (article_id, day)
);

-- 3. Deduplizierungs-Keys
create table if not exists public.article_view_keys (
  key text primary key,
  expires_at timestamptz not null
);

-- 4. Bot User-Agents Blocklist
create table if not exists public.bot_user_agents (
  ua_prefix text primary key,
  created_at timestamptz default now()
);

-- Indices
create index if not exists idx_article_views_daily_day on article_views_daily(day desc);
create index if not exists idx_article_view_keys_expires on article_view_keys(expires_at);