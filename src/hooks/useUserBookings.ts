"use client"

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface UserBooking {
  id: string
  booking_type: 'event' | 'transport'
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded'
  created_at: string
  total_amount: number
  // Campos específicos para eventos
  event?: {
    title: string
    start_date: string
    venues?: {
      name: string
    }
  }
  // Campos específicos para transporte
  route?: {
    origin: string
    destination: string
    departure_time: string
    transport_companies?: {
      name: string
    }
  }
}

interface UseUserBookingsReturn {
  bookings: UserBooking[]
  recentBookings: UserBooking[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useUserBookings(): UseUserBookingsReturn {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<UserBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserBookings = useCallback(async () => {
    if (!user) {
      setBookings([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_type,
          status,
          created_at,
          total_amount,
          event_id,
          route_id,
          events!inner(
            title,
            start_date,
            venues!inner(name)
          ),
          transport_routes!inner(
            origin,
            destination,
            departure_time,
            transport_companies!inner(name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (bookingsError) {
        console.error('Error fetching user bookings:', bookingsError)
        setError('Error al cargar las reservas')
        return
      }

      // Transformar los datos
      const transformedBookings: UserBooking[] = bookingsData?.map(booking => {
        const transformed: UserBooking = {
          id: booking.id,
          booking_type: booking.booking_type,
          status: booking.status,
          created_at: booking.created_at,
          total_amount: booking.total_amount
        }

        if (booking.booking_type === 'event' && booking.events) {
          const eventData = Array.isArray(booking.events) ? booking.events[0] : booking.events
          transformed.event = {
            title: eventData?.title || 'Evento sin título',
            start_date: eventData?.start_date || '',
            venues: eventData?.venues ? {
              name: Array.isArray(eventData.venues) 
                ? (eventData.venues[0] as { name?: string })?.name || 'Venue no disponible'
                : (eventData.venues as { name?: string })?.name || 'Venue no disponible'
            } : undefined
          }
        }

        if (booking.booking_type === 'transport' && booking.transport_routes) {
          const routeData = Array.isArray(booking.transport_routes) ? booking.transport_routes[0] : booking.transport_routes
          transformed.route = {
            origin: routeData?.origin || '',
            destination: routeData?.destination || '',
            departure_time: routeData?.departure_time || '',
            transport_companies: routeData?.transport_companies ? {
              name: Array.isArray(routeData.transport_companies)
                ? (routeData.transport_companies[0] as { name?: string })?.name || 'Empresa no disponible'
                : (routeData.transport_companies as { name?: string })?.name || 'Empresa no disponible'
            } : undefined
          }
        }

        return transformed
      }) || []

      setBookings(transformedBookings)

    } catch (error) {
      console.error('Error fetching user bookings:', error)
      setError('Error al cargar las reservas')
      
      // Datos de fallback para desarrollo
      setBookings([
        {
          id: '1',
          booking_type: 'event',
          status: 'confirmed',
          created_at: new Date().toISOString(),
          total_amount: 150,
          event: {
            title: 'Concierto de Gian Marco',
            start_date: '2025-07-15T20:00:00Z',
            venues: { name: 'Teatro Nacional' }
          }
        },
        {
          id: '2',
          booking_type: 'transport',
          status: 'pending',
          created_at: new Date().toISOString(),
          total_amount: 120,
          route: {
            origin: 'Lima',
            destination: 'Cusco',
            departure_time: '2025-07-20T08:00:00Z',
            transport_companies: { name: 'Cruz del Sur' }
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }, [user]) // useCallback dependency

  useEffect(() => {
    fetchUserBookings()
  }, [fetchUserBookings]) // Ahora fetchUserBookings es estable

  const recentBookings = bookings.slice(0, 2)

  return {
    bookings,
    recentBookings,
    loading,
    error,
    refetch: fetchUserBookings
  }
}
