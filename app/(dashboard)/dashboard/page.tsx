import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/features/auth/components/LogoutButton';

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nombre_completo, rol')
    .eq('id', user!.id)
    .single();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Bienvenido, {usuario?.nombre_completo ?? user?.email}
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-sm font-medium text-slate-400">Catálogos</h2>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-sm font-medium text-slate-400">Productos</h2>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-sm font-medium text-slate-400">Rol</h2>
          <p className="text-xl font-bold mt-2 capitalize">
            {usuario?.rol ?? '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
