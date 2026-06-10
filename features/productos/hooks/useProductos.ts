'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { productoService } from '../services/productoService';
import type { Producto } from '../types/producto.types';

export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const empresaId = await cargarEmpresaId();
      if (!empresaId) throw new Error('No se encontró la empresa del usuario');
      const data = await productoService.listar(empresaId);
      setProductos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { productos, loading, error, reload };
};
