'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export const useGenerarPDF = (onSuccess?: () => void) => {
  const [generando, setGenerando] = useState<string | null>(null);

  const generarPDF = async (catalogoId: string, nombreCliente: string): Promise<string | null> => {
    setGenerando(catalogoId);
    try {
      const res = await fetch(`/api/catalogos/${catalogoId}/generar-pdf`, {
        method: 'POST',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Error al generar PDF');
      toast.success(`PDF de ${nombreCliente} generado correctamente`);
      onSuccess?.();
      return json.pdfUrl as string;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al generar PDF');
      return null;
    } finally {
      setGenerando(null);
    }
  };

  return { generarPDF, generando };
};
