export interface CatalogoPDFItem {
  id: string;

  nombre_producto: string;

  cantidad: number;

  precio_unitario: number;

  subtotal: number;

  imagen_url: string | null;

  posicion: number;
}

export interface CatalogoPDF {
  id: string;

  nombre_cliente: string;

  tipo_lista: string;

  subtotal: number;

  total: number;

  fecha_vencimiento: string;

  created_at: string;

  items: CatalogoPDFItem[];
}