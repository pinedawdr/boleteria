import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/admin/stats - Obtener estadísticas del dashboard (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // días
    
    // TODO: Implementar autenticación y verificar permisos de admin
    // const user = await getCurrentUser(request)
    // if (!user || !hasAdminPermissions(user)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const periodDays = parseInt(period)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - periodDays)
    const startDateStr = startDate.toISOString()

    // Obtener estadísticas básicas
    const [
      totalUsers,
      totalEvents,
      totalBookings,
      totalRevenue,
      activeEvents,
      pendingBookings,
      recentBookings
    ] = await Promise.all([
      // Total de usuarios
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true }),

      // Total de eventos
      supabase
        .from('events')
        .select('*', { count: 'exact', head: true }),

      // Total de reservas en el período
      supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDateStr),

      // Ingresos totales en el período
      supabase
        .from('bookings')
        .select('total_amount')
        .eq('status', 'confirmed')
        .gte('created_at', startDateStr),

      // Eventos activos
      supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),

      // Reservas pendientes
      supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),

      // Reservas recientes (últimas 10)
      supabase
        .from('bookings')
        .select(`
          id,
          booking_reference,
          type,
          status,
          total_amount,
          created_at,
          events (
            title
          ),
          transport_routes (
            origin,
            destination
          ),
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10)
    ])

    // Calcular ingresos totales
    const revenue = totalRevenue.data?.reduce((sum, booking) => 
      sum + (booking.total_amount || 0), 0) || 0

    // Obtener estadísticas por categoría de eventos
    const { data: eventsByCategory } = await supabase
      .from('events')
      .select('category')
      .eq('status', 'active')

    const categoryStats = eventsByCategory?.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Obtener reservas por día (últimos 30 días)
    const { data: dailyBookings } = await supabase
      .from('bookings')
      .select('created_at, total_amount')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true })

    // Agrupar por día
    const dailyStats = dailyBookings?.reduce((acc, booking) => {
      const date = booking.created_at.split('T')[0]
      if (!acc[date]) {
        acc[date] = { bookings: 0, revenue: 0 }
      }
      acc[date].bookings += 1
      acc[date].revenue += booking.total_amount || 0
      return acc
    }, {} as Record<string, { bookings: number; revenue: number }>) || {}

    // Obtener top eventos por reservas
    const { data: topEvents } = await supabase
      .from('events')
      .select(`
        id,
        title,
        image_url,
        start_date,
        bookings!inner (
          id
        )
      `)
      .eq('status', 'active')
      .limit(5)

    const stats = {
      overview: {
        totalUsers: totalUsers.count || 0,
        totalEvents: totalEvents.count || 0,
        totalBookings: totalBookings.count || 0,
        totalRevenue: revenue,
        activeEvents: activeEvents.count || 0,
        pendingBookings: pendingBookings.count || 0
      },
      categoryStats,
      dailyStats,
      recentBookings: recentBookings.data || [],
      topEvents: topEvents || [],
      period: periodDays
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
