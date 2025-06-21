'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
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
  Info,
  ShoppingCart,
  AlertCircle,
  Music,
  Mic,
  Trophy,
  PartyPopper,
  GraduationCap,
  Play,
  Wifi
} from 'lucide-react'
import Link from 'next/link'

interface EventDetails {
  id: string
  title: string
  description: string
  venues?: {
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
  amenities?: string[]
}

interface EventDetailPageProps {
  params: Promise<{ id: string }>
}

// Mock data similar to transport
const mockEvent: EventDetails = {
  id: 'e77fb218-ac38-4013-baed-70205c901c46',
  title: 'Concierto de Rock Nacional - Los Saicos',
  description: 'Una noche épica de rock nacional con la legendaria banda Los Saicos. Revive los clásicos que marcaron una generación en un espectáculo único que combina nostalgia y energía pura.',
  venues: {
    id: 'venue1',
    name: 'Estadio Nacional',
    address: 'Jr. José Díaz 1420, Cercado de Lima',
    city: 'Lima',
    capacity: 45000
  },
  start_date: '2024-12-20T20:00:00',
  price_from: 45,
  price_to: 120,
  image_url: '/images/concert-rock.jpg',
  category: 'concert',
  duration: '3 horas',
  artist: 'Los Saicos',
  rating: 4.8,
  event_type: 'presential',
  requires_seats: true,
  amenities: ['Parqueadero', 'Seguridad', 'Baños', 'Cafetería', 'Wi-Fi']
}

const categoryIcons = {
  concert: Music,
  theater: Mic,
  sports: Trophy,
  club: PartyPopper,
  conference: GraduationCap
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
  const [isLiked, setIsLiked] = useState(false)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  
  // Get the event ID from params
  useEffect(() => {
    params.then(resolved => {
      setEventId(resolved.id)
    })
  }, [params])
  
  // Load event details
  useEffect(() => {
    if (!eventId) return
    
    const fetchEvent = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // For now, use mock data - replace with actual API call
        if (eventId === 'e77fb218-ac38-4013-baed-70205c901c46') {
          setEvent(mockEvent)
        } else {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          setEvent({
            ...mockEvent,
            id: eventId,
            title: 'Evento de Ejemplo',
            description: 'Descripción del evento de ejemplo'
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }
    
    fetchEvent()
  }, [eventId])

  const handleBookNow = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    if (!event) return

    // Para eventos virtuales, ir directo al pago
    if (event.event_type === 'virtual') {
      const paymentParams = new URLSearchParams({
        amount: event.price_from.toString(),
        type: 'event',
        title: event.title,
        event_id: event.id,
        date: new Date(event.start_date).toLocaleDateString(),
        venue: 'Evento Virtual'
      })
      router.push(`/payment?${paymentParams.toString()}`)
      return
    }

    // Para eventos presenciales que requieren selección de asientos
    if (event.requires_seats) {
      // Simular ir a selección de asientos
      router.push(`/events/${event.id}/seat-selection`)
      return
    }

    // Para eventos de entrada general
    const paymentParams = new URLSearchParams({
      amount: event.price_from.toString(),
      type: 'event',
      title: event.title,
      event_id: event.id,
      date: new Date(event.start_date).toLocaleDateString(),
      venue: event.venues?.name || '',
      seat_type: 'general'
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

  const getEventIcon = () => {
    if (!event) return Music
    return categoryIcons[event.category as keyof typeof categoryIcons] || Music
  }

  const getEventTypeLabel = () => {
    switch (event?.event_type) {
      case 'virtual':
        return 'Virtual'
      case 'hybrid':
        return 'Híbrido'
      default:
        return 'Presencial'
    }
  }

  const getEventTypeBadge = () => {
    const label = getEventTypeLabel()
    const colorClass = event?.event_type === 'virtual' ? 'bg-blue-500' : 
                     event?.event_type === 'hybrid' ? 'bg-purple-500' : 'bg-accent'
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass} text-black`}>
        {event?.event_type === 'virtual' && <Play className="w-4 h-4 mr-2" />}
        {event?.event_type === 'hybrid' && <Wifi className="w-4 h-4 mr-2" />}
        {event?.event_type === 'presential' && <MapPin className="w-4 h-4 mr-2" />}
        {label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-body-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-muted">Cargando evento...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-body-bg flex items-center justify-center">
        <Container className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-primary mb-2">Error al cargar evento</h1>
          <p className="text-text-secondary mb-6">{error || 'Evento no encontrado'}</p>
          <Button onClick={() => router.back()} variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Container>
      </div>
    )
  }

  const EventIcon = getEventIcon()

  return (
    <main className="min-h-screen bg-body-bg">
      <div className="particles-bg"></div>
      
      {/* Hero Section */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        {/* Background Image */}
        {event.image_url ? (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${event.image_url})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-accent/40 to-primary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-body-bg/90 via-body-bg/50 to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.back()}
            className="bg-body-bg/80 backdrop-blur-sm border-border-color"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
            className="bg-body-bg/80 backdrop-blur-sm border-border-color"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-body-bg/80 backdrop-blur-sm border-border-color"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Event Info */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 text-text-primary z-10">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="px-3 py-1 bg-body-bg/80 backdrop-blur-sm text-text-primary rounded-full text-sm font-medium border border-border-color">
                  {event.category}
                </span>
                {getEventTypeBadge()}
                <div className="flex items-center gap-1 bg-body-bg/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border-color">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{event.rating || 4.5}</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
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
                      : event.venues?.name
                    }
                  </span>
                </div>
              </div>
            </motion.div>
          </Container>
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
              className="card-default p-6 sm:p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-text-primary mb-6">Sobre el Evento</h2>
              <p className="text-text-secondary leading-relaxed mb-6">{event.description}</p>
              
              {/* Event Type Info */}
              {event.event_type === 'virtual' && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-300 font-medium">Evento Virtual</span>
                  </div>
                  <p className="text-text-secondary text-sm">
                    Este evento se realizará de forma virtual. Recibirás el enlace de acceso por email después de completar tu compra.
                  </p>
                </div>
              )}

              {/* Artist Info */}
              {event.artist && (
                <div className="border-t border-border-color pt-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-4">Artista</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                      <EventIcon className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{event.artist}</h4>
                      <p className="text-text-secondary text-sm">Artista principal</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Venue Info */}
              {event.venues && event.event_type !== 'virtual' && (
                <div className="border-t border-border-color pt-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-4">Ubicación</h3>
                  <div className="space-y-2">
                    <p className="font-medium text-text-primary">{event.venues.name}</p>
                    <p className="text-text-secondary">{event.venues.address}</p>
                    <p className="text-text-secondary">{event.venues.city}</p>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <Users className="w-4 h-4" />
                      <span>Capacidad: {event.venues.capacity.toLocaleString()} personas</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Amenities */}
              {event.amenities && event.amenities.length > 0 && (
                <div className="border-t border-border-color pt-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-4">Comodidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-default p-6 sticky top-8"
            >
              <div className="text-center mb-6">
                <div className="text-2xl sm:text-3xl font-bold text-accent mb-2">
                  S/ {event.price_from}
                  {event.price_to && event.price_to !== event.price_from && ` - S/ ${event.price_to}`}
                </div>
                <div className="text-text-secondary text-sm">
                  {event.event_type === 'virtual' ? 'Acceso completo' : 'Precios desde'}
                </div>
              </div>

              {/* Quick Info */}
              <div className="space-y-3 mb-6 p-4 bg-body-bg rounded-lg border border-border-color">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Fecha:</span>
                  <span className="text-text-primary">{formatDate(event.start_date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Hora:</span>
                  <span className="text-text-primary">{formatTime(event.start_date)}</span>
                </div>
                {event.duration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Duración:</span>
                    <span className="text-text-primary">{event.duration}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Modalidad:</span>
                  <span className="text-text-primary">{getEventTypeLabel()}</span>
                </div>
              </div>

              {/* Book Button */}
              <Button
                onClick={handleBookNow}
                className="w-full bg-accent hover:bg-accent/80 text-primary flex items-center justify-center gap-2 mb-4"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5" />
                {event.event_type === 'virtual' 
                  ? `Comprar Acceso Virtual - S/ ${event.price_from}`
                  : event.requires_seats
                    ? 'Seleccionar Asientos' 
                    : `Comprar Entrada General - S/ ${event.price_from}`
                }
              </Button>

              {!user && (
                <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-600/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-yellow-400 font-medium">Inicia sesión para reservar</p>
                      <p className="text-yellow-300">Necesitas una cuenta para completar tu reserva</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border-color">
                <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
                  <CreditCard className="w-4 h-4" />
                  <span>Compra 100% segura</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </main>
  )
}
