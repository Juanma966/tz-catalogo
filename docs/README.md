# 📦 Generador de Catálogos PDF

Aplicación web moderna para crear y compartir catálogos/listas de precios en PDF de forma rápida, con integración directa a WhatsApp.

## 🎯 Características Principales

- ✅ **Autenticación segura** con Supabase Auth
- ✅ **Dashboard intuitivo** para gestionar catálogos
- ✅ **Gestor de productos** con soporte para imágenes
- ✅ **Formulario multi-paso** para crear catálogos
- ✅ **Generación de PDFs** con diseño corporativo minimalista
- ✅ **Compartir por WhatsApp** directamente desde la app
- ✅ **Historial de catálogos** con opciones de editar, descargar y eliminar
- ✅ **RLS y seguridad multi-tenant** en Supabase
- ✅ **Interfaz moderna** con Shadcn UI y Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15+ (App Router), React 19, TypeScript
- **Estilos**: Tailwind CSS + Shadcn UI
- **Backend**: Supabase (Auth, Database, Storage)
- **PDF**: @react-pdf/renderer
- **Forms**: React Hook Form + Zod
- **Utilidades**: date-fns, Lucide Icons

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase (gratuita en https://supabase.com)

## 🚀 Instalación y Setup

### 1. Clonar o crear el proyecto

```bash
npx create-next-app@latest catalogo-app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir

cd catalogo-app
```

### 2. Instalar dependencias

```bash
npm install @supabase/supabase-js \
  @react-pdf/renderer \
  react-hook-form \
  zod \
  @hookform/resolvers \
  date-fns \
  lucide-react

# Shadcn UI
npx shadcn-ui@latest init

# Agregar componentes específicos
npx shadcn-ui@latest add form input button card select dialog
npx shadcn-ui@latest add date-picker tabs badge alert toast
npx shadcn-ui@latest add separator label dropdown-menu
```

### 3. Configurar Supabase

#### 3.1 Crear proyecto en Supabase

1. Ve a https://supabase.com y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que se inicialice
4. Ve a **SQL Editor** y ejecuta el script SQL (ver `docs/DATABASE.md`)

#### 3.2 Crear buckets de Storage

En Supabase Console → Storage:

1. Crea bucket `catalogos-pdf` (público)
2. Crea bucket `productos-imagenes` (público)

#### 3.3 Configurar variables de entorno

Crea archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Obtén estas claves desde:
- Supabase Console → Settings → API → Project URL/anon key

### 4. Crear usuario administrador

Ejecuta en Supabase SQL Editor:

```sql
-- 1. Crear empresa
INSERT INTO public.empresas (nombre, slug, admin_id)
VALUES ('Tu Empresa', 'tu-empresa', 'placeholder-id')
RETURNING id;

-- 2. Copiar el ID del resultado
-- 3. Crear usuario admin en Auth (desde Supabase Console → Authentication)
-- 4. Actualizar la empresa con el ID real del usuario

UPDATE public.empresas 
SET admin_id = 'id-del-usuario-creado'
WHERE slug = 'tu-empresa';

-- 5. Crear registro en usuarios
INSERT INTO public.usuarios (id, nombre_completo, email, rol, empresa_id)
VALUES (
  'id-del-usuario',
  'Tu Nombre',
  'tu@email.com',
  'admin',
  'id-empresa'
);
```

### 5. Ejecutar la aplicación

```bash
npm run dev
```

Accede a http://localhost:3000

## 📁 Estructura del Proyecto

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rutas de autenticación
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # Rutas protegidas
│   │   ├── dashboard/page.tsx
│   │   ├── catalogos/
│   │   ├── productos/
│   │   └── layout.tsx
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   ├── usuarios/
│   │   ├── productos/
│   │   ├── catalogos/
│   │   └── upload/
│   └── layout.tsx
│
├── features/                     # SCREAMING ARCHITECTURE
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── catalogos/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── templates/
│   ├── productos/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   └── common/
│       ├── components/
│       ├── hooks/
│       ├── utils/
│       └── types/
│
├── lib/                         # Utilidades globales
│   ├── supabase/
│   ├── pdf/
│   ├── whatsapp/
│   └── storage/
│
├── styles/
│   ├── globals.css
│   └── variables.css
│
└── types/
    └── index.ts
```

## 🔐 Flujo de Autenticación

```
Usuario → Página Login
    ↓
LoginForm → authService.login()
    ↓
Supabase Auth
    ↓
Token guardado en sesión
    ↓
ProtectedRoute verifica
    ↓
Dashboard
```

## 📝 Guía de Uso

### Crear Catálogo

1. **Dashboard** → Click "Generar Catálogo"
2. **Paso 1**: Ingresa datos básicos
   - Nombre del cliente
   - Tipo de lista (Público/Mayorista)
   - Fecha de vencimiento
3. **Paso 2**: Agrega productos
   - Nombre, precio, cantidad
   - Sube imagen
   - Click "Agregar Producto"
4. **Paso 3**: Genera PDF
   - Verifica resumen
   - Click "Generar PDF"
5. **Compartir**:
   - Descargar PDF
   - Enviar por WhatsApp

### Gestionar Productos

1. **Dashboard** → Click "Productos"
2. **Crear**: Click "Nuevo Producto" y completa formulario
3. **Editar**: Click en producto de la lista
4. **Eliminar**: Click icono de papelera
5. **Buscar**: Usa barra de búsqueda

### Historial de Catálogos

1. **Dashboard** → Click "Catálogos Hechos"
2. Opciones por catálogo:
   - 👁️ **Ver**: Abre el PDF
   - 📥 **Descargar**: Descarga en local
   - ✏️ **Editar**: Vuelve al formulario
   - 🗑️ **Eliminar**: Borra el catálogo
   - 💬 **WhatsApp**: Abre chat con enlace

## 🎨 Personalización

### Cambiar colores

Edita `src/styles/variables.css`:

```css
:root {
  --primary: 59, 130, 246; /* Azul */
  --secondary: 16, 185, 129; /* Verde */
  --danger: 239, 68, 68; /* Rojo */
}
```

### Modificar plantilla PDF

Edita `src/features/catalogos/templates/CatalogoPDFTemplate.tsx`

### Personalizar mensajes WhatsApp

Edita `src/lib/whatsapp/whatsappService.ts`

## 📚 Documentación Detallada

- 📖 [Estructura Base de Datos](docs/DATABASE.md)
- 🔧 [Guía de Componentes](docs/COMPONENTS.md)
- 🌐 [API Routes](docs/API.md)
- 🎯 [Servicios y Hooks](docs/SERVICES.md)
- 📋 [Variables de Entorno](docs/ENV.md)
- 🐛 [Troubleshooting](docs/TROUBLESHOOTING.md)

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# 1. Push a GitHub
git push origin main

# 2. Importa en Vercel
# https://vercel.com/new

# 3. Configura variables de entorno en Settings
```

### Docker

```bash
docker build -t catalogo-app .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  catalogo-app
```

## 🧪 Testing

```bash
# Instalar Jest y React Testing Library
npm install -D jest @testing-library/react @testing-library/jest-dom

# Ejecutar tests
npm test

# Tests con cobertura
npm test -- --coverage
```

## 📊 Monitoreo

### Supabase Dashboard

- Realtime stats
- Logs
- Métricas de storage
- Análisis de queries

### Vercel Analytics

- Performance
- Web Vitals
- Usage

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

MIT License - ver archivo LICENSE para detalles

## 💬 Soporte

- 📧 Email: support@catalogo-app.com
- 🐛 Issues: GitHub Issues
- 💡 Discussions: GitHub Discussions

## 📅 Changelog

### v1.0.0 (Inicial)
- Autenticación básica
- Gestor de productos
- Generador de catálogos
- Integración WhatsApp
- Almacenamiento en Supabase

---

**Versión**: 1.0.0  
**Última actualización**: 2024  
**Estado**: Production Ready ✅
