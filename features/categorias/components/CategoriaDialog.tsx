'use client';

import { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CategoriaForm } from './CategoriaForm';
import type { Categoria } from '../types/categoria.types';

interface CategoriaDialogProps {
  open: boolean;
  categoria?: Categoria;
  onClose: () => void;
  onSuccess: () => void;
}

export const CategoriaDialog: FC<CategoriaDialogProps> = ({ open, categoria, onClose, onSuccess }) => {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{categoria ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
        </DialogHeader>
        <CategoriaForm
          categoria={categoria}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
