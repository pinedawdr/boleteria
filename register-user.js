#!/usr/bin/env node

// Script para registrar usuario usando Supabase client directamente
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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

async function registerUser() {
  log.title('REGISTRANDO USUARIO ADMINISTRADOR');
  console.log('=' .repeat(50));
  
  const userData = {
    email: 'admin@boleteria.com',
    password: 'admin123456',
    fullName: 'Administrador del Sistema'
  };
  
  try {
    log.info('1. Intentando registrar usuario...');
    
    // Registrar usuario
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.fullName
        }
      }
    });
    
    if (error) {
      if (error.message.includes('already')) {
        log.warning('El usuario ya existe');
        log.info('Procediendo a verificar y asignar rol...');
      } else {
        log.error(`Error en registro: ${error.message}`);
        return;
      }
    } else {
      log.success('Usuario registrado exitosamente');
      if (data.user) {
        console.log(`   📧 Email: ${data.user.email}`);
        console.log(`   🆔 ID: ${data.user.id}`);
        
        // Esperar un momento para que se cree el perfil automáticamente
        log.info('Esperando a que se cree el perfil...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Ahora ejecutar la asignación de rol
    log.info('2. Asignando rol de administrador...');
    
    // Buscar el usuario en profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .limit(5);
    
    if (profileError) {
      log.error(`Error buscando perfiles: ${profileError.message}`);
      return;
    }
    
    if (!profiles || profiles.length === 0) {
      log.warning('No se encontraron perfiles. El usuario puede no haberse creado correctamente.');
      console.log('💡 Intenta registrarte manualmente en: http://localhost:3002/auth/register');
      return;
    }
    
    // Buscar usuario admin o usar el primero
    let targetUser = profiles.find(p => 
      p.full_name && p.full_name.toLowerCase().includes('admin')
    ) || profiles[0];
    
    log.success(`Usuario encontrado: ${targetUser.full_name}`);
    
    // Verificar si ya tiene rol admin
    const { data: existingRole, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', targetUser.id)
      .eq('role', 'admin')
      .single();
    
    if (existingRole) {
      log.success('El usuario ya tiene rol de administrador');
    } else {
      // Asignar rol admin
      const { error: insertRoleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: targetUser.id,
          role: 'admin',
          permissions: ['*']
        });
      
      if (insertRoleError) {
        log.error(`Error asignando rol: ${insertRoleError.message}`);
        return;
      }
      
      log.success('Rol de administrador asignado exitosamente');
    }
    
    console.log('\n' + colors.green + '🎉 ¡USUARIO ADMINISTRADOR LISTO!' + colors.reset);
    console.log('=' .repeat(50));
    console.log(`📧 Email: ${userData.email}`);
    console.log(`🔑 Contraseña: ${userData.password}`);
    console.log(`🌐 Login: http://localhost:3002/auth/login`);
    console.log(`⚙️ Dashboard: http://localhost:3002/admin/dashboard`);
    
  } catch (error) {
    log.error(`Error general: ${error.message}`);
  }
}

registerUser().catch(console.error);
