'use client';

import { FC, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { CatalogoBadge } from './CatalogoBadge';
import { NuevoCatalogoWizard } from './NuevoCatalogoWizard';
import { useCatalogos } from '../hooks/useCatalogos';
import { catalogoService } from '../services/catalogoService';

export const CatalogosList: FC = () => {
  const { catalogos, loading, error, reload } = useCatalogos();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [eliminando, setEliminando] = useState<string | null>(null);

  const handleEliminar = async (id: string, nombreCliente: string) => {
    if (!confirm(`¿Eliminar el catálogo de ${nombreCliente}?`)) return;
    setEliminando(id);
    try {
      await catalogoService.eliminar(id);
      toast.success('Catálogo eliminado');
      reload();
    } catch {
      toast.error('No se pudo eliminar el catálogo');
    } finally {
      setEliminando(null);
    }
  };

  const handleSuccess = () => {
    setWizardOpen(false);
    reload();
  };

  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loading ? '...' : `${catalogos.length} catálogo${catalogos.length !== 1 ? 's' : ''}`}
        </p>
        <Button onClick={() => setWizardOpen(true)} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={15} /> Nuevo catálogo
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 hover:bg-transparent bg-gray-50">
              <TableHead className="text-gray-500 font-medium">Cliente</TableHead>
              <TableHead className="text-gray-500 font-medium">Tipo de lista</TableHead>
              <TableHead className="text-gray-500 font-medium">Vencimiento</TableHead>
              <TableHead className="text-gray-500 font-medium text-right">Total</TableHead>
              <TableHead className="text-gray-500 font-medium text-center">Estado</TableHead>
              <TableHead className="text-gray-500 font-medium text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i} className="border-gray-100">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full bg-gray-200" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : catalogos.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center text-gray-400 py-12">
                  No hay catálogos. Creá el primero.
                </TableCell>
              </TableRow>
            ) : (
              catalogos.map((catalogo) => (
                <TableRow key={catalogo.id} className="border-gray-100 hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{catalogo.nombre_cliente}</TableCell>
                  <TableCell className="capitalize text-gray-600 text-sm">{catalogo.tipo_lista}</TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {new Date(catalogo.fecha_vencimiento + 'T00:00:00').toLocaleDateString('es-AR')}
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-900">
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(catalogo.total)}
                  </TableCell>
                  <TableCell className="text-center">
                    <CatalogoBadge estado={catalogo.estado} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={eliminando === catalogo.id}
                      onClick={() => handleEliminar(catalogo.id, catalogo.nombre_cliente)}
                      className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={wizardOpen} onOpenChange={(v) => !v && setWizardOpen(false)}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 w-[calc(100%-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Nuevo catálogo</DialogTitle>
          </DialogHeader>
          <NuevoCatalogoWizard
            onSuccess={handleSuccess}
            onCancel={() => setWizardOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
