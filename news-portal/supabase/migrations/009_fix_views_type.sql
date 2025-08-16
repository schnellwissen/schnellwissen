-- Fix views column type mismatch in search function

-- Drop existing functions
drop function if exists search_articles(text, int);
drop function if exists search_articles_fallback(text, int);

-- Recreate search function with correct bigint type for views
create or replace function search_articles(q_raw text, limit_n int default 20)
returns table (
  id uuid,
  slug text,
  title text,
  excerpt text,
  cover_image_url text,
  category_slug text,
  published_at timestamptz,
  views bigint,  -- Changed from integer to bigint
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
      case 
        when a.tsv @@ websearch_to_tsquery('simple', q_normalized) 
        then ts_rank(a.tsv, websearch_to_tsquery('simple', q_normalized))
        else 0
      end as ft_score,
      -- Trigram similarity score (apply unaccent at query time)
      greatest(
        similarity(lower(unaccent(a.title)), q_normalized),
        similarity(lower(unaccent(coalesce(a.excerpt, ''))), q_normalized),
        0.0
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
        -- Direct substring match (most reliable)
        lower(unaccent(a.title)) ilike ('%' || q_normalized || '%')
        or lower(unaccent(a.excerpt)) ilike ('%' || q_normalized || '%')
        -- Full-text search
        or a.tsv @@ websearch_to_tsquery('simple', q_normalized)
        -- Fuzzy matching with unaccent at query time
        or lower(unaccent(a.title)) % q_normalized
        or lower(unaccent(coalesce(a.excerpt, ''))) % q_normalized
        -- Prefix matching on individual tokens
        or exists (
          select 1 from unnest(q_tokens) t
          where length(t) > 0 
          and (
            lower(unaccent(a.title)) ilike (t || '%') or
            lower(unaccent(a.title)) ilike ('% ' || t || '%')
          )
        )
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
    -- Exact substring matches first
    case when lower(unaccent(c.title)) ilike ('%' || q_normalized || '%') then 0 else 1 end,
    -- Then prefix matches
    c.prefix_match desc,
    -- Then fuzzy similarity
    c.trigram_score desc,
    -- Then full-text relevance
    c.ft_score desc,
    -- Finally by popularity and recency
    c.views desc nulls last,
    c.published_at desc
  limit limit_n;
end;
$$;

-- Recreate fallback search with correct bigint type
create or replace function search_articles_fallback(q_raw text, limit_n int default 20)
returns table (
  id uuid,
  slug text,
  title text,
  excerpt text,
  cover_image_url text,
  category_slug text,
  published_at timestamptz,
  views bigint  -- Changed from integer to bigint
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
      or content_html ilike '%' || q_raw || '%'
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

-- Grant permissions
grant execute on function search_articles to anon, authenticated;
grant execute on function search_articles_fallback to anon, authenticated;