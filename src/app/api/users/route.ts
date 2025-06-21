import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/users - Obtener todos los usuarios (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // TODO: Implementar autenticación y verificar permisos de admin
    // const user = await getCurrentUser(request)
    // if (!user || !hasAdminPermissions(user)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    let query = supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        phone,
        avatar_url,
        created_at,
        updated_at,
        user_roles (
          role,
          permissions,
          created_at
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Aplicar filtros de búsqueda
    if (search) {
      query = query.or(`full_name.ilike.%${search}%, phone.ilike.%${search}%`)
    }

    const { data: profiles, error, count } = await query

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json(
        { error: 'Error fetching users', details: error.message },
        { status: 500 }
      )
    }

    // Obtener datos de auth.users para obtener emails
    const userIds = profiles?.map(p => p.id) || []
    let usersWithAuth = profiles || []

    if (userIds.length > 0) {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
      
      if (!authError && authUsers) {
        usersWithAuth = profiles?.map(profile => {
          const authUser = authUsers.users.find(u => u.id === profile.id)
          return {
            ...profile,
            email: authUser?.email || null,
            email_confirmed_at: authUser?.email_confirmed_at || null,
            last_sign_in_at: authUser?.last_sign_in_at || null
          }
        }) || []
      }
    }

    // Filtrar por rol si se especifica
    if (role && role !== 'all') {
      usersWithAuth = usersWithAuth.filter(user => 
        user.user_roles?.some((r: any) => r.role === role)
      )
    }

    return NextResponse.json({
      users: usersWithAuth,
      total: count || 0,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil((count || 0) / limit),
      limit
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/users - Crear nuevo usuario (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Implementar autenticación y verificar permisos de admin
    // const user = await getCurrentUser(request)
    // if (!user || !hasAdminPermissions(user)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const {
      email,
      password,
      full_name,
      phone,
      role = 'customer'
    } = body

    // Validaciones básicas
    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: 'Campos requeridos: email, password, full_name' },
        { status: 400 }
      )
    }

    // Crear usuario en auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        phone
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return NextResponse.json(
        { error: 'Error creating user', details: authError.message },
        { status: 500 }
      )
    }

    // Crear perfil
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.user.id,
        full_name,
        phone
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      // Intentar eliminar el usuario de auth si falla el perfil
      await supabase.auth.admin.deleteUser(authUser.user.id)
      return NextResponse.json(
        { error: 'Error creating user profile', details: profileError.message },
        { status: 500 }
      )
    }

    // Asignar rol
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authUser.user.id,
        role,
        permissions: role === 'admin' ? ['*'] : ['read']
      })

    if (roleError) {
      console.error('Error assigning role:', roleError)
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: authUser.user.id,
        email: authUser.user.email,
        full_name,
        phone,
        role
      }
    }, { status: 201 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
