-- Reliable Search Implementation (Without tags column)
-- Optimized for articles table structure without tags

-- 1. Ensure extensions are enabled
create extension if not exists pg_trgm;
create extension if not exists unaccent;

-- 2. Add normalized columns (not generated)
alter table articles add column if not exists title_norm text;
alter table articles add column if not exists excerpt_norm text;
alter table articles add column if not exists tsv tsvector;

-- 3. Create function to normalize text
create or replace function normalize_text(input_text text)
returns text
language sql
immutable
as $$
  select regexp_replace(lower(coalesce(input_text, '')), '[-_/]+', ' ', 'g');
$$;

-- 4. Create function to update normalized fields and tsvector
create or replace function update_article_search_fields()
returns trigger
language plpgsql
as $$
begin
  -- Update normalized fields
  NEW.title_norm := normalize_text(NEW.title);
  NEW.excerpt_norm := normalize_text(NEW.excerpt);
  
  -- Update tsvector (without tags)
  NEW.tsv := 
    setweight(to_tsvector('simple', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.content, '')), 'C');
    
  return NEW;
end;
$$;

-- 5. Create trigger for updates
drop trigger if exists update_article_search_trigger on articles;
create trigger update_article_search_trigger
  before insert or update of title, excerpt, content
  on articles
  for each row
  execute function update_article_search_fields();

-- 6. Update existing records
update articles 
set 
  title_norm = normalize_text(title),
  excerpt_norm = normalize_text(excerpt),
  tsv = 
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(content, '')), 'C');

-- 7. Create indexes
drop index if exists idx_articles_tsv;
drop index if exists idx_articles_title_norm_trgm;
drop index if exists idx_articles_excerpt_norm_trgm;
drop index if exists idx_articles_status;

create index idx_articles_tsv on articles using gin (tsv);
create index idx_articles_title_norm_trgm on articles using gin (title_norm gin_trgm_ops);
create index idx_articles_excerpt_norm_trgm on articles using gin (excerpt_norm gin_trgm_ops);
create index idx_articles_status on articles(status) where status = 'published';

-- 8. Create improved search function
create or replace function search_articles(q_raw text, limit_n int default 20)
returns table (
  id uuid,
  slug text,
  title text,
  excerpt text,
  cover_image_url text,
  category_slug text,
  published_at timestamptz,
  views integer,
  ft_score real,
  trigram_score real,
  prefix_match boolean
) 
language plpgsql 
stable 
security definer
as $$
declare
  q_normalized text;
  q_tokens text[];
begin
  -- Normalize the query (with unaccent at query time)
  q_normalized := regexp_replace(lower(unaccent(trim(q_raw))), '[-_/]+', ' ', 'g');
  q_tokens := regexp_split_to_array(q_normalized, '\s+');
  
  return query
  with candidates as (
    select
      a.id, 
      a.slug, 
      a.title, 
      a.excerpt,
      a.cover_image_url,
      a.category_slug,
      a.published_at,
      a.views,
      -- Full-text search score
      ts_rank(a.tsv, websearch_to_tsquery('simple', q_normalized)) as ft_score,
      -- Trigram similarity score (apply unaccent at query time)
      greatest(
        similarity(lower(unaccent(a.title)), q_normalized),
        similarity(lower(unaccent(coalesce(a.excerpt, ''))), q_normalized),
        similarity(lower(unaccent(coalesce(a.content, ''))), q_normalized)
      ) as trigram_score,
      -- Check if all tokens match as prefixes
      case
        when array_length(q_tokens, 1) is null then false
        when array_length(q_tokens, 1) = 0 then false
        else (
          select bool_and(
            lower(unaccent(a.title)) ilike (t || '%') or
            lower(unaccent(a.title)) ilike ('% ' || t || '%')
          )
          from unnest(q_tokens) t
          where length(t) > 0
        )
      end as prefix_match
    from articles a
    where
      a.status = 'published'
      and (
        -- Full-text search
        a.tsv @@ websearch_to_tsquery('simple', q_normalized)
        -- Fuzzy matching with unaccent at query time
        or lower(unaccent(a.title)) % q_normalized
        or lower(unaccent(coalesce(a.excerpt, ''))) % q_normalized
        or lower(unaccent(coalesce(a.content, ''))) % q_normalized
        -- Prefix matching
        or exists (
          select 1 from unnest(q_tokens) t
          where length(t) > 0 
          and (
            lower(unaccent(a.title)) ilike (t || '%') or
            lower(unaccent(a.title)) ilike ('% ' || t || '%')
          )
        )
        -- Direct substring match
        or lower(unaccent(a.title)) ilike ('%' || q_normalized || '%')
        or lower(unaccent(a.excerpt)) ilike ('%' || q_normalized || '%')
      )
  )
  select
    c.id,
    c.slug,
    c.title,
    c.excerpt,
    c.cover_image_url,
    c.category_slug,
    c.published_at,
    c.views,
    c.ft_score,
    c.trigram_score,
    c.prefix_match
  from candidates c
  order by
    c.prefix_match desc,
    c.trigram_score desc,
    c.ft_score desc,
    c.views desc nulls last,
    c.published_at desc
  limit limit_n;
end;
$$;

-- 9. Create simple fallback search
create or replace function search_articles_fallback(q_raw text, limit_n int default 20)
returns table (
  id uuid,
  slug text,
  title text,
  excerpt text,
  cover_image_url text,
  category_slug text,
  published_at timestamptz,
  views integer
)
language sql
stable
security definer
as $$
  select 
    id,
    slug,
    title,
    excerpt,
    cover_image_url,
    category_slug,
    published_at,
    views
  from articles
  where 
    status = 'published'
    and (
      title ilike '%' || q_raw || '%'
      or excerpt ilike '%' || q_raw || '%'
      or content ilike '%' || q_raw || '%'
    )
  order by
    case 
      when title ilike q_raw || '%' then 1
      when title ilike '%' || q_raw || '%' then 2
      else 3
    end,
    views desc nulls last,
    published_at desc
  limit limit_n;
$$;

-- 10. Grant permissions
grant execute on function search_articles to anon, authenticated;
grant execute on function search_articles_fallback to anon, authenticated;
grant execute on function normalize_text to anon, authenticated;
grant execute on function update_article_search_fields to anon, authenticated;

-- 11. Set trigram similarity threshold (lower = more fuzzy matches)
select set_limit(0.2);

-- 12. Analyze table for query planner
analyze articles;