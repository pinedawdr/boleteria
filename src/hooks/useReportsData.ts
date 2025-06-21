'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface SalesData {
  period: string
  events: number
  transport: number
  total: number
}

export interface TopEvent {
  id: string
  name: string
  category: string
  revenue: number
  tickets: number
  growth: number
}

export interface TopRoute {
  id: string
  origin: string
  destination: string
  company: string
  revenue: number
  bookings: number
  rating: number
}

export interface CategoryData {
  category: string
  revenue: number
  percentage: number
  color: string
}

export interface ReportsData {
  totalRevenue: number
  eventsRevenue: number
  transportRevenue: number
  avgMonthlyGrowth: number
  salesData: SalesData[]
  topEvents: TopEvent[]
  topRoutes: TopRoute[]
  categoryData: CategoryData[]
}

export function useReportsData(timeRange: string = 'Últimos 30 días') {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reportsData, setReportsData] = useState<ReportsData | null>(null)

  const getDaysFromTimeRange = (range: string): number => {
    switch (range) {
      case 'Últimos 7 días': return 7
      case 'Últimos 30 días': return 30
      case 'Últimos 3 meses': return 90
      case 'Último año': return 365
      default: return 30
    }
  }

  const getMonthsFromTimeRange = (range: string): number => {
    switch (range) {
      case 'Últimos 7 días': return 1
      case 'Últimos 30 días': return 6
      case 'Últimos 3 meses': return 6
      case 'Último año': return 12
      default: return 6
    }
  }

  const fetchReportsData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const days = getDaysFromTimeRange(timeRange)
      const months = getMonthsFromTimeRange(timeRange)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Obtener datos de ventas por mes
      const salesStartDate = new Date()
      salesStartDate.setMonth(salesStartDate.getMonth() - months)

      const [
        bookingsResponse,
        eventsResponse,
        routesResponse,
        companiesResponse,
        salesByMonthResponse
      ] = await Promise.all([
        // Reservas del período
        supabase
          .from('bookings')
          .select('id, total_amount, booking_type, created_at, event_id, route_id')
          .gte('created_at', startDate.toISOString())
          .eq('status', 'confirmed'),
        
        // Eventos para obtener detalles
        supabase
          .from('events')
          .select('id, title, category, ticket_price'),
        
        // Rutas para obtener detalles
        supabase
          .from('routes')
          .select('id, origin, destination, company_id, price'),
        
        // Compañías
        supabase
          .from('companies')
          .select('id, name'),
        
        // Ventas por mes para el gráfico
        supabase
          .from('bookings')
          .select('total_amount, booking_type, created_at, event_id, route_id')
          .gte('created_at', salesStartDate.toISOString())
          .eq('status', 'confirmed')
      ])

      // Verificar errores
      if (bookingsResponse.error) throw bookingsResponse.error
      if (eventsResponse.error) throw eventsResponse.error
      if (routesResponse.error) throw routesResponse.error
      if (companiesResponse.error) throw companiesResponse.error
      if (salesByMonthResponse.error) throw salesByMonthResponse.error

      const bookings = bookingsResponse.data || []
      const events = eventsResponse.data || []
      const routes = routesResponse.data || []
      const companies = companiesResponse.data || []
      const salesByMonth = salesByMonthResponse.data || []

      // Crear mapas para lookups rápidos
      const eventsMap = new Map(events.map(event => [event.id, event]))
      const routesMap = new Map(routes.map(route => [route.id, route]))
      const companiesMap = new Map(companies.map(company => [company.id, company]))

      // Procesar datos de ventas mensuales
      const monthlyData = new Map<string, { events: number; transport: number }>()
      
      salesByMonth.forEach(booking => {
        const date = new Date(booking.created_at)
        const monthKey = date.toLocaleDateString('es-ES', { month: 'short' })
        
        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, { events: 0, transport: 0 })
        }
        
        const current = monthlyData.get(monthKey)!
        const amount = booking.total_amount || 0
        
        if (booking.booking_type === 'event') {
          current.events += amount
        } else if (booking.booking_type === 'transport') {
          current.transport += amount
        }
      })

      // Convertir a array y ordenar
      const sortedMonths = Array.from(monthlyData.entries())
        .sort(([a], [b]) => {
          const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
          return months.indexOf(a.toLowerCase()) - months.indexOf(b.toLowerCase())
        })
        .slice(-6) // Últimos 6 meses

      const salesData: SalesData[] = sortedMonths.map(([period, data]) => ({
        period,
        events: data.events,
        transport: data.transport,
        total: data.events + data.transport
      }))

      // Calcular ingresos totales
      const eventBookings = bookings.filter(b => b.booking_type === 'event')
      const transportBookings = bookings.filter(b => b.booking_type === 'transport')
      
      const eventsRevenue = eventBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)
      const transportRevenue = transportBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)
      const totalRevenue = eventsRevenue + transportRevenue

      // Procesar top eventos
      const eventStats = new Map<string, { revenue: number; tickets: number }>()
      
      eventBookings.forEach(booking => {
        const eventId = booking.event_id
        if (!eventId) return
        
        if (!eventStats.has(eventId)) {
          eventStats.set(eventId, { revenue: 0, tickets: 0 })
        }
        
        const stats = eventStats.get(eventId)!
        stats.revenue += booking.total_amount || 0
        stats.tickets += 1
      })

      const topEvents: TopEvent[] = Array.from(eventStats.entries())
        .map(([eventId, stats]) => {
          const event = eventsMap.get(eventId)
          return {
            id: eventId,
            name: event?.title || 'Evento sin nombre',
            category: event?.category || 'Sin categoría',
            revenue: stats.revenue,
            tickets: stats.tickets,
            growth: 0 // Se puede calcular con datos históricos
          }
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 4)

      // Procesar top rutas
      const routeStats = new Map<string, { revenue: number; bookings: number }>()
      
      transportBookings.forEach(booking => {
        const routeId = booking.route_id
        if (!routeId) return
        
        if (!routeStats.has(routeId)) {
          routeStats.set(routeId, { revenue: 0, bookings: 0 })
        }
        
        const stats = routeStats.get(routeId)!
        stats.revenue += booking.total_amount || 0
        stats.bookings += 1
      })

      const topRoutes: TopRoute[] = Array.from(routeStats.entries())
        .map(([routeId, stats]) => {
          const route = routesMap.get(routeId)
          const company = route?.company_id ? companiesMap.get(route.company_id) : null
          return {
            id: routeId,
            origin: route?.origin || 'Origen',
            destination: route?.destination || 'Destino',
            company: company?.name || 'Compañía',
            revenue: stats.revenue,
            bookings: stats.bookings,
            rating: 4.2 // Valor fijo consistente
          }
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 4)

      // Procesar datos por categoría
      const categoryStats = new Map<string, number>()
      
      eventBookings.forEach(booking => {
        const event = eventsMap.get(booking.event_id || '')
        const category = event?.category || 'Sin categoría'
        
        if (!categoryStats.has(category)) {
          categoryStats.set(category, 0)
        }
        
        categoryStats.set(category, categoryStats.get(category)! + (booking.total_amount || 0))
      })

      // Agregar transporte como categoría
      if (transportRevenue > 0) {
        categoryStats.set('Transporte', transportRevenue)
      }

      const totalCategoryRevenue = Array.from(categoryStats.values()).reduce((sum, rev) => sum + rev, 0)
      
      const colors = [
        'bg-purple-500',
        'bg-blue-500', 
        'bg-green-500',
        'bg-yellow-500',
        'bg-red-500',
        'bg-indigo-500',
        'bg-pink-500'
      ]

      const categoryData: CategoryData[] = Array.from(categoryStats.entries())
        .map(([category, revenue], index) => ({
          category,
          revenue,
          percentage: totalCategoryRevenue > 0 ? Math.round((revenue / totalCategoryRevenue) * 100) : 0,
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      // Calcular crecimiento promedio mensual (simulado por ahora)
      const avgMonthlyGrowth = salesData.length > 1 ? 
        ((salesData[salesData.length - 1]?.total || 0) - (salesData[0]?.total || 0)) / (salesData[0]?.total || 1) * 100 :
        0

      const reports: ReportsData = {
        totalRevenue,
        eventsRevenue,
        transportRevenue,
        avgMonthlyGrowth: Math.round(avgMonthlyGrowth * 100) / 100,
        salesData,
        topEvents,
        topRoutes,
        categoryData
      }

      setReportsData(reports)

    } catch (error) {
      console.error('Error fetching reports data:', error)
      setError('Error al cargar los datos de reportes. Por favor, inténtelo de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchReportsData()
  }, [fetchReportsData])

  return {
    loading,
    error,
    reportsData,
    refetch: fetchReportsData
  }
}
