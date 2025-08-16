-- Reliable Search Implementation with Prefix, Fuzzy, and Accent-insensitive matching
-- This migration improves search reliability for compound words and special characters

-- 1. Ensure extensions are enabled
create extension if not exists pg_trgm;
create extension if not exists unaccent;

-- 2. Add normalized columns for better prefix and fuzzy matching
-- These columns replace hyphens, underscores, and slashes with spaces for better matching
alter table articles
  add column if not exists title_norm text
  generated always as (
    regexp_replace(lower(unaccent(coalesce(title,''))), '[-_/]+', ' ', 'g')
  ) stored;

alter table articles
  add column if not exists excerpt_norm text
  generated always as (
    regexp_replace(lower(unaccent(coalesce(excerpt,''))), '[-_/]+', ' ', 'g')
  ) stored;

alter table articles
  add column if not exists tags_norm text
  generated always as (
    regexp_replace(lower(unaccent(coalesce(tags,''))), '[-_/]+', ' ', 'g')
  ) stored;

-- 3. Recreate the tsvector column with proper weighting
alter table articles drop column if exists tsv;
alter table articles
  add column tsv tsvector
  generated always as (
    setweight(to_tsvector('simple', unaccent(coalesce(title,''))),    'A') ||
    setweight(to_tsvector('simple', unaccent(coalesce(excerpt,''))),  'B') ||
    setweight(to_tsvector('simple', unaccent(coalesce(tags,''))),     'C') ||
    setweight(to_tsvector('simple', unaccent(coalesce(content,''))),  'D')
  ) stored;

-- 4. Create optimized indexes
drop index if exists idx_articles_tsv;
drop index if exists idx_articles_title_trgm;
drop index if exists idx_articles_excerpt_trgm;
drop index if exists idx_articles_tags_trgm;

create index idx_articles_tsv on articles using gin (tsv);
create index idx_articles_title_norm_trgm on articles using gin (title_norm gin_trgm_ops);
create index idx_articles_excerpt_norm_trgm on articles using gin (excerpt_norm gin_trgm_ops);
create index idx_articles_tags_norm_trgm on articles using gin (tags_norm gin_trgm_ops);
create index idx_articles_status on articles(status) where status = 'published';

-- 5. Create improved search function
drop function if exists search_articles(text);
drop function if exists search_articles(text, int);

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
language sql 
stable 
security definer
as $$
with norm as (
  select
    -- Normalize query: lowercase, unaccent, replace separators with spaces
    regexp_replace(lower(unaccent(trim(q_raw))), '[-_/]+', ' ', 'g') as q,
    -- Split into tokens for prefix matching
    regexp_split_to_array(
      regexp_replace(lower(unaccent(trim(q_raw))), '[-_/]+', ' ', 'g'), 
      '\s+'
    ) as tokens
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
    -- Full-text search score
    ts_rank(a.tsv, websearch_to_tsquery('simple', (select q from norm))) as ft_score,
    -- Trigram similarity score for fuzzy matching
    greatest(
      similarity(a.title_norm, (select q from norm)),
      similarity(coalesce(a.excerpt_norm, ''), (select q from norm)),
      similarity(coalesce(a.tags_norm, ''), (select q from norm))
    ) as trigram_score,
    -- Check if all tokens match as prefixes in the normalized title
    case
      when (select array_length(tokens, 1) from norm) is null then false
      when (select array_length(tokens, 1) from norm) = 0 then false
      else (
        select bool_and(
          a.title_norm ilike (t || '%') or
          a.title_norm ilike ('% ' || t || '%')
        )
        from unnest((select tokens from norm)) t
        where length(t) > 0
      )
    end as prefix_match
  from articles a
  where
    a.status = 'published'
    and (
      -- Full-text search
      a.tsv @@ websearch_to_tsquery('simple', (select q from norm))
      -- Fuzzy matching with trigrams (lowered threshold for better recall)
      or a.title_norm % (select q from norm)
      or coalesce(a.excerpt_norm, '') % (select q from norm)
      or coalesce(a.tags_norm, '') % (select q from norm)
      -- Prefix matching on any token
      or exists (
        select 1 from unnest((select tokens from norm)) t
        where length(t) > 0 
        and (
          a.title_norm ilike (t || '%') or
          a.title_norm ilike ('% ' || t || '%')
        )
      )
      -- Direct substring match as fallback
      or a.title_norm ilike ('%' || (select q from norm) || '%')
    )
)
select *
from candidates
order by
  -- Prioritize exact prefix matches
  prefix_match desc,
  -- Then fuzzy similarity
  trigram_score desc,
  -- Then full-text relevance
  ft_score desc,
  -- Finally by popularity and recency
  views desc nulls last,
  published_at desc
limit limit_n;
$$;

-- 6. Create a simpler fallback search for when advanced search fails
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
      -- Simple ILIKE matching without any special processing
      title ilike '%' || q_raw || '%'
      or excerpt ilike '%' || q_raw || '%'
      or content ilike '%' || q_raw || '%'
      or tags ilike '%' || q_raw || '%'
    )
  order by
    -- Prioritize title matches
    case 
      when title ilike q_raw || '%' then 1  -- Starts with query
      when title ilike '%' || q_raw || '%' then 2  -- Contains query
      else 3
    end,
    views desc nulls last,
    published_at desc
  limit limit_n;
$$;

-- 7. Grant permissions
grant execute on function search_articles to anon, authenticated;
grant execute on function search_articles_fallback to anon, authenticated;

-- 8. Set trigram similarity threshold (lower = more fuzzy matches)
select set_limit(0.2);

-- 9. Analyze table for query planner
analyze articles;