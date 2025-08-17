import Link from 'next/link';
import { signOutAction } from '@/app/(auth)/logout/action';

export interface UserData {
  id: string;
  email: string;
  displayName?: string | null;
}

interface AuthButtonsProps {
  user: UserData | null;
}

export function AuthButtons({ user }: AuthButtonsProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link 
          href="/login" 
          prefetch={false}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Anmelden
        </Link>
        <Link 
          href="/register" 
          prefetch={false}
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Registrieren
        </Link>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-700">
        {user.displayName || user.email}
      </span>
      <form action={signOutAction as any}>
        <button 
          type="submit"
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors border border-red-300 rounded-lg hover:bg-red-50"
        >
          Abmelden
        </button>
      </form>
    </div>
  );
}