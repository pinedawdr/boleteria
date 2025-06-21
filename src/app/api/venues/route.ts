import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/venues - Obtener todos los venues
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('id, name, address, city, capacity')
      .order('name')

    if (error) {
      console.error('Error fetching venues:', error)
      return NextResponse.json(
        { error: 'Error al obtener venues' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      venues: data || [],
      total: data?.length || 0
    })
  } catch (error) {
    console.error('Error in venues API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
