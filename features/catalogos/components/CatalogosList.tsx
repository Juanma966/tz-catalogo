'use client';

import { FC, useState } from 'react';
import { ExternalLink, FileText, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
import { useGenerarPDF } from '../hooks/useGenerarPDF';
import { catalogoService } from '../services/catalogoService';
import { CompartirWhatsAppButton } from './CompartirWhatsAppButton';
import type { CatalogoConItems } from '../types/catalogo.types';

export const CatalogosList: FC = () => {
  const { catalogos, loading, error, reload } = useCatalogos();
  const { generarPDF, generando } = useGenerarPDF(reload);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [eliminando, setEliminando] = useState<string | null>(null);
  const [editando, setEditando] = useState<string | null>(null);
  const [catalogoEditar, setCatalogoEditar] = useState<CatalogoConItems | null>(null);

  const handleEditar = async (id: string) => {
    setEditando(id);
    try {
      const catalogo = await catalogoService.obtenerConItems(id);
      setCatalogoEditar(catalogo);
    } catch {
      toast.error('No se pudo cargar el catálogo');
    } finally {
      setEditando(null);
    }
  };

  const handleEditarSuccess = () => {
    setCatalogoEditar(null);
    reload();
  };

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

      <div className="rounded-xl border border-gray-200 overflow-x-auto bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 hover:bg-transparent bg-gray-50">
              <TableHead className="text-gray-500 font-medium">Cliente</TableHead>
              <TableHead className="text-gray-500 font-medium hidden sm:table-cell">Tipo</TableHead>
              <TableHead className="text-gray-500 font-medium hidden md:table-cell">Vencimiento</TableHead>
              
              <TableHead className="text-gray-500 font-medium text-center hidden sm:table-cell">Estado</TableHead>
              <TableHead className="text-gray-500 font-medium text-right pr-40">Acciones</TableHead>
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
              catalogos.map((catalogo) => {
                const ocupado = generando === catalogo.id || eliminando === catalogo.id || editando === catalogo.id;
                return (
                  <TableRow key={catalogo.id} className="border-gray-100 hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">{catalogo.nombre_cliente}</TableCell>
                    <TableCell className="capitalize text-gray-600 text-sm hidden sm:table-cell">{catalogo.tipo_lista}</TableCell>
                    <TableCell className="text-gray-600 text-sm hidden md:table-cell">
                      {new Date(catalogo.fecha_vencimiento + 'T00:00:00').toLocaleDateString('es-AR')}
                    </TableCell>
                    
                    <TableCell className="text-center hidden sm:table-cell">
                      <CatalogoBadge estado={catalogo.estado} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {catalogo.pdf_url && (
                          <a
                            href={catalogo.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ver PDF"
                            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50')}
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                        {catalogo.pdf_url && (
                          <CompartirWhatsAppButton
                              pdfUrl={catalogo.pdf_url}
                              nombreCliente={catalogo.nombre_cliente}
                            />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={ocupado}
                          onClick={() => handleEditar(catalogo.id)}
                          className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                          title="Editar"
                        >
                          {editando === catalogo.id
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Pencil size={14} />
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={ocupado}
                          onClick={() => generarPDF(catalogo.id, catalogo.nombre_cliente)}
                          className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                          title="Generar PDF"
                        >
                          {generando === catalogo.id
                            ? <Loader2 size={14} className="animate-spin" />
                            : <FileText size={14} />
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={ocupado}
                          onClick={() => handleEliminar(catalogo.id, catalogo.nombre_cliente)}
                          className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
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

      <Dialog open={!!catalogoEditar} onOpenChange={(v) => !v && setCatalogoEditar(null)}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 w-[calc(100%-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Editar catálogo</DialogTitle>
          </DialogHeader>
          {catalogoEditar && (
            <NuevoCatalogoWizard
              catalogo={catalogoEditar}
              onSuccess={handleEditarSuccess}
              onCancel={() => setCatalogoEditar(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
