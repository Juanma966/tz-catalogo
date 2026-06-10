# 📚 Documentación Completa - Índice

## 📖 Estructura de la Documentación

```
docs/
├── README.md                    ← EMPEZAR AQUÍ
├── QUICKSTART.md                ← Setup inicial paso a paso
├── DATABASE.md                  ← Esquema SQL y RLS
├── COMPONENTS.md                ← Componentes Shadcn UI
├── SERVICES.md                  ← Servicios, hooks y API routes
├── TYPES.md                     ← Definiciones TypeScript
├── TROUBLESHOOTING.md           ← Solución de problemas
├── CODE_CONVENTIONS.md          ← Convenciones de código
└── ROADMAP.md                   ← Plan de 6 días
```

---

## 🎯 Cómo Usar Esta Documentación

### Soy nuevo en el proyecto

1. Lee **README.md** - Visión general
2. Sigue **QUICKSTART.md** - Setup en 30 min
3. Consulta **COMPONENTS.md** - Para entender UI
4. Refiere **TYPES.md** - Para TypeScript

### Necesito información específica

| Necesito... | Archivo |
|-------------|---------|
| Setup inicial | QUICKSTART.md |
| Crear tabla en BD | DATABASE.md |
| Usar un componente | COMPONENTS.md |
| Crear un servicio | SERVICES.md |
| Tipificar código | TYPES.md |
| Resolver error | TROUBLESHOOTING.md |
| Estilo de código | CODE_CONVENTIONS.md |

### Desarrollo diario

1. Consulta **CODE_CONVENTIONS.md** para mantener consistencia
2. Refiere **TYPES.md** para tipos correctos
3. Usa ejemplos en **COMPONENTS.md** y **SERVICES.md**
4. Si hay error, ve a **TROUBLESHOOTING.md**

---

## 📋 Documentación por Tema

### Autenticación
- ✅ Setup: QUICKSTART.md (PASO 7)
- ✅ Servicios: SERVICES.md → authService
- ✅ Componentes: COMPONENTS.md → LoginForm
- ✅ Tipos: TYPES.md → Usuario, AuthContextType
- ❓ Problemas: TROUBLESHOOTING.md → "Problemas de Autenticación"

### Base de Datos
- ✅ Esquema: DATABASE.md → "Tablas Detalladas"
- ✅ Seguridad: DATABASE.md → "Row Level Security"
- ✅ Storage: DATABASE.md → "Storage Buckets"
- ✅ Queries: DATABASE.md → "Queries Útiles"

### Productos
- ✅ Servicios: SERVICES.md → productoService
- ✅ Tipos: TYPES.md → Producto, ProductoFormData
- ✅ Componentes: COMPONENTS.md → ProductosList

### Catálogos
- ✅ Flujo: README.md → "Flujo del Creador de Catálogos"
- ✅ Servicios: SERVICES.md → catalogoService
- ✅ Componentes: COMPONENTS.md → Step1Form, Step2Form
- ✅ Tipos: TYPES.md → Catalogo, CatalogoFormData

### PDF
- ✅ Generación: SERVICES.md → pdfService
- ✅ Almacenamiento: SERVICES.md → storageService
- ✅ Problemas: TROUBLESHOOTING.md → "Problemas de PDF"

### WhatsApp
- ✅ Integración: SERVICES.md → whatsappService
- ✅ Componentes: COMPONENTS.md → WhatsAppButton

### Deployment
- ✅ Instrucciones: README.md → "Deploy"
- ✅ Problemas: TROUBLESHOOTING.md → "Deploy a Vercel"

---

# 📝 Convenciones de Código

## Estructura de Archivos

### Naming de archivos

```
# Componentes React (PascalCase)
LoginForm.tsx
ProductosList.tsx
CatalogoCard.tsx

# Servicios (camelCase + Service)
authService.ts
productoService.ts
catalogoService.ts

# Hooks (camelCase + use prefix)
useAuth.ts
useProductos.ts
useCatalogoForm.ts

# Tipos (PascalCase + .types.ts)
auth.types.ts
producto.types.ts
catalogo.types.ts

# Utils (camelCase)
validators.ts
formatters.ts
constants.ts

# Directorios (kebab-case)
src/features/auth/
src/features/productos/
src/features/catalogos/
```

---

## Estilo de Código

### Imports

```typescript
// ✅ CORRECTO - Organizados por tipo
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { productoService } from '../services/productoService';
import { useProductos } from '../hooks/useProductos';
import type { Producto } from '../types/producto.types';

// ❌ INCORRECTO - Desorganizados
import { useState } from 'react';
import type { Producto } from '../types/producto.types';
import { productoService } from '../services/productoService';
import { Button } from '@/components/ui/button';
```

### Componentes

```typescript
// ✅ CORRECTO
'use client';

import { FC, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ProductoCardProps {
  id: string;
  nombre: string;
  precio: number;
  onEdit?: (id: string) => void;
  loading?: boolean;
}

export const ProductoCard: FC<ProductoCardProps> = ({
  id,
  nombre,
  precio,
  onEdit,
  loading = false,
}) => {
  return (
    <div className="rounded-lg border border-slate-700 p-4">
      <h3 className="font-semibold text-white">{nombre}</h3>
      <p className="text-slate-400">${precio.toFixed(2)}</p>
      <Button
        onClick={() => onEdit?.(id)}
        disabled={loading}
        size="sm"
      >
        Editar
      </Button>
    </div>
  );
};

// ❌ INCORRECTO
function ProductoCard({ id, nombre, precio, onEdit, loading }) {
  return (
    <div>
      <h3>{nombre}</h3>
      <p>${precio}</p>
      <button onClick={() => onEdit && onEdit(id)}>Edit</button>
    </div>
  );
}
```

### Servicios

```typescript
// ✅ CORRECTO
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

  async crearProducto(
    empresaId: string,
    producto: NewProducto
  ) {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase
      .from('productos')
      .insert([{ ...producto, empresa_id: empresaId }])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },
};

// ❌ INCORRECTO
export async function getProducts(id) {
  const { data } = await supabase.from('productos').select();
  return data;
}
```

### Hooks

```typescript
// ✅ CORRECTO
import { useState, useEffect, useCallback } from 'react';
import { productoService } from '../services/productoService';
import type { Producto } from '../types/producto.types';

export function useProductos(empresaId: string) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
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
  }, [empresaId]);

  useEffect(() => {
    cargar();
  }, [cargar, empresaId]);

  return { productos, loading, error, recargar: cargar };
}

// ❌ INCORRECTO
export function useProductos(id) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch(`/api/productos?id=${id}`)
      .then(r => r.json())
      .then(setData);
  }, [id]);
  
  return data;
}
```

### TypeScript

```typescript
// ✅ CORRECTO - Con tipos explícitos
async function guardarCatalogo(
  empresaId: string,
  datos: CatalogoFormData
): Promise<Catalogo> {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from('catalogos')
    .insert([{
      empresa_id: empresaId,
      nombre_cliente: datos.nombreCliente,
      tipo_lista: datos.tipoLista,
      fecha_vencimiento: datos.fechaVencimiento,
      total: datos.productos.reduce((sum, p) => sum + p.subtotal, 0),
    }])
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return data;
}

// ❌ INCORRECTO - Sin tipos
async function guardarCatalogo(empresaId, datos) {
  const { data } = await supabase
    .from('catalogos')
    .insert([datos])
    .select()
    .single();
  
  return data;
}
```

---

## Convenciones de Nombres

### Variables

```typescript
// ✅ CORRECTO - Descriptivos y en español
const nombreCliente = 'ABC Distribuidora';
const precioUnitario = 150.50;
const fechaVencimiento = '2024-12-31';
const esProductoActivo = true;
const catalogosCreados = [];

// ❌ INCORRECTO
const name = 'ABC';
const price = 150.50;
const d = '2024-12-31';
const active = true;
const arr = [];
```

### Funciones

```typescript
// ✅ CORRECTO - Verbos descriptivos
async function obtenerProductos() { }
async function crearCatalogo() { }
function formatearPrecio(precio: number) { }
function validarEmail(email: string) { }
function renderizarItem(item: Item) { }

// ❌ INCORRECTO
async function get() { }
async function add() { }
function fmt(p) { }
function check(e) { }
function item(x) { }
```

### Constantes

```typescript
// ✅ CORRECTO - UPPER_SNAKE_CASE
const MAX_PRODUCTOS_POR_CATALOGO = 100;
const TIPOS_LISTA = ['publico', 'mayorista'];
const RUTA_API_PRODUCTOS = '/api/productos';
const TIEMPO_ESPERA_MINIMO = 300; // ms

// ❌ INCORRECTO
const maxProductos = 100;
const tipos = ['publico', 'mayorista'];
const API_URL = '/api/productos';
const tiempo = 300;
```

---

## Orden de Código en Archivos

### Componente React

```typescript
'use client';

// 1. Imports
import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { productoService } from '../services/productoService';
import { useProductos } from '../hooks/useProductos';
import type { Producto } from '../types/producto.types';

// 2. Types/Interfaces
interface MyComponentProps {
  id: string;
  onSave?: (data: Producto) => void;
}

// 3. Component
export const MyComponent: FC<MyComponentProps> = ({ id, onSave }) => {
  // 3.1 Hooks
  const router = useRouter();
  const { productos, loading } = useProductos(id);

  // 3.2 State
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);

  // 3.3 Effects
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, []);

  // 3.4 Handlers
  const handleSelect = (product: Producto) => {
    setSelectedProduct(product);
  };

  const handleSave = async () => {
    if (selectedProduct) {
      await productoService.actualizarProducto(selectedProduct.id, selectedProduct);
      onSave?.(selectedProduct);
    }
  };

  // 3.5 Render
  if (loading) return <div>Cargando...</div>;

  return (
    <Card>
      <div className="space-y-4">
        {productos.map((p) => (
          <button key={p.id} onClick={() => handleSelect(p)}>
            {p.nombre}
          </button>
        ))}
      </div>
      <Button onClick={handleSave}>Guardar</Button>
    </Card>
  );
};
```

### Servicio

```typescript
// 1. Imports
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Producto } from '../types/producto.types';

// 2. Tipo de retorno
type QueryOptions = {
  limit?: number;
  offset?: number;
};

// 3. Servicio
export const productoService = {
  // 3.1 Queries (GET)
  async obtenerTodos(empresaId: string, options?: QueryOptions) {
    // Implementation
  },

  async obtenerPorId(id: string) {
    // Implementation
  },

  // 3.2 Mutations (POST/PUT/DELETE)
  async crear(empresaId: string, datos: NewProducto) {
    // Implementation
  },

  async actualizar(id: string, datos: Partial<Producto>) {
    // Implementation
  },

  async eliminar(id: string) {
    // Implementation
  },

  // 3.3 Búsquedas/Filtros
  async buscar(empresaId: string, termino: string) {
    // Implementation
  },
};
```

---

## Comentarios

```typescript
// ✅ CORRECTO - Solo donde es complejo

// Verificar si la fecha de vencimiento ya pasó
const estaVencido = new Date(catalogo.fecha_vencimiento) < new Date();

// Calcular el descuento basado en cantidad (5% por cada 10 unidades)
const descuento = Math.floor(cantidad / 10) * 0.05;

// ❌ INCORRECTO - Obvio

// Incrementar contador
count++;

// Obtener el nombre
const nombre = usuario.nombre;
```

---

## Tests

```typescript
// Ubicación: `__tests__` al lado del archivo

// ✅ CORRECTO
import { describe, it, expect } from '@jest/globals';
import { formatearPrecio } from './formatters';

describe('formatearPrecio', () => {
  it('debe formatear números correctamente', () => {
    expect(formatearPrecio(100)).toBe('$100.00');
    expect(formatearPrecio(99.5)).toBe('$99.50');
  });

  it('debe manejar valores inválidos', () => {
    expect(formatearPrecio(-10)).toBe('$0.00');
  });
});
```

---

## Commits de Git

```bash
# ✅ CORRECTO - Descriptivos y en presente

git commit -m "feat: agregar componente ProductosList"
git commit -m "fix: corregir validación de email en formulario"
git commit -m "docs: actualizar README con instrucciones de setup"
git commit -m "refactor: mejorar estructura de hooks"
git commit -m "perf: optimizar queries de Supabase"

# ❌ INCORRECTO

git commit -m "cambios"
git commit -m "fixed stuff"
git commit -m "update"
```

### Prefijos de commits

- `feat:` - Nueva característica
- `fix:` - Bug fix
- `docs:` - Cambios en documentación
- `style:` - Cambios en estilos (CSS, Tailwind)
- `refactor:` - Refactorización de código
- `perf:` - Mejoras de performance
- `test:` - Agregar o actualizar tests
- `chore:` - Cambios en dependencias, configuración

---

## Integración Continua

### Pre-commit

Instalar husky:
```bash
npm install --save-dev husky
npx husky install
```

Crear hook:
```bash
npx husky add .husky/pre-commit "npm run lint && npm run type-check"
```

---

## Checklist de Code Review

- [ ] ¿Sigue las convenciones de nombres?
- [ ] ¿Está bien tipado con TypeScript?
- [ ] ¿Los componentes son reutilizables?
- [ ] ¿Se usan los servicios correctamente?
- [ ] ¿Hay manejo de errores?
- [ ] ¿Se sigue el patrón de la carpeta?
- [ ] ¿El código está limpio y legible?
- [ ] ¿Hay comentarios útiles (no obvios)?
- [ ] ¿Se cumple con las convenciones?

---

**Versión**: 1.0.0  
**Última actualización**: 2024
