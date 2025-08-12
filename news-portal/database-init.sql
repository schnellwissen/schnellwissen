-- Database initialization script for News Portal restoration
-- Run this in Supabase SQL editor

-- 1. Create the normalize_slug function
create extension if not exists unaccent;

create or replace function public.normalize_slug(s text)
returns text language sql immutable strict as $$
select trim(both '-' from
  regexp_replace(
    regexp_replace(
      lower(unaccent(regexp_replace(coalesce(s, ''), '^\s+|\s+$', '', 'g'))),
      '[^a-z0-9]+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
) $$;

-- 2. Ensure categories table has slug column
alter table public.categories
  add column if not exists slug text;

-- 3. Update existing category slugs
update public.categories set slug = public.normalize_slug(name) where slug is null or slug='';

-- 4. Make slug required and unique
alter table public.categories alter column slug set not null;
create unique index if not exists categories_slug_ux on public.categories(slug);

-- 5. Ensure articles table has category_slug column
alter table public.articles add column if not exists category_slug text;

-- 6. Update existing articles with category_slug from categories
update public.articles a
set category_slug = public.normalize_slug(c.slug)
from public.categories c
where a.category_id = c.id and (a.category_slug is null or a.category_slug='');

-- 7. Normalize existing slugs
update public.articles set slug = public.normalize_slug(slug);
update public.articles set category_slug = public.normalize_slug(category_slug);

-- 8. Make category_slug required and add unique constraint
alter table public.articles alter column category_slug set not null;
create unique index if not exists articles_cat_slug_slug_ux
  on public.articles(category_slug, slug);

-- 9. Create trigger function for automatic slug normalization
create or replace function public.trg_articles_normalize()
returns trigger language plpgsql as $$
begin
  new.slug := public.normalize_slug(coalesce(new.slug, new.title));
  if new.category_slug is null or new.category_slug='' then
    if new.category_id is not null then
      select public.normalize_slug(slug) into new.category_slug
      from public.categories where id = new.category_id;
    end if;
  else
    new.category_slug := public.normalize_slug(new.category_slug);
  end if;
  return new;
end; $$;

-- 10. Create trigger
drop trigger if exists trg_articles_normalize on public.articles;
create trigger trg_articles_normalize
before insert or update of slug, title, category_slug, category_id
on public.articles
for each row execute function public.trg_articles_normalize();

-- 11. Seed categories if missing
insert into public.categories (name, slug)
values
('Finanzen', 'finanzen'),
('Auto', 'auto'),
('Gesundheit', 'gesundheit'),
('Technologie', 'technologie'),
('Lifestyle', 'lifestyle'),
('Wissen', 'wissen')
on conflict (slug) do nothing;

-- 12. Refresh PostgREST
notify pgrst, 'reload schema';
notify pgrst, 'reload config';

-- Check results
select 'Categories:' as section, count(*) as count from public.categories
union all
select 'Articles:', count(*) from public.articles
union all
select 'Published Articles:', count(*) from public.articles where status = 'published';