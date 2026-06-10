# 🎨 Documentación de Componentes

## Índice

1. [Componentes Shadcn UI](#componentes-shadcnui)
2. [Componentes Personalizados](#componentes-personalizados)
3. [Ejemplos de Uso](#ejemplos-de-uso)
4. [Guía de Estilos](#guía-de-estilos)

---

## Componentes Shadcn/UI

### 1. Button

Componente básico de botón con múltiples variantes.

**Props:**
```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}
```

**Uso:**
```jsx
import { Button } from "@/components/ui/button";

// Primario
<Button>Guardar</Button>

// Destructivo (rojo)
<Button variant="destructive">Eliminar</Button>

// Outline
<Button variant="outline">Cancelar</Button>

// Icon
<Button variant="ghost" size="icon">
  <Trash2 className="h-4 w-4" />
</Button>

// Loading
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Cargando...
</Button>
```

---

### 2. Input

Campo de entrada de texto.

**Props:**
```typescript
interface InputProps 
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
```

**Uso:**
```jsx
import { Input } from "@/components/ui/input";

<Input
  type="email"
  placeholder="tu@correo.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Con label
<div className="space-y-2">
  <label className="text-sm font-medium">Email</label>
  <Input type="email" placeholder="correo@ejemplo.com" />
</div>
```

---

### 3. Card

Contenedor de contenido con estilos predefinidos.

**Componentes:**
- `Card` - Contenedor principal
- `CardHeader` - Encabezado
- `CardTitle` - Título
- `CardDescription` - Subtítulo
- `CardContent` - Contenido principal
- `CardFooter` - Pie de página

**Uso:**
```jsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Mi Tarjeta</CardTitle>
  </CardHeader>
  <CardContent>
    Contenido aquí
  </CardContent>
</Card>
```

---

### 4. Select

Dropdown para seleccionar opciones.

**Componentes:**
- `Select`
- `SelectTrigger` - Botón que abre el menu
- `SelectContent` - Container del menu
- `SelectItem` - Opciones individuales
- `SelectValue` - Valor mostrado

**Uso:**
```jsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select value={tipo} onValueChange={setTipo}>
  <SelectTrigger>
    <SelectValue placeholder="Selecciona tipo" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="publico">Público</SelectItem>
    <SelectItem value="mayorista">Mayorista</SelectItem>
  </SelectContent>
</Select>
```

---

### 5. Dialog

Modal/diálogo para confirmar acciones o capturar datos.

**Componentes:**
- `Dialog`
- `DialogTrigger` - Botón que abre
- `DialogContent` - Container
- `DialogHeader`
- `DialogTitle`
- `DialogDescription`
- `DialogFooter`

**Uso:**
```jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

export function DeleteDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Eliminar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás seguro?</DialogTitle>
        </DialogHeader>
        <p>Esta acción no se puede deshacer.</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="destructive"
            onClick={async () => {
              await deleteCatalog();
              setOpen(false);
            }}
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

### 6. Form (React Hook Form Integration)

Componentes para trabajar con React Hook Form y Zod.

**Componentes:**
- `Form`
- `FormField`
- `FormItem`
- `FormLabel`
- `FormControl`
- `FormDescription`
- `FormMessage`

**Uso Completo:**
```jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    await login(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="tu@correo.com" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Iniciar Sesión
        </Button>
      </form>
    </Form>
  );
}
```

---

### 7. Badge

Etiqueta pequeña para indicar estado o tipo.

**Props:**
```typescript
interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}
```

**Uso:**
```jsx
import { Badge } from "@/components/ui/badge";

<Badge>Nuevo</Badge>
<Badge variant="secondary">Mayorista</Badge>
<Badge variant="destructive">Vencido</Badge>
<Badge variant="outline">Borrador</Badge>
```

---

### 8. Alert

Componente para mostrar mensajes importantes.

**Componentes:**
- `Alert`
- `AlertTitle`
- `AlertDescription`

**Uso:**
```jsx
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Error
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertDescription>Error al guardar los cambios</AlertDescription>
</Alert>

// Success
<Alert variant="default">
  <CheckCircle2 className="h-4 w-4 text-green-500" />
  <AlertDescription>¡Cambios guardados correctamente!</AlertDescription>
</Alert>
```

---

### 9. Toast

Notificaciones temporales (requiere provider en layout).

**Uso:**
```jsx
import { useToast } from "@/components/ui/use-toast";

export function MyComponent() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          title: "Éxito",
          description: "Archivo guardado correctamente",
          duration: 3000,
        });
      }}
    >
      Guardar
    </Button>
  );
}
```

---

### 10. Separator

Línea divisoria.

**Uso:**
```jsx
import { Separator } from "@/components/ui/separator";

<div>
  <div>Contenido 1</div>
  <Separator className="my-4" />
  <div>Contenido 2</div>
</div>
```

---

## Componentes Personalizados

### 1. LoginForm

**Ubicación:** `src/features/auth/components/LoginForm.tsx`

**Props:**
```typescript
// Sin props, usa hooks internos
```

**Características:**
- Validación de email y password
- Manejo de errores
- Loading state
- Tema oscuro moderno

**Uso:**
```jsx
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return <LoginForm />;
}
```

---

### 2. ProtectedRoute

**Ubicación:** `src/features/auth/components/ProtectedRoute.tsx`

**Props:**
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'empleado';
}
```

**Características:**
- Protege rutas sin autenticación
- Verifica rol del usuario (opcional)
- Redirige a login si no autenticado

**Uso:**
```jsx
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

export function DashboardLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="empleado">
      {children}
    </ProtectedRoute>
  );
}
```

---

### 3. MainMenu

**Ubicación:** `src/features/dashboard/components/MainMenu.tsx`

**Props:**
```typescript
interface MainMenuProps {
  usuario: Usuario;
  estadisticas: {
    productosCount: number;
    catalogosCount: number;
    totalVentas: number;
  };
}
```

**Características:**
- Tres botones principales
- Muestra estadísticas
- Perfil de usuario
- Logout

**Uso:**
```jsx
import { MainMenu } from "@/features/dashboard/components/MainMenu";

export default function DashboardPage() {
  const usuario = useAuth();
  const stats = useDashboard();

  return <MainMenu usuario={usuario} estadisticas={stats} />;
}
```

---

### 4. Step1Form (Catálogo)

**Ubicación:** `src/features/catalogos/components/CatalogoForm/Step1Form.tsx`

**Props:**
```typescript
interface Step1FormProps {
  data: CatalogoFormData;
  onChange: (data: Partial<CatalogoFormData>) => void;
  onNext: () => void;
}
```

**Campos:**
- Nombre del Cliente (text)
- Tipo de Lista (select: público/mayorista)
- Fecha de Vencimiento (date)

**Validación:**
- Todos los campos requeridos
- Fecha debe ser futura

**Uso:**
```jsx
const [formData, setFormData] = useState<CatalogoFormData>({
  nombreCliente: "",
  tipoLista: "",
  fechaVencimiento: "",
  productos: [],
});

<Step1Form 
  data={formData}
  onChange={(partial) => setFormData({ ...formData, ...partial })}
  onNext={handleNext}
/>
```

---

### 5. Step2Form (Productos)

**Ubicación:** `src/features/catalogos/components/CatalogoForm/Step2Form.tsx`

**Props:**
```typescript
interface Step2FormProps {
  data: CatalogoFormData;
  onChange: (data: Partial<CatalogoFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}
```

**Campos para Agregar:**
- Nombre del Producto
- Precio
- Cantidad
- Imagen (file upload)

**Características:**
- Preview de imagen
- Cálculo automático de subtotales
- Lista de productos agregados
- Total en tiempo real

**Uso:**
```jsx
<Step2Form
  data={formData}
  onChange={handleChange}
  onNext={handleNext}
  onBack={handleBack}
/>
```

---

### 6. ProductosList

**Ubicación:** `src/features/productos/components/ProductosList.tsx`

**Props:**
```typescript
interface ProductosListProps {
  productos: Producto[];
  loading?: boolean;
  onEdit?: (producto: Producto) => void;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
}
```

**Características:**
- Tabla de productos
- Búsqueda y filtrado
- Acciones (editar, eliminar)
- Paginación

**Uso:**
```jsx
const { productos, loading } = useProductos();

<ProductosList 
  productos={productos}
  loading={loading}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

### 7. CatalogosList

**Ubicación:** `src/features/catalogos/components/CatalogosList.tsx`

**Props:**
```typescript
interface CatalogosListProps {
  catalogos: Catalogo[];
  loading?: boolean;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
}
```

**Características:**
- Lista de catálogos creados
- Acciones rápidas
- Filtros por estado/fecha
- Vista previa

**Uso:**
```jsx
const { catalogos } = useCatalogos();

<CatalogosList
  catalogos={catalogos}
  onDownload={handleDownload}
  onShare={handleShare}
/>
```

---

### 8. WhatsAppButton

**Ubicación:** `src/features/catalogos/components/WhatsAppButton.tsx`

**Props:**
```typescript
interface WhatsAppButtonProps {
  catalogoId: string;
  nombreCliente: string;
  pdfUrl: string;
  loading?: boolean;
}
```

**Características:**
- Genera URL de WhatsApp Web
- Incluye mensaje con datos
- Enlace al PDF

**Uso:**
```jsx
<WhatsAppButton
  catalogoId={catalogo.id}
  nombreCliente={catalogo.nombreCliente}
  pdfUrl={catalogo.pdfUrl}
/>
```

---

## Ejemplos de Uso

### Ejemplo 1: Formulario con Validación

```jsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

const schema = z.object({
  nombre: z.string().min(3),
  email: z.string().email(),
  telefono: z.string().optional(),
});

export function ProductoForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data) {
    const response = await fetch('/api/productos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // Handle response
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Más campos */}
        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  );
}
```

---

### Ejemplo 2: Modal de Confirmación

```jsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export function DeleteCatalogDialog({ catalogoId, onConfirm }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await fetch(`/api/catalogos/${catalogoId}`, { method: 'DELETE' });
      onConfirm?.();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Eliminar
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar catálogo?</DialogTitle>
        </DialogHeader>
        <p>Esta acción es irreversible.</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

### Ejemplo 3: Tabla de Datos

```jsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function ProductosTable({ productos }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productos.map((producto) => (
          <TableRow key={producto.id}>
            <TableCell>{producto.nombre}</TableCell>
            <TableCell>${producto.precio}</TableCell>
            <TableCell>
              <Badge variant={producto.activo ? 'default' : 'secondary'}>
                {producto.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm">
                Editar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

## Guía de Estilos

### Colores

```css
/* Tema oscuro predeterminado */
:root {
  --primary: 59, 130, 246;        /* Azul */
  --secondary: 100, 116, 139;     /* Gris-Azul */
  --destructive: 239, 68, 68;     /* Rojo */
  --success: 34, 197, 94;         /* Verde */
  --warning: 251, 146, 60;        /* Naranja */
  --info: 59, 130, 246;           /* Azul */
}
```

### Espaciado (Tailwind)

```
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
```

### Tipografía

```
- text-xs: 12px
- text-sm: 14px
- text-base: 16px
- text-lg: 18px
- text-xl: 20px
- text-2xl: 24px
```

### Clases Útiles

```jsx
// Centrar contenido
className="flex items-center justify-center"

// Grid responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Espaciado
className="space-y-4"  // Margin vertical
className="space-x-2"  // Margin horizontal

// Estilos de fondo
className="bg-slate-800/50"      // 50% de opacidad
className="bg-gradient-to-r"     // Gradiente
className="backdrop-blur"        // Blur de fondo

// Bordes
className="border border-slate-700"
className="border-t border-b"    // Solo arriba/abajo

// Sombras
className="shadow-lg"
className="shadow-2xl"
```

---

**Versión**: 1.0.0  
**Compatible con**: Shadcn UI v0.8+, Tailwind CSS v3+
