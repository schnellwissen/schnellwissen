import { sbServer } from '@/lib/supabase/server';
import { AuthButtons } from './AuthButtons';

export default async function HeaderUserWrapper() {
  const sb = await sbServer();
  const { data: { user } } = await sb.auth.getUser();
  
  const userData = user ? {
    id: user.id,
    email: user.email || '',
    displayName: null
  } : null;
  
  return <AuthButtons user={userData} />;
}