'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface AnalyticsData {
  period: string
  revenue: number
  bookings: number
  users: number
  events: number
  routes: number
  revenueGrowth: number
  bookingsGrowth: number
  usersGrowth: number
  conversionRate: number
  conversionGrowth: number
}

export interface ChartData {
  name: string
  value: number
  growth: number
}

export interface RevenueChartData extends ChartData {
  month: string
  year: number
}

export interface BookingsByTypeData extends ChartData {
  type: 'events' | 'transport'
  icon: string
}

interface BookingData {
  id: string
  total_amount: number
  booking_type: string
  created_at: string
}

interface UserData {
  id: string
  created_at?: string
}

export function useAnalyticsData(period: string = '30d') {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [revenueChart, setRevenueChart] = useState<RevenueChartData[]>([])
  const [bookingsChart, setBookingsChart] = useState<BookingsByTypeData[]>([])

  const getDaysFromPeriod = (period: string): number => {
    switch (period) {
      case '7d': return 7
      case '30d': return 30
      case '90d': return 90
      case '1y': return 365
      default: return 30
    }
  }

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const days = getDaysFromPeriod(period)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      
      const previousStartDate = new Date()
      previousStartDate.setDate(previousStartDate.getDate() - (days * 2))
      const previousEndDate = new Date()
      previousEndDate.setDate(previousEndDate.getDate() - days)

      // Verificar conexión a Supabase
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      // Función para procesar respuestas de manera segura
      const safeQuery = async <T>(queryPromise: Promise<any>): Promise<T[]> => {
        try {
          const response = await queryPromise
          if (response.error) {
            console.warn('Supabase query error:', response.error)
            return []
          }
          return response.data || []
        } catch (error) {
          console.warn('Query failed:', error)
          return []
        }
      }

      // Ejecutar consultas de manera segura
      const [
        currentBookings,
        previousBookings,
        currentUsers,
        previousUsers,
        eventsData,
        routesData,
        monthlyRevenueData
      ] = await Promise.all([
        // Reservas del período actual
        safeQuery<BookingData>(
          supabase
            .from('bookings')
            .select('id, total_amount, booking_type, created_at')
            .gte('created_at', startDate.toISOString())
            .eq('status', 'confirmed')
        ),
        
        // Reservas del período anterior
        safeQuery<BookingData>(
          supabase
            .from('bookings')
            .select('id, total_amount, booking_type, created_at')
            .gte('created_at', previousStartDate.toISOString())
            .lt('created_at', previousEndDate.toISOString())
            .eq('status', 'confirmed')
        ),
        
        // Usuarios del período actual
        safeQuery<UserData>(
          supabase
            .from('users')
            .select('id, created_at')
            .gte('created_at', startDate.toISOString())
        ),
        
        // Usuarios del período anterior
        safeQuery<UserData>(
          supabase
            .from('users')
            .select('id, created_at')
            .gte('created_at', previousStartDate.toISOString())
            .lt('created_at', previousEndDate.toISOString())
        ),
        
        // Eventos activos
        safeQuery<{id: string}>(
          supabase
            .from('events')
            .select('id')
            .eq('status', 'active')
        ),
        
        // Rutas activas
        safeQuery<{id: string}>(
          supabase
            .from('routes')
            .select('id')
            .eq('status', 'active')
        ),
        
        // Ingresos por mes para el gráfico (últimos 6 meses)
        safeQuery<BookingData>(
          supabase
            .from('bookings')
            .select('total_amount, created_at, booking_type')
            .gte('created_at', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString())
            .eq('status', 'confirmed')
        )
      ])

      // Calcular métricas con manejo seguro de datos
      const totalRevenue = currentBookings.reduce((sum: number, booking: BookingData) => 
        sum + (booking.total_amount || 0), 0)
      const previousRevenue = previousBookings.reduce((sum: number, booking: BookingData) => 
        sum + (booking.total_amount || 0), 0)
      
      const totalBookings = currentBookings.length
      const previousTotalBookings = previousBookings.length
      
      const totalUsers = currentUsers.length
      const previousTotalUsers = previousUsers.length

      // Calcular crecimientos de manera segura
      const revenueGrowth = previousRevenue > 0 ? 
        ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0
      
      const bookingsGrowth = previousTotalBookings > 0 ? 
        ((totalBookings - previousTotalBookings) / previousTotalBookings) * 100 : 0
      
      const usersGrowth = previousTotalUsers > 0 ? 
        ((totalUsers - previousTotalUsers) / previousTotalUsers) * 100 : 0

      // Calcular tasa de conversión (usuarios únicos que hicieron reservas)
      const uniqueUserDates = new Set(
        currentBookings
          .map((booking: BookingData) => booking.created_at?.split('T')[0])
          .filter(Boolean)
      )
      const conversionRate = totalUsers > 0 ? (uniqueUserDates.size / totalUsers) * 100 : 0

      const analytics: AnalyticsData = {
        period,
        revenue: totalRevenue,
        bookings: totalBookings,
        users: totalUsers,
        events: eventsData.length,
        routes: routesData.length,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        bookingsGrowth: Math.round(bookingsGrowth * 100) / 100,
        usersGrowth: Math.round(usersGrowth * 100) / 100,
        conversionRate: Math.round(conversionRate * 100) / 100,
        conversionGrowth: 0 // Simplificado por ahora
      }

      // Preparar datos del gráfico de ingresos
      const monthlyData = new Map<string, { revenue: number; bookings: number }>()
      
      monthlyRevenueData.forEach((booking: BookingData) => {
        const date = new Date(booking.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, { revenue: 0, bookings: 0 })
        }
        
        const current = monthlyData.get(monthKey)!
        current.revenue += booking.total_amount || 0
        current.bookings += 1
      })

      // Convertir a array y ordenar por fecha
      const sortedMonths = Array.from(monthlyData.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6) // Últimos 6 meses

      const revenueChartData: RevenueChartData[] = sortedMonths.map(([monthKey, data], index, array) => {
        const [year, month] = monthKey.split('-').map(Number)
        const monthName = new Date(year, month - 1).toLocaleDateString('es-ES', { month: 'short' })
        
        // Calcular crecimiento comparado con el mes anterior
        let growth = 0
        if (index > 0) {
          const previousRevenue = array[index - 1][1].revenue
          if (previousRevenue > 0) {
            growth = ((data.revenue - previousRevenue) / previousRevenue) * 100
          }
        }
        
        return {
          name: monthName,
          month: monthName,
          year,
          value: data.revenue,
          growth: Math.round(growth * 100) / 100
        }
      })

      // Preparar datos del gráfico de reservas por tipo
      const eventBookings = currentBookings.filter((b: BookingData) => b.booking_type === 'event')
      const transportBookings = currentBookings.filter((b: BookingData) => b.booking_type === 'transport')
      
      const previousEventBookings = previousBookings.filter((b: BookingData) => b.booking_type === 'event')
      const previousTransportBookings = previousBookings.filter((b: BookingData) => b.booking_type === 'transport')

      const eventGrowth = previousEventBookings.length > 0 ? 
        ((eventBookings.length - previousEventBookings.length) / previousEventBookings.length) * 100 : 0
      const transportGrowth = previousTransportBookings.length > 0 ? 
        ((transportBookings.length - previousTransportBookings.length) / previousTransportBookings.length) * 100 : 0

      const bookingsChartData: BookingsByTypeData[] = [
        {
          name: 'Eventos',
          type: 'events',
          icon: '🎪',
          value: eventBookings.length,
          growth: Math.round(eventGrowth * 100) / 100
        },
        {
          name: 'Transporte',
          type: 'transport',
          icon: '🚌',
          value: transportBookings.length,
          growth: Math.round(transportGrowth * 100) / 100
        }
      ]

      setAnalyticsData(analytics)
      setRevenueChart(revenueChartData)
      setBookingsChart(bookingsChartData)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      console.error('Error fetching analytics data:', errorMessage, error)
      setError(`Error al cargar los datos de analytics: ${errorMessage}`)
      
      // Establecer datos por defecto en caso de error
      setAnalyticsData({
        period,
        revenue: 0,
        bookings: 0,
        users: 0,
        events: 0,
        routes: 0,
        revenueGrowth: 0,
        bookingsGrowth: 0,
        usersGrowth: 0,
        conversionRate: 0,
        conversionGrowth: 0
      })
      setRevenueChart([])
      setBookingsChart([])
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchAnalyticsData()
  }, [fetchAnalyticsData])

  return {
    loading,
    error,
    analyticsData,
    revenueChart,
    bookingsChart,
    refetch: fetchAnalyticsData
  }
}
