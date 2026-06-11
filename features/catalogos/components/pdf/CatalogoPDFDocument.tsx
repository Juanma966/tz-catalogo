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
  meta:        { fontSize: 10, color: '#64748b', marginBottom: 3 },
  badge:       { backgroundColor: '#dbeafe', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start', marginTop: 6 },
  badgeText:   { fontSize: 9, color: '#1d4ed8', fontFamily: 'Helvetica-Bold' },
  divider:     { borderBottomWidth: 1, borderBottomColor: '#e2e8f0', marginTop: 14, marginBottom: 12 },
  thead:       { flexDirection: 'row', backgroundColor: '#f8fafc', paddingHorizontal: 6, paddingVertical: 7, borderRadius: 3 },
  theadText:   { fontSize: 8, color: '#94a3b8', fontFamily: 'Helvetica-Bold' },
  row:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  rowAlt:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', backgroundColor: '#fafafa' },
  cell:        { fontSize: 10, color: '#374151' },
  img:         { width: 32, height: 32, borderRadius: 4, objectFit: 'cover' },
  imgPlaceholder: { width: 32, height: 32, borderRadius: 4, backgroundColor: '#e2e8f0' },
  c1:          { flex: 4, flexDirection: 'row', alignItems: 'center', gap: 8 },
  c2:          { flex: 1 },
  c3:          { flex: 2 },
  c4:          { flex: 2 },
  totalWrap:   { marginTop: 18, paddingTop: 10, borderTopWidth: 2, borderTopColor: '#cbd5e1', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  totalLabel:  { fontSize: 12, color: '#64748b', marginRight: 14 },
  totalValue:  { fontSize: 15, fontFamily: 'Helvetica-Bold', color: '#1e293b' },
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
          <Text style={s.title}>Catálogo de Precios</Text>
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
          <View style={s.c4}><Text style={[s.theadText, { textAlign: 'right' }]}>SUBTOTAL</Text></View>
        </View>

        {/* Filas de productos */}
        {catalogo.items.map((item, i) => (
          <View key={item.id} style={i % 2 === 0 ? s.row : s.rowAlt}>
            <View style={s.c1}>
              {item.imagen_url
                ? <Image style={s.img} src={item.imagen_url} />
                : <View style={s.imgPlaceholder} />
              }
              <Text style={s.cell}>{item.nombre_producto}</Text>
            </View>
            <View style={s.c2}><Text style={[s.cell, { textAlign: 'center' }]}>{item.cantidad}</Text></View>
            <View style={s.c3}><Text style={[s.cell, { textAlign: 'right' }]}>{fmt(item.precio_unitario)}</Text></View>
            <View style={s.c4}><Text style={[s.cell, { textAlign: 'right' }]}>{fmt(item.subtotal)}</Text></View>
          </View>
        ))}

        {/* Total */}
        <View style={s.totalWrap}>
          <Text style={s.totalLabel}>Total</Text>
          <Text style={s.totalValue}>{fmt(catalogo.total)}</Text>
        </View>

      </Page>
    </Document>
  );
};
