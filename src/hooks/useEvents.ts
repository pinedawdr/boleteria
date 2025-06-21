import { useState, useEffect, useCallback } from 'react'
import { Event } from '@/lib/supabase'

interface UseEventsOptions {
  category?: string
  city?: string
  status?: string
  search?: string
  limit?: number
  autoFetch?: boolean
}

interface UseEventsReturn {
  events: Event[]
  loading: boolean
  error: string | null
  total: number
  page: number
  totalPages: number
  refetch: () => Promise<void>
  fetchMore: () => Promise<void>
  hasMore: boolean
}

export function useEvents(options: UseEventsOptions = {}): UseEventsReturn {
  const {
    category = 'all',
    city = 'all',
    status = 'active',
    search = '',
    limit = 20,
    autoFetch = true
  } = options

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(autoFetch)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const fetchEvents = useCallback(async (offset = 0, append = false) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        status
      })

      if (category !== 'all') params.append('category', category)
      if (city !== 'all') params.append('city', city)
      if (search) params.append('search', search)

      const response = await fetch(`/api/events?${params}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error fetching events')
      }

      const data = await response.json()

      if (append) {
        setEvents(prev => [...prev, ...(data.events || [])])
      } else {
        setEvents(data.events || [])
      }

      setTotal(data.total || 0)
      setPage(data.page || 1)
      setTotalPages(data.totalPages || 0)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      if (!append) {
        setEvents([])
      }
    } finally {
      setLoading(false)
    }
  }, [category, city, status, search, limit])

  const refetch = useCallback(() => {
    setPage(1)
    return fetchEvents(0, false)
  }, [fetchEvents])

  const fetchMore = useCallback(async () => {
    if (page >= totalPages) return
    const newOffset = page * limit
    await fetchEvents(newOffset, true)
    setPage(prev => prev + 1)
  }, [fetchEvents, page, totalPages, limit])

  const hasMore = page < totalPages

  useEffect(() => {
    if (autoFetch) {
      refetch()
    }
  }, [autoFetch, refetch])

  return {
    events,
    loading,
    error,
    total,
    page,
    totalPages,
    refetch,
    fetchMore,
    hasMore
  }
}

// Hook para obtener un evento específico
export function useEvent(id: string | null) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEvent = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/events/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Event not found')
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error fetching event')
      }

      const data = await response.json()
      setEvent(data.event)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setEvent(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])

  return {
    event,
    loading,
    error,
    refetch: fetchEvent
  }
}
