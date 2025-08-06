const { createClient } = require('@supabase/supabase-js');

// Supabase Setup mit Service Role Key (für Admin-Operationen)
const supabaseUrl = 'https://uabmwhtoimelqpuhyluz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhYm13aHRvaW1lbHFwdWh5bHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUwMjU2OSwiZXhwIjoyMDcwMDc4NTY5fQ.TkQ8mq5_Cg8zQMkUMbJZ7y4Qeq7KR9oXOJN1t9Y9hX0';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  console.log('Creating admin user...');
  
  // User erstellen
  const { data: user, error: userError } = await supabase.auth.admin.createUser({
    email: 'schnellwissen5@gmail.com',
    password: 'IboHimoPaul1!',
    email_confirm: true
  });

  if (userError) {
    console.error('Error creating user:', userError);
    return;
  }

  console.log('User created:', user.user.id);

  // Admin-Profil erstellen/updaten
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: user.user.id,
      is_admin: true
    });

  if (profileError) {
    console.error('Error creating admin profile:', profileError);
    return;
  }

  console.log('Admin profile created successfully!');
  console.log('Email: schnellwissen5@gmail.com');
  console.log('Password: IboHimoPaul1!');
}

createAdminUser();