'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useEventSeats } from '@/hooks/useEventSeats'
import { Container } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Share2, 
  Heart,
  Star,
  Users,
  CreditCard,
  X,
  Info,
  ShoppingCart,
  AlertCircle,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

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
  end_date: string
  price_from: number
  price_to: number
  image_url: string
  category: string
  duration: string
  age_restriction: string
  artist: string
  rating: number
  status: string
  event_type?: 'presential' | 'virtual' | 'hybrid'
  platform_url?: string // Para eventos virtuales
  requires_seats?: boolean // Si requiere selección de asientos
}

interface EventDetailPageProps {
  params: Promise<{ id: string }>
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  return <EventDetailClient params={params} />
}

function EventDetailClient({ params }: EventDetailPageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [eventId, setEventId] = useState<string>('')
  const [event, setEvent] = useState<EventDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSeatMap, setShowSeatMap] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  
  // Get the event ID from params
  useEffect(() => {
    params.then(resolved => {
      setEventId(resolved.id)
    })
  }, [params])
  
  // Use the event seats hook
  const {
    seats,
    selectedSeats,
    loading: seatsLoading,
    selectSeat,
    deselectSeat,
    getTotalPrice
  } = useEventSeats(eventId)
  
  // Load event details
  useEffect(() => {
    if (!eventId) return
    
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/events/${eventId}`)
        
        if (!response.ok) {
          throw new Error('Error al cargar el evento')
        }
        
        const data = await response.json()
        setEvent(data.event)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }
    
    fetchEvent()
  }, [eventId])

  const handleSeatClick = async (seatId: string) => {
    const seat = seats.find(s => s.id === seatId)
    if (!seat || seat.status === 'occupied' || seat.status === 'reserved') return

    try {
      if (seat.status === 'selected') {
        await deselectSeat(seatId)
      } else {
        await selectSeat(seatId)
      }
    } catch (error) {
      console.error('Error updating seat:', error)
    }
  }

  const getSeatColor = (seat: { status: string; category: string }) => {
    if (seat.status === 'occupied' || seat.status === 'reserved') return 'bg-red-500 cursor-not-allowed'
    if (seat.status === 'selected') return 'bg-accent cursor-pointer hover:bg-accent/80'
    
    switch (seat.category) {
      case 'vip': return 'bg-purple-500 hover:bg-purple-400 cursor-pointer'
      case 'preferencial': return 'bg-yellow-500 hover:bg-yellow-400 cursor-pointer'
      case 'general': return 'bg-green-500 hover:bg-green-400 cursor-pointer'
      default: return 'bg-gray-400'
    }
  }

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0 || !event) return
    
    // Create URL with booking details for payment page
    const selectedSeatNumbers = selectedSeats.map(seatId => {
      const seat = seats.find(s => s.id === seatId)
      return `${seat?.section}-${seat?.row}-${seat?.number}`
    })
    
    const paymentParams = new URLSearchParams({
      amount: getTotalPrice().toString(),
      type: 'event',
      seats: selectedSeatNumbers.join(','),
      title: event.title,
      event_id: event.id,
      date: new Date(event.start_date).toLocaleDateString(),
      venue: event.venues.name
    })
    
    router.push(`/payment?${paymentParams.toString()}`)
  }

  const handleBookNow = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    // Para eventos virtuales, ir directo al pago
    if (event?.event_type === 'virtual') {
      const paymentParams = new URLSearchParams({
        amount: event?.price_from?.toString() || '0',
        type: 'event',
        title: event?.title || '',
        event_id: event?.id || '',
        date: event ? new Date(event.start_date).toLocaleDateString() : '',
        venue: 'Evento Virtual'
      })
      router.push(`/payment?${paymentParams.toString()}`)
      return
    }

    // Para eventos presenciales, verificar si requiere selección de asientos
    // Si hay seats disponibles en el hook Y el evento no tiene requires_seats=false, mostrar selección
    if (seats.length > 0 && event?.requires_seats !== false) {
      setShowSeatMap(true)
      return
    }

    // Para eventos sin selección de asientos específicos (entrada general)
    const paymentParams = new URLSearchParams({
      amount: event?.price_from?.toString() || '0',
      type: 'event',
      title: event?.title || '',
      event_id: event?.id || '',
      date: event ? new Date(event.start_date).toLocaleDateString() : '',
      venue: event?.venues?.name || '',
      seat_type: 'general'
    })
    router.push(`/payment?${paymentParams.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-body-bg flex items-center justify-center">
        <div className="flex items-center space-x-2 text-text-primary">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <span>Cargando evento...</span>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-body-bg flex items-center justify-center">
        <div className="text-center text-text-primary">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold mb-2">Error al cargar el evento</h2>
          <p className="text-gray-400 mb-4">{error || 'Evento no encontrado'}</p>
          <Button onClick={() => router.push('/events')} variant="secondary">
            Volver a eventos
          </Button>
        </div>
      </div>
    )
  }

  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Función para determinar si mostrar el badge de tipo de evento
  const getEventTypeBadge = () => {
    if (event.event_type === 'virtual') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
          <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
          Evento Virtual
        </span>
      )
    }
    if (event.event_type === 'hybrid') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
          <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
          Híbrido
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent/20 text-accent border border-accent/30">
        <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
        Presencial
      </span>
    )
  }

  if (showSeatMap) {
    return (
      <div className="min-h-screen bg-body-bg">
        <Container className="py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <button 
              onClick={() => setShowSeatMap(false)}
              className="p-2 hover:bg-body-bg rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-text-primary" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Selección de Asientos</h1>
              <p className="text-gray-400 text-sm sm:text-base">{event.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Seat Map */}
            <div className="xl:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-body-bg rounded-lg p-6"
              >
                {/* Stage */}
                <div className="w-full h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg mb-8 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ESCENARIO</span>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 p-3 sm:p-4 bg-body-bg rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded"></div>
                    <span className="text-xs sm:text-sm text-gray-300">General</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded"></div>
                    <span className="text-xs sm:text-sm text-gray-300">Preferencial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded"></div>
                    <span className="text-xs sm:text-sm text-gray-300">VIP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-accent rounded"></div>
                    <span className="text-xs sm:text-sm text-gray-300">Seleccionado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded"></div>
                    <span className="text-xs sm:text-sm text-gray-300">Ocupado</span>
                  </div>
                </div>

                {/* Seats Grid */}
                {seatsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                    <span className="ml-2 text-white">Cargando asientos...</span>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto">
                    <div className="grid gap-2">
                      {Array.from({ length: 20 }, (_, rowIndex) => {
                        const row = rowIndex + 1
                        const rowSeats = seats.filter(seat => parseInt(seat.row) === row)
                        
                        if (rowSeats.length === 0) return null
                        
                        return (
                          <div key={row} className="flex items-center gap-1 sm:gap-2 justify-center">
                            {/* Row Number */}
                            <div className="w-6 sm:w-8 text-center text-gray-400 text-xs sm:text-sm font-semibold">
                              {row}
                            </div>
                            
                            {/* Seats */}
                            <div className="flex gap-0.5 sm:gap-1 flex-wrap justify-center">
                              {rowSeats.map(seat => (
                                <button
                                  key={seat.id}
                                  onClick={() => handleSeatClick(seat.id)}
                                  className={`w-5 h-5 sm:w-6 sm:h-6 text-xs font-bold text-white rounded transition-all duration-200 ${getSeatColor(seat)}`}
                                  disabled={seat.status === 'occupied' || seat.status === 'reserved'}
                                  title={`${seat.section} - Fila ${seat.row}, Asiento ${seat.number} - S/ ${seat.price}`}
                                >
                                  {seat.number}
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>                {/* Booking Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-body-bg rounded-lg p-6 sticky top-8"
              >
                <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-4 sm:mb-6">Resumen</h3>
                
                {/* Event Info */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                    <span className="text-gray-300">{formatDate(event.start_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                    <span className="text-gray-300">{formatTime(event.start_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                    <span className="text-gray-300">{event.venues.name}</span>
                  </div>
                </div>

                {/* Selected Seats */}
                {selectedSeats.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h4 className="text-text-primary font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Asientos Seleccionados</h4>
                    <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                      {selectedSeats.map(seatId => {
                        const seat = seats.find(s => s.id === seatId)
                        return (
                          <div key={seatId} className="flex justify-between items-center py-2 px-2 sm:px-3 bg-body-bg rounded text-xs sm:text-sm">
                            <span className="text-gray-300">
                              {seat?.section} F{seat?.row} A{seat?.number}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-accent font-semibold">S/ {seat?.price}</span>
                              <button
                                onClick={() => handleSeatClick(seatId)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Total */}
                {selectedSeats.length > 0 && (
                  <div className="border-t border-gray-700 pt-3 sm:pt-4 mb-4 sm:mb-6">
                    <div className="flex justify-between items-center text-lg sm:text-xl font-bold">
                      <span className="text-text-primary">Total:</span>
                      <span className="text-accent">S/ {getTotalPrice()}</span>
                    </div>
                  </div>
                )}

                {/* Continue Button */}
                <Button
                  onClick={handleProceedToPayment}
                  disabled={selectedSeats.length === 0}
                  className="w-full bg-accent hover:bg-accent/80 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <CreditCard className="h-4 w-4" />
                  Comprar Entradas ({selectedSeats.length})
                </Button>
              </motion.div>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-body-bg">
      {/* Hero Section */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/20">
          <div className="absolute inset-0 bg-gradient-to-t from-body-bg/80 to-transparent" />
        </div>
        
        {/* Navigation */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
          <Link 
            href="/events"
            className="p-2 hover:bg-body-bg rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-text-primary" />
          </Link>
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 flex gap-3">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 hover:bg-body-bg rounded-lg transition-colors"
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-text-primary'}`} />
          </button>
          <button className="p-2 hover:bg-body-bg rounded-lg transition-colors">
            <Share2 className="h-5 w-5 text-text-primary" />
          </button>
        </div>

        {/* Event Info */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 text-text-primary z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-body-bg text-text-primary rounded-full text-sm font-medium">
                {event.category}
              </span>
              {getEventTypeBadge()}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm">{event.rating}</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
              {event.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-6 text-base sm:text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                <span>{formatDate(event.start_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                <span>{formatTime(event.start_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" />
                <span>
                  {event.event_type === 'virtual' 
                    ? 'Evento Virtual' 
                    : event.venues.name
                  }
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <Container className="py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-body-bg rounded-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-text-primary mb-6">Sobre el Evento</h2>
              <p className="text-gray-300 leading-relaxed mb-6">{event.description}</p>
              
              {/* Información específica del tipo de evento */}
              {event.event_type === 'virtual' && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-300 font-medium">Evento Virtual</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Este evento se realizará de forma virtual. Recibirás el enlace de acceso por email después de completar tu compra.
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
                <div>
                  <div className="text-accent font-bold text-base sm:text-lg">{event.duration}</div>
                  <div className="text-gray-400 text-xs sm:text-sm">Duración</div>
                </div>
                <div>
                  <div className="text-accent font-bold text-base sm:text-lg">{event.age_restriction}</div>
                  <div className="text-gray-400 text-xs sm:text-sm">Edad</div>
                </div>
                <div>
                  <div className="text-accent font-bold text-base sm:text-lg">{event.artist}</div>
                  <div className="text-gray-400 text-xs sm:text-sm">Artista</div>
                </div>
                <div>
                  <div className="text-accent font-bold text-base sm:text-lg">
                    {event.event_type === 'virtual' ? 'Online' : event.venues.name}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">Ubicación</div>
                </div>
              </div>
            </motion.div>

            {/* Venue Information */}
            {event.event_type !== 'virtual' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-body-bg rounded-lg p-8"
              >
                <h2 className="text-2xl font-bold text-text-primary mb-6">Información del Venue</h2>
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-text-primary font-semibold mb-2">{event.venues.name}</h3>
                    <p className="text-gray-300 mb-4">{event.venues.address}, {event.venues.city}</p>
                    <div className="flex items-center gap-2 text-accent">
                      <Info className="h-4 w-4" />
                      <span className="text-sm">Capacidad: {event.venues.capacity} personas</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Booking Panel */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-body-bg rounded-lg p-6 sticky top-8"
            >
              <div className="text-center mb-4 sm:mb-6">
                <div className="text-2xl sm:text-3xl font-bold text-accent mb-2">
                  S/ {event.price_from}
                  {event.price_from !== event.price_to && ` - S/ ${event.price_to}`}
                </div>
                <div className="text-gray-400 text-sm">
                  Precios desde
                </div>
              </div>

              {/* Quick Info */}
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-body-bg rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Fecha:</span>
                  <span className="text-text-primary">{formatDate(event.start_date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Hora:</span>
                  <span className="text-text-primary">{formatTime(event.start_date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Duración:</span>
                  <span className="text-text-primary">{event.duration}</span>
                </div>
                {event.event_type && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Modalidad:</span>
                    <span className="text-text-primary">
                      {event.event_type === 'virtual' ? 'Virtual' : 
                       event.event_type === 'hybrid' ? 'Híbrido' : 'Presencial'}
                    </span>
                  </div>
                )}
              </div>

              {/* Book Button */}
              <Button
                onClick={handleBookNow}
                className="w-full bg-accent hover:bg-accent/80 text-primary flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                {event.event_type === 'virtual' 
                  ? `Comprar Acceso Virtual - S/ ${event.price_from}`
                  : (seats.length > 0 && event.requires_seats !== false)
                    ? 'Seleccionar Asientos' 
                    : `Comprar Entrada General - S/ ${event.price_from}`
                }
              </Button>

              {!user && (
                <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-600/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-yellow-400 font-medium">Inicia sesión para reservar</p>
                      <p className="text-yellow-300">Necesitas una cuenta para completar tu reserva</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>Compra 100% segura</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  )
}
