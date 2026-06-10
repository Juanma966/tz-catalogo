'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
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
import { productoService } from '../services/productoService';
import { ProductoDialog } from './ProductoDialog';
import { useProductos } from '../hooks/useProductos';
import type { Producto } from '../types/producto.types';

const FORMATO_PRECIO = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
});

export const ProductosList: FC = () => {
  const { productos, loading, error, reload } = useProductos();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | undefined>();
  const [toggling, setToggling] = useState<string | null>(null);

  const abrirCrear = () => {
    setProductoSeleccionado(undefined);
    setDialogOpen(true);
  };

  const abrirEditar = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setDialogOpen(true);
  };

  const handleToggleActivo = async (producto: Producto) => {
    setToggling(producto.id);
    try {
      await productoService.toggleActivo(producto.id, !producto.activo);
      toast.success(producto.activo ? 'Producto desactivado' : 'Producto activado');
      reload();
    } catch {
      toast.error('No se pudo cambiar el estado del producto');
    } finally {
      setToggling(null);
    }
  };

  const handleSuccess = () => {
    toast.success(productoSeleccionado ? 'Producto actualizado' : 'Producto creado');
    reload();
  };

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loading ? '...' : `${productos.length} producto${productos.length !== 1 ? 's' : ''}`}
        </p>
        <Button onClick={abrirCrear} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={15} /> Nuevo producto
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 hover:bg-transparent bg-gray-50">
              <TableHead className="text-gray-500 font-medium w-16">Imagen</TableHead>
              <TableHead className="text-gray-500 font-medium">Nombre</TableHead>
              <TableHead className="text-gray-500 font-medium">SKU</TableHead>
              <TableHead className="text-gray-500 font-medium text-right">Precio</TableHead>
              <TableHead className="text-gray-500 font-medium text-center">Estado</TableHead>
              <TableHead className="text-gray-500 font-medium text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-gray-100">
                  <TableCell><Skeleton className="w-10 h-10 rounded bg-gray-200" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40 bg-gray-200" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 bg-gray-200" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 ml-auto bg-gray-200" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 mx-auto bg-gray-200" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto bg-gray-200" /></TableCell>
                </TableRow>
              ))
            ) : productos.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center text-gray-400 py-12">
                  No hay productos. Creá el primero.
                </TableCell>
              </TableRow>
            ) : (
              productos.map((producto) => (
                <TableRow key={producto.id} className="border-gray-100 hover:bg-gray-50">
                  <TableCell>
                    {producto.imagen_url ? (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
                        <Image src={producto.imagen_url} alt={producto.nombre} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                        —
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-900">{producto.nombre}</p>
                    {producto.descripcion && (
                      <p className="text-xs text-gray-400 truncate max-w-48">{producto.descripcion}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">{producto.codigo_sku ?? '—'}</TableCell>
                  <TableCell className="text-right font-medium text-gray-900">
                    {FORMATO_PRECIO.format(producto.precio_base)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary"
                      className={producto.activo
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-100'}>
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => abrirEditar(producto)}
                        className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100">
                        <Pencil size={14} />
                      </Button>
                      <Button variant="ghost" size="icon"
                        onClick={() => handleToggleActivo(producto)}
                        disabled={toggling === producto.id}
                        className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100">
                        {producto.activo
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

      <ProductoDialog
        open={dialogOpen}
        producto={productoSeleccionado}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};
