import type { Producto } from '@/features/productos/types/producto.types';

export type EstadoCatalogo = 'borrador' | 'publicado' | 'vencido';
export type TipoLista = 'publico' | 'mayorista';

export interface Catalogo {
  id: string;
  empresa_id: string;
  usuario_id: string;
  nombre_cliente: string;
  tipo_lista: TipoLista;
  fecha_vencimiento: string;
  subtotal: number;
  total: number;
  pdf_url: string | null;
  estado: EstadoCatalogo;
  created_at: string;
  updated_at: string;
}

export interface CatalogoItem {
  id: string;
  catalogo_id: string;
  producto_id: string | null;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  imagen_url: string | null;
  posicion: number;
  created_at: string;
}

export interface CatalogoConItems extends Catalogo {
  catalogo_items: CatalogoItem[];
}

// Estado del wizard (los 3 pasos juntos)
export interface NuevoCatalogoForm {
  // Paso 1
  nombre_cliente: string;
  tipo_lista: TipoLista;
  fecha_vencimiento: string;
  // Paso 2 — productos seleccionados con cantidad
  items: ItemSeleccionado[];
}

export interface ItemSeleccionado {
  producto: Producto;
  cantidad: number;
}
