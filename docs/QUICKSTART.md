# 🚀 Guía Rápida de Setup Inicial

## Tiempo estimado: 30-45 minutos

---

## PASO 1: Crear proyecto Next.js (5 minutos)

```bash
# Crear proyecto
npx create-next-app@latest catalogo-app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --import-alias '@/*' \
  --no-git

cd catalogo-app

# Resultado esperado:
# ✔ Proyecto creado
# ✔ TypeScript configurado
# ✔ Tailwind CSS listo
```

---

## PASO 2: Instalar dependencias (5 minutos)

```bash
# Dependencias principales
npm install \
  @supabase/supabase-js \
  @supabase/auth-helpers-nextjs \
  @supabase/auth-helpers-react \
  @react-pdf/renderer \
  react-hook-form \
  @hookform/resolvers \
  zod \
  date-fns \
  lucide-react

# Shadcn UI
npx shadcn-ui@latest init

# Responder a las preguntas:
# - Use TypeScript? → Yes
# - Style? → Default
# - Base color? → Slate
# - CSS variables? → Yes
```

Instalar componentes Shadcn:

```bash
npx shadcn-ui@latest add form input button card select dialog
npx shadcn-ui@latest add date-picker tabs badge alert toast
npx shadcn-ui@latest add separator label dropdown-menu table
```

---

## PASO 3: Configurar Supabase (10 minutos)

### 3.1 Crear cuenta en Supabase

1. Ve a https://supabase.com
2. Click "Start your project"
3. Sign up con GitHub/Google
4. Crea un nuevo proyecto
5. Espera ~5 minutos

### 3.2 Obtener credenciales

1. Dashboard → Settings → API
2. Copia:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3.3 Ejecutar script SQL

1. Dashboard → SQL Editor
2. Click "New Query"
3. Pega el contenido de `DATABASE.md` (la sección SQL)
4. Click "Run"

**Resultado esperado:** ✅ 7 tablas creadas

### 3.4 Crear Buckets

Dashboard → Storage:

1. Click "New bucket"
   - Nombre: `catalogos-pdf`
   - Público: ✅
2. Click "New bucket"
   - Nombre: `productos-imagenes`
   - Público: ✅

---

## PASO 4: Configurar Variables de Entorno (2 minutos)

Crea archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Reemplaza con tus valores de Supabase.

---

## PASO 5: Crear Estructura del Proyecto (5 minutos)

```bash
# Crear directorios
mkdir -p src/features/{auth,catalogos,productos,dashboard,common}/\{components,hooks,services,types,templates\}
mkdir -p src/lib/{supabase,pdf,whatsapp,storage}
mkdir -p src/app/{api,\(auth\),\(dashboard\)}
mkdir -p docs

# Verifica estructura
ls -la src/features/
```

---

## PASO 6: Crear Cliente de Supabase (3 minutos)

Crea `src/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr';

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

Crea `src/lib/supabase/server.ts`:

```typescript
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle error
          }
        },
      },
    }
  );
};
```

---

## PASO 7: Crear usuario Administrador (5 minutos)

### 7.1 En Supabase Auth

1. Dashboard → Authentication → Users
2. Click "Add user"
3. Email: `admin@example.com`
4. Password: `Temporal123!`

Copia el **User ID** generado.

### 7.2 Crear Empresa en BD

Dashboard → SQL Editor → New Query:

```sql
INSERT INTO public.empresas (nombre, slug, admin_id)
VALUES (
  'Mi Primera Empresa',
  'mi-empresa',
  'PEGA-EL-USER-ID-AQUI'
)
RETURNING id;
```

Copia el **ID de empresa** retornado.

### 7.3 Crear registro en usuarios

```sql
INSERT INTO public.usuarios (
  id,
  nombre_completo,
  email,
  rol,
  empresa_id,
  activo
)
VALUES (
  'PEGA-EL-USER-ID',
  'Admin User',
  'admin@example.com',
  'admin',
  'PEGA-EL-EMPRESA-ID',
  true
);
```

**Resultado esperado:** ✅ Usuario creado y visible en tabla

---

## PASO 8: Crear componente LoginForm (5 minutos)

Crea `src/features/auth/components/LoginForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (err) {
        setError(err.message);
        return;
      }

      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## PASO 9: Crear páginas básicas (3 minutos)

Crea `src/app/(auth)/login/page.tsx`:

```typescript
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return <LoginForm />;
}
```

Crea `src/app/(dashboard)/dashboard/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    });
  }, [router]);

  if (!user) return <div>Cargando...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Bienvenido</h1>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
}
```

---

## PASO 10: Ejecutar aplicación (2 minutos)

```bash
npm run dev
```

Abre http://localhost:3000

### Pruebas:

1. ✅ Página carga sin errores
2. ✅ Redirige a `/login`
3. ✅ Login con:
   - Email: `admin@example.com`
   - Password: `Temporal123!`
4. ✅ Redirige a dashboard
5. ✅ Dashboard muestra email

---

## Checklist Final

- [ ] Proyecto Next.js creado
- [ ] Dependencias instaladas
- [ ] Supabase proyecto creado
- [ ] Script SQL ejecutado
- [ ] Buckets creados
- [ ] `.env.local` configurado
- [ ] Cliente Supabase creado
- [ ] Usuario admin creado
- [ ] LoginForm implementado
- [ ] App ejecutada exitosamente
- [ ] Login funcional ✅

---

## 🎉 ¡Listo!

Tu aplicación base está lista. Ahora puedes:

1. **Continuar con Día 2** del roadmap (Dashboard)
2. **Agregar más features** según necesites
3. **Deploy a Vercel** cuando esté listo

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Linting
npm run lint

# Tipos
npx tsc --noEmit

# Limpiar caché
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

---

## Próximos pasos después del setup

1. **Implementar protección de rutas:**
   - Middleware de autenticación
   - ProtectedRoute component

2. **Crear estructura de features:**
   - Tipos TypeScript
   - Servicios
   - Hooks personalizados

3. **Agregar gestión de usuarios:**
   - Admin panel
   - Crear/editar usuarios

4. **Implementar productos:**
   - CRUD completo
   - Upload de imágenes

5. **Generador de catálogos:**
   - Formulario multi-paso
   - Generación PDF
   - Share WhatsApp

---

**¿Problemas?** Ver `TROUBLESHOOTING.md`

**¿Más detalles?** Ver documentación completa
