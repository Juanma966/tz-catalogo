import { createClient } from '@/lib/supabase/server';
import { Package, BookOpen, CheckCircle } from 'lucide-react';

export const metadata = { title: 'Menu' };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nombre_completo, empresa_id')
    .eq('id', user!.id)
    .single();

  const empresaId = usuario?.empresa_id;

  const [{ count: totalProductos }, { count: totalCatalogos }, { count: catalogosPublicados }] =
    await Promise.all([
      supabase.from('productos').select('*', { count: 'exact', head: true }).eq('empresa_id', empresaId).eq('activo', true),
      supabase.from('catalogos').select('*', { count: 'exact', head: true }).eq('empresa_id', empresaId),
      supabase.from('catalogos').select('*', { count: 'exact', head: true }).eq('empresa_id', empresaId).eq('estado', 'publicado'),
    ]);

  const stats = [
    { label: 'Productos activos', value: totalProductos ?? 0, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Catálogos totales', value: totalCatalogos ?? 0, icon: BookOpen, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Catálogos publicados', value: catalogosPublicados ?? 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Mis Catálogos</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Bienvenido, {usuario?.nombre_completo ?? user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{label}</span>
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={17} className={color} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
