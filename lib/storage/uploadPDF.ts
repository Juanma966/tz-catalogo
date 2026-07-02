import type { SupabaseClient } from '@supabase/supabase-js';

export async function uploadPDF(
  fileName: string,
  pdfBlob: Blob,
  supabase: SupabaseClient
): Promise<string> {
  const { error } = await supabase.storage
    .from('catalogos-pdf')
    .upload(fileName, pdfBlob, {
      contentType: 'application/pdf',
      upsert: true,
      cacheControl: '0',
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from('catalogos-pdf')
    .getPublicUrl(fileName);

  // La ruta del archivo es determinística (mismo id/cliente), por lo que al
  // regenerar el PDF la URL no cambiaría y el navegador/CDN serviría la copia
  // cacheada. Agregamos un parámetro con timestamp para forzar la recarga.
  return `${data.publicUrl}?v=${Date.now()}`;
}
