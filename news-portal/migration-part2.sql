-- TEIL 2: Bot-Liste und RLS
-- Führe diesen Teil nach Teil 1 aus

-- Bot-Patterns einfügen
insert into public.bot_user_agents (ua_prefix) values
  ('bot'), ('spider'), ('crawler'), ('preview'),
  ('facebookexternalhit'), ('slurp'), ('duckduckbot'),
  ('bingbot'), ('baiduspider'), ('yandexbot'),
  ('ahrefsbot'), ('semrushbot'), ('mj12bot'),
  ('dotbot'), ('applebot'), ('twitterbot'),
  ('linkedinbot'), ('whatsapp'), ('telegram'),
  ('discord'), ('slack'), ('pinterest'),
  ('lighthouse'), ('gtmetrix'), ('pingdom')
on conflict (ua_prefix) do nothing;

-- RLS aktivieren
alter table public.article_views_total enable row level security;
alter table public.article_views_daily enable row level security;
alter table public.article_view_keys enable row level security;
alter table public.bot_user_agents enable row level security;

-- Öffentliche Leseberechtigung
create policy "Public read" on public.article_views_total for select using (true);
create policy "Public read" on public.article_views_daily for select using (true);

-- Service-Role Zugriff
create policy "Service role all" on public.article_views_total for all using (auth.jwt()->>'role' = 'service_role');
create policy "Service role all" on public.article_views_daily for all using (auth.jwt()->>'role' = 'service_role');
create policy "Service role all" on public.article_view_keys for all using (auth.jwt()->>'role' = 'service_role');