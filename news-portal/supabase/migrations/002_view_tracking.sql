-- View-Tracking-System für robuste Artikelaufrufe-Zählung
-- Mit Bot-Filterung und Deduplizierung

-- 1. Artikel-Gesamtzähler
create table if not exists public.article_views_total (
  article_id uuid primary key references articles(id) on delete cascade,
  views bigint not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Zeitlich granulare Views (für "Meistgelesen" nach Zeitraum)
create table if not exists public.article_views_daily (
  article_id uuid references articles(id) on delete cascade,
  day date not null,
  views bigint not null default 0,
  created_at timestamptz default now(),
  primary key (article_id, day)
);

-- Index für schnelle Zeitraum-Abfragen
create index if not exists idx_article_views_daily_day 
  on article_views_daily(day desc);

-- 3. Deduplizierungs-Keys (temporär, automatisch bereinigt)
create table if not exists public.article_view_keys (
  key text primary key,
  expires_at timestamptz not null
);

-- Index für automatische Bereinigung
create index if not exists idx_article_view_keys_expires 
  on article_view_keys(expires_at);

-- 4. Bot User-Agents Blocklist
create table if not exists public.bot_user_agents (
  ua_prefix text primary key,
  created_at timestamptz default now()
);

-- Standard Bot-Patterns einfügen
insert into public.bot_user_agents (ua_prefix) values
  ('bot'), ('spider'), ('crawler'), ('preview'),
  ('facebookexternalhit'), ('slurp'), ('duckduckbot'),
  ('bingbot'), ('baiduspider'), ('yandexbot'),
  ('ahrefsbot'), ('semrushbot'), ('mj12bot'),
  ('dotbot'), ('applebot'), ('twitterbot'),
  ('linkedinbot'), ('whatsapp'), ('telegram'),
  ('discord'), ('slack'), ('pinterest'),
  ('lighthouse'), ('gtmetrix'), ('pingdom')
on conflict (ua_prefix) do nothing;

-- RLS deaktivieren für Performance
alter table public.article_views_total enable row level security;
alter table public.article_views_daily enable row level security;
alter table public.article_view_keys enable row level security;
alter table public.bot_user_agents enable row level security;

-- Öffentliche Leseberechtigung für Views
create policy "Öffentlich lesbar" on public.article_views_total
  for select using (true);

create policy "Öffentlich lesbar" on public.article_views_daily
  for select using (true);

-- Service-Role kann alles
create policy "Service role full access" on public.article_views_total
  for all using (auth.jwt()->>'role' = 'service_role');

create policy "Service role full access" on public.article_views_daily
  for all using (auth.jwt()->>'role' = 'service_role');

create policy "Service role full access" on public.article_view_keys
  for all using (auth.jwt()->>'role' = 'service_role');

-- RPC-Funktionen für atomare Operationen

-- Dedupe-Check mit automatischer Bereinigung
create or replace function public.dedupe_view(p_key text, p_ttl_minutes int default 720)
returns boolean
language plpgsql
security definer
as $$
declare
  v_exists boolean;
begin
  -- Prüfe ob Key existiert und noch gültig ist
  select exists(
    select 1 from article_view_keys 
    where key = p_key and expires_at > now()
  ) into v_exists;
  
  if v_exists then
    return false; -- View bereits gezählt
  end if;
  
  -- Neuen Key einfügen
  insert into article_view_keys(key, expires_at)
  values (p_key, now() + make_interval(mins => p_ttl_minutes))
  on conflict (key) do nothing;
  
  -- Gelegentlich alte Keys löschen (1% Chance)
  if random() < 0.01 then
    delete from article_view_keys where expires_at < now();
  end if;
  
  return true; -- View kann gezählt werden
end;
$$;

-- Atomar Views erhöhen (total)
create or replace function public.inc_article_views_total(p_article_id uuid)
returns void
language sql
security definer
as $$
  insert into article_views_total(article_id, views, updated_at) 
  values (p_article_id, 1, now())
  on conflict (article_id) do update 
  set views = article_views_total.views + 1,
      updated_at = now();
$$;

-- Atomar Views erhöhen (daily)
create or replace function public.inc_article_views_daily(p_article_id uuid, p_day date)
returns void
language sql
security definer
as $$
  insert into article_views_daily(article_id, day, views) 
  values (p_article_id, p_day, 1)
  on conflict (article_id, day) do update 
  set views = article_views_daily.views + 1;
$$;

-- Helper: 30-Tage Views abrufen
create or replace function public.get_article_views_30d(p_article_id uuid)
returns bigint
language sql
stable
as $$
  select coalesce(sum(views), 0)::bigint
  from article_views_daily
  where article_id = p_article_id 
    and day >= current_date - interval '30 days';
$$;

-- Helper: Top Artikel nach Views (30 Tage)
create or replace function public.get_top_articles_30d(p_limit int default 6)
returns table(
  article_id uuid,
  views_30d bigint
)
language sql
stable
as $$
  select 
    article_id,
    sum(views)::bigint as views_30d
  from article_views_daily
  where day >= current_date - interval '30 days'
  group by article_id
  order by views_30d desc
  limit p_limit;
$$;

-- Migration der existierenden Views aus articles Tabelle
insert into article_views_total (article_id, views)
select id, coalesce(views, 0)
from articles
where views > 0
on conflict (article_id) do update
set views = excluded.views;

-- Trigger für updated_at
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_article_views_total_updated_at
  before update on article_views_total
  for each row
  execute function update_updated_at();