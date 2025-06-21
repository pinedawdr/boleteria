'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout'
import { EventCard } from '@/components/events/EventCard'
import { 
  Music, 
  Mic, 
  Trophy, 
  PartyPopper,
  GraduationCap,
  Filter,
  Search,
  ArrowRight
} from 'lucide-react'

interface EventDetails {
  id: string
  title: string
  artist?: string
  venues?: {
    name: string
    city: string
  }
  start_date: string
  price_from: number
  price_to?: number
  category: string
  rating?: number
  image_url?: string
  duration?: string
  event_type?: 'presential' | 'virtual' | 'hybrid'
}

// Mock data mientras se conecta con la API real
const mockEvents: EventDetails[] = [
  {
    id: '1',
    title: 'Concierto de Rock Nacional',
    artist: 'Los Saicos',
    venues: { name: 'Estadio Nacional', city: 'Lima' },
    start_date: '2024-12-20T20:00:00',
    price_from: 45,
    price_to: 120,
    category: 'concert',
    rating: 4.8,
    image_url: '/images/concert-rock.jpg',
    duration: '3 horas',
    event_type: 'presential'
  },
  {
    id: '2',
    title: 'Obra de Teatro: Romeo y Julieta',
    artist: 'Compañía Nacional',
    venues: { name: 'Teatro Municipal', city: 'Lima' },
    start_date: '2024-12-15T19:00:00',
    price_from: 30,
    price_to: 80,
    category: 'theater',
    rating: 4.6,
    image_url: '/images/theater-romeo.jpg',
    duration: '2.5 horas',
    event_type: 'presential'
  },
  {
    id: '3',
    title: 'Conferencia de Tecnología 2024',
    artist: 'TechPeru',
    venues: { name: 'Centro de Convenciones', city: 'Lima' },
    start_date: '2024-12-18T09:00:00',
    price_from: 25,
    price_to: 60,
    category: 'conference',
    rating: 4.7,
    duration: '8 horas',
    event_type: 'hybrid'
  },
  {
    id: '4',
    title: 'Partido Universitario vs Alianza',
    venues: { name: 'Estadio Monumental', city: 'Lima' },
    start_date: '2024-12-22T15:30:00',
    price_from: 20,
    price_to: 150,
    category: 'sports',
    rating: 4.5,
    duration: '2 horas',
    event_type: 'presential'
  },
  {
    id: '5',
    title: 'Fiesta Electronica NYE',
    artist: 'DJ internacional',
    venues: { name: 'Club Exodus', city: 'Lima' },
    start_date: '2024-12-31T22:00:00',
    price_from: 50,
    price_to: 100,
    category: 'club',
    rating: 4.4,
    duration: '6 horas',
    event_type: 'presential'
  },
  {
    id: '6',
    title: 'Webinar: Marketing Digital',
    artist: 'Academia Online',
    start_date: '2024-12-16T14:00:00',
    price_from: 15,
    category: 'conference',
    rating: 4.3,
    duration: '2 horas',
    event_type: 'virtual'
  }
// Mock data mientras se conecta con la API real
const mockEvents: EventDetails[] = [
  const searchParams = useSearchParams()
  const [events] = useState<EventDetails[]>(mockEvents)
  const [filteredEvents, setFilteredEvents] = useState<EventDetails[]>(mockEvents)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [eventTypeFilter, setEventTypeFilter] = useState('')
  const [priceFilter, setPriceFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Initialize from URL parameters
  useEffect(() => {
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    if (category) {
      // Map homepage categories to event categories
      const categoryMap: Record<string, string> = {
        'conciertos': 'concert',
        'teatro': 'theater',
        'deportes': 'sports',
        'fiestas': 'club',
        'educativo': 'conference'
      }
      setCategoryFilter(categoryMap[category] || category)
    }
    
    if (search) {
      setSearchTerm(decodeURIComponent(search))
    }
  }, [searchParams])

  useEffect(() => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venues?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venues?.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter(event => event.category === categoryFilter)
    }

    if (cityFilter) {
      filtered = filtered.filter(event => 
        event.venues?.city === cityFilter || 
        (cityFilter === 'virtual' && event.event_type === 'virtual')
      )
    }

    if (eventTypeFilter) {
      filtered = filtered.filter(event => event.event_type === eventTypeFilter)
    }

    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number)
      filtered = filtered.filter(event => {
        if (max) {
          return event.price_from >= min && event.price_from <= max
        } else {
          return event.price_from >= min
        }
      })
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, categoryFilter, cityFilter, eventTypeFilter, priceFilter])

  return (
    <main className="min-h-screen bg-body-bg">
      <div className="particles-bg"></div>
      
      <Container className="relative z-10 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center text-text-muted text-sm mb-6">
          <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
          <ArrowRight className="icon-xs mx-2" />
          <span className="text-text-primary">Eventos</span>
        </div>

        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-2">
            Descubre Eventos Increíbles
          </h1>
          <p className="text-text-secondary text-sm md:text-base lg:text-lg max-w-2xl">
            Encuentra la experiencia perfecta para ti entre miles de eventos en todo el Perú
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card-default mb-6 md:mb-8 p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-sm text-text-muted" />
              <input
                type="text"
                placeholder="Buscar eventos, artistas, venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-search w-full"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<Filter className="icon-sm" />}
              size="sm"
            >
              Filtros
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border-color animate-fadeIn">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-default"
              >
                <option value="">Todas las categorías</option>
                <option value="concert">Conciertos</option>
                <option value="theater">Teatro</option>
                <option value="sports">Deportes</option>
                <option value="club">Fiestas</option>
                <option value="conference">Conferencias</option>
              </select>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="input-default"
              >
                <option value="">Todas las ciudades</option>
                <option value="Lima">Lima</option>
                <option value="Cusco">Cusco</option>
                <option value="Arequipa">Arequipa</option>
                <option value="virtual">Virtual</option>
              </select>

              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="input-default"
              >
                <option value="">Tipo de evento</option>
                <option value="presential">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="hybrid">Híbrido</option>
              </select>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="input-default"
              >
                <option value="">Rango de precio</option>
                <option value="0-25">S/ 0 - 25</option>
                <option value="25-50">S/ 25 - 50</option>
                <option value="50-100">S/ 50 - 100</option>
                <option value="100">S/ 100+</option>
              </select>
            </div>
          )}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No se encontraron eventos
              </h3>
              <p className="text-text-secondary">
                Intenta cambiar los filtros de búsqueda
              </p>
            </div>
          ) : (
            filteredEvents.map((event, index) => (
              <EventCard 
                key={event.id} 
                event={event} 
                index={index}
              />
            ))
          )}
        </div>

        {/* Load More Button - Placeholder for pagination */}
        {filteredEvents.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="secondary" size="lg">
              Cargar más eventos
            </Button>
          </div>
        )}
      </Container>
    </main>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div>Cargando eventos...</div>}>
      <EventsPageContent />
    </Suspense>
  )
}
