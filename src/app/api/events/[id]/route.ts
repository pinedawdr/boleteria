import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/events/[id] - Obtener evento específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: event, error } = await supabase
      .from('events')
      .select(`
        id,
        title,
        description,
        start_date,
        end_date,
        price_from,
        price_to,
        image_url,
        category,
        status,
        artist,
        duration,
        age_restriction,
        rating,
        created_at,
        venues (
          id,
          name,
          address,
          city,
          capacity,
          seating_map
        ),
        event_seats (
          id,
          section,
          row_number,
          seat_number,
          price,
          status
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching event:', error)
      return NextResponse.json(
        { error: 'Error fetching event', details: error.message },
        { status: 500 }
      )
    }

    // Contar reservas activas para este evento
    const { count: bookingsCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', id)
      .neq('status', 'cancelled')

    return NextResponse.json({
      event,
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

// PUT /api/events/[id] - Actualizar evento (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // TODO: Implementar autenticación y verificar permisos de admin
    // const user = await getCurrentUser(request)
    // if (!user || !hasAdminPermissions(user)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const {
      title,
      description,
      venue_id,
      artist,
      category,
      start_date,
      end_date,
      price_from,
      price_to,
      image_url,
      duration,
      age_restriction,
      status
    } = body

    const { data: event, error } = await supabase
      .from('events')
      .update({
        title,
        description,
        venue_id,
        artist,
        category,
        start_date,
        end_date,
        price_from,
        price_to,
        image_url,
        duration,
        age_restriction,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        id,
        title,
        description,
        start_date,
        end_date,
        price_from,
        price_to,
        image_url,
        category,
        status,
        artist,
        duration,
        age_restriction,
        venues (
          id,
          name,
          address,
          city,
          capacity
        )
      `)
      .single()

    if (error) {
      console.error('Error updating event:', error)
      return NextResponse.json(
        { error: 'Error updating event', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Event updated successfully',
      event
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/events/[id] - Actualizar estado del evento (admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // TODO: Implementar autenticación y verificar permisos de admin
    // const user = await getCurrentUser(request)
    // if (!user || !hasAdminPermissions(user)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { status } = body

    if (!status || !['active', 'cancelled', 'sold_out'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be active, cancelled, or sold_out' },
        { status: 400 }
      )
    }

    const { data: event, error } = await supabase
      .from('events')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        id,
        title,
        status,
        updated_at
      `)
      .single()

    if (error) {
      console.error('Error updating event status:', error)
      return NextResponse.json(
        { error: 'Error updating event status', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Event status updated successfully',
      event
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/events/[id] - Eliminar evento (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // TODO: Implementar autenticación y verificar permisos de admin
    // const user = await getCurrentUser(request)
    // if (!user || !hasAdminPermissions(user)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Verificar si hay reservas activas
    const { count: activeBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', id)
      .neq('status', 'cancelled')

    if (activeBookings && activeBookings > 0) {
      return NextResponse.json(
        { error: 'Cannot delete event with active bookings' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting event:', error)
      return NextResponse.json(
        { error: 'Error deleting event', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Event deleted successfully'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
