import { CatalogosList } from '@/features/catalogos/components/CatalogosList';

export const metadata = { title: 'Catálogos' };

export default function CatalogosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Catálogos</h1>
        <p className="text-gray-500 mt-1 text-sm">Creá y compartí catálogos de precios en PDF</p>
      </div>
      <CatalogosList />
    </div>
  );
}
