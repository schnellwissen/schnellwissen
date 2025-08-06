-- User manuell bestätigen (E-Mail einsetzen)
UPDATE auth.users 
SET email_confirmed_at = now(), 
    confirmed_at = now()
WHERE email = 'HIER_EMAIL_EINSETZEN';

-- Alle unbestätigten User anzeigen
SELECT email, created_at, email_confirmed_at 
FROM auth.users 
WHERE email_confirmed_at IS NULL;