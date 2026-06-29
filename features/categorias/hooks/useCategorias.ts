import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { categoriaService } from '../services/categoriaService';
import type { Categoria, CrearCategoriaInput, ActualizarCategoriaInput } from '../types/categoria.types';

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [empresaId, setEmpresaId] = useState<string | null>(null);

  const cargarEmpresaId = async (): Promise<string | null> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from('usuarios')
      .select('empresa_id')
      .eq('id', user.id)
      .single();
    return data?.empresa_id ?? null;
  };

  // Función para cargar la lista desde Supabase
  const cargarCategorias = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const id = await cargarEmpresaId();
      if (!id) throw new Error('No se encontró la empresa del usuario');
      setEmpresaId(id);
      const data = await categoriaService.listar(id);
      setCategorias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las categorías');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  // Función para agregar una categoría
  const crearCategoria = async (input: CrearCategoriaInput) => {
    if (!empresaId) throw new Error('No hay una sesión activa');
    const nueva = await categoriaService.crear(empresaId, input);
    setCategorias((prev) => [...prev, nueva].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    return nueva;
  };

  // Función para modificar una categoría
  const actualizarCategoria = async (id: string, input: ActualizarCategoriaInput) => {
    const editada = await categoriaService.actualizar(id, input);
    setCategorias((prev) => prev.map((c) => (c.id === id ? editada : c)));
    return editada;
  };

  // Función para activar/desactivar
  const toggleActivo = async (id: string, activo: boolean) => {
    await categoriaService.toggleActivo(id, activo);
    setCategorias((prev) =>
      prev.map((c) => (c.id === id ? { ...c, activo } : c))
    );
  };

  return {
    categorias,
    isLoading,
    error,
    refrescar: cargarCategorias,
    crearCategoria,
    actualizarCategoria,
    toggleActivo,
  };
}
