'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layout'
import { 
  ArrowLeft, 
  X,
  MapPin,
  Clock,
  Calendar,
  CreditCard,
  Music,
  Mic,
  Trophy,
  PartyPopper,
  GraduationCap
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import PeruvianEventSeatMap from '@/components/PeruvianEventSeatMap'

interface Seat {
  id: string
  number: string
  section: string
  type: 'general' | 'premium' | 'vip'
  status: 'available' | 'occupied' | 'selected'
  price: number
  position: { row: number; col: number }
}

interface EventDetails {
  id: string
  title: string
  description: string
  venues: {
    id: string
    name: string
    address: string
    city: string
    capacity: number
  }
  start_date: string
  price_from: number
  price_to?: number
  image_url?: string
  category: string
  duration?: string
  artist?: string
  rating?: number
  event_type?: 'presential' | 'virtual' | 'hybrid'
  requires_seats?: boolean
}

interface EventSeatSelectionPageProps {
  params: Promise<{ id: string }>
}

// Mock event details based on ID
const getEventDetails = (eventId: string): EventDetails => {
  const baseEvent = {
    description: 'Un evento increíble que no te puedes perder',
    venues: {
      id: 'venue1',
      name: 'Estadio Nacional',
      address: 'Jr. José Díaz 1420, Cercado de Lima',
      city: 'Lima',
      capacity: 45000
    },
    start_date: '2024-12-20T20:00:00',
    image_url: '/images/concert-rock.jpg',
    duration: '3 horas',
    rating: 4.8,
    event_type: 'presential' as const,
    requires_seats: true
  }

  switch (eventId) {
    case '1':
      return {
        ...baseEvent,
        id: '1',
        title: 'Concierto de Rock Nacional - Los Saicos',
        category: 'concert',
        artist: 'Los Saicos',
        price_from: 45,
        price_to: 120
      }
    case '2':
      return {
        ...baseEvent,
        id: '2',
        title: 'Obra de Teatro: Romeo y Julieta',
        category: 'theater',
        artist: 'Compañía Nacional',
        price_from: 30,
        price_to: 80,
        venues: {
          ...baseEvent.venues,
          name: 'Teatro Municipal',
          capacity: 1200
        }
      }
    case '4':
      return {
        ...baseEvent,
        id: '4',
        title: 'Partido Universitario vs Alianza',
        category: 'sports',
        price_from: 20,
        price_to: 150,
        venues: {
          ...baseEvent.venues,
          name: 'Estadio Monumental',
          capacity: 80000
        }
      }
    default:
      return {
        ...baseEvent,
        id: eventId,
        title: 'Evento con Asientos Asignados',
        category: 'concert',
        price_from: 45,
        price_to: 120
      }
  }
}

// Generate mock seats based on event type
const generateEventSeats = (eventCategory: string): Seat[] => {
  const seats: Seat[] = []
  
  if (eventCategory === 'theater') {
    // Teatro: Filas A-M, asientos 1-20
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    
    rows.forEach((rowLetter, rowIndex) => {
      for (let seatNum = 1; seatNum <= 20; seatNum++) {
        const seatId = `${rowLetter}${seatNum}`
        let type: 'general' | 'premium' | 'vip' = 'general'
        let price = 30
        
        // Primeras 3 filas = VIP
        if (rowIndex < 3) {
          type = 'vip'
          price = 80
        }
        // Filas 4-7 = Premium
        else if (rowIndex < 7) {
          type = 'premium'
          price = 55
        }
        
        seats.push({
          id: seatId,
          number: seatId,
          section: rowIndex < 7 ? 'Platea' : 'General',
          type,
          status: Math.random() > 0.75 ? 'occupied' : 'available',
          price,
          position: { row: rowIndex + 1, col: seatNum }
        })
      }
    })
  } else if (eventCategory === 'sports') {
    // Estadio: Diferentes secciones
    const sections = [
      { name: 'Tribuna Norte', rows: 15, seatsPerRow: 25, basePrice: 20 },
      { name: 'Tribuna Sur', rows: 15, seatsPerRow: 25, basePrice: 20 },
      { name: 'Oriente Premium', rows: 10, seatsPerRow: 20, basePrice: 80 },
      { name: 'Occidente VIP', rows: 8, seatsPerRow: 15, basePrice: 150 }
    ]
    
    sections.forEach(section => {
      for (let row = 1; row <= section.rows; row++) {
        for (let seat = 1; seat <= section.seatsPerRow; seat++) {
          const seatId = `${section.name.charAt(0)}${row}-${seat}`
          let type: 'general' | 'premium' | 'vip' = 'general'
          
          if (section.basePrice >= 150) type = 'vip'
          else if (section.basePrice >= 80) type = 'premium'
          
          seats.push({
            id: seatId,
            number: `${row}-${seat}`,
            section: section.name,
            type,
            status: Math.random() > 0.7 ? 'occupied' : 'available',
            price: section.basePrice,
            position: { row, col: seat }
          })
        }
      }
    })
  } else {
    // Concierto: Layout estándar
    const zones = [
      { name: 'Zona VIP', rows: 5, seatsPerRow: 20, basePrice: 120 },
      { name: 'Zona Premium', rows: 10, seatsPerRow: 25, basePrice: 75 },
      { name: 'Zona General', rows: 20, seatsPerRow: 30, basePrice: 45 }
    ]
    
    zones.forEach(zone => {
      for (let row = 1; row <= zone.rows; row++) {
        for (let seat = 1; seat <= zone.seatsPerRow; seat++) {
          const seatId = `${zone.name.charAt(5)}${row}-${seat}`
          let type: 'general' | 'premium' | 'vip' = 'general'
          
          if (zone.basePrice >= 120) type = 'vip'
          else if (zone.basePrice >= 75) type = 'premium'
          
          seats.push({
            id: seatId,
            number: `${row}-${seat}`,
            section: zone.name,
            type,
            status: Math.random() > 0.8 ? 'occupied' : 'available',
            price: zone.basePrice,
            position: { row, col: seat }
          })
        }
      }
    })
  }
  
  return seats.slice(0, Math.min(seats.length, 200)) // Limitar para performance
}

const categoryIcons = {
  'concert': Music,
  'theater': Mic,
  'sports': Trophy,
  'club': PartyPopper,
  'conference': GraduationCap
}

export default function EventSeatSelectionPage({ params }: EventSeatSelectionPageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [eventId, setEventId] = useState<string>('')
  const [event, setEvent] = useState<EventDetails | null>(null)
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getEventId = async () => {
      const resolvedParams = await params
      setEventId(resolvedParams.id)
    }
    getEventId()
  }, [params])

  useEffect(() => {
    if (!eventId) return

    const fetchEventAndSeats = async () => {
      try {
        setLoading(true)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const eventDetails = getEventDetails(eventId)
        setEvent(eventDetails)
        
        const eventSeats = generateEventSeats(eventDetails.category)
        setSeats(eventSeats)
      } catch (error) {
        console.error('Error loading event details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEventAndSeats()
  }, [eventId])

  // Note: No auto-redirect to login - let users select seats first

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId)
    if (!seat || seat.status === 'occupied') return

    if (selectedSeats.includes(seatId)) {
      // Deselect seat
      setSelectedSeats(prev => prev.filter(id => id !== seatId))
      setSeats(prev => prev.map(s => 
        s.id === seatId ? { ...s, status: 'available' } : s
      ))
    } else {
      // Select seat
      setSelectedSeats(prev => [...prev, seatId])
      setSeats(prev => prev.map(s => 
        s.id === seatId ? { ...s, status: 'selected' } : s
      ))
    }
  }

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId)
      return total + (seat?.price || 0)
    }, 0)
  }

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) return

    // Check authentication only when proceeding to payment
    if (!user) {
      // Save selection in localStorage before redirecting to login
      localStorage.setItem('pendingSelection', JSON.stringify({
        eventId: event?.id,
        seats: selectedSeats,
        returnUrl: `/events/${event?.id}/seat-selection`
      }))
      router.push('/auth/login')
      return
    }

    const selectedSeatDetails = selectedSeats.map(seatId => {
      const seat = seats.find(s => s.id === seatId)
      return `${seat?.section}-${seat?.number}`
    })

    const paymentParams = new URLSearchParams({
      amount: getTotalPrice().toString(),
      type: 'event',
      seats: selectedSeatDetails.join(','),
      title: event?.title || '',
      event_id: event?.id || '',
      date: event ? new Date(event.start_date).toLocaleDateString() : '',
      venue: event?.venues?.name || ''
    })

    router.push(`/payment?${paymentParams.toString()}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-body-bg">
        <Container className="py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-text-primary">Cargando asientos disponibles...</p>
            </div>
          </div>
        </Container>
      </main>
    )
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-body-bg">
        <Container className="py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-text-primary mb-2">Evento no encontrado</h1>
            <button 
              onClick={() => router.back()}
              className="text-accent hover:underline"
            >
              Volver atrás
            </button>
          </div>
        </Container>
      </main>
    )
  }

  const EventIcon = categoryIcons[event.category as keyof typeof categoryIcons] || Music

  return (
    <main className="min-h-screen bg-body-bg">
      <div className="particles-bg"></div>
      
      <Container className="relative z-10 py-8">
        {/* Header Mejorado */}
        <div className="flex items-center gap-6 mb-10">
          <button
            onClick={() => router.back()}
            className="p-3 hover:bg-card-hover rounded-xl transition-colors shadow-sm bg-card-bg border border-border-color flex items-center gap-3"
          >
            <ArrowLeft className="w-6 h-6 text-text-primary" />
            <span className="text-text-primary font-medium hidden sm:block">Volver al evento</span>
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <EventIcon className="w-8 h-8 text-accent" />
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Selección de Asientos</h1>
            </div>
            <div className="text-lg md:text-xl text-text-secondary font-medium">
              {event.title}
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.venues.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.start_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatTime(event.start_date)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Selection - Enhanced */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-default p-8 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl border border-accent/20">
                <div className="p-3 bg-accent/20 rounded-full">
                  <EventIcon className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">Mapa de Asientos</h2>
                  <p className="text-text-secondary">Selecciona hasta 8 asientos para tu grupo</p>
                </div>
              </div>

              {/* Legend Mejorada */}
              <div className="flex flex-wrap gap-6 mb-10 p-6 bg-gradient-to-r from-body-bg to-card-bg rounded-xl border border-border-color shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-lg shadow-sm border-2 border-white/30"></div>
                  <span className="text-base font-medium text-text-primary">General</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-lg shadow-sm border-2 border-white/30"></div>
                  <span className="text-base font-medium text-text-primary">Premium</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-lg shadow-sm border-2 border-white/30"></div>
                  <span className="text-base font-medium text-text-primary">VIP</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-accent rounded-lg shadow-sm border-2 border-white/30"></div>
                  <span className="text-base font-medium text-text-primary">Seleccionado</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-lg shadow-sm border-2 border-white/30"></div>
                  <span className="text-base font-medium text-text-primary">Ocupado</span>
                </div>
              </div>

              {/* Enhanced Seat Map with Peruvian Venues */}
              <PeruvianEventSeatMap
                eventId={eventId}
                venueLayout={{
                  id: event.venues.id,
                  name: event.venues.name,
                  capacity: event.venues.capacity,
                  city: event.venues.city,
                  sections: [
                    {
                      id: 'platea',
                      name: 'Platea',
                      rows: 12,
                      seats_per_row: 20,
                      base_price: event.price_from,
                      view_quality: 'excelente',
                      position: { x: 0, y: 0 }
                    },
                    {
                      id: 'mezzanine',
                      name: 'Mezzanine',
                      rows: 8,
                      seats_per_row: 24,
                      base_price: Math.round(event.price_from * 1.5),
                      view_quality: 'buena',
                      position: { x: 0, y: 12 }
                    },
                    {
                      id: 'balcon',
                      name: 'Balcón',
                      rows: 6,
                      seats_per_row: 28,
                      base_price: Math.round(event.price_from * 2),
                      view_quality: 'excelente',
                      position: { x: 0, y: 20 }
                    }
                  ]
                }}
                onSeatSelect={(selectedSeats) => {
                  setSelectedSeats(selectedSeats.map(s => s.id))
                }}
                maxSeats={8}
              />
            </motion.div>
          </div>

          {/* Booking Summary - Enhanced */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-default p-8 sticky top-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-text-primary mb-8 border-b border-border-color pb-4">
                Resumen de tu reserva
              </h3>
              
              {/* Event Details - Enhanced */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4 p-4 bg-body-bg rounded-lg border border-border-color">
                  <div className="p-2 bg-accent/20 rounded-full">
                    <EventIcon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-text-primary text-lg mb-1">{event.title}</h4>
                    {event.artist && (
                      <p className="text-text-secondary text-base">{event.artist}</p>
                    )}
                    <div className="mt-2 text-sm text-text-muted">
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-body-bg rounded-lg border border-border-color">
                    <MapPin className="w-5 h-5 text-accent" />
                    <div>
                      <div className="text-text-primary font-semibold">{event.venues.name}</div>
                      <div className="text-text-secondary text-sm">{event.venues.city}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-body-bg rounded-lg border border-border-color">
                    <Calendar className="w-5 h-5 text-accent" />
                    <div>
                      <div className="text-text-primary font-semibold">{formatDate(event.start_date)}</div>
                      <div className="text-text-secondary text-sm">Fecha del evento</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-body-bg rounded-lg border border-border-color">
                    <Clock className="w-5 h-5 text-accent" />
                    <div>
                      <div className="text-text-primary font-semibold">{formatTime(event.start_date)}</div>
                      <div className="text-text-secondary text-sm">Hora de inicio</div>
                    </div>
                  </div>
              
              {/* Selected Seats - Enhanced */}
              {selectedSeats.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-text-primary font-semibold mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 bg-accent rounded-full"></span>
                    Asientos seleccionados
                  </h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {selectedSeats.map(seatId => {
                      const seat = seats.find(s => s.id === seatId)
                      return (
                        <div key={seatId} className="flex justify-between items-center py-3 px-4 bg-accent/5 rounded-lg border border-accent/20 hover:bg-accent/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white text-sm font-bold">
                              {seat?.number}
                            </div>
                            <div>
                              <div className="text-text-primary font-medium">{seat?.section}</div>
                              <div className="text-text-secondary text-sm">{seat?.type.charAt(0).toUpperCase() + seat?.type.slice(1)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-accent font-bold text-lg">S/ {seat?.price}</span>
                            <button
                              onClick={() => handleSeatClick(seatId)}
                              className="p-1 hover:bg-danger/10 text-danger hover:text-danger/80 rounded-full transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Total - Enhanced */}
              <div className="border-t border-border-color pt-6 mb-8">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20">
                  <div>
                    <span className="text-text-secondary text-sm">Total a pagar</span>
                    <div className="text-text-muted text-xs">({selectedSeats.length} asiento{selectedSeats.length !== 1 ? 's' : ''})</div>
                  </div>
                  <span className="text-3xl font-bold text-accent">S/ {getTotalPrice()}</span>
                </div>
              </div>

              {/* Action Button - Enhanced */}
              <button
                onClick={handleProceedToPayment}
                disabled={selectedSeats.length === 0}
                className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                  selectedSeats.length > 0
                    ? 'bg-accent hover:bg-accent/80 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                <CreditCard className="w-6 h-6" />
                {selectedSeats.length > 0 ? 'Proceder al Pago' : 'Selecciona tus asientos'}
              </button>

              {selectedSeats.length > 0 && (
                <p className="text-xs text-text-muted text-center mt-3">
                  Los asientos se reservarán por 15 minutos
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </Container>
    </main>
  )
}
