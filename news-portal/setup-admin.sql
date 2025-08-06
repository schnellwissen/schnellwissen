-- Erst den Trigger für automatische Profile-Erstellung hinzufügen
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, is_admin)
  values (new.id, false);
  return new;
end;
$$;

-- Trigger für neue User
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Admin-User erstellen (Service Role Key erforderlich)
-- Hinweis: User muss über Supabase Auth Dashboard oder API erstellt werden
-- Email: schnellwissen5@gmail.com
-- Passwort: IboHimoPaul1!

-- Nach User-Erstellung: Admin-Flag setzen
-- UPDATE public.profiles SET is_admin = true WHERE id = (SELECT id FROM auth.users WHERE email = 'schnellwissen5@gmail.com');