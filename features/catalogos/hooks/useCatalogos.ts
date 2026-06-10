'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { catalogoService } from '../services/catalogoService';
import type { Catalogo } from '../types/catalogo.types';

export const useCatalogos = () => {
  const [catalogos, setCatalogos] = useState<Catalogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarContexto = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from('usuarios')
      .select('empresa_id, id')
      .eq('id', user.id)
      .single();
    return data ?? null;
  };

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ctx = await cargarContexto();
      if (!ctx) throw new Error('No se encontró la empresa del usuario');
      const data = await catalogoService.listar(ctx.empresa_id);
      setCatalogos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { catalogos, loading, error, reload };
};
