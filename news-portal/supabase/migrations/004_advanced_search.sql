-- Advanced Search Implementation for News Portal
-- This migration adds fuzzy search, prefix matching, and weighted ranking

-- 1. Enable required extensions
create extension if not exists pg_trgm;
create extension if not exists unaccent;

-- 2. Add generated tsvector column for full-text search with weights
alter table articles
  add column if not exists tsv tsvector
  generated always as (
    setweight(to_tsvector('simple', unaccent(coalesce(title,''))),     'A') ||
    setweight(to_tsvector('simple', unaccent(coalesce(excerpt,''))),   'B') ||
    setweight(to_tsvector('simple', unaccent(coalesce(tags,''))),      'C') ||
    setweight(to_tsvector('simple', unaccent(coalesce(content,''))),   'D')
  ) stored;

-- 3. Create indexes for performance
create index if not exists idx_articles_tsv on articles using gin (tsv);
create index if not exists idx_articles_title_trgm on articles using gin (unaccent(title) gin_trgm_ops);
create index if not exists idx_articles_excerpt_trgm on articles using gin (unaccent(excerpt) gin_trgm_ops);
create index if not exists idx_articles_tags_trgm on articles using gin (unaccent(tags) gin_trgm_ops);

-- 4. Create search function with prefix matching, fuzzy search, and ranking
create or replace function search_articles(q_raw text)
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
language sql 
stable 
security definer
as $$
with
norm as (
  select
    lower(unaccent(trim(q_raw))) as q,
    regexp_split_to_array(lower(unaccent(trim(q_raw))), '\s+') as tokens
),
candidates as (
  select
    a.id, 
    a.slug, 
    a.title, 
    a.excerpt,
    a.cover_image_url,
    a.category_slug,
    a.published_at,
    a.views,
    -- Full-text score
    ts_rank(a.tsv, websearch_to_tsquery('simple', (select q from norm))) as ft_score,
    -- Trigram similarity score (fuzzy matching)
    greatest(
      similarity(unaccent(a.title), (select q from norm)),
      similarity(unaccent(coalesce(a.excerpt, '')), (select q from norm)),
      similarity(unaccent(coalesce(a.tags, '')), (select q from norm))
    ) as trigram_score,
    -- Prefix matching (true if all tokens are prefixes in title)
    case
      when (select array_length(tokens, 1) from norm) is null then false
      else (
        select bool_and(unaccent(a.title) ilike (t || '%'))
        from unnest((select tokens from norm)) t
      )
    end as prefix_match
  from articles a
  where
    a.status = 'published'
    and (
      -- Full-text search
      a.tsv @@ websearch_to_tsquery('simple', (select q from norm))
      -- Fuzzy matching with trigrams
      or unaccent(a.title) % (select q from norm)
      or unaccent(coalesce(a.excerpt, '')) % (select q from norm)
      or unaccent(coalesce(a.tags, '')) % (select q from norm)
      -- Prefix matching
      or exists (
        select 1 from unnest((select tokens from norm)) t
        where unaccent(a.title) ilike (t || '%')
      )
    )
)
select *
from candidates
order by
  -- Ranking: prefix matches first, then trigram score, then full-text score
  prefix_match desc,
  trigram_score desc,
  ft_score desc,
  views desc nulls last,
  published_at desc
limit 20;
$$;

-- 5. Create simple search function for basic queries
create or replace function search_articles_simple(search_query text)
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
      title ilike '%' || search_query || '%'
      or excerpt ilike '%' || search_query || '%'
      or content ilike '%' || search_query || '%'
      or tags ilike '%' || search_query || '%'
    )
  order by
    case when title ilike search_query || '%' then 1 else 2 end,
    views desc nulls last,
    published_at desc
  limit 20;
$$;

-- 6. Create function to get search suggestions (most popular tags)
create or replace function get_search_suggestions()
returns table (
  tag text,
  count bigint
)
language sql
stable
security definer
as $$
  with tag_counts as (
    select 
      unnest(string_to_array(tags, ',')) as tag,
      count(*) as count
    from articles
    where status = 'published' and tags is not null
    group by tag
  )
  select 
    trim(tag) as tag,
    count
  from tag_counts
  where trim(tag) != ''
  order by count desc
  limit 10;
$$;

-- Grant necessary permissions
grant execute on function search_articles to anon, authenticated;
grant execute on function search_articles_simple to anon, authenticated;
grant execute on function get_search_suggestions to anon, authenticated;