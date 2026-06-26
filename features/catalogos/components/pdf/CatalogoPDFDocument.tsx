import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { CatalogoPDF } from '@/features/catalogos/types/catalogo-pdf.types';

interface CatalogoPDFDocumentProps {
  catalogo: CatalogoPDF;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n);

const s = StyleSheet.create({
  page:        { padding: 40, backgroundColor: '#ffffff' },
  title:       { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#1e293b', marginBottom: 5 },
  subtitle:    { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#3667b6', marginBottom: 5 },
  meta:        { fontSize: 10, color: '#64748b', marginBottom: 3 },
  badge:       { backgroundColor: '#dbeafe', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start', marginTop: 6 },
  badgeText:   { fontSize: 9, color: '#1d4ed8', fontFamily: 'Helvetica-Bold' },
  divider:     { borderBottomWidth: 1, borderBottomColor: '#e2e8f0', marginTop: 14, marginBottom: 12 },
  
  // Agrandamos un poquito la cabecera de la tabla para que acompañe el diseño
  thead:       { flexDirection: 'row', backgroundColor: '#f8fafc', paddingHorizontal: 10, paddingVertical: 9, borderRadius: 3, gap: 12 },
  theadText:   { fontSize: 10, color: '#94a3b8', fontFamily: 'Helvetica-Bold' }, // Subió de 8 a 10
  
  // Agrandamos la fila dándole más padding vertical (de 9 subió a 14)
  row:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 14, marginTop: 8, borderRadius: 6, backgroundColor: '#eff6ff', gap: 12 },
  
  // Agrandamos el texto del producto, precio, etc. (de 10 subió a 12)
  cell:        { fontSize: 12, color: '#374151' }, 
  
  // ¡Fotos más grandes! Pasaron de 32x32 a 48x48 píxeles
  img:         { width: 48, height: 48, borderRadius: 6, objectFit: 'cover' },
  imgPlaceholder: { width: 48, height: 48, borderRadius: 6, backgroundColor: '#e2e8f0' },
  
  // Columnas (las dejamos igual para que mantengan la proporción)
  c1:          { flex: 4, flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 28 },
  c1text:      { flex: 1 },
  c2:          { flex: 1, marginLeft: 12 },
  c3:          { flex: 2 },
  c4:          { flex: 3 },
  
  footer:      { position: 'absolute', bottom: 24, left: 40, right: 40, borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 8, alignItems: 'center' },
  footerText:  { fontSize: 9, color: '#64748b' },
});

export const CatalogoPDFDocument = ({ catalogo }: CatalogoPDFDocumentProps) => {
  const tipoLabel = catalogo.tipo_lista === 'mayorista' ? 'Lista Mayorista' : 'Lista Pública';
  const fechaVence = new Date(catalogo.fecha_vencimiento + 'T00:00:00').toLocaleDateString('es-AR');
  const fechaEmision = new Date(catalogo.created_at).toLocaleDateString('es-AR');

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Encabezado */}
        <View>
          <Text style={s.title}>TEKNOZOVAK - CATALOGO </Text>
          <Text style={s.subtitle}>Telefono: 2645212661 - 2645238881 </Text>
          <Text style={s.meta}>Para: {catalogo.nombre_cliente}</Text>
          <Text style={s.meta}>Emitido: {fechaEmision}  —  Vence: {fechaVence}</Text>
          <View style={s.badge}>
            <Text style={s.badgeText}>{tipoLabel}</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* Encabezado tabla */}
        <View style={s.thead}>
          <View style={s.c1}><Text style={s.theadText}>PRODUCTO</Text></View>
          <View style={s.c2}><Text style={[s.theadText, { textAlign: 'center' }]}>CANT.</Text></View>
          <View style={s.c3}><Text style={[s.theadText, { textAlign: 'right' }]}>PRECIO UNIT.</Text></View>
          <View style={s.c4}><Text style={s.theadText}>DESCRIPCIÒN</Text></View>
        </View>

        {/* Filas de productos */}
        {catalogo.items.map((item) => (
          <View key={item.id} style={s.row}>
            <View style={s.c1}>
              {item.imagen_url
                ? <Image style={s.img} src={item.imagen_url} />
                : <View style={s.imgPlaceholder} />
              }
              <View style={s.c1text}><Text style={[s.cell, { fontFamily: 'Helvetica-Bold' }]}>{item.nombre_producto}</Text></View>
            </View>
            <View style={s.c2}><Text style={[s.cell, { textAlign: 'center' }]}>{item.cantidad}</Text></View>
            <View style={s.c3}><Text style={[s.cell, { textAlign: 'right', fontFamily: 'Helvetica-Bold' }]}>{fmt(item.precio_unitario)}</Text></View>
            <View style={s.c4}><Text style={s.cell}>{item.descripcion || '—'}</Text></View>
          </View>
        ))}

        {/* Pie de pagina */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>CONTACTO: 2645212661 - 2645238881</Text>
        </View>

      </Page>
    </Document>
  );
};
