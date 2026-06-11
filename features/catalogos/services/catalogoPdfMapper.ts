import type { CatalogoConItems } from '@/features/catalogos/types/catalogo.types';
import type { CatalogoPDF } from '@/features/catalogos/types/catalogo-pdf.types';

export function mapCatalogoToPDF( catalogo: CatalogoConItems): CatalogoPDF {
    return {
        id: catalogo.id,
        nombre_cliente: catalogo.nombre_cliente,
        tipo_lista: catalogo.tipo_lista,
        subtotal: Number(catalogo.subtotal),
        total: Number(catalogo.total),
        fecha_vencimiento: catalogo.fecha_vencimiento,
        created_at: catalogo.created_at,
        
        items: catalogo.catalogo_items.map((item) => ({
            id: item.id,
            nombre_producto: item.nombre_producto,
            cantidad: item.cantidad,
            precio_unitario: Number(item.precio_unitario),
            subtotal: Number(item.subtotal),
            imagen_url: item.imagen_url,
        }))
    }
}