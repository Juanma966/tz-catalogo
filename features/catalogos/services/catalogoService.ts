import { createClient } from '@/lib/supabase/client';
import type { Catalogo, CatalogoConItems, NuevoCatalogoForm, EstadoCatalogo } from '../types/catalogo.types';

export const catalogoService = {
  async listar(empresaId: string): Promise<Catalogo[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('catalogos')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async obtenerConItems(id: string): Promise<CatalogoConItems> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('catalogos')
      .select('*, catalogo_items(*)')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async crear(empresaId: string, usuarioId: string, form: NuevoCatalogoForm): Promise<Catalogo> {
    const supabase = createClient();

    const esMayorista = form.tipo_lista === 'mayorista';
    const precioEfectivo = (p: typeof form.items[0]['producto']) =>
      esMayorista ? (p.precio_mayorista ?? p.precio_base) : p.precio_base;

    const subtotal = form.items.reduce(
      (acc, { producto, cantidad }) => acc + precioEfectivo(producto) * cantidad,
      0
    );

    const { data: catalogo, error: errorCatalogo } = await supabase
      .from('catalogos')
      .insert({
        empresa_id: empresaId,
        usuario_id: usuarioId,
        nombre_cliente: form.nombre_cliente,
        tipo_lista: form.tipo_lista,
        fecha_vencimiento: form.fecha_vencimiento,
        subtotal,
        total: subtotal,
        estado: 'borrador',
      })
      .select()
      .single();

    if (errorCatalogo) throw new Error(errorCatalogo.message);

    const items = form.items.map((item, index) => {
      const precio = precioEfectivo(item.producto);
      return {
        catalogo_id: catalogo.id,
        producto_id: item.producto.id,
        nombre_producto: item.producto.nombre,
        descripcion: item.producto.descripcion ?? null,
        precio_unitario: precio,
        cantidad: item.cantidad,
        subtotal: precio * item.cantidad,
        imagen_url: item.producto.imagen_url,
        posicion: index + 1,
      };
    });

    const { error: errorItems } = await supabase.from('catalogo_items').insert(items);
    if (errorItems) throw new Error(errorItems.message);

    return catalogo;
  },

  async actualizarEstado(id: string, estado: EstadoCatalogo): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('catalogos')
      .update({ estado })
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
  async actualizarPDF(
  id: string,
  pdfUrl: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('catalogos')
    .update({
      pdf_url: pdfUrl,
      estado: 'publicado',
    })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
},

  async eliminar(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('catalogos').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
