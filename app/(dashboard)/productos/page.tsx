import { ProductosList } from '@/features/productos/components/ProductosList';

export const metadata = { title: 'Productos' };

export default function ProductosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
        <p className="text-gray-500 mt-1 text-sm">Administrá tu catálogo de productos</p>
      </div>
      <ProductosList />
    </div>
  );
}
