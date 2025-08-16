-- Authors System Implementation
-- Adds author profiles with images to articles

-- 1. Create authors table
create table if not exists authors (
  id serial primary key,
  name text not null unique,
  image_path text not null,
  bio text,
  created_at timestamptz default now()
);

-- 2. Add author_id to articles
alter table articles
  add column if not exists author_id integer references authors(id) on delete set null;

-- 3. Insert the 5 authors with their images
-- Note: These paths will be replaced with public URLs in production
insert into authors (name, image_path, bio) values
  ('Lukas Weber', '/authors/lukas-weber.png', 'Finanzexperte mit über 10 Jahren Erfahrung in der Anlageberatung.'),
  ('Dr. Jana Köhler', '/authors/jana-koehler.png', 'Wirtschaftswissenschaftlerin und Autorin zahlreicher Fachpublikationen.'),
  ('Clara Neumann', '/authors/clara-neumann.png', 'Spezialistin für nachhaltige Investments und ESG-Kriterien.'),
  ('Martin Albrecht', '/authors/martin-albrecht.png', 'Ehemaliger Fondsmanager mit Fokus auf ETFs und Indexfonds.'),
  ('Lea Schuster', '/authors/lea-schuster.png', 'Finanzjournalistin mit Schwerpunkt auf Verbraucherthemen.')
on conflict (name) do nothing;

-- 4. Create function to assign random author to new articles
create or replace function assign_random_author()
returns trigger
language plpgsql
as $$
begin
  -- Only assign if author_id is null
  if NEW.author_id is null then
    -- Select random author (1-5)
    NEW.author_id := floor(random() * 5 + 1)::integer;
  end if;
  return NEW;
end;
$$;

-- 5. Create trigger for new articles
create trigger assign_author_on_insert
  before insert on articles
  for each row
  execute function assign_random_author();

-- 6. Assign random authors to existing articles without author
update articles
set author_id = floor(random() * 5 + 1)::integer
where author_id is null;

-- 7. Create view for articles with author info
create or replace view articles_with_authors as
select 
  a.*,
  au.name as author_name,
  au.image_path as author_image,
  au.bio as author_bio
from articles a
left join authors au on au.id = a.author_id;

-- 8. Grant permissions
grant select on authors to anon, authenticated;
grant select on articles_with_authors to anon, authenticated;

-- 9. Add index for performance
create index if not exists idx_articles_author_id on articles(author_id);