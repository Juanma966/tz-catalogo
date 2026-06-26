'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProductos } from '@/features/productos/hooks/useProductos';
import type { ItemSeleccionado, NuevoCatalogoForm, TipoLista } from '../types/catalogo.types';

const FORMATO_PRECIO = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', minimumFractionDigits: 2,
});

interface PasoProductosProps {
  items: NuevoCatalogoForm['items'];
  tipoLista: TipoLista;
  onSiguiente: (items: ItemSeleccionado[]) => void;
  onAtras: () => void;
}

export const PasoProductos: FC<PasoProductosProps> = ({ items: itemsIniciales, tipoLista, onSiguiente, onAtras }) => {
  const esMayorista = tipoLista === 'mayorista';
  const precioVisible = (p: { precio_base: number; precio_mayorista?: number | null }) =>
    esMayorista ? (p.precio_mayorista ?? p.precio_base) : p.precio_base;
  const { productos, loading } = useProductos();
  const [seleccionados, setSeleccionados] = useState<Map<string, ItemSeleccionado>>(() => {
    const mapa = new Map<string, ItemSeleccionado>();
    itemsIniciales.forEach((item) => mapa.set(item.producto.id, item));
    return mapa;
  });
  const [error, setError] = useState('');

  const toggleProducto = (productoId: string) => {
    setSeleccionados((prev) => {
      const nuevo = new Map(prev);
      if (nuevo.has(productoId)) {
        nuevo.delete(productoId);
      } else {
        const producto = productos.find((p) => p.id === productoId)!;
        nuevo.set(productoId, { producto, cantidad: 1 });
      }
      return nuevo;
    });
  };

  const totalGeneral = Array.from(seleccionados.values()).reduce(
    (acc, { producto, cantidad }) => acc + precioVisible(producto) * cantidad, 0
  );

  const handleSiguiente = () => {
    if (seleccionados.size === 0) {
      setError('Seleccioná al menos un producto');
      return;
    }
    setError('');
    onSiguiente(Array.from(seleccionados.values()));
  };

  const productosActivos = productos.filter((p) => p.activo);

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-gray-200 rounded-lg" />
          ))}
        </div>
      ) : productosActivos.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">
          No tenés productos activos. Creá productos primero.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-1">
          {productosActivos.map((producto) => {
            const seleccionado = seleccionados.get(producto.id);
            return (
              <div
                key={producto.id}
                onClick={() => toggleProducto(producto.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  seleccionado
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                  seleccionado ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                }`}>
                  {seleccionado && <span className="text-white text-xs leading-none">✓</span>}
                </div>

                {producto.imagen_url ? (
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    <Image src={producto.imagen_url} alt={producto.nombre} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 border border-gray-200" />
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{producto.nombre}</p>
                  <p className="text-xs text-gray-500">{FORMATO_PRECIO.format(precioVisible(producto))}</p>
                </div>

                {seleccionado && (
                  <p className="text-sm font-medium text-gray-900 w-24 text-right shrink-0">
                    {FORMATO_PRECIO.format(precioVisible(producto) * seleccionado.cantidad)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {seleccionados.size > 0 && (
        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
          <span className="text-sm text-gray-500">{seleccionados.size} producto(s) seleccionado(s)</span>
          <span className="font-semibold text-gray-900">Total: {FORMATO_PRECIO.format(totalGeneral)}</span>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onAtras} className="text-gray-500 hover:text-gray-900">
          ← Atrás
        </Button>
        <Button type="button" onClick={handleSiguiente} className="bg-blue-600 hover:bg-blue-700 text-white">
          Siguiente →
        </Button>
      </div>
    </div>
  );
};
