import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/transport/companies - Obtener todas las compañías de transporte
export async function GET(request: NextRequest) {
  try {
    const { data: companies, error } = await supabase
      .from('transport_companies')
      .select(`
        id,
        name,
        logo_url,
        rating,
        phone,
        email,
        created_at
      `)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching transport companies:', error)
      return NextResponse.json(
        { error: 'Error fetching transport companies', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      companies: companies || [],
      total: companies?.length || 0
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/transport/companies - Crear nueva compañía de transporte
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Implementar autenticación y verificar permisos de admin
    // const user = await getCurrentUser(request)
    // if (!user || !hasAdminPermissions(user)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const {
      name,
      logo_url,
      rating = 0,
      phone,
      email
    } = body

    // Validaciones básicas
    if (!name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      )
    }

    const { data: company, error } = await supabase
      .from('transport_companies')
      .insert({
        name,
        logo_url,
        rating,
        phone,
        email
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating transport company:', error)
      return NextResponse.json(
        { error: 'Error creating transport company', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Transport company created successfully',
      company
    }, { status: 201 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
