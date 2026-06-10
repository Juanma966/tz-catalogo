'use client';

import { FC, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Loader2, Upload, X } from 'lucide-react';

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
import { uploadImagen } from '@/lib/storage/uploadImagen';
import { createClient } from '@/lib/supabase/client';
import type { Producto, CrearProductoInput } from '../types/producto.types';

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100),
  descripcion: z.string().max(300).optional(),
  precio_base: z.coerce.number().positive('El precio debe ser mayor a 0'),
  codigo_sku: z.string().max(50).optional(),
});

type FormValues = z.infer<typeof schema>;

interface ProductoFormProps {
  producto?: Producto;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProductoForm: FC<ProductoFormProps> = ({ producto, onSuccess, onCancel }) => {
  const [imagenPreview, setImagenPreview] = useState<string | null>(producto?.imagen_url ?? null);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [errorImg, setErrorImg] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: {
      nombre: producto?.nombre ?? '',
      descripcion: producto?.descripcion ?? '',
      precio_base: producto?.precio_base ?? 0,
      codigo_sku: producto?.codigo_sku ?? '',
    },
  });

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setErrorImg('La imagen no puede superar 3 MB');
      return;
    }
    setErrorImg(null);
    setImagenFile(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const quitarImagen = () => {
    setImagenFile(null);
    setImagenPreview(null);
    if (inputFileRef.current) inputFileRef.current.value = '';
  };

  const onSubmit = async (values: FormValues) => {
    setGuardando(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { data: usuario } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('id', user!.id)
        .single();

      const empresaId: string = usuario!.empresa_id;

      let imagen_url = producto?.imagen_url ?? null;
      if (imagenFile) {
        imagen_url = await uploadImagen(imagenFile, empresaId);
      } else if (!imagenPreview) {
        imagen_url = null;
      }

      const payload: CrearProductoInput = {
        nombre: values.nombre,
        descripcion: values.descripcion || undefined,
        precio_base: values.precio_base,
        codigo_sku: values.codigo_sku || undefined,
        imagen_url: imagen_url ?? undefined,
      };

      if (producto) {
        const { error } = await supabase.from('productos').update(payload).eq('id', producto.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from('productos').insert({ ...payload, empresa_id: empresaId });
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

        {/* Imagen */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Imagen del producto</span>
          {imagenPreview ? (
            <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
              <Image src={imagenPreview} alt="preview" fill className="object-contain bg-gray-50" />
              <button
                type="button"
                onClick={quitarImagen}
                className="absolute top-2 right-2 bg-white rounded-full p-1 border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
              >
                <X size={14} className="text-gray-500" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputFileRef.current?.click()}
              className="w-full h-32 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Upload size={20} />
              <span className="text-xs">Click para subir imagen (máx. 3 MB)</span>
            </button>
          )}
          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
            className="hidden"
          />
          {errorImg && <p className="text-xs text-red-500">{errorImg}</p>}
        </div>

        <FormField control={form.control} name="nombre" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Nombre *</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Laptop HP 15" className="border-gray-300 focus:border-blue-500" {...field} />
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

        <div className="grid grid-cols-2 gap-3">
          <FormField control={form.control} name="precio_base" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Precio base *</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" placeholder="0.00" className="border-gray-300 focus:border-blue-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="codigo_sku" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Código SKU</FormLabel>
              <FormControl>
                <Input placeholder="Ej: HP-LAP-001" className="border-gray-300 focus:border-blue-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {form.formState.errors.root && (
          <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={guardando}
            className="text-gray-500 hover:text-gray-900">
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando} className="min-w-24 bg-blue-600 hover:bg-blue-700 text-white">
            {guardando ? <Loader2 size={16} className="animate-spin" /> : (producto ? 'Guardar' : 'Crear')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
