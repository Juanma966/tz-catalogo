# 📝 Definiciones de Tipos TypeScript

## Ubicación: `src/types/index.ts`

```typescript
import { User as AuthUser } from '@supabase/auth-helpers-nextjs';

// ============================================
// AUTENTICACIÓN
// ============================================

export interface Usuario {
  id: string;
  nombre_completo: string;
  email: string;
  rol: 'admin' | 'empleado';
  empresa_id: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  usuario: Usuario | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

// ============================================
// EMPRESAS
// ============================================

export interface Empresa {
  id: string;
  nombre: string;
  slug: string;
  logo_url?: string;
  descripcion?: string;
  admin_id: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// PRODUCTOS
// ============================================

export interface Producto {
  id: string;
  empresa_id: string;
  nombre: string;
  descripcion?: string;
  precio_base: number;
  imagen_url?: string;
  codigo_sku?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductoFormData {
  nombre: string;
  descripcion?: string;
  precio_base: number;
  codigo_sku?: string;
  imagen?: File;
}

// ============================================
// CATÁLOGOS
// ============================================

export interface Catalogo {
  id: string;
  empresa_id: string;
  usuario_id: string;
  nombre_cliente: string;
  tipo_lista: 'publico' | 'mayorista';
  fecha_vencimiento: string;
  subtotal: number;
  total: number;
  pdf_url?: string;
  estado: 'borrador' | 'publicado' | 'vencido';
  created_at: string;
  updated_at: string;
  usuario?: {
    nombre_completo: string;
  };
  items?: CatalogoItem[];
}

export interface CatalogoItem {
  id: string;
  catalogo_id: string;
  producto_id?: string;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  imagen_url?: string;
  posicion: number;
  created_at: string;
}

export interface CatalogoFormData {
  nombreCliente: string;
  tipoLista: 'publico' | 'mayorista' | '';
  fechaVencimiento: string;
  productos: ProductoEnCatalogo[];
}

export interface ProductoEnCatalogo {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  imagenUrl: string;
  archivo?: File;
  productoId?: string;
}

// ============================================
// FORMULARIOS
// ============================================

export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  loading: boolean;
  submitted: boolean;
}

export interface FormAction<T> {
  type: 'SET_FIELD' | 'SET_ERROR' | 'SET_LOADING' | 'RESET' | 'SET_DATA';
  payload: any;
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// ============================================
// PAGINACIÓN
// ============================================

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// FILTROS Y BÚSQUEDA
// ============================================

export interface SearchParams {
  query?: string;
  sort?: string;
  filter?: Record<string, any>;
  page?: number;
  limit?: number;
}

export interface CatalogoFilters {
  estado?: 'borrador' | 'publicado' | 'vencido';
  tipo_lista?: 'publico' | 'mayorista';
  fecha_desde?: string;
  fecha_hasta?: string;
  usuario_id?: string;
}

// ============================================
// NOTIFICACIONES
// ============================================

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================
// ESTADO DE CARGA
// ============================================

export interface LoadingState {
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
}

// ============================================
// PDF
// ============================================

export interface PDFMetadata {
  titulo: string;
  autor: string;
  fecha_creacion: string;
  tamaño: number;
}

export interface PDFOptions {
  formato?: 'A4' | 'Letter';
  orientacion?: 'portrait' | 'landscape';
  margen?: number;
  titulo?: string;
}

// ============================================
// WHATSAPP
// ============================================

export interface WhatsAppMessage {
  numero: string;
  mensaje: string;
  enlace_pdf?: string;
}

// ============================================
// ESTADÍSTICAS
// ============================================

export interface Estadisticas {
  totalProductos: number;
  totalCatalogos: number;
  totalVentas: number;
  ultimoMes: {
    catalogos: number;
    monto: number;
  };
  porTipo: {
    publico: number;
    mayorista: number;
  };
}

// ============================================
// CONFIGURACIÓN
// ============================================

export interface AppConfig {
  appName: string;
  appVersion: string;
  supabaseUrl: string;
  appUrl: string;
  environment: 'development' | 'production' | 'staging';
}

// ============================================
// COMPONENTES UI
// ============================================

export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void | Promise<void>;
  className?: string;
}

export interface CardProps {
  title?: string;
  description?: string;
  className?: string;
  loading?: boolean;
}

// ============================================
// HOOKS PERSONALIZADOS
// ============================================

export interface UseFormReturn<T> {
  form: T;
  setForm: (data: Partial<T>) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  validate: () => boolean;
  reset: () => void;
  isDirty: boolean;
}

export interface UseQueryOptions {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
  cacheTime?: number;
}

// ============================================
// HELPERS PARA TYPES
// ============================================

// Extraer propiedades de un tipo
export type ExtractKeys<T> = {
  [K in keyof T]: T[K];
};

// Hacer propiedades opcionales
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Hacer propiedades requeridas
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Tipo para errores de validación
export type ValidationErrors<T> = {
  [K in keyof T]?: string | string[];
};

// Tipo para estado de formulario
export type FormStatus = 'idle' | 'loading' | 'success' | 'error';
```

---

## Archivos de Tipos Específicos

### `src/features/auth/types/auth.types.ts`

```typescript
import { Usuario } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  nombre_completo: string;
  rol: 'admin' | 'empleado';
}

export interface AuthState {
  user: Usuario | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}
```

### `src/features/productos/types/producto.types.ts`

```typescript
import { Producto } from '@/types';

export interface ProductoWithStats extends Producto {
  veces_usado: number;
  cantidad_vendida: number;
}

export interface ProductoBuscado {
  id: string;
  nombre: string;
  precio_base: number;
  imagen_url?: string;
  relevancia: number;
}
```

### `src/features/catalogos/types/catalogo.types.ts`

```typescript
import { Catalogo, CatalogoItem, ProductoEnCatalogo } from '@/types';

export interface CatalogoWithStats extends Catalogo {
  cantidad_items: number;
  precio_minimo: number;
  precio_maximo: number;
  descargado_veces: number;
}

export interface CatalogoFormState {
  paso: number;
  nombreCliente: string;
  tipoLista: 'publico' | 'mayorista' | '';
  fechaVencimiento: string;
  productos: ProductoEnCatalogo[];
  total: number;
  errors: Record<string, string>;
}

export interface CatalogoPDFData {
  nombreCliente: string;
  tipoLista: string;
  fechaVencimiento: string;
  items: CatalogoItem[];
  total: number;
  subtotal: number;
  generadoEn: string;
}
```

---

## Uso en Componentes

### Ejemplo 1: Component con Props Tipados

```typescript
import { Catalogo } from '@/types';

interface CatalogoCardProps {
  catalogo: Catalogo;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
}

export function CatalogoCard({
  catalogo,
  onEdit,
  onDelete,
  loading = false,
}: CatalogoCardProps) {
  return (
    <div>
      <h3>{catalogo.nombre_cliente}</h3>
      <p>{catalogo.total}</p>
      <button onClick={() => onEdit?.(catalogo.id)}>Editar</button>
    </div>
  );
}
```

### Ejemplo 2: Hook con Tipos

```typescript
import { useState } from 'react';
import { Producto, ValidationErrors } from '@/types';

export function useProductoForm() {
  const [producto, setProducto] = useState<Partial<Producto>>({});
  const [errors, setErrors] = useState<ValidationErrors<Producto>>({});

  const validate = (): boolean => {
    const newErrors: ValidationErrors<Producto> = {};

    if (!producto.nombre) {
      newErrors.nombre = 'Nombre requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { producto, setProducto, errors, validate };
}
```

### Ejemplo 3: API con Tipos

```typescript
import { ApiResponse, Catalogo } from '@/types';

async function obtenerCatalogos(empresaId: string): Promise<ApiResponse<Catalogo[]>> {
  try {
    const response = await fetch(`/api/catalogos?empresa=${empresaId}`);
    const data = await response.json();

    return {
      success: response.ok,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al obtener catálogos',
    };
  }
}
```

---

## Type Guards (Funciones de Validación)

```typescript
// Verificar si es un usuario válido
export function isUsuarioValido(data: any): data is Usuario {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.email === 'string' &&
    typeof data.rol === 'string'
  );
}

// Verificar si es un catálogo válido
export function isCatalogoValido(data: any): data is Catalogo {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.total === 'number' &&
    Array.isArray(data.items)
  );
}

// Verificar si es un error de API
export function isApiError(error: any): error is ApiError {
  return (
    typeof error === 'object' &&
    typeof error.status === 'number' &&
    typeof error.message === 'string'
  );
}
```

---

## Tipos Genéricos Útiles

```typescript
// Hook genérico para lists
export interface UseListReturn<T> {
  items: T[];
  loading: boolean;
  error: Error | null;
  add: (item: T) => void;
  remove: (id: string) => void;
  update: (id: string, item: Partial<T>) => void;
  clear: () => void;
}

// Función genérica para crear servicios
export type ServiceMethod<T, R> = (payload: T) => Promise<R>;

// Estado genérico para async operations
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

---

**Versión**: 1.0.0  
**Compatible con**: TypeScript 5.0+
