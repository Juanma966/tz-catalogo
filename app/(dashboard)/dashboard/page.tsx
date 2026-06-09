import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, BookOpen, CheckCircle } from 'lucide-react';

export const metadata = { title: 'Dashboard' };

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
    { label: 'Productos activos', value: totalProductos ?? 0, icon: Package },
    { label: 'Catálogos totales', value: totalCatalogos ?? 0, icon: BookOpen },
    { label: 'Catálogos publicados', value: catalogosPublicados ?? 0, icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Bienvenido, {usuario?.nombre_completo ?? user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">{label}</CardTitle>
              <Icon size={16} className="text-slate-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
