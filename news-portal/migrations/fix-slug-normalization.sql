-- Fix slug normalization for articles and categories
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

-- Kategorien
alter table public.categories add column if not exists slug text;
update public.categories set slug = public.normalize_slug(name)
where slug is null or slug='';
alter table public.categories alter column slug set not null;
create unique index if not exists categories_slug_ux on public.categories(slug);

-- Artikel
alter table public.articles add column if not exists category_slug text;
update public.articles a
set category_slug = public.normalize_slug(c.slug)
from public.categories c
where a.category_id = c.id
  and (a.category_slug is null or a.category_slug='');

update public.articles set slug = public.normalize_slug(slug);
update public.articles set category_slug = public.normalize_slug(category_slug);

alter table public.articles alter column category_slug set not null;
create unique index if not exists articles_cat_slug_slug_ux
  on public.articles(category_slug, slug);

-- Trigger zur Auto-Normalisierung
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

drop trigger if exists trg_articles_normalize on public.articles;
create trigger trg_articles_normalize
before insert or update of slug, title, category_slug, category_id
on public.articles
for each row execute function public.trg_articles_normalize();

-- PostgREST Refresh
notify pgrst, 'reload schema';
notify pgrst, 'reload config';