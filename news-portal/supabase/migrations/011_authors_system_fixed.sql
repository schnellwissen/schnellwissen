-- Authors System Implementation (Fixed for UUID)
-- Adds author profiles with images to articles

-- 1. Create authors table with UUID primary key
create table if not exists authors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  image_path text not null,
  bio text,
  created_at timestamptz default now()
);

-- 2. Check if author_id column exists and drop if wrong type
do $$ 
begin
  if exists (
    select 1 from information_schema.columns 
    where table_name = 'articles' 
    and column_name = 'author_id'
  ) then
    alter table articles drop column author_id;
  end if;
end $$;

-- 3. Add author_id as UUID to articles
alter table articles
  add column author_id uuid references authors(id) on delete set null;

-- 4. Insert the 5 authors with their images
insert into authors (name, image_path, bio) values
  ('Lukas Weber', '/authors/lukas-weber.png', 'Finanzexperte mit über 10 Jahren Erfahrung in der Anlageberatung.'),
  ('Dr. Jana Köhler', '/authors/jana-koehler.png', 'Wirtschaftswissenschaftlerin und Autorin zahlreicher Fachpublikationen.'),
  ('Clara Neumann', '/authors/clara-neumann.png', 'Spezialistin für nachhaltige Investments und ESG-Kriterien.'),
  ('Martin Albrecht', '/authors/martin-albrecht.png', 'Ehemaliger Fondsmanager mit Fokus auf ETFs und Indexfonds.'),
  ('Lea Schuster', '/authors/lea-schuster.png', 'Finanzjournalistin mit Schwerpunkt auf Verbraucherthemen.')
on conflict (name) do nothing;

-- 5. Create function to assign random author to new articles
create or replace function assign_random_author()
returns trigger
language plpgsql
as $$
declare
  author_ids uuid[];
  random_author_id uuid;
begin
  -- Only assign if author_id is null
  if NEW.author_id is null then
    -- Get all author IDs
    select array_agg(id) into author_ids from authors;
    
    -- Select random author from the array
    if array_length(author_ids, 1) > 0 then
      random_author_id := author_ids[floor(random() * array_length(author_ids, 1) + 1)::int];
      NEW.author_id := random_author_id;
    end if;
  end if;
  return NEW;
end;
$$;

-- 6. Drop existing trigger if exists
drop trigger if exists assign_author_on_insert on articles;

-- 7. Create trigger for new articles
create trigger assign_author_on_insert
  before insert on articles
  for each row
  execute function assign_random_author();

-- 8. Assign random authors to existing articles without author
do $$
declare
  author_ids uuid[];
  article_record record;
  random_author_id uuid;
begin
  -- Get all author IDs
  select array_agg(id) into author_ids from authors;
  
  -- Update each article without an author
  for article_record in select id from articles where author_id is null
  loop
    if array_length(author_ids, 1) > 0 then
      random_author_id := author_ids[floor(random() * array_length(author_ids, 1) + 1)::int];
      update articles set author_id = random_author_id where id = article_record.id;
    end if;
  end loop;
end $$;

-- 9. Create or replace view for articles with author info
create or replace view articles_with_authors as
select 
  a.*,
  au.name as author_name,
  au.image_path as author_image,
  au.bio as author_bio
from articles a
left join authors au on au.id = a.author_id;

-- 10. Grant permissions
grant select on authors to anon, authenticated;
grant select on articles_with_authors to anon, authenticated;

-- 11. Add index for performance
create index if not exists idx_articles_author_id on articles(author_id);