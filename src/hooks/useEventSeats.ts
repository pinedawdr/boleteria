import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'

export interface EventSeat {
  id: string
  section: string
  row: string
  number: string
  price: number
  status: 'available' | 'occupied' | 'selected' | 'reserved'
  category: 'general' | 'preferencial' | 'vip' | 'platea'
}

export interface EventInfo {
  id: string
  title: string
  start_date: string
  venue: {
    name: string
    address: string
    city: string
  }
}

interface UseEventSeatsReturn {
  event: EventInfo | null
  seats: EventSeat[]
  selectedSeats: string[]
  loading: boolean
  error: string | null
  selectSeat: (seatId: string) => Promise<void>
  deselectSeat: (seatId: string) => Promise<void>
  clearSelection: () => Promise<void>
  getTotalPrice: () => number
  getSelectedSeatsInfo: () => EventSeat[]
  refreshSeats: () => Promise<void>
}

export function useEventSeats(eventId: string): UseEventSeatsReturn {
  const { user } = useAuth()
  const [event, setEvent] = useState<EventInfo | null>(null)
  const [seats, setSeats] = useState<EventSeat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar asientos del evento
  const loadSeats = useCallback(async () => {
    if (!eventId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/events/${eventId}/seats`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Error cargando asientos')
      }

      setEvent(data.event)
      setSeats(data.seats || [])
      
      // Limpiar selección anterior si los asientos han cambiado
      setSelectedSeats([])

    } catch (err) {
      console.error('Error loading seats:', err)
      setError(err instanceof Error ? err.message : 'Error cargando asientos')
    } finally {
      setLoading(false)
    }
  }, [eventId])

  // Actualizar estado de asientos en la base de datos
  const updateSeatStatus = useCallback(async (seatIds: string[], status: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/seats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seatIds,
          status,
          userId: user?.id
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Error actualizando asientos')
      }

      return data.seats
    } catch (err) {
      console.error('Error updating seat status:', err)
      throw err
    }
  }, [eventId, user?.id])

  // Seleccionar un asiento
  const selectSeat = useCallback(async (seatId: string) => {
    const seat = seats.find(s => s.id === seatId)
    
    if (!seat || seat.status === 'occupied' || seat.status === 'reserved') {
      return
    }

    try {
      // Actualizar en el servidor
      await updateSeatStatus([seatId], 'selected')
      
      // Actualizar estado local
      setSeats(prevSeats => 
        prevSeats.map(s => 
          s.id === seatId 
            ? { ...s, status: 'selected' as const }
            : s
        )
      )
      
      setSelectedSeats(prev => [...prev, seatId])
    } catch (error) {
      console.error('Error selecting seat:', error)
      setError('Error seleccionando asiento')
    }
  }, [seats, updateSeatStatus])

  // Deseleccionar un asiento
  const deselectSeat = useCallback(async (seatId: string) => {
    try {
      // Actualizar en el servidor
      await updateSeatStatus([seatId], 'available')
      
      // Actualizar estado local
      setSeats(prevSeats => 
        prevSeats.map(s => 
          s.id === seatId 
            ? { ...s, status: 'available' as const }
            : s
        )
      )
      
      setSelectedSeats(prev => prev.filter(id => id !== seatId))
    } catch (error) {
      console.error('Error deselecting seat:', error)
      setError('Error deseleccionando asiento')
    }
  }, [updateSeatStatus])

  // Limpiar toda la selección
  const clearSelection = useCallback(async () => {
    if (selectedSeats.length === 0) return

    try {
      // Actualizar en el servidor
      await updateSeatStatus(selectedSeats, 'available')
      
      // Actualizar estado local
      setSeats(prevSeats => 
        prevSeats.map(s => 
          selectedSeats.includes(s.id)
            ? { ...s, status: 'available' as const }
            : s
        )
      )
      
      setSelectedSeats([])
    } catch (error) {
      console.error('Error clearing selection:', error)
      setError('Error limpiando selección')
    }
  }, [selectedSeats, updateSeatStatus])

  // Calcular precio total
  const getTotalPrice = useCallback(() => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId)
      return total + (seat?.price || 0)
    }, 0)
  }, [selectedSeats, seats])

  // Obtener información de asientos seleccionados
  const getSelectedSeatsInfo = useCallback(() => {
    return seats.filter(seat => selectedSeats.includes(seat.id))
  }, [seats, selectedSeats])

  // Refrescar asientos
  const refreshSeats = useCallback(async () => {
    await loadSeats()
  }, [loadSeats])

  // Cargar asientos al montar el componente
  useEffect(() => {
    loadSeats()
  }, [loadSeats])

  // Limpiar selección cuando el usuario cambia o se desmonta el componente
  useEffect(() => {
    return () => {
      if (selectedSeats.length > 0) {
        // Cleanup en caso de que el usuario salga sin confirmar
        clearSelection()
      }
    }
  }, [])

  return {
    event,
    seats,
    selectedSeats,
    loading,
    error,
    selectSeat,
    deselectSeat,
    clearSelection,
    getTotalPrice,
    getSelectedSeatsInfo,
    refreshSeats
  }
}
