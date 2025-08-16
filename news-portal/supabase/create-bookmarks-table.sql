-- Create bookmarks table
create table if not exists bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id uuid not null references articles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, article_id)
);

-- Enable RLS
alter table bookmarks enable row level security;

-- RLS Policies
create policy "bookmarks_read_own" on bookmarks
  for select using (auth.uid() = user_id);

create policy "bookmarks_insert_own" on bookmarks
  for insert with check (auth.uid() = user_id);

create policy "bookmarks_delete_own" on bookmarks
  for delete using (auth.uid() = user_id);

-- Index for performance
create index if not exists bookmarks_user_id_idx on bookmarks(user_id);
create index if not exists bookmarks_article_id_idx on bookmarks(article_id);
create index if not exists bookmarks_created_at_idx on bookmarks(created_at desc);