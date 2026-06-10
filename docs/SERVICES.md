# 🔧 Documentación de Servicios y API Routes

## Tabla de Contenidos

1. [Servicios de Autenticación](#servicios-de-autenticación)
2. [Servicios de Productos](#servicios-de-productos)
3. [Servicios de Catálogos](#servicios-de-catálogos)
4. [Servicios de PDF](#servicios-de-pdf)
5. [Servicios de Storage](#servicios-de-storage)
6. [Servicios de WhatsApp](#servicios-de-whatsapp)
7. [Custom Hooks](#custom-hooks)
8. [API Routes](#api-routes)

---

## Servicios de Autenticación

### authService.ts

**Ubicación:** `src/features/auth/services/authService.ts`

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const authService = {
  async login(email: string, password: string) {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw new Error(error.message);
    return data;
  },

  async logout() {
    const supabase = createClientComponentClient();
    
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async getCurrentUser() {
    const supabase = createClientComponentClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getSession() {
    const supabase = createClientComponentClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async createUser(email: string, password: string) {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw new Error(error.message);
    return data;
  },
};
```

**Métodos:**

| Método | Parámetros | Retorna | Descripción |
|--------|-----------|---------|-------------|
| `login` | email, password | { user, session } | Inicia sesión con email/password |
| `logout` | - | void | Cierra sesión actual |
| `getCurrentUser` | - | User \| null | Obtiene usuario autenticado |
| `getSession` | - | Session \| null | Obtiene sesión actual |
| `createUser` | email, password | { user, session } | Crea nuevo usuario |

**Uso:**
```typescript
import { authService } from '@/features/auth/services/authService';

// En componente
try {
  const { user } = await authService.login(email, password);
  router.push('/dashboard');
} catch (error) {
  console.error('Error:', error.message);
}
```

---

## Servicios de Productos

### productoService.ts

**Ubicación:** `src/features/productos/services/productoService.ts`

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const productoService = {
  async obtenerProductos(empresaId: string) {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('activo', true)
      .order('nombre');
    
    if (error) throw new Error(error.message);
    return data;
  },

  async obtenerProducto(id: string) {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  async crearProducto(
    empresaId: string, 
    producto: {
      nombre: string;
      precio_base: number;
      codigo_sku?: string;
      descripcion?: string;
      imagen_url?: string;
    }
  ) {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase
      .from('productos')
      .insert([
        {
          ...producto,
          empresa_id: empresaId,
        },
      ])
      .select();
    
    if (error) throw new Error(error.message);
    return data[0];
  },

  async actualizarProducto(
    id: string,
    actualizaciones: Partial<Producto>
  ) {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase
      .from('productos')
      .update(actualizaciones)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  async eliminarProducto(id: string) {
    const supabase = createClientComponentClient();
    
    const { error } = await supabase
      .from('productos')
      .update({ activo: false })
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  },

  async buscarProductos(
    empresaId: string,
    termino: string
  ) {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('activo', true)
      .or(`nombre.ilike.%${termino}%,codigo_sku.ilike.%${termino}%`);
    
    if (error) throw new Error(error.message);
    return data;
  },
};
```

**Métodos:**

| Método | Parámetros | Retorna | Descripción |
|--------|-----------|---------|-------------|
| `obtenerProductos` | empresaId | Producto[] | Lista todos los productos activos |
| `obtenerProducto` | id | Producto | Obtiene producto por ID |
| `crearProducto` | empresaId, producto | Producto | Crea nuevo producto |
| `actualizarProducto` | id, actualizaciones | Producto | Actualiza producto existente |
| `eliminarProducto` | id | void | Marca como inactivo (soft delete) |
| `buscarProductos` | empresaId, termino | Producto[] | Busca por nombre o SKU |

---

## Servicios de Catálogos

### catalogoService.ts

**Ubicación:** `src/features/catalogos/services/catalogoService.ts`

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const catalogoService = {
  async obtenerCatalogos(empresaId: string) {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase
      .from('catalogos')
      .select(`
        *,
        usuario:usuarios(nombre_completo),
        items:catalogo_items(*)
      `)
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  },

  async obtenerCatalogo(id: string) {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase
      .from('catalogos')
      .select(`
        *,
        usuario:usuarios(nombre_completo),
        items:catalogo_items(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  async crearCatalogo(
    empresaId: string,
    userId: string,
    catalogo: {
      nombre_cliente: string;
      tipo_lista: 'publico' | 'mayorista';
      fecha_vencimiento: string;
      subtotal: number;
      total: number;
      items: Array<{
        nombre_producto: string;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
        imagen_url: string;
        posicion: number;
      }>;
    }
  ) {
    const supabase = createClientComponentClient();
    
    // Crear catálogo
    const { data: catalogoData, error: catalogoError } = await supabase
      .from('catalogos')
      .insert([
        {
          empresa_id: empresaId,
          usuario_id: userId,
          nombre_cliente: catalogo.nombre_cliente,
          tipo_lista: catalogo.tipo_lista,
          fecha_vencimiento: catalogo.fecha_vencimiento,
          subtotal: catalogo.subtotal,
          total: catalogo.total,
          estado: 'borrador',
        },
      ])
      .select()
      .single();
    
    if (catalogoError) throw new Error(catalogoError.message);
    
    // Crear items
    const itemsConCatalogoId = catalogo.items.map(item => ({
      ...item,
      catalogo_id: catalogoData.id,
    }));
    
    const { error: itemsError } = await supabase
      .from('catalogo_items')
      .insert(itemsConCatalogoId);
    
    if (itemsError) throw new Error(itemsError.message);
    
    return catalogoData;
  },

  async actualizarCatalogo(
    id: string,
    actualizaciones: Partial<Catalogo>
  ) {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase
      .from('catalogos')
      .update(actualizaciones)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  async guardarPDFUrl(catalogoId: string, pdfUrl: string) {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase
      .from('catalogos')
      .update({
        pdf_url: pdfUrl,
        estado: 'publicado',
      })
      .eq('id', catalogoId)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  async eliminarCatalogo(id: string) {
    const supabase = createClientComponentClient();
    
    const { error } = await supabase
      .from('catalogos')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  },
};
```

---

## Servicios de PDF

### pdfService.ts

**Ubicación:** `src/lib/pdf/pdfService.ts`

```typescript
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { CatalogoPDFTemplate } from '@/features/catalogos/templates/CatalogoPDFTemplate';

export const pdfService = {
  async generarPDF(
    catalogo: {
      nombreCliente: string;
      tipoLista: string;
      fechaVencimiento: string;
      items: any[];
      total: number;
    }
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const doc = (
        <CatalogoPDFTemplate
          catalogo={catalogo}
          onRenderSuccess={(pdf) => {
            pdf.blob().then(resolve).catch(reject);
          }}
        />
      );
    });
  },

  async descargarPDF(blob: Blob, nombreArchivo: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  calcularDimensionesCatalogo(
    itemsCount: number,
    itemsPerPage: number = 15
  ) {
    const paginas = Math.ceil(itemsCount / itemsPerPage);
    return {
      paginas,
      itemsUltimaPagina: itemsCount % itemsPerPage || itemsPerPage,
    };
  },
};
```

---

## Servicios de Storage

### storageService.ts

**Ubicación:** `src/lib/storage/storageService.ts`

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const storageService = {
  async subirImagen(
    bucket: string,
    ruta: string,
    archivo: File
  ): Promise<string> {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(ruta, archivo, {
        upsert: true,
        contentType: archivo.type,
      });
    
    if (error) throw new Error(error.message);
    
    return this.obtenerURLPublica(bucket, data.path);
  },

  async subirPDF(
    bucket: string,
    ruta: string,
    blob: Blob
  ): Promise<string> {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(ruta, blob, {
        contentType: 'application/pdf',
        upsert: true,
      });
    
    if (error) throw new Error(error.message);
    
    return this.obtenerURLPublica(bucket, data.path);
  },

  obtenerURLPublica(bucket: string, ruta: string): string {
    const supabase = createClientComponentClient();
    
    const { data } = supabase.storage.from(bucket).getPublicUrl(ruta);
    
    return data.publicUrl;
  },

  async eliminarArchivo(bucket: string, ruta: string) {
    const supabase = createClientComponentClient();
    
    const { error } = await supabase.storage.from(bucket).remove([ruta]);
    
    if (error) throw new Error(error.message);
  },

  async obtenerMetadatos(bucket: string, ruta: string) {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .info(ruta);
    
    if (error) throw new Error(error.message);
    return data;
  },

  generarRutaUnica(empresaId: string, nombre: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const nombreLimpio = nombre.toLowerCase().replace(/\s+/g, '-');
    
    return `${empresaId}/${timestamp}-${random}-${nombreLimpio}`;
  },
};
```

---

## Servicios de WhatsApp

### whatsappService.ts

**Ubicación:** `src/lib/whatsapp/whatsappService.ts`

```typescript
export const whatsappService = {
  generarEnlace(
    numeroWhatsApp: string,
    catalogo: {
      nombreCliente: string;
      tipoLista: string;
      total: number;
      pdfUrl: string;
      fechaVencimiento: string;
    }
  ): string {
    const mensaje = this.generarMensaje(catalogo);
    const enlaceWA = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
    return enlaceWA;
  },

  generarMensaje(catalogo: any): string {
    const { nombreCliente, tipoLista, total, pdfUrl, fechaVencimiento } = catalogo;
    
    return `
¡Hola! 👋

Te envío el catálogo de precios solicitado.

📋 *Catálogo para:* ${nombreCliente}
📊 *Tipo:* ${tipoLista === 'publico' ? 'Precio Público' : 'Precio Mayorista'}
💵 *Total:* $${total.toFixed(2)}
📅 *Válido hasta:* ${fechaVencimiento}

👇 *Descargar PDF:*
${pdfUrl}

¡Gracias por tu confianza! 😊
    `.trim();
  },

  abrirWhatsApp(enlace: string) {
    if (typeof window !== 'undefined') {
      window.open(enlace, '_blank');
    }
  },

  validarNumero(numero: string): boolean {
    // Formato internacional sin +
    const regex = /^[1-9]\d{1,14}$/;
    return regex.test(numero.replace(/[^0-9]/g, ''));
  },
};
```

---

## Custom Hooks

### useAuth.ts

**Ubicación:** `src/features/auth/hooks/useAuth.ts`

```typescript
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/auth-helpers-nextjs';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    async function obtenerUsuario() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    obtenerUsuario();

    // Suscribirse a cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, [supabase]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return { user, loading, error, logout };
}
```

**Uso:**
```typescript
'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header>
      <p>Hola, {user.email}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </header>
  );
}
```

---

### useProductos.ts

**Ubicación:** `src/features/productos/hooks/useProductos.ts`

```typescript
import { useEffect, useState } from 'react';
import { productoService } from '../services/productoService';
import type { Producto } from '../types/producto.types';

export function useProductos(empresaId: string) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await productoService.obtenerProductos(empresaId);
      setProductos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [empresaId]);

  const crear = async (producto: any) => {
    const nuevo = await productoService.crearProducto(empresaId, producto);
    setProductos([...productos, nuevo]);
    return nuevo;
  };

  const actualizar = async (id: string, actualizaciones: any) => {
    const actualizado = await productoService.actualizarProducto(id, actualizaciones);
    setProductos(productos.map(p => p.id === id ? actualizado : p));
    return actualizado;
  };

  const eliminar = async (id: string) => {
    await productoService.eliminarProducto(id);
    setProductos(productos.filter(p => p.id !== id));
  };

  return {
    productos,
    loading,
    error,
    recargar: cargar,
    crear,
    actualizar,
    eliminar,
  };
}
```

---

### useCatalogoForm.ts

**Ubicación:** `src/features/catalogos/hooks/useCatalogoForm.ts`

```typescript
import { useState } from 'react';
import { catalogoService } from '../services/catalogoService';
import type { CatalogoFormData } from '../types/catalogo.types';

export function useCatalogoForm() {
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState<CatalogoFormData>({
    nombreCliente: '',
    tipoLista: '',
    fechaVencimiento: '',
    productos: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avanzar = () => setPaso(p => p + 1);
  const retroceder = () => setPaso(p => Math.max(1, p - 1));

  const actualizar = (actualizaciones: Partial<CatalogoFormData>) => {
    setDatos(prev => ({ ...prev, ...actualizaciones }));
  };

  const guardar = async (empresaId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const catalogo = await catalogoService.crearCatalogo(
        empresaId,
        userId,
        {
          nombre_cliente: datos.nombreCliente,
          tipo_lista: datos.tipoLista as 'publico' | 'mayorista',
          fecha_vencimiento: datos.fechaVencimiento,
          subtotal: datos.productos.reduce((sum, p) => sum + p.subtotal, 0),
          total: datos.productos.reduce((sum, p) => sum + p.subtotal, 0),
          items: datos.productos.map((p, i) => ({
            nombre_producto: p.nombre,
            cantidad: p.cantidad,
            precio_unitario: p.precio,
            subtotal: p.subtotal,
            imagen_url: p.imagenUrl,
            posicion: i + 1,
          })),
        }
      );

      return catalogo;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error desconocido';
      setError(mensaje);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetear = () => {
    setPaso(1);
    setDatos({
      nombreCliente: '',
      tipoLista: '',
      fechaVencimiento: '',
      productos: [],
    });
    setError(null);
  };

  return {
    paso,
    datos,
    loading,
    error,
    avanzar,
    retroceder,
    actualizar,
    guardar,
    resetear,
  };
}
```

---

## API Routes

### POST /api/auth/signup

**Ubicación:** `src/app/api/auth/signup/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, nombre_completo, empresa_id, rol } = 
      await request.json();

    const supabase = createRouteHandlerClient({ cookies });

    // Crear usuario en Auth
    const { data: authData, error: authError } = 
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Crear registro en usuarios table
    const { error: dbError } = await supabase
      .from('usuarios')
      .insert([
        {
          id: authData.user.id,
          email,
          nombre_completo,
          empresa_id,
          rol,
          activo: true,
        },
      ]);

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { user: authData.user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
```

---

### POST /api/catalogos

**Ubicación:** `src/app/api/catalogos/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/lib/storage/storageService';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Verificar autenticación
    const { data: { user }, error: authError } = 
      await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;
    const catalogoData = JSON.parse(
      formData.get('catalogo') as string
    );

    // Subir PDF
    const rutaPDF = storageService.generarRutaUnica(
      catalogoData.empresa_id,
      `catalogo-${Date.now()}.pdf`
    );

    const pdfUrl = await storageService.subirPDF(
      'catalogos-pdf',
      rutaPDF,
      pdfFile
    );

    // Crear registro en BD
    const { data, error } = await supabase
      .from('catalogos')
      .insert([
        {
          ...catalogoData,
          pdf_url: pdfUrl,
          usuario_id: user.id,
          estado: 'publicado',
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { data: data[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error al crear catálogo' },
      { status: 500 }
    );
  }
}
```

---

### DELETE /api/catalogos/[id]

**Ubicación:** `src/app/api/catalogos/[id]/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: { user }, error: authError } = 
      await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario sea el propietario
    const { data: catalogo, error: selectError } = await supabase
      .from('catalogos')
      .select('usuario_id')
      .eq('id', params.id)
      .single();

    if (selectError || catalogo.usuario_id !== user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    // Eliminar
    const { error } = await supabase
      .from('catalogos')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Catálogo eliminado' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar' },
      { status: 500 }
    );
  }
}
```

---

**Versión**: 1.0.0  
**Compatible con**: Next.js 15+, Supabase v2.0+
