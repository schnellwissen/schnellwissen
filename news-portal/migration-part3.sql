-- TEIL 3: RPC-Funktionen
-- Führe diesen Teil nach Teil 2 aus

-- Dedupe-Check Funktion
create or replace function public.dedupe_view(p_key text, p_ttl_minutes int default 720)
returns boolean
language plpgsql
security definer
as $$
declare
  v_exists boolean;
begin
  select exists(
    select 1 from article_view_keys 
    where key = p_key and expires_at > now()
  ) into v_exists;
  
  if v_exists then
    return false;
  end if;
  
  insert into article_view_keys(key, expires_at)
  values (p_key, now() + make_interval(mins => p_ttl_minutes))
  on conflict (key) do nothing;
  
  if random() < 0.01 then
    delete from article_view_keys where expires_at < now();
  end if;
  
  return true;
end;
$$;

-- Views erhöhen (total)
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

-- Views erhöhen (daily)
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