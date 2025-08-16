import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await supabaseServer();
    
    // Run the migration SQL
    const migrationSQL = `
-- Create reading_progress table for tracking user article reading history
create table if not exists public.reading_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  last_read_at timestamp with time zone default now() not null,
  progress_percent integer default 0 check (progress_percent >= 0 and progress_percent <= 100),
  scroll_position integer default 0,
  reading_time_seconds integer default 0,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  
  -- Ensure one record per user per article
  unique(user_id, article_id)
);

-- Create bookmarks table for saving articles
create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  created_at timestamp with time zone default now() not null,
  
  -- Ensure one bookmark per user per article
  unique(user_id, article_id)
);

-- Create indexes for better query performance
create index if not exists idx_reading_progress_user_id on public.reading_progress(user_id);
create index if not exists idx_reading_progress_article_id on public.reading_progress(article_id);
create index if not exists idx_reading_progress_last_read on public.reading_progress(last_read_at desc);
create index if not exists idx_bookmarks_user_id on public.bookmarks(user_id);
create index if not exists idx_bookmarks_article_id on public.bookmarks(article_id);
create index if not exists idx_bookmarks_created_at on public.bookmarks(created_at desc);

-- Enable RLS
alter table public.reading_progress enable row level security;
alter table public.bookmarks enable row level security;

-- RLS policies for reading_progress
create policy "Users can view their own reading progress"
  on public.reading_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reading progress"
  on public.reading_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reading progress"
  on public.reading_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reading progress"
  on public.reading_progress for delete
  using (auth.uid() = user_id);

-- RLS policies for bookmarks
create policy "Users can view their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can create their own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at for reading_progress
create trigger update_reading_progress_updated_at
  before update on public.reading_progress
  for each row
  execute function update_updated_at_column();
    `;

    // Execute the migration using raw SQL
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL }).single();
    
    if (error) {
      // If exec_sql doesn't exist, we'll create the tables individually
      console.log('exec_sql not available, running migrations individually');
      
      // Note: We can't run raw SQL directly through Supabase client
      // The tables need to be created through Supabase dashboard
      return NextResponse.json({ 
        error: 'Please run the migration SQL in the Supabase dashboard SQL editor',
        sql: migrationSQL
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Migration completed successfully' });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: 'Migration failed', details: error }, { status: 500 });
  }
}