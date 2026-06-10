'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import type { NuevoCatalogoForm, TipoLista } from '../types/catalogo.types';

const schema = z.object({
  nombre_cliente: z.string().min(1, 'El nombre del cliente es requerido').max(100),
  tipo_lista: z.enum(['publico', 'mayorista'] as const),
  fecha_vencimiento: z.string().min(1, 'La fecha de vencimiento es requerida'),
});

type FormValues = z.infer<typeof schema>;

interface PasoConfiguracionProps {
  datos: Pick<NuevoCatalogoForm, 'nombre_cliente' | 'tipo_lista' | 'fecha_vencimiento'>;
  onSiguiente: (valores: FormValues) => void;
}

const TIPOS: { value: TipoLista; label: string; descripcion: string }[] = [
  { value: 'publico',   label: 'Público',   descripcion: 'Precio de venta al público general' },
  { value: 'mayorista', label: 'Mayorista', descripcion: 'Precio especial para mayoristas' },
];

export const PasoConfiguracion: FC<PasoConfiguracionProps> = ({ datos, onSiguiente }) => {
  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: {
      nombre_cliente: datos.nombre_cliente,
      tipo_lista: datos.tipo_lista,
      fecha_vencimiento: datos.fecha_vencimiento,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSiguiente)} className="space-y-5">
        <FormField control={form.control} name="nombre_cliente" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Nombre del cliente *</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Distribuidora Pérez" className="border-gray-300" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="tipo_lista" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Tipo de lista *</FormLabel>
            <div className="grid grid-cols-2 gap-3 mt-1">
              {TIPOS.map((tipo) => (
                <button
                  key={tipo.value}
                  type="button"
                  onClick={() => field.onChange(tipo.value)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    field.value === tipo.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium text-sm">{tipo.label}</p>
                  <p className="text-xs mt-0.5 opacity-70">{tipo.descripcion}</p>
                </button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="fecha_vencimiento" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Fecha de vencimiento *</FormLabel>
            <FormControl>
              <Input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="border-gray-300"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex justify-end pt-2">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Siguiente →
          </Button>
        </div>
      </form>
    </Form>
  );
};
