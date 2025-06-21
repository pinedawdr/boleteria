
### Gestión de Eventos
- Catálogo completo de eventos (conciertos, teatro, deportes, conferencias)
- Sistema de asientos interactivo
- Diferentes categorías de boletos (general, VIP, preferencial)
- Gestión de venues y capacidades

### Sistema de Transporte
- Reserva de asientos en buses, trenes y boats
- Rutas entre diferentes ciudades
- Múltiples compañías de transporte
- Amenidades y servicios por vehículo

### 👥 Sistema de Usuarios y Roles
- **Clientes**: Compra de boletos y reservas
- **Operadores**: Gestión de eventos y transportes
- **Administradores**: Control total del sistema

### Gestión de Reservas
- Códigos QR únicos para cada reserva
- Múltiples métodos de pago (Yape, Plin, tarjetas)
- Sistema de notificaciones
- Historial completo de reservas

### Panel de Administración
- Dashboard con métricas en tiempo real
- Gestión de usuarios y permisos
- Reportes y análisis de ventas
- Sistema de blog integrado

## Instalación Rápida

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta de Supabase

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd boleteria
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configuración de Supabase

#### Opción A: Configuración Automática (Recomendada)
```bash
npm run setup
```

Este comando te guiará paso a paso para configurar tu proyecto de Supabase.

#### Opción B: Configuración Manual

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a Settings > API en tu dashboard de Supabase
3. Copia las credenciales y crea un archivo `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Boletería
```

### 4. Configurar Base de Datos

1. Ve a tu panel de Supabase > SQL Editor
2. Copia y pega el contenido de `supabase-schema.sql`
3. Ejecuta el script para crear todas las tablas y configuraciones

### 5. Crear Usuario Administrador

En el SQL Editor de Supabase, ejecuta (reemplaza con tu email):

```sql
-- Crear rol de administrador para tu usuario
INSERT INTO public.user_roles (user_id, role, permissions)
SELECT id, 'admin', ARRAY['*']
FROM auth.users 
WHERE email = 'tu-email@example.com';
```

### 6. Ejecutar el Proyecto
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`
