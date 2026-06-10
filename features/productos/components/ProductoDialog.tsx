'use client';

import { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductoForm } from './ProductoForm';
import type { Producto } from '../types/producto.types';

interface ProductoDialogProps {
  open: boolean;
  producto?: Producto;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductoDialog: FC<ProductoDialogProps> = ({ open, producto, onClose, onSuccess }) => {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{producto ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
        </DialogHeader>
        <ProductoForm
          producto={producto}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
