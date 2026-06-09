'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={loading}
      className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
    >
      {loading ? 'Cerrando...' : 'Cerrar sesión'}
    </Button>
  );
};
