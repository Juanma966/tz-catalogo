import { pdf } from '@react-pdf/renderer';

import { CatalogoPDFDocument } from '@/features/catalogos/components/pdf/CatalogoPDFDocument';

import type { CatalogoPDF } from '@/features/catalogos/types/catalogo-pdf.types';

export async function generarCatalogoPDF( catalogo: CatalogoPDF): Promise<Blob> {
    const blob = await pdf( <CatalogoPDFDocument catalogo ={catalogo} /> ).toBlob();
    return blob;
}