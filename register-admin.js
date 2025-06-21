#!/usr/bin/env node

// Script para registrar usuario a través de las APIs del frontend
const axios = require('axios');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m', 
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  title: (msg) => console.log(`${colors.cyan}🔧 ${msg}${colors.reset}`)
};

async function registerAdminUser() {
  log.title('REGISTRANDO USUARIO ADMINISTRADOR VÍA FRONTEND');
  console.log('=' .repeat(50));
  
  const userData = {
    email: 'admin@boleteria.com',
    password: 'admin123456',
    fullName: 'Administrador del Sistema'
  };

  try {
    log.info('1. Verificando que el servidor esté corriendo...');
    
    // Verificar que el servidor esté activo
    try {
      const healthCheck = await axios.get('http://localhost:3002');
      log.success('Servidor de desarrollo activo');
    } catch (error) {
      log.error('El servidor no está corriendo en el puerto 3002');
      console.log('Ejecuta: npm run dev');
      return;
    }
    
    log.info('2. Procediendo con registro manual...');
    console.log('📝 Datos del usuario administrador:');
    console.log(`   📧 Email: ${userData.email}`);
    console.log(`   🔑 Contraseña: ${userData.password}`);
    console.log(`   👤 Nombre: ${userData.fullName}`);
    
    console.log('\n🔧 PASOS MANUALES REQUERIDOS:');
    console.log('=' .repeat(50));
    console.log('1. Ve a: http://localhost:3002/auth/register');
    console.log('2. Completa el formulario con los datos mostrados arriba');
    console.log('3. Haz clic en "Registrarse"');
    console.log('4. Una vez registrado, ejecuta: node assign-admin-role.js');
    
    console.log('\n💡 Alternativa - Usar SQL directamente:');
    console.log('Ve a: https://supabase.com/dashboard/project/zyazsnafxjgfmwkpqyar/editor');
    console.log('Y ejecuta:');
    console.log(`
-- 1. Primero crear el usuario y perfil manualmente o vía registro web
-- 2. Luego ejecutar este comando para asignar rol de admin:
INSERT INTO public.user_roles (user_id, role, permissions)
SELECT id, 'admin', ARRAY['*']
FROM auth.users 
WHERE email = '${userData.email}';
`);
    
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }
}

// Ejecutar el registro
registerAdminUser().catch(console.error);
