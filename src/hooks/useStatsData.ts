"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Statistics {
  activeUsers: number
  totalEvents: number
  totalDestinations: number
  securityRate: number
  loading: boolean
  error: string | null
}

export function useStatsData(): Statistics {
  const [stats, setStats] = useState<Statistics>({
    activeUsers: 0,
    totalEvents: 0,
    totalDestinations: 0,
    securityRate: 99.9,
    loading: true,
    error: null
  })

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }))

      // Obtener total de usuarios activos (perfiles creados)
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      if (usersError) {
        console.error('Error fetching users count:', usersError)
      }

      // Obtener total de eventos
      const { count: eventsCount, error: eventsError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })

      if (eventsError) {
        console.error('Error fetching events count:', eventsError)
      }

      // Obtener total de destinos únicos (ciudades de venues + rutas de transporte)
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('city')

      const { data: routesData, error: routesError } = await supabase
        .from('transport_routes')
        .select('origin, destination')

      if (venuesError) {
        console.error('Error fetching venues:', venuesError)
      }

      if (routesError) {
        console.error('Error fetching routes:', routesError)
      }

      // Calcular destinos únicos
      const uniqueDestinations = new Set<string>()
      
      if (venuesData) {
        venuesData.forEach(venue => {
          if (venue.city) uniqueDestinations.add(venue.city)
        })
      }

      if (routesData) {
        routesData.forEach(route => {
          if (route.origin) uniqueDestinations.add(route.origin)
          if (route.destination) uniqueDestinations.add(route.destination)
        })
      }

      // Calcular tasa de seguridad basada en transacciones exitosas
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('bookings')
        .select('status')

      let securityRate = 99.9
      if (paymentsData && !paymentsError) {
        const totalBookings = paymentsData.length
        const successfulBookings = paymentsData.filter(
          booking => booking.status === 'confirmed'
        ).length
        
        if (totalBookings > 0) {
          securityRate = Math.round((successfulBookings / totalBookings) * 100 * 10) / 10
        }
      }

      setStats({
        activeUsers: usersCount || 0,
        totalEvents: eventsCount || 0,
        totalDestinations: uniqueDestinations.size || 0,
        securityRate: securityRate,
        loading: false,
        error: null
      })

    } catch (error) {
      console.error('Error fetching statistics:', error)
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar estadísticas'
      }))
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return stats
}
