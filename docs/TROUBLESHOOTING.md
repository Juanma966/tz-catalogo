# ⚙️ Variables de Entorno y Troubleshooting

## Variables de Entorno

### .env.local

Archivo de configuración local (NO commit a Git).

```env
# ============================================
# SUPABASE
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ============================================
# NEXT.JS
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ============================================
# EMAIL (Opcional, para notificaciones)
# ============================================
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@tuempresa.com

# ============================================
# WHATSAPP (Opcional)
# ============================================
NEXT_PUBLIC_WHATSAPP_PHONE=595985123456
WHATSAPP_API_TOKEN=your-api-token

# ============================================
# AMBIENTE
# ============================================
NODE_ENV=development
```

### .env.production

Para producción en Vercel:

```env
# En Vercel Dashboard → Settings → Environment Variables

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://tuapp.com
```

---

## Obtener las Credenciales de Supabase

### 1. URL del Proyecto

```
Supabase Console → Settings → API
→ Copy "Project URL"
```

Ejemplo:
```
https://abcdefghijklmnop.supabase.co
```

### 2. Anon Key (Pública - Safe)

```
Supabase Console → Settings → API
→ Copy "anon public" key
```

Esta clave es PÚBLICA y se usa en el cliente.

### 3. Service Role Key (Privada - Secret)

```
Supabase Console → Settings → API
→ Copy "service_role secret" key
```

Esta clave es PRIVADA. NO la publiques.

### 4. Verificar Configuración

```typescript
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variables de Supabase no configuradas');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## Checklist de Setup

- [ ] Crear proyecto en Supabase
- [ ] Ejecutar script SQL
- [ ] Crear buckets: `catalogos-pdf`, `productos-imagenes`
- [ ] Copiar URL y Anon Key
- [ ] Crear `.env.local` con credenciales
- [ ] Verificar RLS está habilitado
- [ ] Crear usuario admin en Supabase Auth
- [ ] Crear registro en tabla `usuarios`
- [ ] Ejecutar `npm run dev`
- [ ] Probar login en http://localhost:3000/login

---

# 🐛 Troubleshooting

## Problemas de Autenticación

### Error: "Invalid login credentials"

**Causa:** Email o contraseña incorrectos.

**Solución:**
1. Verifica que el usuario existe en Supabase → Authentication
2. Revisa que la contraseña sea correcta
3. Intenta recuperar contraseña si la olvidaste

```sql
-- En Supabase SQL Editor: Ver todos los usuarios
SELECT id, email FROM auth.users;
```

---

### Error: "RLS policy violation"

**Causa:** Las políticas de RLS están bloqueando el acceso.

**Solución:**
1. Verifica que el usuario tenga registro en tabla `usuarios`
2. Verifica que `empresa_id` sea correcto
3. Revisa que las políticas de RLS estén bien configuradas

```sql
-- Verificar usuario existe
SELECT * FROM public.usuarios 
WHERE email = 'tu@correo.com';

-- Verificar empresa existe
SELECT * FROM public.empresas 
WHERE id = 'empresa-id';
```

---

### Error: "User already registered"

**Causa:** El email ya existe en la BD.

**Solución:**
```sql
-- Opción 1: Usar otro email
-- Opción 2: Eliminar usuario anterior
DELETE FROM auth.users WHERE email = 'viejo@correo.com';
```

---

## Problemas de Supabase

### Error: "Cannot read property 'user' of null"

**Causa:** El cliente de Supabase no está inicializado.

**Solución:**
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// ✅ Correcto
const supabase = createClientComponentClient();
const { data: { user } } = await supabase.auth.getUser();

// ❌ Incorrecto - Usar en client components directamente
import { createClient } from '@supabase/supabase-js';
```

---

### Error: "Network request failed"

**Causa:** Problemas de conectividad o credenciales inválidas.

**Solución:**
1. Verifica tu conexión a internet
2. Comprueba que `NEXT_PUBLIC_SUPABASE_URL` sea correcto
3. Verifica que `NEXT_PUBLIC_SUPABASE_ANON_KEY` sea válida
4. Reinicia el servidor: `npm run dev`

```bash
# Prueba conectividad
curl https://your-project.supabase.co

# Si falla, revisa tu URL en Supabase Console
```

---

### Error: "Failed to fetch user data"

**Causa:** Session expirada o usuario no encontrado.

**Solución:**
```typescript
// Implementar refresh automático
import { useEffect } from 'react';

export function useAuth() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'TOKEN_REFRESH') {
          // Token actualizado
          console.log('Token renovado');
        }
      }
    );
    return () => subscription?.unsubscribe();
  }, []);
}
```

---

## Problemas de Storage

### Error: "Bucket not found"

**Causa:** El bucket no existe en Supabase Storage.

**Solución:**
1. Ve a Supabase Console → Storage
2. Crea los buckets:
   - `catalogos-pdf`
   - `productos-imagenes`
3. Asegúrate que sean públicos

---

### Error: "Access denied" al subir archivo

**Causa:** Las políticas de Storage no están configuradas.

**Solución:**
```sql
-- En SQL Editor, ejecutar:

CREATE POLICY "Permitir subida autenticada" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'catalogos-pdf' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Permitir lectura pública" ON storage.objects
  FOR SELECT USING (bucket_id = 'catalogos-pdf');
```

---

### Archivo subido pero no aparece

**Causa:** Necesita actualizar la página o limpiar caché.

**Solución:**
```typescript
// Limpiar caché de Storage
const { data } = supabase.storage
  .from('catalogos-pdf')
  .getPublicUrl('ruta/archivo.pdf', {
    // Agregar timestamp para evitar cache
    cacheControl: '0',
  });
```

---

## Problemas de PDF

### Error: "PDF generation failed"

**Causa:** Datos inválidos o memoria insuficiente.

**Solución:**
1. Verifica que los datos sean válidos:
```typescript
// Validar antes de generar PDF
const validar = (catalogo) => {
  if (!catalogo.nombreCliente) throw new Error('Cliente requerido');
  if (!catalogo.items.length) throw new Error('Al menos 1 producto');
  if (catalogo.total <= 0) throw new Error('Total inválido');
};
```

2. Reduce el tamaño:
```typescript
// Limitar imágenes
const optimizarImagen = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  
  // Comprimir si es muy grande
  if (blob.size > 500000) { // 500KB
    // Usar compressor.js
  }
  return blob;
};
```

---

### PDF generado pero no se descarga

**Causa:** Problema con el tipo MIME o nombre de archivo.

**Solución:**
```typescript
// Descargar correctamente
const descargarPDF = async (blob, nombre) => {
  const url = URL.createObjectURL(
    new Blob([blob], { type: 'application/pdf' })
  );
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${nombre}-${Date.now()}.pdf`;
  link.click();
  
  // Limpiar
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
```

---

## Problemas de TypeScript

### Error: "Type 'x' is not assignable to type 'y'"

**Causa:** Tipos no coinciden.

**Solución:**
```typescript
// Usar type casting
const data = response as unknown as Catalogo;

// O type-safe
const data = response as Catalogo;

// O usar Zod para validación
import { z } from 'zod';

const CatalogoSchema = z.object({
  id: z.string().uuid(),
  nombre_cliente: z.string(),
});

const catalogo = CatalogoSchema.parse(data);
```

---

### Error: "Cannot find module '@/features/...'"

**Causa:** Ruta de alias incorrecto.

**Solución:**
Verificar `tsconfig.json` o `jsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Problemas de Rendimiento

### Aplicación lenta

**Causa:** Queries ineficientes o mucho re-render.

**Solución:**
```typescript
// 1. Usar índices en Supabase
CREATE INDEX idx_catalogos_empresa 
  ON catalogos(empresa_id);

// 2. Paginar resultados
const { data } = await supabase
  .from('catalogos')
  .select()
  .range(0, 10);  // Primeros 10

// 3. Memorizar componentes
export const CatalogoItem = React.memo(({ catalogo }) => (
  <div>{catalogo.nombre_cliente}</div>
));

// 4. Usar useCallback para funciones
const handleDelete = useCallback((id) => {
  deleteCatalog(id);
}, []);
```

---

### Imágenes tardan en cargar

**Causa:** Archivos muy grandes sin comprimir.

**Solución:**
```typescript
// Comprimir antes de subir
import Compressor from 'compressorjs';

const comprimirImagen = (file) => {
  return new Promise((resolve) => {
    new Compressor(file, {
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
      success: (compressedFile) => resolve(compressedFile),
    });
  });
};

// Uso
const archivoComprimido = await comprimirImagen(archivo);
```

---

## Problemas de Despliegue (Vercel)

### Error: "Build failed"

**Causa:** Variables de entorno faltantes o código con errores.

**Solución:**
```bash
# 1. Verifica las vars de entorno en Vercel
# Dashboard → Settings → Environment Variables

# 2. Ejecuta build local
npm run build

# 3. Verifica tipos
npx tsc --noEmit

# 4. Verifica imports
npm run lint
```

---

### App funciona local pero no en producción

**Causa:** Diferencia en variables de entorno.

**Solución:**
```typescript
// Usar valores seguros con defaults
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Variables de Supabase no configuradas en producción'
  );
}
```

---

## Logs y Debugging

### Ver logs de Supabase

```typescript
// En consola del navegador
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth Event:', event);
  console.log('Session:', session);
});

// Ver network requests
// F12 → Network → Filter por 'supabase'
```

---

### Activar modo debug

```typescript
// En Next.js
export const dynamic = 'force-dynamic';

// En Supabase client
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
```

---

### Verificar RLS en acción

```sql
-- Conectarse como usuario específico y ejecutar
SET request.jwt.claim.sub = 'user-id-aqui';

SELECT * FROM public.catalogos;  
-- Si RLS funciona, solo verá sus catálogos
```

---

## Obtener Soporte

### Recursos

- 📚 [Supabase Docs](https://supabase.com/docs)
- 💬 [Supabase Discord](https://discord.supabase.com)
- 🆘 [Supabase Support](https://supabase.com/support)
- 🔍 [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

### Reportar Bug

```markdown
**Descripción:**
Breve descripción del problema

**Pasos para reproducir:**
1. Paso 1
2. Paso 2
3. Paso 3

**Resultado esperado:**
Qué debería pasar

**Resultado actual:**
Qué pasó en realidad

**Ambiente:**
- Node: 18.0.0
- Next.js: 15.0.0
- Supabase: 2.0.0

**Logs:**
[Pegar error completo]
```

---

**Versión**: 1.0.0  
**Última actualización**: 2024  
**Compatible con**: Node 18+, Next.js 15+
