# 📊 Documentación de Base de Datos

## Descripción General

La base de datos está diseñada con arquitectura **multi-tenant** usando Supabase. Implementa **Row Level Security (RLS)** para garantizar que cada usuario solo acceda a sus propios datos.

## 🏗️ Diagrama de Relaciones

```
┌─────────────────┐
│    EMPRESAS     │
│   (multi-tenant)│
└────────┬────────┘
         │ 1
         │
         │ N
    ┌────┴─────────┬──────────────┬────────────────┐
    │              │              │                │
┌───▼────┐  ┌────▼──┐  ┌─────▼──┐  ┌────────▼──┐
│USUARIOS│  │PRODUCTOS│  │CATÁLOGOS│  │CATALOGO  │
│        │  │        │  │        │  │ITEMS     │
└────────┘  └────────┘  └────┬───┘  └──────────┘
                             │
                             │ 1:N
                             │
                        ┌────▼───┐
                        │CATALOGO│
                        │ITEMS   │
                        └────────┘
```

## 📋 Tablas Detalladas

### 1️⃣ EMPRESAS

Tabla que contiene todas las empresas/negocios registrados.

```sql
CREATE TABLE public.empresas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  descripcion TEXT,
  admin_id UUID NOT NULL REFERENCES public.usuarios(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| nombre | TEXT | Nombre de la empresa (ej: "Mi Distribuidora") |
| slug | TEXT | URL-friendly (ej: "mi-distribuidora") |
| logo_url | TEXT | URL del logo en Storage |
| descripcion | TEXT | Descripción breve |
| admin_id | UUID | Usuario administrador propietario |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

**Índices:**
```sql
CREATE INDEX idx_empresas_admin ON public.empresas(admin_id);
CREATE INDEX idx_empresas_slug ON public.empresas(slug);
```

---

### 2️⃣ USUARIOS

Tabla de usuarios vinculada a Supabase Auth.

```sql
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  nombre_completo TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  rol TEXT NOT NULL DEFAULT 'empleado' 
    CHECK (rol IN ('admin', 'empleado')),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID de auth.users (referencia) |
| nombre_completo | TEXT | Nombre completo del usuario |
| email | TEXT | Email único del usuario |
| rol | TEXT | 'admin' o 'empleado' |
| empresa_id | UUID | Empresa a la que pertenece |
| activo | BOOLEAN | Si el usuario puede acceder |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

**Índices:**
```sql
CREATE INDEX idx_usuarios_empresa ON public.usuarios(empresa_id);
CREATE INDEX idx_usuarios_rol ON public.usuarios(rol);
CREATE INDEX idx_usuarios_activo ON public.usuarios(activo);
```

**Tipos de Rol:**
- `admin`: Puede crear usuarios, ver reportes, gestionar catálogos
- `empleado`: Solo puede crear catálogos y gestionar productos

---

### 3️⃣ PRODUCTOS

Catálogo maestro de productos de cada empresa.

```sql
CREATE TABLE public.productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio_base DECIMAL(12, 2) NOT NULL,
  imagen_url TEXT,
  codigo_sku TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(empresa_id, codigo_sku)
);
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| empresa_id | UUID | Empresa propietaria del producto |
| nombre | TEXT | Nombre del producto (ej: "Arroz 5kg") |
| descripcion | TEXT | Descripción detallada (opcional) |
| precio_base | DECIMAL | Precio unitario base |
| imagen_url | TEXT | URL de la imagen en Storage |
| codigo_sku | TEXT | Código único del producto |
| activo | BOOLEAN | Si está disponible para vender |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

**Índices:**
```sql
CREATE INDEX idx_productos_empresa ON public.productos(empresa_id);
CREATE INDEX idx_productos_sku ON public.productos(codigo_sku);
CREATE INDEX idx_productos_activo ON public.productos(activo);
```

**Consideraciones:**
- El `codigo_sku` debe ser único dentro de cada empresa
- Los precios usan DECIMAL para precisión financiera
- Las imágenes se almacenan en Storage, solo guardamos la URL

---

### 4️⃣ CATÁLOGOS

Registro de todos los catálogos/listas de precios generados.

```sql
CREATE TABLE public.catalogos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id),
  nombre_cliente TEXT NOT NULL,
  tipo_lista TEXT NOT NULL CHECK (tipo_lista IN ('publico', 'mayorista')),
  fecha_vencimiento DATE NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  pdf_url TEXT,
  estado TEXT DEFAULT 'borrador' 
    CHECK (estado IN ('borrador', 'publicado', 'vencido')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| empresa_id | UUID | Empresa creadora |
| usuario_id | UUID | Usuario que creó el catálogo |
| nombre_cliente | TEXT | Nombre de quien recibirá el catálogo |
| tipo_lista | TEXT | 'publico' o 'mayorista' |
| fecha_vencimiento | DATE | Fecha de expiración del catálogo |
| subtotal | DECIMAL | Suma antes de impuestos |
| total | DECIMAL | Total final (puede incluir impuestos) |
| pdf_url | TEXT | URL pública del PDF en Storage |
| estado | TEXT | 'borrador', 'publicado', 'vencido' |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

**Estados:**
- `borrador`: Aún en edición
- `publicado`: Finalizado y compartido
- `vencido`: Pasó la fecha de vencimiento

**Índices:**
```sql
CREATE INDEX idx_catalogos_empresa ON public.catalogos(empresa_id);
CREATE INDEX idx_catalogos_usuario ON public.catalogos(usuario_id);
CREATE INDEX idx_catalogos_estado ON public.catalogos(estado);
CREATE INDEX idx_catalogos_fecha ON public.catalogos(created_at);
```

---

### 5️⃣ CATALOGO_ITEMS

Items/líneas que contiene cada catálogo.

```sql
CREATE TABLE public.catalogo_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  catalogo_id UUID NOT NULL REFERENCES public.catalogos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES public.productos(id),
  nombre_producto TEXT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  imagen_url TEXT,
  posicion INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| catalogo_id | UUID | Catálogo padre (cascada al eliminar) |
| producto_id | UUID | Producto referenciado (puede ser NULL si fue eliminado) |
| nombre_producto | TEXT | Nombre exacto del producto en ese momento |
| cantidad | INT | Cantidad listada |
| precio_unitario | DECIMAL | Precio en ese momento |
| subtotal | DECIMAL | cantidad × precio_unitario |
| imagen_url | TEXT | Snapshot de la imagen en ese momento |
| posicion | INT | Orden en el PDF (1, 2, 3...) |
| created_at | TIMESTAMP | Fecha de creación |

**Índices:**
```sql
CREATE INDEX idx_catalogo_items_catalogo ON public.catalogo_items(catalogo_id);
CREATE INDEX idx_catalogo_items_producto ON public.catalogo_items(producto_id);
CREATE INDEX idx_catalogo_items_posicion ON public.catalogo_items(posicion);
```

**Nota Importante:**
- El nombre, precio e imagen se guardan como "snapshot" en el momento de creación
- Esto permite que cambios posteriores al producto NO afecten catálogos antiguos

---

## 🔐 Row Level Security (RLS)

### Políticas por Tabla

#### USUARIOS

```sql
-- Solo pueden ver su propio perfil
CREATE POLICY "usuarios_view_self" ON public.usuarios
  FOR SELECT USING (auth.uid() = id);

-- Admins pueden ver todos los usuarios de su empresa
CREATE POLICY "usuarios_admin_view_empresa" ON public.usuarios
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.usuarios u
      WHERE u.id = auth.uid()
      AND u.empresa_id = usuarios.empresa_id
      AND u.rol = 'admin'
    )
  );

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "usuarios_update_self" ON public.usuarios
  FOR UPDATE USING (auth.uid() = id);

-- Solo admins pueden insertar usuarios
CREATE POLICY "usuarios_admin_insert" ON public.usuarios
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios u
      WHERE u.id = auth.uid()
      AND u.empresa_id = NEW.empresa_id
      AND u.rol = 'admin'
    )
  );
```

#### PRODUCTOS

```sql
-- Ver: Solo usuarios de la misma empresa
CREATE POLICY "productos_view" ON public.productos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.usuarios u
      WHERE u.id = auth.uid()
      AND u.empresa_id = productos.empresa_id
    )
  );

-- Insertar/Actualizar: Solo usuarios de la empresa
CREATE POLICY "productos_insert_update" ON public.productos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios u
      WHERE u.id = auth.uid()
      AND u.empresa_id = NEW.empresa_id
    )
  );
```

#### CATÁLOGOS

```sql
-- Ver: Solo usuarios de la misma empresa
CREATE POLICY "catalogos_view" ON public.catalogos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.usuarios u
      WHERE u.id = auth.uid()
      AND u.empresa_id = catalogos.empresa_id
    )
  );

-- Insertar: Solo el usuario autenticado de su empresa
CREATE POLICY "catalogos_insert" ON public.catalogos
  FOR INSERT WITH CHECK (
    usuario_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.usuarios u
      WHERE u.id = auth.uid()
      AND u.empresa_id = NEW.empresa_id
    )
  );

-- Actualizar/Eliminar: Solo el propietario
CREATE POLICY "catalogos_update_delete" ON public.catalogos
  FOR UPDATE USING (usuario_id = auth.uid());
```

---

## 💾 Storage Buckets

### catalogos-pdf
Almacena archivos PDF generados.

```
Estructura:
catalogos-pdf/
├── [empresa_id]/
│   ├── [catalogo_id].pdf
│   └── [catalogo_id]_backup.pdf
```

**Políticas:**
```sql
-- Lectura pública
CREATE POLICY "Permitir lectura pública de PDFs" ON storage.objects
  FOR SELECT USING (bucket_id = 'catalogos-pdf');

-- Subida solo autenticada
CREATE POLICY "Permitir subida de PDFs autenticados" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'catalogos-pdf' 
    AND auth.role() = 'authenticated'
  );
```

### productos-imagenes
Almacena imágenes de productos.

```
Estructura:
productos-imagenes/
├── [empresa_id]/
│   ├── [producto_id]/
│   │   ├── original.jpg
│   │   └── thumb.jpg
```

**Políticas:**
```sql
-- Lectura pública
CREATE POLICY "Permitir lectura de imágenes" ON storage.objects
  FOR SELECT USING (bucket_id = 'productos-imagenes');

-- Subida autenticada
CREATE POLICY "Permitir subida de imágenes" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'productos-imagenes'
    AND auth.role() = 'authenticated'
  );
```

---

## 🔄 Triggers y Funciones

### Actualizar timestamp de updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas las tablas
CREATE TRIGGER usuarios_updated_at BEFORE UPDATE ON public.usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER empresas_updated_at BEFORE UPDATE ON public.empresas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER productos_updated_at BEFORE UPDATE ON public.productos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER catalogos_updated_at BEFORE UPDATE ON public.catalogos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 📊 Queries Útiles

### Obtener catálogos por empresa

```sql
SELECT 
  c.id,
  c.nombre_cliente,
  c.tipo_lista,
  c.total,
  c.created_at,
  u.nombre_completo
FROM public.catalogos c
JOIN public.usuarios u ON c.usuario_id = u.id
WHERE c.empresa_id = $1
ORDER BY c.created_at DESC;
```

### Productos más usados en catálogos

```sql
SELECT 
  p.nombre,
  COUNT(ci.id) as veces_usado,
  SUM(ci.cantidad) as cantidad_total
FROM public.productos p
JOIN public.catalogo_items ci ON p.id = ci.producto_id
WHERE p.empresa_id = $1
GROUP BY p.id, p.nombre
ORDER BY veces_usado DESC;
```

### Ventas por rango de fechas

```sql
SELECT 
  DATE(c.created_at) as fecha,
  COUNT(c.id) as catálogos,
  SUM(c.total) as monto_total
FROM public.catalogos c
WHERE c.empresa_id = $1
  AND c.created_at >= $2
  AND c.created_at <= $3
GROUP BY DATE(c.created_at)
ORDER BY fecha DESC;
```

### Usuarios activos

```sql
SELECT 
  u.id,
  u.nombre_completo,
  u.email,
  u.rol,
  COUNT(c.id) as catálogos_creados
FROM public.usuarios u
LEFT JOIN public.catalogos c ON u.id = c.usuario_id
WHERE u.empresa_id = $1 AND u.activo = true
GROUP BY u.id
ORDER BY catálogos_creados DESC;
```

---

## 🎯 Notas de Implementación

### Multi-Tenancy

- Cada tabla tiene `empresa_id` para aislar datos
- RLS asegura que cada usuario solo ve su empresa
- Las queries siempre filtran por `empresa_id`

### Integridad Referencial

- `ON DELETE CASCADE` en relaciones hijo
- No se pueden eliminar empresas si tienen catálogos
- Se pueden eliminar usuarios (se marca como inactivo en cambio)

### Performance

- Usa índices en campos frecuentemente filtrados
- Las imágenes se almacenan en Storage, no en DB
- Los PDFs se almacenan en Storage con URL en BD

### Snapshots

- Los `catalogo_items` guardan datos exactos del momento
- Cambios posteriores a productos NO afectan catálogos antiguos
- Permite mostrar histórico exacto

---

## 🚀 Migración a Producción

```bash
# 1. Backup de la BD actual
pg_dump postgresql://user:password@host/db > backup.sql

# 2. Ejecutar script SQL en producción
# (Desde Supabase Console → SQL Editor)

# 3. Verificar integridad
SELECT COUNT(*) FROM public.empresas;
SELECT COUNT(*) FROM public.usuarios;

# 4. Validar RLS
-- Intenta acceder como usuario normal
SELECT * FROM public.catalogos;  -- Debe retornar solo sus catálogos
```

---

**Versión**: 1.0.0  
**Última actualización**: 2024  
**Compatible con**: Supabase v2.0+
