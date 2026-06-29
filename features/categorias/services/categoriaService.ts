import { createClient } from '@/lib/supabase/client';
import type { Categoria, CrearCategoriaInput, ActualizarCategoriaInput } from '../types/categoria.types';

export const categoriaService = {
  // Trae todas las categorías de la empresa ordenadas alfabéticamente
  async listar(empresaId: string): Promise<Categoria[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('nombre', { ascending: true });
      
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  // Crea una nueva categoría asignándole la empresa correspondiente
  async crear(empresaId: string, input: CrearCategoriaInput): Promise<Categoria> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categorias')
      .insert({ ...input, empresa_id: empresaId })
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  },

  // Actualiza los datos de una categoría existente
  async actualizar(id: string, input: ActualizarCategoriaInput): Promise<Categoria> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categorias')
      .update(input)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  },

  // Prende o apaga una categoría (borrado lógico)
  async toggleActivo(id: string, activo: boolean): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('categorias')
      .update({ activo })
      .eq('id', id);
      
    if (error) throw new Error(error.message);
  },
};