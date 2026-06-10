# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Generador de Catálogos PDF** — a multi-tenant web app for creating and sharing PDF price catalogs via WhatsApp. Built for businesses to manage products, generate branded PDFs, and send them directly to clients.

The repository root (`tecno-catalogo/`) holds documentation. The actual Next.js application lives in `tecnozovak/`.

## Commands

All commands run from inside `tecnozovak/`. This project uses **pnpm**.

```bash
cd tecnozovak
pnpm dev        # Start dev server with Turbopack (http://localhost:3000)
pnpm build      # Production build (also uses Turbopack)
pnpm start      # Start production server
pnpm lint       # ESLint
```

## Environment Setup

Create `tecnozovak/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Required Supabase Storage buckets: `catalogos-pdf` and `productos-imagenes` (both public).

## Architecture

### Directory Structure (planned — implement incrementally)

```
tecnozovak/
├── app/
│   ├── (auth)/login/           # Auth route group (unauthenticated)
│   ├── (dashboard)/            # Protected route group
│   │   ├── dashboard/
│   │   ├── catalogos/
│   │   └── productos/
│   └── api/                    # API routes
├── features/                   # Feature-based (screaming architecture)
│   ├── auth/
│   ├── catalogos/
│   ├── productos/
│   ├── dashboard/
│   └── common/
│       └── components/hooks/utils/types/
└── lib/
    ├── supabase/
    ├── pdf/
    ├── whatsapp/
    └── storage/
```

Each feature folder contains: `components/`, `hooks/`, `services/`, `types/`.

### Multi-Tenancy

Every data table has `empresa_id`. Supabase RLS policies enforce that users only see rows belonging to their own empresa. Always include `empresa_id` filters in queries — never rely on RLS alone for business logic.

### catalogo_items Snapshot Pattern

`catalogo_items` stores `nombre_producto`, `precio_unitario`, and `imagen_url` as snapshots at creation time. This is intentional — editing or deleting a product must not retroactively change existing catalogs.

### Key Data Flow

```
Login → Supabase Auth → session stored
→ ProtectedRoute checks session
→ Dashboard
→ Multi-step form (3 steps) → PDF generation → Supabase Storage → WhatsApp share URL
```

## Code Conventions

### Language

Domain names (variables, functions, database fields) are in **Spanish**. UI-facing text is Spanish.

```typescript
// Correct
const nombreCliente = 'ABC Distribuidora';
async function obtenerProductos(empresaId: string) {}

// Wrong
const clientName = 'ABC';
async function getProducts(id: string) {}
```

### Constants: UPPER_SNAKE_CASE

```typescript
const MAX_PRODUCTOS_POR_CATALOGO = 100;
const TIPOS_LISTA = ['publico', 'mayorista'];
```

### File Naming

- React components: `PascalCase.tsx` (e.g., `ProductoCard.tsx`)
- Services: `camelCase + Service.ts` (e.g., `productoService.ts`)
- Hooks: `use + PascalCase.ts` (e.g., `useProductos.ts`)
- Types: `domain.types.ts` (e.g., `producto.types.ts`)
- Directories: `kebab-case`

### Services Pattern

Services are plain objects, not classes. Always throw on error:

```typescript
export const productoService = {
  async obtenerProductos(empresaId: string) {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('empresa_id', empresaId);
    if (error) throw new Error(error.message);
    return data;
  },
};
```

### Component Pattern

Use named exports with explicit `FC` type and interface props:

```typescript
'use client';
import { FC } from 'react';

interface ProductoCardProps {
  id: string;
  nombre: string;
}

export const ProductoCard: FC<ProductoCardProps> = ({ id, nombre }) => { ... };
```

### Import Order

1. React/Next.js
2. Shadcn UI (`@/components/ui/`)
3. Feature services/hooks
4. Types (with `import type`)

### Hooks Pattern

Always expose `{ data, loading, error, reload }` shape. Wrap service calls in try/catch with `setLoading`/`setError`.

## Database Tables

| Table | Key Fields |
|---|---|
| `empresas` | `id`, `nombre`, `slug`, `admin_id` |
| `usuarios` | `id` (= auth.uid), `empresa_id`, `rol` (admin/empleado) |
| `productos` | `id`, `empresa_id`, `nombre`, `precio_base`, `imagen_url`, `activo` |
| `catalogos` | `id`, `empresa_id`, `usuario_id`, `nombre_cliente`, `tipo_lista` (publico/mayorista), `estado` (borrador/publicado/vencido), `pdf_url` |
| `catalogo_items` | `catalogo_id`, `producto_id` (nullable), snapshot fields |

Full SQL schema is in `SQL_SCRIPT.sql`.

## Git Commits

Conventional commits in Spanish descriptions:

```
feat: agregar componente ProductosList
fix: corregir validación de email
docs: actualizar README
style: ajustar estilos del formulario
refactor: mejorar estructura de hooks
```

## Reference Documentation

Detailed documentation in the repo root:
- `DATABASE.md` — full schema, RLS policies, Storage bucket setup
- `SERVICES.md` — service method signatures and hooks
- `TYPES.md` — all TypeScript types
- `COMPONENTS.md` — Shadcn UI usage and custom component API
- `TROUBLESHOOTING.md` — common Supabase/RLS/PDF errors
- `QUICKSTART.md` — step-by-step initial setup
