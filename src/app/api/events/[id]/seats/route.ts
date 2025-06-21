import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/events/[id]/seats - Obtener asientos de un evento
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const eventId = (await params).id

    if (!eventId) {
      return NextResponse.json(
        { error: 'ID del evento requerido' },
        { status: 400 }
      )
    }

    // Obtener asientos del evento con información del evento
    const { data: eventSeats, error: seatsError } = await supabase
      .from('event_seats')
      .select(`
        id,
        section,
        row_number,
        seat_number,
        price,
        category,
        status,
        event:event_id (
          id,
          title,
          start_date,
          venue:venue_id (
            name,
            address,
            city
          )
        )
      `)
      .eq('event_id', eventId)
      .order('section')
      .order('row_number')
      .order('seat_number')

    if (seatsError) {
      console.error('Error fetching event seats:', seatsError)
      return NextResponse.json(
        { error: 'Error obteniendo asientos del evento' },
        { status: 500 }
      )
    }

    // Verificar que el evento existe
    if (!eventSeats || eventSeats.length === 0) {
      return NextResponse.json(
        { error: 'Evento no encontrado o sin asientos disponibles' },
        { status: 404 }
      )
    }

    // Formatear datos para el frontend
    const formattedSeats = eventSeats.map(seat => ({
      id: seat.id,
      section: seat.section,
      row: seat.row_number,
      number: seat.seat_number,
      price: seat.price,
      status: seat.status,
      category: seat.category || 'general'
    }))

    // Obtener información adicional del evento
    const eventInfo = eventSeats[0].event

    return NextResponse.json({
      success: true,
      event: eventInfo,
      seats: formattedSeats,
      seatsBySection: groupSeatsBySection(formattedSeats)
    })

  } catch (error) {
    console.error('Error in event seats API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/events/[id]/seats - Actualizar estado de asientos
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const eventId = (await params).id
    const body = await request.json()
    const { seatIds, status, userId } = body

    if (!eventId || !seatIds || !status) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      )
    }

    // Validar estado
    const validStatuses = ['available', 'selected', 'occupied', 'reserved']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Estado de asiento inválido' },
        { status: 400 }
      )
    }

    // Actualizar asientos
    const { data: updatedSeats, error: updateError } = await supabase
      .from('event_seats')
      .update({ 
        status,
        ...(userId && { reserved_by: userId }),
        ...(status === 'selected' && { reserved_at: new Date().toISOString() })
      })
      .in('id', seatIds)
      .eq('event_id', eventId)
      .select()

    if (updateError) {
      console.error('Error updating seat status:', updateError)
      return NextResponse.json(
        { error: 'Error actualizando asientos' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      updatedSeats: updatedSeats.length,
      seats: updatedSeats
    })

  } catch (error) {
    console.error('Error updating seat status:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función auxiliar para agrupar asientos por sección
function groupSeatsBySection(seats: any[]) {
  return seats.reduce((acc, seat) => {
    if (!acc[seat.section]) {
      acc[seat.section] = []
    }
    acc[seat.section].push(seat)
    return acc
  }, {} as Record<string, any[]>)
}
