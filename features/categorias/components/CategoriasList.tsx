'use client';

import { FC, useState } from 'react';
import { Pencil, ToggleLeft, ToggleRight, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CategoriaDialog } from './CategoriaDialog';
import { useCategorias } from '../hooks/useCategorias';
import type { Categoria } from '../types/categoria.types';

export const CategoriasList: FC = () => {
  const { categorias, isLoading, error, refrescar, toggleActivo } = useCategorias();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | undefined>();
  const [toggling, setToggling] = useState<string | null>(null);

  const abrirCrear = () => {
    setCategoriaSeleccionada(undefined);
    setDialogOpen(true);
  };

  const abrirEditar = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setDialogOpen(true);
  };

  const handleToggleActivo = async (categoria: Categoria) => {
    setToggling(categoria.id);
    try {
      await toggleActivo(categoria.id, !categoria.activo);
      toast.success(categoria.activo ? 'Categoría desactivada' : 'Categoría activada');
    } catch {
      toast.error('No se pudo cambiar el estado de la categoría');
    } finally {
      setToggling(null);
    }
  };

  const handleSuccess = () => {
    toast.success(categoriaSeleccionada ? 'Categoría actualizada' : 'Categoría creada');
    refrescar();
  };

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {isLoading ? '...' : `${categorias.length} categoría${categorias.length !== 1 ? 's' : ''}`}
        </p>
        <Button onClick={abrirCrear} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={15} /> Nueva categoría
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 hover:bg-transparent bg-gray-50">
              <TableHead className="text-gray-500 font-medium">Nombre</TableHead>
              <TableHead className="text-gray-500 font-medium">Descripción</TableHead>
              <TableHead className="text-gray-500 font-medium text-center">Estado</TableHead>
              <TableHead className="text-gray-500 font-medium text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-gray-100">
                  <TableCell><Skeleton className="h-4 w-32 bg-gray-200" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48 bg-gray-200" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 mx-auto bg-gray-200" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto bg-gray-200" /></TableCell>
                </TableRow>
              ))
            ) : categorias.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="text-center text-gray-400 py-12">
                  No hay categorías. Creá la primera.
                </TableCell>
              </TableRow>
            ) : (
              categorias.map((categoria) => (
                <TableRow key={categoria.id} className="border-gray-100 hover:bg-gray-50">
                  <TableCell>
                    <p className="font-medium text-gray-900">{categoria.nombre}</p>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm truncate max-w-64">
                    {categoria.descripcion ?? '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary"
                      className={categoria.activo
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-100'}>
                      {categoria.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => abrirEditar(categoria)}
                        className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100">
                        <Pencil size={14} />
                      </Button>
                      <Button variant="ghost" size="icon"
                        onClick={() => handleToggleActivo(categoria)}
                        disabled={toggling === categoria.id}
                        className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100">
                        {categoria.activo
                          ? <ToggleRight size={16} className="text-emerald-500" />
                          : <ToggleLeft size={16} />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CategoriaDialog
        open={dialogOpen}
        categoria={categoriaSeleccionada}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};
