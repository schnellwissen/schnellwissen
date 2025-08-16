import { NextResponse } from 'next/server';
import { sbServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const sb = await sbServer();
    
    // Check if bookmarks table exists
    const { data: tables } = await sb
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'bookmarks')
      .single();
    
    if (tables) {
      return NextResponse.json({ 
        message: 'Bookmarks table already exists',
        exists: true 
      });
    }
    
    // Create bookmarks table using raw SQL
    const { error } = await sb.rpc('exec_sql', {
      sql: `
        -- Create bookmarks table
        CREATE TABLE IF NOT EXISTS bookmarks (
          user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
          created_at timestamptz DEFAULT now(),
          PRIMARY KEY (user_id, article_id)
        );

        -- Enable RLS
        ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

        -- RLS Policies
        CREATE POLICY "bookmarks_read_own" ON bookmarks
          FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "bookmarks_insert_own" ON bookmarks
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "bookmarks_delete_own" ON bookmarks
          FOR DELETE USING (auth.uid() = user_id);

        -- Indexes for performance
        CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON bookmarks(user_id);
        CREATE INDEX IF NOT EXISTS bookmarks_article_id_idx ON bookmarks(article_id);
        CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx ON bookmarks(created_at DESC);
      `
    });
    
    if (error) {
      console.error('Error creating bookmarks table:', error);
      return NextResponse.json({ 
        error: 'Failed to create bookmarks table',
        details: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'Bookmarks table created successfully',
      created: true 
    });
    
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      error: 'Setup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}