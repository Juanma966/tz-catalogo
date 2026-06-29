# Plan: Categorías de productos

Objetivo: agregar una sección de **Categorías** (CRUD), que cada **producto** pertenezca a una categoría, y poder **filtrar por categoría** al elegir productos en el wizard de creación de catálogo.

Arquitectura actual (para referencia): Next.js App Router + Supabase, organizado por feature en `features/<nombre>/{components,hooks,services,types}`. El patrón a seguir es exactamente el de `features/productos`. No hay migraciones SQL versionadas en el repo (`supabase/migrations`) — el esquema se gestiona desde el SQL Editor del dashboard de Supabase.

## Orden recomendado

1. Base de datos (tabla `categorias` + columna `categoria_id` en `productos`)
2. Tipos TypeScript de categoría
3. Servicio + hook de categorías
4. UI del feature Categorías (form, dialog, list) + página + nav
5. Productos: asignar categoría (tipo, form, lista, servicio)
6. Catálogos: filtro por categoría en `PasoProductos`
7. Verificación manual

---

## Paso 1 — Base de datos (Supabase SQL Editor)

Antes de correr esto, abrí la tabla `productos` en el dashboard de Supabase (Table Editor → `productos` → columna `empresa_id`) y fijate qué políticas RLS tiene definidas (Database → Policies). El SQL de abajo asume el mismo patrón que usa el resto del código (`usuarios.empresa_id`); si tus políticas de `productos` usan otra función o lógica, replicá esa misma en vez de la de ejemplo.

```sql
-- 1. Tabla categorias
create table categorias (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null,
  nombre text not null,
  descripcion text,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categorias_empresa_id_idx on categorias(empresa_id);

-- 2. RLS (igual patrón multi-tenant que el resto de las tablas)
alter table categorias enable row level security;

create policy "categorias_select_empresa" on categorias
  for select using (
    empresa_id = (select empresa_id from usuarios where id = auth.uid())
  );

create policy "categorias_insert_empresa" on categorias
  for insert with check (
    empresa_id = (select empresa_id from usuarios where id = auth.uid())
  );

create policy "categorias_update_empresa" on categorias
  for update using (
    empresa_id = (select empresa_id from usuarios where id = auth.uid())
  );

-- 3. Relación producto -> categoria (nullable: productos existentes quedan "sin categoría")
alter table productos
  add column categoria_id uuid references categorias(id) on delete set null;

create index productos_categoria_id_idx on productos(categoria_id);
```

Notas:
- `categoria_id` es **nullable** a propósito: los productos existentes no se rompen y la UI puede mostrar "Sin categoría".
- `on delete set null`: si se borra una categoría, sus productos no se borran, solo quedan sin categoría.
- No agrego política de `delete` para `categorias` a propósito (ver Paso 4: igual que `productos`, esta app no borra filas, solo las desactiva con `activo`).

---

## Paso 2 — Tipos TypeScript

Crear `features/categorias/types/categoria.types.ts`:

```ts
export interface Categoria {
  id: string;
  empresa_id: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CrearCategoriaInput {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export type ActualizarCategoriaInput = Partial<CrearCategoriaInput>;
```

Editar `features/productos/types/producto.types.ts` para agregar la relación (mismo estilo que el resto de los campos):

```ts
export interface Producto {
  id: string;
  empresa_id: string;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  precio_mayorista: number | null;
  imagen_url: string | null;
  codigo_sku: string | null;
  categoria_id: string | null;        // nuevo
  categoria?: { id: string; nombre: string } | null; // nuevo, solo si se hace join en el select
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CrearProductoInput {
  nombre: string;
  descripcion?: string;
  precio_base: number;
  precio_mayorista?: number | null;
  codigo_sku?: string;
  imagen_url?: string;
  categoria_id?: string | null;       // nuevo
  activo?: boolean;
}
```

---

## Paso 3 — Servicio y hook de categorías

Crear `features/categorias/services/categoriaService.ts` (copia el patrón exacto de `productoService.ts`):

```ts
import { createClient } from '@/lib/supabase/client';
import type { Categoria, CrearCategoriaInput, ActualizarCategoriaInput } from '../types/categoria.types';

export const categoriaService = {
  async listar(empresaId: string): Promise<Categoria[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('nombre', { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async crear(empresaId: string, input: CrearCategoriaInput): Promise<Categoria> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categorias')
      .insert({ ...input, empresa_id: empresaId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async actualizar(id: string, input: ActualizarCategoriaInput): Promise<Categoria> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categorias')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async toggleActivo(id: string, activo: boolean): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('categorias')
      .update({ activo })
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
};
```

Crear `features/categorias/hooks/useCategorias.ts` (copia el patrón exacto de `useProductos.ts`, cambiando `productoService` por `categoriaService` y `productos`/`setProductos` por `categorias`/`setCategorias`).

---

## Paso 4 — UI del feature Categorías

Mismo patrón que `features/productos/components`:

- `features/categorias/components/CategoriaForm.tsx` — copia de `ProductoForm.tsx` pero **sin imagen, sin precios, sin SKU**. Campos: `nombre` (requerido), `descripcion` (opcional). Mismo manejo de `producto`/`onSuccess`/`onCancel` pero con `categoria`.
- `features/categorias/components/CategoriaDialog.tsx` — copia exacta de `ProductoDialog.tsx` reemplazando `Producto`/`ProductoForm` por `Categoria`/`CategoriaForm`.
- `features/categorias/components/CategoriasList.tsx` — copia de `ProductosList.tsx`, pero la tabla queda más simple (sin columna Imagen ni Precio): `Nombre | Descripción | Estado | Acciones`, con el mismo botón de `toggleActivo` (no hay borrado físico, igual que productos).

Página `app/(dashboard)/categorias/page.tsx`:

```tsx
import { CategoriasList } from '@/features/categorias/components/CategoriasList';

export const metadata = { title: 'Categorías' };

export default function CategoriasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Categorías</h1>
        <p className="text-gray-500 mt-1 text-sm">Organizá tus productos por categoría</p>
      </div>
      <CategoriasList />
    </div>
  );
}
```

Agregar el link de navegación en **dos** archivos (tienen la misma lista `links` duplicada):

`features/common/components/Sidebar.tsx` y `features/common/components/BottomNav.tsx`:

```ts
import { LayoutDashboard, Package, BookOpen, Tag } from 'lucide-react'; // agregar Tag

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/productos', label: 'Productos', icon: Package },
  { href: '/categorias', label: 'Categorías', icon: Tag },   // nuevo
  { href: '/catalogos', label: 'Catálogos', icon: BookOpen },
];
```

---

## Paso 5 — Productos: asignar categoría

**`features/productos/services/productoService.ts`** — incluir la categoría en el `select` para no tener que cruzar datos a mano en la lista:

```ts
async listar(empresaId: string): Promise<Producto[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('productos')
    .select('*, categoria:categorias(id, nombre)')
    .eq('empresa_id', empresaId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
},
```

`crear` y `actualizar` no necesitan cambios: como `CrearProductoInput` ahora incluye `categoria_id`, el `input` ya viaja con ese campo cuando el formulario lo manda.

**`features/productos/components/ProductoForm.tsx`**:

1. Importar `useCategorias` y agregar `categoria_id` al schema de zod:
   ```ts
   categoria_id: z.string().optional(),
   ```
2. Traer las categorías activas: `const { categorias } = useCategorias();`
3. Agregar un `<select>` (o el componente `Select` de `@/components/ui/select` si ya existe en el proyecto — revisar `components/ui/`) con opción "Sin categoría" + una opción por cada categoría activa, debajo del campo `codigo_sku`.
4. En `onSubmit`, agregar al `payload`:
   ```ts
   categoria_id: values.categoria_id || null,
   ```

**`features/productos/components/ProductosList.tsx`**: agregar columna "Categoría" en el `<TableHeader>` y en cada fila:

```tsx
<TableCell className="text-gray-500 text-sm">{producto.categoria?.nombre ?? '—'}</TableCell>
```

---

## Paso 6 — Catálogos: filtrar por categoría

Editar `features/catalogos/components/PasoProductos.tsx` (el archivo que tenés abierto):

1. Importar `useCategorias` y traer las categorías activas:
   ```ts
   import { useCategorias } from '@/features/categorias/hooks/useCategorias';
   const { categorias } = useCategorias();
   ```
2. Agregar estado para el filtro:
   ```ts
   const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
   ```
3. Filtrar antes de renderizar (justo después de la línea `const productosActivos = productos.filter((p) => p.activo);`):
   ```ts
   const productosFiltrados = categoriaFiltro === 'todas'
     ? productosActivos
     : productosActivos.filter((p) => p.categoria_id === categoriaFiltro);
   ```
4. Renderizar chips/botones de filtro arriba del grid (mismo estilo que los botones de `tipo_lista` en `PasoConfiguracion.tsx`):
   ```tsx
   <div className="flex gap-2 overflow-x-auto pb-1">
     <button
       type="button"
       onClick={() => setCategoriaFiltro('todas')}
       className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
         categoriaFiltro === 'todas'
           ? 'bg-blue-600 text-white border-blue-600'
           : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
       }`}
     >
       Todas
     </button>
     {categorias.filter((c) => c.activo).map((c) => (
       <button
         key={c.id}
         type="button"
         onClick={() => setCategoriaFiltro(c.id)}
         className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
           categoriaFiltro === c.id
             ? 'bg-blue-600 text-white border-blue-600'
             : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
         }`}
       >
         {c.nombre}
       </button>
     ))}
   </div>
   ```
5. Reemplazar `productosActivos.map(...)` por `productosFiltrados.map(...)` en el grid, y el bloque de "No tenés productos activos" debe chequear `productosFiltrados.length === 0` (mantener `productosActivos.length === 0` solo para distinguir "no hay productos" vs "no hay productos en esta categoría", si querés ese matiz).

Importante: el filtro **no cambia qué se guarda** en el catálogo — solo ayuda a encontrar productos más rápido. El catálogo sigue guardando `producto_id`, `nombre_producto`, `precio_unitario`, etc., como ya hace `catalogoService.crear`. No hace falta tocar `catalogo.types.ts` ni `catalogoService.ts` para esto.

---

## Paso 7 — Verificación manual

1. Correr el SQL del Paso 1 en Supabase y confirmar que `categorias` aparece en el Table Editor y que `productos` tiene la columna `categoria_id`.
2. `pnpm dev`, ir a `/categorias`, crear 2-3 categorías.
3. Ir a `/productos`, editar/crear productos y asignarles una categoría desde el nuevo selector. Confirmar que la columna "Categoría" se ve en la lista.
4. Ir a `/catalogos` → "Nuevo catálogo" → paso "Productos": confirmar que los chips de categoría filtran correctamente y que "Todas" muestra todo de nuevo.
5. Completar el wizard y confirmar que el catálogo se crea igual que antes (el filtro no debe romper la selección ni el cálculo de totales).
6. Desactivar una categoría desde `/categorias` y confirmar que deja de aparecer como chip de filtro, pero los productos que ya la tenían asignada no se rompen (siguen mostrando su nombre en la lista de productos, solo no se puede volver a elegir como filtro activo).

---

## Extensiones opcionales (no pedidas, para más adelante)

- Mostrar el nombre de la categoría en el PDF del catálogo (`CatalogoPDFDocument.tsx` / `catalogoPdfMapper.ts`), agrupando productos por categoría.
- Permitir elegir varias categorías de filtro a la vez (multi-select) en vez de una sola.
- Borrado físico de categorías con validación ("no se puede borrar si tiene productos") en lugar de solo desactivar.
