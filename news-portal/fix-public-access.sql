-- KRITISCH: Öffentliche Lesbarkeit für Artikel wiederherstellen
-- Dies behebt das Problem, dass nach Logout keine Artikel mehr anklickbar sind

-- 1. RLS für articles aktivieren (falls noch nicht geschehen)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 2. Alle alten Policies löschen (clean slate)
DROP POLICY IF EXISTS "articles_public_read" ON articles;
DROP POLICY IF EXISTS "articles_admin_all" ON articles;
DROP POLICY IF EXISTS "articles_insert_admin" ON articles;
DROP POLICY IF EXISTS "articles_update_admin" ON articles;
DROP POLICY IF EXISTS "articles_delete_admin" ON articles;

-- 3. NEUE Policy: Öffentliches Lesen für ALLE veröffentlichten Artikel
CREATE POLICY "articles_public_read" ON articles
FOR SELECT
USING (is_published = true);

-- 4. Admin-Policies für authentifizierte Nutzer
CREATE POLICY "articles_admin_all" ON articles
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- 5. Categories müssen auch öffentlich lesbar sein
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_public_read" ON categories;
CREATE POLICY "categories_public_read" ON categories
FOR SELECT
USING (true); -- Alle Kategorien sind öffentlich

-- 6. Profiles öffentlich lesbar (für Autoren-Info)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_public_read" ON profiles;
CREATE POLICY "profiles_public_read" ON profiles
FOR SELECT
USING (true);

-- 7. Views müssen auch ohne Auth funktionieren
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "views_insert_public" ON article_views;
CREATE POLICY "views_insert_public" ON article_views
FOR INSERT
WITH CHECK (true); -- Jeder kann Views tracken

DROP POLICY IF EXISTS "views_select_public" ON article_views;
CREATE POLICY "views_select_public" ON article_views
FOR SELECT
USING (true);

-- 8. Bookmarks nur für eingeloggte User
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bookmarks_user_own" ON bookmarks;
CREATE POLICY "bookmarks_user_own" ON bookmarks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 9. Progress tracking nur für eingeloggte User
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "progress_user_own" ON reading_progress;
CREATE POLICY "progress_user_own" ON reading_progress
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- WICHTIG: Diese Queries in Supabase SQL Editor ausführen!
-- Nach Ausführung sollten Artikel wieder öffentlich lesbar sein