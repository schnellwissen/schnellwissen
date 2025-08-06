-- Trigger-Funktion für automatische Profile-Erstellung bei neuen Usern
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, is_admin)
  values (new.id, false)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger für neue User erstellen
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Sicherstellen dass der Admin-User das richtige Flag hat
UPDATE public.profiles 
SET is_admin = true 
WHERE id = 'e20981ee-04d7-4306-ab16-da9b172e416b';

-- Test: Alle Profile anzeigen
SELECT id, is_admin, created_at FROM public.profiles;