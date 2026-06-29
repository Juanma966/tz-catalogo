'use client';

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { createClient } from '@/lib/supabase/client';
import type { Categoria, CrearCategoriaInput } from '../types/categoria.types';

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100),
  descripcion: z.string().max(300).optional(),
});

type FormValues = z.infer<typeof schema>;

interface CategoriaFormProps {
  categoria?: Categoria;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CategoriaForm: FC<CategoriaFormProps> = ({ categoria, onSuccess, onCancel }) => {
  const [guardando, setGuardando] = useState(false);

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: {
      nombre: categoria?.nombre ?? '',
      descripcion: categoria?.descripcion ?? '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setGuardando(true);
    try {
      const supabase = createClient();

      const payload: CrearCategoriaInput = {
        nombre: values.nombre,
        descripcion: values.descripcion || undefined,
      };

      if (categoria) {
        const { error } = await supabase.from('categorias').update(payload).eq('id', categoria.id);
        if (error) throw new Error(error.message);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: usuario } = await supabase
          .from('usuarios')
          .select('empresa_id')
          .eq('id', user!.id)
          .single();

        const { error } = await supabase
          .from('categorias')
          .insert({ ...payload, empresa_id: usuario!.empresa_id });
        if (error) throw new Error(error.message);
      }

      onSuccess();
    } catch (e) {
      form.setError('root', { message: e instanceof Error ? e.message : 'Error al guardar' });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="nombre" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Nombre *</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Electrónica" className="border-gray-300 focus:border-blue-500" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="descripcion" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Descripción</FormLabel>
            <FormControl>
              <Input placeholder="Descripción breve (opcional)" className="border-gray-300 focus:border-blue-500" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {form.formState.errors.root && (
          <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={guardando}
            className="text-gray-500 hover:text-gray-900">
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando} className="min-w-24 bg-blue-600 hover:bg-blue-700 text-white">
            {guardando ? <Loader2 size={16} className="animate-spin" /> : (categoria ? 'Guardar' : 'Crear')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
