export interface CatalogoPDFItem {
  id: string;

  nombre_producto: string;

  descripcion: string | null;

  cantidad: number;

  precio_unitario: number;

  imagen_url: string | null;

}

export interface CatalogoPDF {
  id: string;

  nombre_cliente: string;

  tipo_lista: string;

  fecha_vencimiento: string;

  created_at: string;

  items: CatalogoPDFItem[];
}