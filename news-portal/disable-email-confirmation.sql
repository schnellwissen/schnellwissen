-- E-Mail-Bestätigung für Entwicklung deaktivieren
UPDATE auth.config 
SET enable_signup = true,
    enable_confirmations = false
WHERE id = 1;

-- Alternativ: Alle bestehenden User als bestätigt markieren
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email_confirmed_at IS NULL;