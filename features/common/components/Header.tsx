import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/features/auth/components/LogoutButton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const Header = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nombre_completo, rol')
    .eq('id', user!.id)
    .single();

  const iniciales = usuario?.nombre_completo
    ? usuario.nombre_completo.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '??';

  return (
    <header className="h-14 border-b border-gray-200 bg-white px-4 lg:px-6 flex items-center justify-between lg:justify-end gap-4 shrink-0">
      {/* Logo visible solo en mobile (el sidebar está oculto) */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-gray-900">CatálogoPDF</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900 leading-none">
            {usuario?.nombre_completo ?? user?.email}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 capitalize">
            {usuario?.rol ?? 'empleado'}
          </p>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
            {iniciales}
          </AvatarFallback>
        </Avatar>
      </div>
      <LogoutButton />
    </header>
  );
};
