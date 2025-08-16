-- Migration für konsistente View-Zählung
-- Eine einzige Wahrheitsquelle: article_views_daily

-- Bestehende Tabellen/Views droppen falls vorhanden (clean slate)
drop table if exists article_views_total cascade;
drop view if exists article_views_total cascade;
drop view if exists article_views_30d cascade;
drop function if exists inc_article_views_total cascade;
drop function if exists inc_article_views_daily cascade;
drop function if exists get_article_views_30d cascade;
drop function if exists get_top_articles_30d cascade;
drop function if exists inc_view cascade;
drop function if exists dedupe_key cascade;
drop function if exists get_article_views cascade;
drop function if exists get_top_articles_by_views_30d cascade;

-- 1) Sicherstellen dass article_views_daily existiert und korrekt ist
create table if not exists article_views_daily (
  article_id uuid references articles(id) on delete cascade,
  day date not null,
  views bigint not null default 0,
  primary key (article_id, day)
);

-- Index für Performance
create index if not exists idx_article_views_daily_day 
  on article_views_daily(day desc);

-- 2) View für Gesamt-Views (abgeleitet von daily)
create or replace view article_views_total as
select 
  article_id, 
  coalesce(sum(views), 0)::bigint as views
from article_views_daily
group by article_id;

-- 3) View für 30-Tage-Views (gemeinsame Quelle)
create or replace view article_views_30d as
select 
  article_id, 
  coalesce(sum(views), 0)::bigint as views_30d
from article_views_daily
where day >= (current_date - interval '30 days')
group by article_id;

-- 4) Atomare Increment-Funktion mit Timezone-Support
create or replace function inc_view(
  p_article_id uuid, 
  p_tz text default 'Europe/Berlin'
)
returns table (views_total bigint, views_30d bigint)
language plpgsql
security definer
as $$
declare
  d date := (now() at time zone p_tz)::date;
begin
  -- Atomares Inkrement
  insert into article_views_daily(article_id, day, views)
  values (p_article_id, d, 1)
  on conflict (article_id, day)
  do update set views = article_views_daily.views + 1;

  -- Aktuelle Werte zurückgeben
  return query
    select 
      coalesce(t.views, 0) as views_total, 
      coalesce(d30.views_30d, 0) as views_30d
    from (select 1) dummy
    left join article_views_total t on t.article_id = p_article_id
    left join article_views_30d d30 on d30.article_id = p_article_id;
end;
$$;

-- 5) Verbesserte Dedupe-Funktion mit automatischer Bereinigung
create or replace function dedupe_key(p_key text, p_ttl_minutes int default 720)
returns boolean
language plpgsql
security definer
as $$
begin
  -- Alte Keys löschen (max 1000 pro Aufruf für Performance)
  delete from article_view_keys 
  where expires_at < now() 
  limit 1000;
  
  -- Neuen Key einfügen
  insert into article_view_keys(key, expires_at)
  values (p_key, now() + make_interval(mins => p_ttl_minutes));
  
  return true;
exception when unique_violation then
  return false; -- Key existiert bereits
end;
$$;

-- 6) Helper-Funktion für aktuelle Views ohne Inkrement
create or replace function get_article_views(p_article_id uuid)
returns table (views_total bigint, views_30d bigint)
language sql
stable
security definer
as $$
  select 
    coalesce(t.views, 0) as views_total, 
    coalesce(d30.views_30d, 0) as views_30d
  from (select 1) dummy
  left join article_views_total t on t.article_id = p_article_id
  left join article_views_30d d30 on d30.article_id = p_article_id;
$$;

-- 7) Top-Artikel Funktion (30 Tage)
create or replace function get_top_articles_by_views_30d(p_limit int default 6)
returns table(
  article_id uuid,
  views_30d bigint
)
language sql
stable
security definer
as $$
  select 
    article_id,
    views_30d
  from article_views_30d
  order by views_30d desc
  limit p_limit;
$$;

-- 8) Migration existierender Views aus articles Tabelle
-- Nur wenn noch keine Daten vorhanden sind
insert into article_views_daily (article_id, day, views)
select 
  id as article_id,
  current_date as day,
  coalesce(views, 0) as views
from articles
where views > 0
  and not exists (
    select 1 from article_views_daily 
    where article_id = articles.id
  )
on conflict (article_id, day) do nothing;

-- 9) RLS Policies
alter table article_views_daily enable row level security;
alter table article_view_keys enable row level security;

-- Public kann Views lesen
create policy "Public read views" on article_views_daily
  for select using (true);

-- Service role hat vollen Zugriff
create policy "Service role full access" on article_views_daily
  for all using (auth.jwt()->>'role' = 'service_role');

create policy "Service role full access" on article_view_keys
  for all using (auth.jwt()->>'role' = 'service_role');

-- 10) Index für Performance
create index if not exists idx_article_views_daily_article_day 
  on article_views_daily(article_id, day desc);