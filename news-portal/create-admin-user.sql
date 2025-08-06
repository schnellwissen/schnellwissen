-- Trigger-Funktion für automatische Profile-Erstellung
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

-- Beispiel: Admin-User erstellen (nach Registrierung ausführen)
-- UPDATE public.profiles SET is_admin = true WHERE id = 'USER_ID_HIER_EINSETZEN';