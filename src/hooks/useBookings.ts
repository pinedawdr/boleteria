import { useState, useEffect, useCallback } from 'react'
import { Booking } from '@/lib/supabase'

interface UseBookingsOptions {
  userId?: string
  status?: string
  type?: string
  limit?: number
  autoFetch?: boolean
}

interface UseBookingsReturn {
  bookings: Booking[]
  loading: boolean
  error: string | null
  total: number
  page: number
  totalPages: number
  refetch: () => Promise<void>
  createBooking: (bookingData: CreateBookingData) => Promise<Booking | null>
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<boolean>
  cancelBooking: (id: string) => Promise<boolean>
}

interface CreateBookingData {
  user_id: string
  event_id?: string
  transport_route_id?: string
  type: 'event' | 'transport'
  tickets_quantity?: number
  ticket_details?: any
  total_amount: number
  passenger_details?: any
}

export function useBookings(options: UseBookingsOptions = {}): UseBookingsReturn {
  const {
    userId,
    status = 'all',
    type = 'all',
    limit = 20,
    autoFetch = true
  } = options

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(autoFetch)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const fetchBookings = useCallback(async () => {
    if (!userId && autoFetch) return

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: '0'
      })

      if (userId) params.append('userId', userId)
      if (status !== 'all') params.append('status', status)
      if (type !== 'all') params.append('type', type)

      const response = await fetch(`/api/bookings?${params}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error fetching bookings')
      }

      const data = await response.json()
      setBookings(data.bookings || [])
      setTotal(data.total || 0)
      setPage(data.page || 1)
      setTotalPages(data.totalPages || 0)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }, [userId, status, type, limit, autoFetch])

  const createBooking = useCallback(async (bookingData: CreateBookingData): Promise<Booking | null> => {
    try {
      setError(null)

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error creating booking')
      }

      const data = await response.json()
      
      // Actualizar la lista de reservas
      await fetchBookings()
      
      return data.booking

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    }
  }, [fetchBookings])

  const updateBooking = useCallback(async (id: string, updates: Partial<Booking>): Promise<boolean> => {
    try {
      setError(null)

      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error updating booking')
      }

      // Actualizar la lista de reservas
      await fetchBookings()
      return true

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
    }
  }, [fetchBookings])

  const cancelBooking = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null)

      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error cancelling booking')
      }

      // Actualizar la lista de reservas
      await fetchBookings()
      return true

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
    }
  }, [fetchBookings])

  const refetch = useCallback(() => {
    return fetchBookings()
  }, [fetchBookings])

  useEffect(() => {
    if (autoFetch) {
      fetchBookings()
    }
  }, [fetchBookings, autoFetch])

  return {
    bookings,
    loading,
    error,
    total,
    page,
    totalPages,
    refetch,
    createBooking,
    updateBooking,
    cancelBooking
  }
}

// Hook para obtener una reserva específica
export function useBooking(id: string | null) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBooking = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/bookings/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Booking not found')
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error fetching booking')
      }

      const data = await response.json()
      setBooking(data.booking)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setBooking(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchBooking()
  }, [fetchBooking])

  return {
    booking,
    loading,
    error,
    refetch: fetchBooking
  }
}
