export function generarLinkWhatsApp( pdfUrl: string, nombreCliente: string ): string {
    const mensaje = `Hola ${nombreCliente},
    
    te compartimos el catalogo de productos. 
    
    Puedes descargarlo del siguiente enlace: ${pdfUrl}
    
    Gracias por Elegirnos!`.trim();

    return `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
}