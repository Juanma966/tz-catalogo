import { createClient } from '@/lib/supabase/server';
import { Package, BookOpen, CheckCircle } from 'lucide-react';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nombre_completo, empresa_id')
    .eq('id', user!.id)
    .single();

  const empresaId = usuario?.empresa_id;

  const [
    { count: totalProductos },
    { count: totalCatalogos },
    { count: catalogosPublicados },
    { count: catalogosBorrador },
    { count: catalogosVencidos },
  ] = await Promise.all([
    supabase
      .from('productos')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', empresaId)
      .eq('activo', true),

    supabase
      .from('catalogos')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', empresaId),

    supabase
      .from('catalogos')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', empresaId)
      .eq('estado', 'publicado'),

    supabase
      .from('catalogos')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', empresaId)
      .eq('estado', 'borrador'),

    supabase
      .from('catalogos')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', empresaId)
      .eq('estado', 'vencido'),
  ]);

  const { data: ultimosCatalogos } = await supabase
    .from('catalogos')
    .select('id, nombre_cliente, estado, created_at')
    .eq('empresa_id', empresaId)
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    {
      label: 'Productos activos',
      value: totalProductos ?? 0,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Catálogos totales',
      value: totalCatalogos ?? 0,
      icon: BookOpen,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      label: 'Publicados',
      value: catalogosPublicados ?? 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Borradores',
      value: catalogosBorrador ?? 0,
      icon: BookOpen,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Vencidos',
      value: catalogosVencidos ?? 0,
      icon: CheckCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Mis Catálogos
        </h1>

        <p className="text-gray-500 mt-1 text-sm">
          Bienvenido, {usuario?.nombre_completo ?? user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">
                {label}
              </span>

              <div
                className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}
              >
                <Icon size={17} className={color} />
              </div>
            </div>

            <p className="text-3xl font-bold text-gray-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            Últimos catálogos
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {ultimosCatalogos?.length ? (
            ultimosCatalogos.map((catalogo) => (
              <div
                key={catalogo.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {catalogo.nombre_cliente}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      catalogo.created_at
                    ).toLocaleDateString('es-AR')}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500 capitalize">
                    {catalogo.estado}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No hay catálogos creados todavía
            </div>
          )}
        </div>
      </div>
    </div>
  );
}