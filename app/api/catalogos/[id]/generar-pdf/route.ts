import { NextResponse } from 'next/server';
import { catalogoService } from '@/features/catalogos/services/catalogoService'

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const catalogo = await catalogoService.obtenerConItems(id);

    return NextResponse.json(catalogo);
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