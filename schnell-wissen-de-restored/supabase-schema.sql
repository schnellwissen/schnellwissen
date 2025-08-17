-- SchnellWissen Database Schema for Supabase
-- Execute this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7) NOT NULL DEFAULT '#2563eb', -- Hex color code
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL, -- Raw HTML content
    meta_description VARCHAR(160) NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    image_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 1, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media files table (for uploaded images)
CREATE TABLE IF NOT EXISTS media_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL, -- in bytes
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_articles_title_search ON articles USING gin(to_tsvector('german', title));
CREATE INDEX IF NOT EXISTS idx_articles_content_search ON articles USING gin(to_tsvector('german', content));

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at 
    BEFORE UPDATE ON articles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, slug, color, description) VALUES
('Technologie', 'technologie', '#2563eb', 'Artikel über Technologie und Innovation'),
('Gesundheit', 'gesundheit', '#10b981', 'Gesundheitstipps und medizinische Erkenntnisse'),
('Wissenschaft', 'wissenschaft', '#8b5cf6', 'Wissenschaftliche Entdeckungen und Forschung'),
('Business', 'business', '#f59e0b', 'Business-Tipps und Karriereratschläge'),
('Lifestyle', 'lifestyle', '#ef4444', 'Lifestyle und persönliche Entwicklung'),
('Bildung', 'bildung', '#6366f1', 'Lernen und Bildung'),
('Umwelt', 'umwelt', '#059669', 'Umwelt und Nachhaltigkeit'),
('Politik', 'politik', '#dc2626', 'Politische Themen und Gesellschaft')
ON CONFLICT (name) DO NOTHING;

-- Insert example articles
INSERT INTO articles (title, slug, content, meta_description, category_id, status, reading_time, view_count, like_count) 
VALUES 
(
    'Die Zukunft der Künstlichen Intelligenz in 2024',
    'zukunft-ki-2024',
    '<section>
        <h2>Die Revolution der KI-Technologie</h2>
        <p>Künstliche Intelligenz verändert unsere Welt in einem noch nie dagewesenen Tempo. Von autonomen Fahrzeugen bis hin zu intelligenten Assistenten – die Möglichkeiten scheinen grenzenlos.</p>
        <h3>Wichtige Entwicklungen</h3>
        <ul>
            <li>Large Language Models (LLMs)</li>
            <li>Computer Vision Fortschritte</li>
            <li>Robotik und Automatisierung</li>
        </ul>
        <p>Diese Technologien werden nicht nur unsere Arbeitsweise revolutionieren, sondern auch die Art, wie wir leben und interagieren.</p>
    </section>',
    'Entdecken Sie die neuesten Entwicklungen in der KI-Technologie und wie sie unser Leben verändern wird.',
    (SELECT id FROM categories WHERE slug = 'technologie'),
    'published',
    5,
    2400,
    89
),
(
    'Gesunde Ernährung im digitalen Zeitalter',
    'gesunde-ernaehrung-digital',
    '<section>
        <h2>Ernährung in der modernen Welt</h2>
        <p>Mit dem zunehmenden digitalen Lebensstil wird es immer wichtiger, auf eine ausgewogene Ernährung zu achten.</p>
        <h3>Herausforderungen des digitalen Lebens</h3>
        <p>Homeoffice, ständige Bildschirmzeit und Bewegungsmangel stellen neue Herausforderungen für unsere Gesundheit dar.</p>
        <h3>Praktische Tipps</h3>
        <ul>
            <li>Regelmäßige Mahlzeiten einhalten</li>
            <li>Ausreichend Wasser trinken</li>
            <li>Gesunde Snacks vorbereiten</li>
        </ul>
    </section>',
    'Wie Sie trotz Homeoffice und digitalem Stress eine gesunde Ernährung beibehalten können.',
    (SELECT id FROM categories WHERE slug = 'gesundheit'),
    'published',
    7,
    1800,
    76
),
(
    'Quantencomputing: Revolution der Rechenleistung',
    'quantencomputing-revolution',
    '<section>
        <h2>Die Zukunft des Computings</h2>
        <p>Quantencomputer versprechen eine Revolution in der Rechenleistung und könnten komplexe Probleme lösen, die heute unmöglich erscheinen.</p>
        <h3>Was sind Quantencomputer?</h3>
        <p>Im Gegensatz zu klassischen Computern nutzen Quantencomputer die Prinzipien der Quantenmechanik für ihre Berechnungen.</p>
        <h3>Anwendungsbereiche</h3>
        <ul>
            <li>Kryptographie und Sicherheit</li>
            <li>Medikamentenentwicklung</li>
            <li>Klimamodellierung</li>
            <li>Finanzoptimierung</li>
        </ul>
    </section>',
    'Was Quantencomputer können und wie sie die Zukunft der Technologie beeinflussen werden.',
    (SELECT id FROM categories WHERE slug = 'wissenschaft'),
    'published',
    6,
    1500,
    92
)
ON CONFLICT (slug) DO NOTHING;

-- Row Level Security (RLS) policies
-- Note: These are basic policies. Adjust based on your specific needs.

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Public read access for published articles and categories
CREATE POLICY "Public can read published articles" ON articles
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read categories" ON categories
    FOR SELECT USING (true);

-- Note: For admin access, you'll need to implement proper authentication
-- This is a placeholder - implement proper admin authentication in your app
CREATE POLICY "Admin full access to articles" ON articles
    FOR ALL USING (
        -- This should check for proper admin authentication
        -- For now, this is a placeholder that needs to be implemented
        true
    );

CREATE POLICY "Admin full access to categories" ON categories
    FOR ALL USING (true);

CREATE POLICY "Admin full access to media_files" ON media_files
    FOR ALL USING (true);

-- Views for public access
CREATE OR REPLACE VIEW public_articles AS
SELECT 
    a.id,
    a.title,
    a.slug,
    a.content,
    a.meta_description,
    a.image_url,
    a.view_count,
    a.like_count,
    a.reading_time,
    a.created_at,
    a.updated_at,
    c.name as category_name,
    c.slug as category_slug,
    c.color as category_color
FROM articles a
JOIN categories c ON a.category_id = c.id
WHERE a.status = 'published'
ORDER BY a.created_at DESC;