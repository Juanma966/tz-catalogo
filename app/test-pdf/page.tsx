'use client';

import { generarCatalogoPDF } from '@/lib/pdf/generarCatalogoPDF';
import { createClient } from '@/lib/supabase/client';
import { mapCatalogoToPDF } from '@/features/catalogos/services/catalogoPdfMapper';

export default function TestPdfPage() {
  const handleGenerarPDF = async () => {
    const catalogoMock = {
      id: '1',
      nombre_cliente: 'Cliente Prueba',
      tipo_lista: 'mayorista',
      subtotal: 1000,
      total: 1000,
      fecha_vencimiento: '2026-06-30',
      created_at: new Date().toISOString(),

      catalogo_items: [
        {
          id: '1',
          nombre_producto: 'Producto Test',
          descripcion: 'Descripción de prueba',
          cantidad: 2,
          precio_unitario: 500,
          subtotal: 1000,
          imagen_url: null,
        },
      ],
    };



    



    alert('PDF generado correctamente');
  };

  return (
    <div className="p-4">
      <button onClick={handleGenerarPDF}>
        Generar PDF de prueba
      </button>
    </div>
  );
}