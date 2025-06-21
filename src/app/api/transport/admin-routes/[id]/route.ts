import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/transport/admin-routes/[id] - Obtener ruta específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: route, error } = await supabase
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
        updated_at,
        transport_companies (
          id,
          name,
          logo_url,
          rating,
          phone,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Route not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching route:', error)
      return NextResponse.json(
        { error: 'Error fetching route', details: error.message },
        { status: 500 }
      )
    }

    // Contar reservas activas para esta ruta
    const { count: bookingsCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('route_id', id)
      .neq('status', 'cancelled')

    return NextResponse.json({
      route,
      bookings_count: bookingsCount || 0
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/transport/admin-routes/[id] - Actualizar ruta
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      status
    } = body

    const { data: route, error } = await supabase
      .from('transport_routes')
      .update({
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
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
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
        transport_companies (
          id,
          name,
          logo_url,
          rating
        )
      `)
      .single()

    if (error) {
      console.error('Error updating route:', error)
      return NextResponse.json(
        { error: 'Error updating route', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Route updated successfully',
      route
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/transport/admin-routes/[id] - Actualizar estado de la ruta
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // TODO: Implementar autenticación y verificar permisos de admin/operator
    // const user = await getCurrentUser(request)
    // if (!user || !hasOperatorPermissions(user)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { status } = body

    if (!status || !['active', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be active or cancelled' },
        { status: 400 }
      )
    }

    const { data: route, error } = await supabase
      .from('transport_routes')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        id,
        origin,
        destination,
        status,
        updated_at
      `)
      .single()

    if (error) {
      console.error('Error updating route status:', error)
      return NextResponse.json(
        { error: 'Error updating route status', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Route status updated successfully',
      route
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/transport/admin-routes/[id] - Eliminar ruta
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // TODO: Implementar autenticación y verificar permisos de admin/operator
    // const user = await getCurrentUser(request)
    // if (!user || !hasOperatorPermissions(user)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Verificar si hay reservas activas
    const { count: activeBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('route_id', id)
      .neq('status', 'cancelled')

    if (activeBookings && activeBookings > 0) {
      return NextResponse.json(
        { error: 'Cannot delete route with active bookings' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('transport_routes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting route:', error)
      return NextResponse.json(
        { error: 'Error deleting route', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Route deleted successfully'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
