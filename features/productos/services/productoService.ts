import { createClient } from '@/lib/supabase/client';
import type { Producto, CrearProductoInput, ActualizarProductoInput } from '../types/producto.types';

export const productoService = {
  async listar(empresaId: string): Promise<Producto[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async crear(empresaId: string, input: CrearProductoInput): Promise<Producto> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('productos')
      .insert({ ...input, empresa_id: empresaId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async actualizar(id: string, input: ActualizarProductoInput): Promise<Producto> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('productos')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async toggleActivo(id: string, activo: boolean): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('productos')
      .update({ activo })
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
};
