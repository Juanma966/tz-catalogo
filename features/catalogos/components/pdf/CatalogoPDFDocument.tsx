import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

import type { CatalogoPDF} from '@/features/catalogos/types/catalogo-pdf.types';

interface CatalogoPDFDocumentProps {
    catalogo: CatalogoPDF;
}

const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
})

export const CatalogoPDFDocument = ({ catalogo }: CatalogoPDFDocumentProps) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View>
                    <Text style={styles.title}>Hola, este es un PDF de ejemplo para el catálogo.</Text>
                    <Text> Generado con React PDF </Text>
                </View>
            </Page>
        </Document>
    )
}