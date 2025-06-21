import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/bookings/[id] - Obtener reserva específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        id,
        booking_reference,
        type,
        status,
        total_amount,
        tickets_quantity,
        ticket_details,
        passenger_details,
        booking_date,
        created_at,
        updated_at,
        user_id,
        events (
          id,
          title,
          description,
          start_date,
          end_date,
          image_url,
          artist,
          category,
          venues (
            id,
            name,
            address,
            city,
            capacity
          )
        ),
        transport_routes (
          id,
          origin,
          destination,
          departure_time,
          arrival_time,
          price,
          transport_companies (
            id,
            name,
            phone,
            rating
          )
        ),
        payments (
          id,
          status,
          payment_method,
          amount,
          transaction_id,
          payment_date
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching booking:', error)
      return NextResponse.json(
        { error: 'Error fetching booking', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ booking })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/bookings/[id] - Actualizar estado de reserva
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { status, cancellation_reason } = body

    // Validar estados permitidos
    const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed']
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Allowed: ' + allowedStatuses.join(', ') },
        { status: 400 }
      )
    }

    // Obtener la reserva actual para validaciones
    const { data: currentBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('status, type, event_id, transport_route_id')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Validar transiciones de estado
    if (currentBooking.status === 'cancelled' && status !== 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot change status of cancelled booking' },
        { status: 400 }
      )
    }

    if (currentBooking.status === 'completed' && status !== 'completed') {
      return NextResponse.json(
        { error: 'Cannot change status of completed booking' },
        { status: 400 }
      )
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (status) {
      updateData.status = status
    }

    if (status === 'cancelled' && cancellation_reason) {
      updateData.cancellation_reason = cancellation_reason
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select(`
        id,
        booking_reference,
        type,
        status,
        total_amount,
        tickets_quantity,
        booking_date,
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
      console.error('Error updating booking:', error)
      return NextResponse.json(
        { error: 'Error updating booking', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Booking updated successfully',
      booking
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/bookings/[id] - Cancelar reserva
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Obtener la reserva actual
    const { data: currentBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('status, type')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (currentBooking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Booking is already cancelled' },
        { status: 400 }
      )
    }

    if (currentBooking.status === 'completed') {
      return NextResponse.json(
        { error: 'Cannot cancel completed booking' },
        { status: 400 }
      )
    }

    // Cambiar estado a cancelado en lugar de eliminar
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancellation_reason: 'Cancelled by user',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, booking_reference, status')
      .single()

    if (error) {
      console.error('Error cancelling booking:', error)
      return NextResponse.json(
        { error: 'Error cancelling booking', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Booking cancelled successfully',
      booking
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
