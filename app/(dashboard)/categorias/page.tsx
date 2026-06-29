import { CategoriasList } from '@/features/categorias/components/CategoriasList';

export const metadata = { title: 'Categorías' };

export default function CategoriasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Categorías</h1>
        <p className="text-gray-500 mt-1 text-sm">Organizá tus productos por categoría</p>
      </div>
      <CategoriasList />
    </div>
  );
}
