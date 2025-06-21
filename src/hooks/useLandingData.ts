"use client"

import { useState, useEffect } from 'react'

export interface Event {
  id: string
  title: string
  description?: string
  start_date: string
  end_date?: string
  price_from: number
  price_to?: number
  image_url?: string
  category: string
  artist?: string
  status: 'active' | 'cancelled' | 'sold_out'
  event_type?: 'presential' | 'virtual' | 'hybrid'
  requires_seats?: boolean
  rating?: number
  duration?: string
  venues?: {
    id: string
    name: string
    address: string
    city: string
    capacity: number
  }
}

export interface Route {
  id: string
  origin: string
  destination: string
  vehicle_type: string
  company: string
  departure_time: string
  arrival_time?: string
  duration_hours: number
  distance_km: number
  price_range: { min: number; max: number }
  date: string
  image_url?: string
  status: 'active' | 'cancelled' | 'full'
  services?: string[]
}

interface UseDataReturn {
  events: Event[]
  routes: Route[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useLandingData(): UseDataReturn {
  const [events, setEvents] = useState<Event[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch events from API
      const eventsResponse = await fetch('/api/events?limit=6&status=active')
      let eventsData: Event[] = []
      
      if (eventsResponse.ok) {
        const result = await eventsResponse.json()
        eventsData = result.events || []
      }

      // Fetch routes from API
      const routesResponse = await fetch('/api/routes?limit=6&status=active')
      let routesData: Route[] = []
      
      if (routesResponse.ok) {
        const result = await routesResponse.json()
        routesData = result.routes || []
      }

      // Si no hay datos de la API, usar datos de fallback
      if (eventsData.length === 0) {
        eventsData = [
          {
            id: '1',
            title: 'Concierto Rock en Lima',
            start_date: '2025-07-15T20:00:00',
            price_from: 80,
            price_to: 150,
            category: 'concert',
            artist: 'Banda Nacional',
            status: 'active',
            event_type: 'presential',
            rating: 4.5,
            venues: {
              id: 'venue1',
              name: 'Estadio Nacional',
              address: 'Jr. José Díaz 1420',
              city: 'Lima',
              capacity: 45000
            }
          },
          {
            id: '2',
            title: 'Obra de Teatro Clásico',
            start_date: '2025-07-20T19:00:00',
            price_from: 50,
            price_to: 80,
            category: 'theater',
            artist: 'Compañía Nacional',
            status: 'active',
            event_type: 'presential',
            rating: 4.3,
            venues: {
              id: 'venue2',
              name: 'Teatro Municipal',
              address: 'Jr. Ica 377',
              city: 'Lima',
              capacity: 1100
            }
          },
          {
            id: '3',
            title: 'Match Alianza vs Universitario',
            start_date: '2025-07-25T15:30:00',
            price_from: 30,
            price_to: 120,
            category: 'sports',
            status: 'active',
            event_type: 'presential',
            rating: 4.7,
            venues: {
              id: 'venue3',
              name: 'Estadio Alejandro Villanueva',
              address: 'Av. Isabel La Católica',
              city: 'Lima',
              capacity: 35000
            }
          },
          {
            id: '4',
            title: 'Festival Electrónico',
            start_date: '2025-07-30T22:00:00',
            price_from: 120,
            price_to: 200,
            category: 'club',
            artist: 'DJ Internacional',
            status: 'active',
            event_type: 'presential',
            rating: 4.6,
            venues: {
              id: 'venue4',
              name: 'Centro de Convenciones',
              address: 'Av. Aviación',
              city: 'Lima',
              capacity: 5000
            }
          },
          {
            id: '5',
            title: 'Curso: IA y Machine Learning',
            start_date: '2025-08-15T09:00:00',
            price_from: 250,
            category: 'conference',
            artist: 'Academia Tecnológica',
            status: 'active',
            event_type: 'virtual',
            rating: 4.8
          },
          {
            id: '6',
            title: 'Orquesta Sinfónica Nacional',
            start_date: '2025-07-28T19:30:00',
            price_from: 60,
            price_to: 150,
            category: 'concert',
            artist: 'Orquesta Sinfónica',
            status: 'active',
            event_type: 'presential',
            rating: 4.9,
            venues: {
              id: 'venue5',
              name: 'Gran Teatro Nacional',
              address: 'Av. Brasil 2700',
              city: 'Lima',
              capacity: 1400
            }
          }
        ]
      }

      // Si no hay rutas de la API, usar datos de fallback
      if (routesData.length === 0) {
        routesData = [
          {
            id: '1',
            origin: 'Lima',
            destination: 'Cusco',
            vehicle_type: 'bus',
            company: 'Cruz del Sur',
            departure_time: '22:00',
            arrival_time: '14:00',
            duration_hours: 16,
            distance_km: 1200,
            price_range: { min: 80, max: 150 },
            date: '2025-07-15',
            status: 'active',
            services: ['WiFi', 'Asientos Reclinables', 'Entretenimiento']
          },
          {
            id: '2',
            origin: 'Cusco',
            destination: 'Machu Picchu',
            vehicle_type: 'train',
            company: 'PeruRail',
            departure_time: '06:00',
            arrival_time: '08:30',
            duration_hours: 2.5,
            distance_km: 110,
            price_range: { min: 200, max: 400 },
            date: '2025-07-16',
            status: 'active',
            services: ['Vista Panorámica', 'Desayuno Incluido']
          },
          {
            id: '3',
            origin: 'Lima',
            destination: 'Arequipa',
            vehicle_type: 'bus',
            company: 'Oltursa',
            departure_time: '21:30',
            arrival_time: '12:00',
            duration_hours: 14.5,
            distance_km: 1000,
            price_range: { min: 70, max: 120 },
            date: '2025-07-17',
            status: 'active',
            services: ['Aire Acondicionado', 'Entretenimiento', 'Snacks']
          }
        ]
      }

      setEvents(eventsData)
      setRoutes(routesData)

    } catch (err) {
      console.error('Error fetching landing data:', err)
      setError('Error al cargar los datos')
      
      // En caso de error, usar datos de fallback
      setEvents([
        {
          id: '1',
          title: 'Eventos Disponibles',
          start_date: '2025-07-15T20:00:00',
          price_from: 50,
          category: 'concert',
          status: 'active',
          event_type: 'presential',
          rating: 4.5
        }
      ])
      setRoutes([
        {
          id: '1',
          origin: 'Lima',
          destination: 'Cusco',
          vehicle_type: 'bus',
          company: 'Transporte Nacional',
          departure_time: '22:00',
          duration_hours: 16,
          distance_km: 1200,
          price_range: { min: 80, max: 150 },
          date: '2025-07-15',
          status: 'active'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    events,
    routes,
    loading,
    error,
    refetch
  }
}
