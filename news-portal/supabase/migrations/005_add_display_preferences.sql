-- Add display preference columns to profiles table
alter table public.profiles
  add column if not exists theme text
    check (theme in ('light', 'dark', 'system'))
    default 'system',
  add column if not exists font_size text
    check (font_size in ('sm', 'md', 'lg'))
    default 'md';

-- Update RLS policies to include new columns (already covered by existing policies)