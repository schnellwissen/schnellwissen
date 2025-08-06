-- RPC für Aufruf-Zähler
create or replace function public.increment_article_views(p_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.articles set views = views + 1
  where id = p_id and status = 'published';
$$;

revoke all on function public.increment_article_views(uuid) from public;
grant execute on function public.increment_article_views(uuid) to anon, authenticated;