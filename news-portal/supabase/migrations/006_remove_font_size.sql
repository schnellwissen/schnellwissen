-- Remove font_size column from profiles table
alter table public.profiles
  drop column if exists font_size;