import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/transport/routes - Buscar rutas de transporte
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const origin = searchParams.get('origin')
    const destination = searchParams.get('destination')
    const date = searchParams.get('date')
    const passengers = parseInt(searchParams.get('passengers') || '1')
    const company = searchParams.get('company')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('transport_routes')
      .select(`
        id,
        origin,
        destination,
        departure_time,
        arrival_time,
        price,
        available_seats,
        total_seats,
        amenities,
        bus_type,
        duration,
        created_at,
        transport_companies (
          id,
          name,
          rating,
          phone,
          email,
          logo_url
        )
      `)
      .gte('available_seats', passengers)
      .order('departure_time', { ascending: true })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (origin) {
      query = query.ilike('origin', `%${origin}%`)
    }

    if (destination) {
      query = query.ilike('destination', `%${destination}%`)
    }

    if (date) {
      // Filtrar por fecha (considerando solo la fecha, no la hora)
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      
      query = query
        .gte('departure_time', startDate.toISOString())
        .lt('departure_time', endDate.toISOString())
    }

    if (company) {
      query = query.eq('transport_companies.name', company)
    }

    const { data: routes, error, count } = await query

    if (error) {
      console.error('Error fetching transport routes:', error)
      return NextResponse.json(
        { error: 'Error fetching transport routes', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      routes: routes || [],
      total: count || 0,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil((count || 0) / limit),
      limit,
      filters: {
        origin,
        destination,
        date,
        passengers,
        company
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/transport/routes - Crear nueva ruta (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Implementar autenticación y verificar permisos de admin
    // const user = await getCurrentUser(request)
    // if (!user || !hasAdminPermissions(user)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const {
      company_id,
      origin,
      destination,
      departure_time,
      arrival_time,
      price,
      total_seats,
      amenities,
      bus_type,
      duration
    } = body

    // Validaciones básicas
    if (!company_id || !origin || !destination || !departure_time || !price || !total_seats) {
      return NextResponse.json(
        { error: 'Campos requeridos: company_id, origin, destination, departure_time, price, total_seats' },
        { status: 400 }
      )
    }

    const { data: route, error } = await supabase
      .from('transport_routes')
      .insert({
        company_id,
        origin,
        destination,
        departure_time,
        arrival_time,
        price,
        total_seats,
        available_seats: total_seats, // Inicialmente todos los asientos están disponibles
        amenities: amenities || [],
        bus_type,
        duration
      })
      .select(`
        id,
        origin,
        destination,
        departure_time,
        arrival_time,
        price,
        available_seats,
        total_seats,
        amenities,
        bus_type,
        duration,
        transport_companies (
          id,
          name,
          rating,
          phone,
          email
        )
      `)
      .single()

    if (error) {
      console.error('Error creating transport route:', error)
      return NextResponse.json(
        { error: 'Error creating transport route', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Transport route created successfully',
      route
    }, { status: 201 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
