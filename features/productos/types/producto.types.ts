export interface Producto {
  id: string;
  empresa_id: string;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  precio_mayorista: number | null;
  imagen_url: string | null;
  codigo_sku: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  categoria_id: string | null;
  categoria?: { id:string; nombre:string } | null;
}

export interface CrearProductoInput {
  nombre: string;
  descripcion?: string;
  precio_base: number;
  precio_mayorista?: number | null;
  codigo_sku?: string;
  imagen_url?: string;
  activo?: boolean;
  categoria_id?: string | null;
}

export type ActualizarProductoInput = Partial<CrearProductoInput>;
