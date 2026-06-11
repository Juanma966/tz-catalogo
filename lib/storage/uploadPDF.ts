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
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from('catalogos-pdf')
    .getPublicUrl(fileName);

  return data.publicUrl;
}
