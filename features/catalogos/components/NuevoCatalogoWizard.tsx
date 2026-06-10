'use client';

import { FC, useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { catalogoService } from '../services/catalogoService';
import { PasoConfiguracion } from './PasoConfiguracion';
import { PasoProductos } from './PasoProductos';
import { PasoResumen } from './PasoResumen';
import type { NuevoCatalogoForm, ItemSeleccionado } from '../types/catalogo.types';

const PASOS = ['Configuración', 'Productos', 'Resumen'];

const FORM_INICIAL: NuevoCatalogoForm = {
  nombre_cliente: '',
  tipo_lista: 'publico',
  fecha_vencimiento: '',
  items: [],
};

interface NuevoCatalogoWizardProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const NuevoCatalogoWizard: FC<NuevoCatalogoWizardProps> = ({ onSuccess }) => {
  const [paso, setPaso] = useState(0);
  const [form, setForm] = useState<NuevoCatalogoForm>(FORM_INICIAL);
  const [guardando, setGuardando] = useState(false);

  const handlePaso1 = (valores: Pick<NuevoCatalogoForm, 'nombre_cliente' | 'tipo_lista' | 'fecha_vencimiento'>) => {
    setForm((prev) => ({ ...prev, ...valores }));
    setPaso(1);
  };

  const handlePaso2 = (items: ItemSeleccionado[]) => {
    setForm((prev) => ({ ...prev, items }));
    setPaso(2);
  };

  const handleConfirmar = async () => {
    setGuardando(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { data: usuario } = await supabase
        .from('usuarios')
        .select('empresa_id, id')
        .eq('id', user!.id)
        .single();

      await catalogoService.crear(usuario!.empresa_id, usuario!.id, form);
      toast.success('Catálogo creado correctamente');
      onSuccess();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al crear el catálogo');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicador de pasos */}
      <div className="flex items-center gap-2">
        {PASOS.map((nombre, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i < paso
                ? 'bg-emerald-500 text-white'
                : i === paso
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {i < paso ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium ${i === paso ? 'text-gray-900' : 'text-gray-400'}`}>
              {nombre}
            </span>
            {i < PASOS.length - 1 && <div className="w-6 h-px bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      {paso === 0 && <PasoConfiguracion datos={form} onSiguiente={handlePaso1} />}
      {paso === 1 && <PasoProductos items={form.items} onSiguiente={handlePaso2} onAtras={() => setPaso(0)} />}
      {paso === 2 && <PasoResumen form={form} guardando={guardando} onConfirmar={handleConfirmar} onAtras={() => setPaso(1)} />}
    </div>
  );
};
