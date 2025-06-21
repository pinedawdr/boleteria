"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface UpcomingEvent {
  id: string
  name: string
  date: string
  venue: string
  category: string
  start_date: string
}

export interface PopularRoute {
  id: string
  route: string
  duration: string
  price: string
  company: string
  origin: string
  destination: string
  price_from: number
}

interface UseLandingDetailsReturn {
  upcomingEvents: UpcomingEvent[]
  popularRoutes: PopularRoute[]
  loading: boolean
  error: string | null
}

export function useLandingDetails(): UseLandingDetailsReturn {
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([])
  const [popularRoutes, setPopularRoutes] = useState<PopularRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLandingDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      // Obtener eventos próximos (en Lima, próximas 2 semanas)
      const twoWeeksFromNow = new Date()
      twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          id,
          title,
          start_date,
          category,
          venues!inner(name, city)
        `)
        .eq('status', 'active')
        .eq('venues.city', 'Lima')
        .gte('start_date', new Date().toISOString())
        .lte('start_date', twoWeeksFromNow.toISOString())
        .order('start_date', { ascending: true })
        .limit(3)

      if (eventsError) {
        console.error('Error fetching upcoming events:', eventsError)
      }

      // Transformar datos de eventos
      const transformedEvents: UpcomingEvent[] = eventsData?.map(event => {
        const eventDate = new Date(event.start_date)
        const now = new Date()
        const diffTime = eventDate.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        let dateText = ''
        if (diffDays === 0) {
          dateText = 'Hoy'
        } else if (diffDays === 1) {
          dateText = 'Mañana'
        } else if (diffDays <= 7) {
          const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
          dateText = `Este ${days[eventDate.getDay()]}`
        } else if (diffDays <= 14) {
          dateText = 'Próximo fin de semana'
        } else {
          dateText = `En ${diffDays} días`
        }

        return {
          id: event.id,
          name: event.title,
          date: dateText,
          venue: Array.isArray(event.venues) && event.venues.length > 0 
            ? (event.venues[0] as { name: string }).name 
            : 'Venue no disponible',
          category: event.category === 'concert' ? 'Música' : 
                   event.category === 'theater' ? 'Teatro' :
                   event.category === 'sports' ? 'Deportes' : 
                   event.category === 'conference' ? 'Conferencia' : 'Entretenimiento',
          start_date: event.start_date
        }
      }) || []

      // Obtener rutas populares (las 3 con más reservas)
      const { data: routesData, error: routesError } = await supabase
        .from('transport_routes')
        .select(`
          id,
          origin,
          destination,
          duration,
          price_from,
          transport_companies!inner(name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6)

      if (routesError) {
        console.error('Error fetching popular routes:', routesError)
      }

      // Transformar datos de rutas
      const transformedRoutes: PopularRoute[] = routesData?.slice(0, 3).map(route => ({
        id: route.id,
        route: `${route.origin} → ${route.destination}`,
        duration: `${Math.floor(route.duration / 60)} horas`,
        price: `S/ ${route.price_from}`,
        company: Array.isArray(route.transport_companies) && route.transport_companies.length > 0
          ? (route.transport_companies[0] as { name: string }).name
          : 'Empresa no disponible',
        origin: route.origin,
        destination: route.destination,
        price_from: route.price_from
      })) || []

      setUpcomingEvents(transformedEvents)
      setPopularRoutes(transformedRoutes)

    } catch (error) {
      console.error('Error fetching landing details:', error)
      setError('Error al cargar información adicional')
      
      // Datos de fallback si hay error
      setUpcomingEvents([
        { id: '1', name: "Concierto de Cumbia", date: "Este Sábado", venue: "Club Nacional", category: "Música", start_date: new Date().toISOString() },
        { id: '2', name: "Stand Up Comedy", date: "Próximo Miércoles", venue: "Teatro Británico", category: "Comedia", start_date: new Date().toISOString() },
        { id: '3', name: "Festival Gastronómico", date: "Este Fin de Semana", venue: "Parque de la Exposición", category: "Gastronomía", start_date: new Date().toISOString() }
      ])

      setPopularRoutes([
        { id: '1', route: "Lima → Cusco", duration: "22 horas", price: "S/ 120", company: "Cruz del Sur", origin: "Lima", destination: "Cusco", price_from: 120 },
        { id: '2', route: "Lima → Arequipa", duration: "16 horas", price: "S/ 80", company: "Oltursa", origin: "Lima", destination: "Arequipa", price_from: 80 },
        { id: '3', route: "Lima → Trujillo", duration: "8 horas", price: "S/ 60", company: "Tepsa", origin: "Lima", destination: "Trujillo", price_from: 60 }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLandingDetails()
  }, [])

  return {
    upcomingEvents,
    popularRoutes,
    loading,
    error
  }
}
