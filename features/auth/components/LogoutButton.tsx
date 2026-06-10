'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { authService } from '../services/authService';

export const LogoutButton: FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    await authService.logout();
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100"
    >
      <LogOut size={15} />
      {loading ? 'Saliendo...' : 'Salir'}
    </button>
  );
};
