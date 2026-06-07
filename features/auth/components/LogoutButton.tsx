'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
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
      className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 disabled:opacity-60 rounded-md transition-colors"
    >
      {loading ? 'Cerrando...' : 'Cerrar sesión'}
    </button>
  );
};
