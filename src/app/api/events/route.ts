import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/events - Obtener todos los eventos con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const status = searchParams.get('status') || 'active'
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
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
        venues (
          id,
          name,
          address,
          city,
          capacity
        )
      `)
      .eq('status', status)
      .order('start_date', { ascending: true })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (city && city !== 'all') {
      query = query.eq('venues.city', city)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%, description.ilike.%${search}%, artist.ilike.%${search}%`)
    }

    const { data: events, error, count } = await query

    if (error) {
      console.error('Error fetching events:', error)
      return NextResponse.json(
        { error: 'Error fetching events', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      events: events || [],
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

// POST /api/events - Crear nuevo evento (admin)
export async function POST(request: NextRequest) {
  try {
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
      age_restriction
    } = body

    // Validaciones básicas
    if (!title || !venue_id || !category || !start_date || !price_from) {
      return NextResponse.json(
        { error: 'Campos requeridos: title, venue_id, category, start_date, price_from' },
        { status: 400 }
      )
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
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
        status: 'active'
      })
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
      console.error('Error creating event:', error)
      return NextResponse.json(
        { error: 'Error creating event', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Event created successfully',
      event
    }, { status: 201 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
