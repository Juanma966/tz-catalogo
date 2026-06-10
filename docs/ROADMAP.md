# ROADMAP — Generador de Catálogos PDF
**Duración:** 5 días  
**Stack:** Next.js 15 · Supabase · Tailwind v4 · shadcn/ui  
**Estado al inicio:** Auth completo · Dashboard esqueleto · DB lista

---

## DÍA 1 — Base UI + Estructura de navegación

**Objetivo:** shadcn/ui instalado, layout del dashboard funcional con sidebar y navegación real.

### Tareas
- [ ] Instalar shadcn/ui (`pnpm dlx shadcn@latest init`)
- [ ] Instalar componentes base: `button`, `input`, `label`, `card`, `badge`, `dialog`, `form`, `table`, `skeleton`, `toast`, `dropdown-menu`, `separator`, `avatar`
- [ ] Crear layout del dashboard con sidebar:
  - `features/common/components/Sidebar.tsx` — links a Dashboard, Productos, Catálogos
  - `features/common/components/Header.tsx` — nombre usuario + LogoutButton
- [ ] Reemplazar layout de `app/(dashboard)/layout.tsx` con el nuevo sidebar + header
- [ ] Conectar contadores reales del dashboard (query a `productos` y `catalogos` con `count`)
- [ ] Crear rutas vacías: `app/(dashboard)/productos/page.tsx` y `app/(dashboard)/catalogos/page.tsx`
- [ ] Instalar `react-hook-form` y `zod` para validación de formularios

**Resultado del día:** App navegable con sidebar, contadores reales, base UI lista.

---

## DÍA 2 — Módulo de Productos (CRUD completo)

**Objetivo:** El usuario puede crear, editar, desactivar y ver sus productos con imagen.

### Tareas

#### Tipos y servicios
- [ ] `features/productos/types/producto.types.ts` — tipo `Producto`
- [ ] `features/productos/services/productoService.ts` — métodos: `listar`, `crear`, `actualizar`, `toggleActivo`
- [ ] `features/productos/hooks/useProductos.ts` — hook con `{ productos, loading, error, reload }`

#### Subida de imágenes
- [ ] `lib/storage/uploadImagen.ts` — función que sube al bucket `productos-imagenes` y retorna la URL pública

#### Componentes
- [ ] `features/productos/components/ProductosList.tsx` — tabla con columnas: imagen, nombre, SKU, precio, estado (badge activo/inactivo), acciones
- [ ] `features/productos/components/ProductoForm.tsx` — formulario con zod: nombre, descripción, precio_base, codigo_sku, imagen (file input con preview), activo
- [ ] `features/productos/components/ProductoDialog.tsx` — Dialog que contiene el form (modo crear / editar)

#### Página
- [ ] `app/(dashboard)/productos/page.tsx` — lista + botón "Nuevo Producto" + ProductoDialog

**Resultado del día:** CRUD de productos completamente funcional con imágenes en Supabase Storage.

---

## DÍA 3 — Módulo de Catálogos (formulario multi-paso)

**Objetivo:** El usuario puede crear un catálogo seleccionando productos y configurando datos del cliente.

### Tareas

#### Tipos y servicios
- [ ] `features/catalogos/types/catalogo.types.ts` — tipos `Catalogo`, `CatalogoItem`, `NuevoCatalogoForm`
- [ ] `features/catalogos/services/catalogoService.ts` — métodos: `listar`, `crear` (con items), `actualizar`, `eliminar`
- [ ] `features/catalogos/hooks/useCatalogos.ts`

#### Componentes del formulario multi-paso
- [ ] `features/catalogos/components/NuevoCatalogoWizard.tsx` — orquesta los 3 pasos, mantiene estado global
- [ ] **Paso 1** `PasoConfiguracion.tsx` — nombre_cliente, tipo_lista (público/mayorista), fecha_vencimiento
- [ ] **Paso 2** `PasoProductos.tsx` — grilla de productos con checkbox, cantidad editable por producto, subtotal calculado en tiempo real
- [ ] **Paso 3** `PasoResumen.tsx` — muestra resumen completo: cliente, productos seleccionados, subtotal, total

#### Lista de catálogos
- [ ] `features/catalogos/components/CatalogosList.tsx` — tabla con: nombre cliente, tipo lista, fecha vencimiento, estado (badge), acciones
- [ ] `features/catalogos/components/CatalogoBadge.tsx` — badge con color según estado (borrador/publicado/vencido)

#### Página
- [ ] `app/(dashboard)/catalogos/page.tsx` — lista + botón "Nuevo Catálogo" abre el wizard

**Resultado del día:** Catálogos creados y guardados en Supabase con sus items (snapshot de precio).

---

## DÍA 4 — Generación de PDF + Storage

**Objetivo:** Desde un catálogo guardado se genera un PDF con branding y se sube a Supabase Storage.

### Tareas

#### Setup PDF
- [ ] Instalar `@react-pdf/renderer`
- [ ] `lib/pdf/generarCatalogoPDF.ts` — función que recibe un catálogo con items y retorna un Blob del PDF

#### Diseño del PDF (componentes React PDF)
- [ ] `features/catalogos/components/pdf/CatalogoPDFDocument.tsx` — documento raíz
- [ ] `features/catalogos/components/pdf/PDFHeader.tsx` — logo de empresa (si existe), nombre cliente, fecha, tipo lista
- [ ] `features/catalogos/components/pdf/PDFProductoRow.tsx` — imagen del producto, nombre, cantidad, precio unitario, subtotal
- [ ] `features/catalogos/components/pdf/PDFFooter.tsx` — total, fecha de vencimiento

#### Subida y guardado
- [ ] `lib/storage/uploadPDF.ts` — sube el Blob al bucket `catalogos-pdf`, retorna URL pública
- [ ] API Route `app/api/catalogos/[id]/generar-pdf/route.ts` — genera PDF → sube → actualiza `pdf_url` en DB → retorna URL
- [ ] Botón "Generar PDF" en la fila del catálogo (con estado loading mientras genera)
- [ ] Actualizar `estado` a `publicado` al generar el PDF

**Resultado del día:** PDF generado, subido a Storage y con URL guardada en la DB.

---

## DÍA 5 — Compartir por WhatsApp + Polish final

**Objetivo:** Compartir el PDF por WhatsApp con un click. App pulida y sin bugs conocidos.

### Tareas

#### Compartir
- [ ] `lib/whatsapp/generarLinkWhatsApp.ts` — construye el link `https://wa.me/?text=...` con el mensaje y la URL del PDF
- [ ] `features/catalogos/components/CompartirWhatsAppButton.tsx` — botón que abre el link en nueva pestaña (solo visible si `pdf_url` existe)

#### Vencimiento automático
- [ ] `app/api/cron/vencer-catalogos/route.ts` — endpoint que marca como `vencido` los catálogos con `fecha_vencimiento < NOW()` y `estado = 'publicado'`

#### Dashboard final
- [ ] Conectar contadores con datos reales (catálogos por estado, total productos activos)
- [ ] Agregar últimos 5 catálogos creados en el dashboard

#### Polish
- [ ] Toasts de éxito/error en todas las operaciones (crear, editar, eliminar, generar PDF)
- [ ] Estados de loading con Skeleton en todas las listas
- [ ] Manejo de errores si `.env.local` no está configurado
- [ ] Validar que los campos requeridos muestren mensajes de error claros
- [ ] Probar flujo completo: login → crear productos → crear catálogo → generar PDF → compartir

**Resultado del día:** App completa y funcional lista para usar.

---

## Resumen por día

| Día | Entregable |
|-----|-----------|
| 1 | shadcn/ui + sidebar + navegación |
| 2 | CRUD de productos con imágenes |
| 3 | Wizard de catálogos + guardado en DB |
| 4 | Generación y subida de PDF |
| 5 | WhatsApp share + polish final |

---

## Dependencias a instalar

```bash
# Día 1
pnpm dlx shadcn@latest init
pnpm add react-hook-form zod @hookform/resolvers

# Día 4
pnpm add @react-pdf/renderer
pnpm add -D @types/react-pdf
```

## Variables de entorno necesarias

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
