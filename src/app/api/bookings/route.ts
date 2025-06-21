import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/bookings - Obtener reservas del usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('bookings')
      .select(`
        id,
        user_id,
        booking_type,
        event_id,
        route_id,
        booking_date,
        travel_date,
        departure_time,
        seat_numbers,
        passenger_info,
        total_amount,
        status,
        created_at,
        updated_at,
        events (
          id,
          title,
          start_date,
          image_url,
          venues (
            name,
            address,
            city
          )
        ),
        transport_routes (
          id,
          origin,
          destination,
          departure_time,
          arrival_time,
          transport_companies (
            name
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (type && type !== 'all') {
      query = query.eq('booking_type', type)
    }

    const { data: bookings, error, count } = await query

    if (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json(
        { error: 'Error fetching bookings', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      bookings: bookings || [],
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

// POST /api/bookings - Crear nueva reserva
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      user_id,
      event_id,
      route_id,
      booking_type,
      travel_date,
      departure_time,
      seat_numbers,
      total_amount,
      passenger_info
    } = body

    // Validaciones básicas
    if (!user_id || !booking_type || !total_amount) {
      return NextResponse.json(
        { error: 'Campos requeridos: user_id, booking_type, total_amount' },
        { status: 400 }
      )
    }

    if (booking_type === 'event' && !event_id) {
      return NextResponse.json(
        { error: 'event_id is required for event bookings' },
        { status: 400 }
      )
    }

    if (booking_type === 'transport' && !route_id) {
      return NextResponse.json(
        { error: 'route_id is required for transport bookings' },
        { status: 400 }
      )
    }

    // Generar referencia única de reserva (aunque no se use en la nueva estructura)
    const bookingReference = generateBookingReference()

    // Verificar disponibilidad antes de crear la reserva
    if (booking_type === 'event' && event_id) {
      const { data: event } = await supabase
        .from('events')
        .select('status')
        .eq('id', event_id)
        .single()

      if (!event || event.status !== 'active') {
        return NextResponse.json(
          { error: 'Event is not available for booking' },
          { status: 400 }
        )
      }
    }

    // Crear la reserva
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        user_id,
        booking_type,
        event_id,
        route_id,
        booking_date: new Date().toISOString(),
        travel_date: travel_date || null,
        departure_time: departure_time || null,
        seat_numbers: seat_numbers || [],
        passenger_info: passenger_info || {},
        total_amount,
        status: 'pending'
      })
      .select(`
        id,
        user_id,
        booking_type,
        event_id,
        route_id,
        booking_date,
        travel_date,
        departure_time,
        seat_numbers,
        passenger_info,
        total_amount,
        status,
        created_at,
        events (
          id,
          title,
          start_date,
          venues (
            name,
            address,
            city
          )
        ),
        transport_routes (
          id,
          origin,
          destination,
          departure_time,
          transport_companies (
            name
          )
        )
      `)
      .single()

    if (error) {
      console.error('Error creating booking:', error)
      return NextResponse.json(
        { error: 'Error creating booking', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Booking created successfully',
      booking
    }, { status: 201 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Función auxiliar para generar referencia de reserva
function generateBookingReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `BK${timestamp}${random}`
}
