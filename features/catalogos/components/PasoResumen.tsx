'use client';

import { FC } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CatalogoBadge } from './CatalogoBadge';
import type { NuevoCatalogoForm } from '../types/catalogo.types';

const FORMATO_PRECIO = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', minimumFractionDigits: 2,
});

interface PasoResumenProps {
  form: NuevoCatalogoForm;
  guardando: boolean;
  modoEdicion?: boolean;
  onConfirmar: () => void;
  onAtras: () => void;
}

export const PasoResumen: FC<PasoResumenProps> = ({ form, guardando, modoEdicion, onConfirmar, onAtras }) => {
  const total = form.items.reduce(
    (acc, { producto, cantidad }) => acc + producto.precio_base * cantidad, 0
  );

  return (
    <div className="space-y-5">
      {/* En desktop: 2 columnas — datos izquierda, productos derecha */}
      <div className="sm:grid sm:grid-cols-2 sm:gap-5 space-y-5 sm:space-y-0">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Datos del catálogo</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Cliente:</span>
              <span className="ml-2 text-gray-900 font-medium">{form.nombre_cliente}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Lista:</span>
              <CatalogoBadge estado="borrador" />
              <span className="text-gray-700 capitalize">{form.tipo_lista}</span>
            </div>
            <div>
              <span className="text-gray-500">Vence:</span>
              <span className="ml-2 text-gray-900">
                {new Date(form.fecha_vencimiento + 'T00:00:00').toLocaleDateString('es-AR')}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Productos ({form.items.length})
          </h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
          {form.items.map(({ producto, cantidad }) => (
            <div key={producto.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              {producto.imagen_url ? (
                <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                  <Image src={producto.imagen_url} alt={producto.nombre} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gray-100 shrink-0 border border-gray-200" />
              )}
              <span className="flex-1 text-sm text-gray-900 truncate">{producto.nombre}</span>
              <span className="text-xs text-gray-500">x{cantidad}</span>
              <span className="text-sm font-medium text-gray-900 w-24 text-right">
                {FORMATO_PRECIO.format(producto.precio_base * cantidad)}
              </span>
            </div>
          ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
        <span className="text-gray-500 text-sm">Total del catálogo</span>
        <span className="text-xl font-bold text-gray-900">{FORMATO_PRECIO.format(total)}</span>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onAtras} disabled={guardando}
          className="text-gray-500 hover:text-gray-900">
          ← Atrás
        </Button>
        <Button onClick={onConfirmar} disabled={guardando} className="min-w-32 bg-blue-600 hover:bg-blue-700 text-white">
          {guardando
            ? <Loader2 size={16} className="animate-spin" />
            : modoEdicion ? 'Guardar cambios' : 'Crear catálogo'}
        </Button>
      </div>
    </div>
  );
};
