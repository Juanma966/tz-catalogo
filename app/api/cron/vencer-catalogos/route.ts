import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function POST() {
  try {
    const supabase = createClient();

    const hoy = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('catalogos')
      .update({
        estado: 'vencido',
      })
      .eq('estado', 'publicado')
      .lt('fecha_vencimiento', hoy)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      actualizados: data?.length ?? 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Error desconocido',
      },
      {
        status: 500,
      }
    );
  }
}