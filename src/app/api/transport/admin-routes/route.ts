import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/transport/routes - Obtener todas las rutas de transporte (Admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    
    let query = supabase
      .from('transport_routes')
      .select(`
        id,
        origin,
        destination,
        vehicle_type,
        departure_time,
        arrival_time,
        duration,
        price_from,
        price_to,
        total_seats,
        amenities,
        status,
        created_at,
        transport_companies (
          id,
          name,
          logo_url,
          rating,
          phone,
          email
        )
      `)
      .order('created_at', { ascending: false })

    // Filtrar por estado si no es 'all'
    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: routes, error } = await query

    if (error) {
      console.error('Error fetching transport routes:', error)
      return NextResponse.json(
        { error: 'Error fetching transport routes', details: error.message },
        { status: 500 }
      )
    }

    // Calcular asientos ocupados (esto debería venir de una consulta real a bookings)
    const routesWithOccupancy = routes?.map(route => ({
      ...route,
      occupied_seats: Math.floor(Math.random() * route.total_seats * 0.8) // Mock data por ahora
    })) || []

    return NextResponse.json({
      routes: routesWithOccupancy,
      total: routesWithOccupancy.length
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/transport/routes - Crear nueva ruta de transporte
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Implementar autenticación y verificar permisos de admin/operator
    // const user = await getCurrentUser(request)
    // if (!user || !hasOperatorPermissions(user)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const {
      company_id,
      origin,
      destination,
      vehicle_type,
      departure_time,
      arrival_time,
      duration,
      price_from,
      price_to,
      total_seats,
      amenities,
      status = 'active'
    } = body

    // Validaciones básicas
    if (!company_id || !origin || !destination || !vehicle_type || !departure_time || !arrival_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['bus', 'boat', 'train'].includes(vehicle_type)) {
      return NextResponse.json(
        { error: 'Invalid vehicle type' },
        { status: 400 }
      )
    }

    const { data: route, error } = await supabase
      .from('transport_routes')
      .insert({
        company_id,
        origin,
        destination,
        vehicle_type,
        departure_time,
        arrival_time,
        duration,
        price_from,
        price_to,
        total_seats,
        amenities: amenities || [],
        status
      })
      .select(`
        id,
        origin,
        destination,
        vehicle_type,
        departure_time,
        arrival_time,
        duration,
        price_from,
        price_to,
        total_seats,
        amenities,
        status,
        created_at,
        transport_companies (
          id,
          name,
          logo_url,
          rating
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
