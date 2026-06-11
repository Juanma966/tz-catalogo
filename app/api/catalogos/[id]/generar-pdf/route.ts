import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mapCatalogoToPDF } from '@/features/catalogos/services/catalogoPdfMapper';
import { generarCatalogoPDF } from '@/lib/pdf/generarCatalogoPDF';
import { uploadPDF } from '@/lib/storage/uploadPDF';
import type { CatalogoConItems } from '@/features/catalogos/types/catalogo.types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // 1. Obtener catálogo con items
    const { data, error } = await supabase
      .from('catalogos')
      .select('*, catalogo_items(*)')
      .eq('id', id)
      .single<CatalogoConItems>();

    if (error) throw new Error(error.message);

    // 2. Convertir al formato PDF
    const catalogoPDF = mapCatalogoToPDF(data);

    // 3. Generar el PDF como Blob
    const pdfBlob = await generarCatalogoPDF(catalogoPDF);

    // 4. Subir al bucket catalogos-pdf
    const nombreSanitizado = data.nombre_cliente
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_');
    const fileName = `${data.empresa_id}/${id}/${nombreSanitizado}.pdf`;
    const pdfUrl = await uploadPDF(fileName, pdfBlob, supabase);

    // 5. Guardar pdf_url y cambiar estado a publicado
    const { error: updateError } = await supabase
      .from('catalogos')
      .update({ pdf_url: pdfUrl, estado: 'publicado' })
      .eq('id', id);

    if (updateError) throw new Error(updateError.message);

    return NextResponse.json({ pdfUrl });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
