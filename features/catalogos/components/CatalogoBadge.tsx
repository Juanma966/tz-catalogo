import { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import type { EstadoCatalogo } from '../types/catalogo.types';

const CONFIG: Record<EstadoCatalogo, { label: string; className: string }> = {
  borrador:  { label: 'Borrador',  className: 'bg-gray-100 text-gray-600 hover:bg-gray-100' },
  publicado: { label: 'Publicado', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' },
  vencido:   { label: 'Vencido',   className: 'bg-red-100 text-red-600 hover:bg-red-100' },
};

interface CatalogoBadgeProps {
  estado: EstadoCatalogo;
}

export const CatalogoBadge: FC<CatalogoBadgeProps> = ({ estado }) => {
  const { label, className } = CONFIG[estado];
  return <Badge className={className}>{label}</Badge>;
};
