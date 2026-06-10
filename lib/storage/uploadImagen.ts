import { createClient } from '@/lib/supabase/client';

const BUCKET = 'productos-imagenes';

export async function uploadImagen(file: File, empresaId: string): Promise<string> {
  const supabase = createClient();
  const extension = file.name.split('.').pop();
  const nombreArchivo = `${empresaId}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(nombreArchivo, file, { upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nombreArchivo);
  return data.publicUrl;
}

export async function eliminarImagen(url: string): Promise<void> {
  const supabase = createClient();
  const path = url.split(`${BUCKET}/`)[1];
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}
