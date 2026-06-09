import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/features/auth/components/LogoutButton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
    <header className="h-14 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-end gap-4">
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-white leading-none">
            {usuario?.nombre_completo ?? user?.email}
          </p>
          <Badge
            variant="outline"
            className="mt-1 text-xs capitalize border-slate-700 text-slate-400"
          >
            {usuario?.rol ?? 'empleado'}
          </Badge>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-slate-700 text-white text-xs">
            {iniciales}
          </AvatarFallback>
        </Avatar>
      </div>
      <LogoutButton />
    </header>
  );
};
