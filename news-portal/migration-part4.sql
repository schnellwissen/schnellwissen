-- TEIL 4: Helper-Funktionen und Migration
-- Führe diesen Teil nach Teil 3 aus

-- 30-Tage Views abrufen
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

-- Top Artikel nach 30-Tage Views
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

-- Existierende Views migrieren
insert into article_views_total (article_id, views)
select id, coalesce(views, 0)
from articles
where views > 0
on conflict (article_id) do update
set views = excluded.views;