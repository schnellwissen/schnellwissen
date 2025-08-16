-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Add normalized columns and tsvector column
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS title_norm TEXT,
ADD COLUMN IF NOT EXISTS tsv tsvector;

-- Update normalized columns
UPDATE articles 
SET 
  title_norm = lower(unaccent(title));

-- Create function to update tsvector
CREATE OR REPLACE FUNCTION update_article_tsv() RETURNS trigger AS $$
BEGIN
  NEW.title_norm := lower(unaccent(NEW.title));
  NEW.tsv := setweight(to_tsvector('german', COALESCE(NEW.title, '')), 'A') ||
             setweight(to_tsvector('german', COALESCE(NEW.excerpt, '')), 'B') ||
             setweight(to_tsvector('german', COALESCE(NEW.content_html, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic tsvector updates
DROP TRIGGER IF EXISTS update_article_tsv_trigger ON articles;
CREATE TRIGGER update_article_tsv_trigger
BEFORE INSERT OR UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION update_article_tsv();

-- Update existing articles
UPDATE articles 
SET tsv = setweight(to_tsvector('german', COALESCE(title, '')), 'A') ||
          setweight(to_tsvector('german', COALESCE(excerpt, '')), 'B') ||
          setweight(to_tsvector('german', COALESCE(content_html, '')), 'C');

-- Create indexes
CREATE INDEX IF NOT EXISTS articles_tsv_idx ON articles USING GIN (tsv);
CREATE INDEX IF NOT EXISTS articles_title_norm_trgm_idx ON articles USING GIN (title_norm gin_trgm_ops);
CREATE INDEX IF NOT EXISTS articles_category_slug_idx ON articles(category_slug);
CREATE INDEX IF NOT EXISTS articles_published_at_idx ON articles(published_at DESC);

-- Create related_articles function
CREATE OR REPLACE FUNCTION related_articles(
  article_id UUID,
  max_results INTEGER DEFAULT 3
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  title TEXT,
  excerpt TEXT,
  cover_image_url TEXT,
  category_slug TEXT,
  published_at TIMESTAMPTZ,
  score FLOAT
) AS $$
DECLARE
  article_record RECORD;
  result_count INTEGER;
BEGIN
  -- Get the current article's data
  SELECT a.title_norm, a.tsv, a.category_slug, a.published_at
  INTO article_record
  FROM articles a
  WHERE a.id = article_id;

  -- If article not found, return empty
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- First, try to find related articles using full-text search and trigram similarity
  RETURN QUERY
  WITH scored_articles AS (
    SELECT 
      a.id,
      a.slug,
      a.title,
      a.excerpt,
      a.cover_image_url,
      a.category_slug,
      a.published_at,
      (
        -- Full-text search rank
        COALESCE(ts_rank(a.tsv, plainto_tsquery('german', article_record.title_norm)), 0) * 2 +
        -- Trigram similarity for title
        COALESCE(similarity(a.title_norm, article_record.title_norm), 0) * 3 +
        -- Category boost (same category gets higher score)
        CASE WHEN a.category_slug = article_record.category_slug THEN 1.5 ELSE 0 END +
        -- Recency boost (newer articles get slight boost)
        CASE 
          WHEN a.published_at > NOW() - INTERVAL '7 days' THEN 0.5
          WHEN a.published_at > NOW() - INTERVAL '30 days' THEN 0.3
          ELSE 0
        END
      ) AS relevance_score
    FROM articles a
    WHERE 
      a.id != article_id
      AND a.published_at IS NOT NULL
      AND (
        -- Full-text search
        a.tsv @@ plainto_tsquery('german', article_record.title_norm)
        -- Trigram similarity threshold
        OR similarity(a.title_norm, article_record.title_norm) > 0.1
        -- Same category fallback
        OR a.category_slug = article_record.category_slug
      )
  )
  SELECT 
    sa.id,
    sa.slug,
    sa.title,
    sa.excerpt,
    sa.cover_image_url,
    sa.category_slug,
    sa.published_at,
    sa.relevance_score::FLOAT
  FROM scored_articles sa
  WHERE sa.relevance_score > 0
  ORDER BY sa.relevance_score DESC, sa.published_at DESC
  LIMIT max_results;

  -- Check how many results we got
  GET DIAGNOSTICS result_count = ROW_COUNT;

  -- If we don't have enough results, fill with articles from the same category
  IF result_count < max_results THEN
    RETURN QUERY
    SELECT 
      a.id,
      a.slug,
      a.title,
      a.excerpt,
      a.cover_image_url,
      a.category_slug,
      a.published_at,
      0.5::FLOAT AS score -- Lower score for fallback articles
    FROM articles a
    WHERE 
      a.id != article_id
      AND a.category_slug = article_record.category_slug
      AND a.published_at IS NOT NULL
      AND a.id NOT IN (
        SELECT id FROM related_articles(article_id, max_results)
      )
    ORDER BY a.published_at DESC
    LIMIT (max_results - result_count);
  END IF;

  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION related_articles TO anon, authenticated;