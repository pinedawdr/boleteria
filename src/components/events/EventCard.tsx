import { memo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Clock, Calendar, User, ArrowRight, Music, GraduationCap, Trophy, PartyPopper, Mic } from 'lucide-react'
import { useUltraLazyLoading } from '@/hooks/useScrollOptimizations'

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

interface EventCardProps {
  event: EventDetails
  index: number
}

const categoryIcons = {
  'concert': Music,
  'concierto': Music,
  'music': Music,
  'teatro': Mic,
  'theater': Mic,
  'theatre': Mic,
  'sports': Trophy,
  'deportes': Trophy,
  'deporte': Trophy,
  'club': PartyPopper,
  'fiesta': PartyPopper,
  'party': PartyPopper,
  'conference': GraduationCap,
  'education': GraduationCap,
  'educativo': GraduationCap,
  'curso': GraduationCap,
  'educacion': GraduationCap
}

const getEventIcon = (category: string) => {
  const normalizedCategory = category?.toLowerCase() || ''
  console.log('🎯 Event category:', normalizedCategory, '| Event Icon:', categoryIcons[normalizedCategory as keyof typeof categoryIcons]?.name || 'Music (default)')
  return categoryIcons[normalizedCategory as keyof typeof categoryIcons] || Music
}

// Componente de tarjeta memoizado para evitar re-renders innecesarios
export const EventCard = memo<EventCardProps>(({ event, index }) => {
  const { targetRef, isVisible } = useUltraLazyLoading(0.1)
  const [imageError, setImageError] = useState(false)
  const EventIcon = getEventIcon(event.category)

  const hasValidImage = event.image_url && event.image_url.trim() !== '' && !imageError
  
  console.log('🖼️ Event:', event.title, '| Has Image:', !!event.image_url, '| Image Error:', imageError, '| Will Show Icon:', !hasValidImage)

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-PE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
  }

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEventTypeLabel = () => {
    switch (event.event_type) {
      case 'virtual':
        return 'Virtual'
      case 'hybrid':
        return 'Híbrido'
      default:
        return 'Presencial'
    }
  }

  const getEventTypeColor = () => {
    switch (event.event_type) {
      case 'virtual':
        return 'bg-blue-500'
      case 'hybrid':
        return 'bg-purple-500'
      default:
        return 'bg-accent'
    }
  }

  return (
    <div ref={targetRef as React.RefObject<HTMLDivElement>} className="w-full h-full">
      {isVisible ? (
        <Link 
          href={`/events/${event.id}`}
          className="block w-full h-full group"
        >
          <div 
            className="card-event cursor-pointer h-full flex flex-col transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.02]"
            style={{ 
              animationDelay: `${Math.min(index * 0.02, 0.15)}s`,
              contain: 'layout style paint',
              willChange: 'transform'
            }}
          >
            {/* Event Image */}
            <div className="relative h-40 bg-body-bg rounded-lg mb-3 flex-shrink-0 border border-border-color overflow-hidden">
              {hasValidImage ? (
                <Image 
                  src={event.image_url} 
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={() => {
                    console.log('Image failed to load:', event.image_url)
                    setImageError(true)
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface to-card-hover">
                  <EventIcon className="w-16 h-16 text-accent opacity-90" />
                </div>
              )}
              
              {/* Event Type Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 ${getEventTypeColor()} text-black text-xs rounded-full capitalize font-semibold`}>
                  {getEventTypeLabel()}
                </span>
              </div>
              
              {/* Rating Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-body-bg px-2 py-1 rounded-full border border-border-color">
                <Star className="icon-xs text-accent fill-current" />
                <span className="text-text-primary text-xs font-medium">{event.rating || 4.5}</span>
              </div>
            </div>

            <div className="flex flex-col flex-grow">
              {/* Event Title */}
              <h3 className="text-text-primary font-semibold text-base mb-2 line-clamp-2 min-h-[3rem]">
                {event.title}
              </h3>
              
              {/* Artist/Organizer */}
              {event.artist && (
                <div className="flex items-center gap-2 text-sm mb-2">
                  <User className="icon-xs text-accent" />
                  <span className="text-text-secondary line-clamp-1">{event.artist}</span>
                </div>
              )}

              {/* Date and Time */}
              <div className="flex items-center gap-2 text-sm mb-3">
                <Calendar className="icon-xs text-accent" />
                <span className="text-text-primary font-medium">{formatEventDate(event.start_date)}</span>
                <span className="text-text-secondary">•</span>
                <span className="text-text-primary font-medium">{formatEventTime(event.start_date)}</span>
              </div>

              {/* Location/Venue */}
              <div className="flex items-center gap-2 text-sm mb-3">
                <MapPin className="icon-xs text-accent" />
                <span className="text-text-secondary line-clamp-1">
                  {event.event_type === 'virtual' 
                    ? 'Evento Virtual' 
                    : event.venues?.name || 'Ubicación por confirmar'
                  }
                </span>
              </div>

              {/* Duration */}
              {event.duration && (
                <div className="flex items-center gap-2 text-sm mb-3">
                  <Clock className="icon-xs text-accent" />
                  <span className="text-text-secondary">{event.duration}</span>
                </div>
              )}

              {/* Price */}
              <div className="flex justify-between items-center mb-3">
                <div className="text-accent font-bold text-lg">
                  S/ {event.price_from}
                  {event.price_to && event.price_to !== event.price_from && (
                    <span className="text-sm text-text-muted"> - S/ {event.price_to}</span>
                  )}
                </div>
                <div className="text-text-secondary text-xs">
                  {event.event_type === 'virtual' ? 'Acceso completo' : 'Desde'}
                </div>
              </div>

              {/* Category Badge */}
              <div className="mb-auto">
                <span className="px-2 py-1 bg-body-bg border border-border-color text-text-primary text-xs rounded capitalize font-medium inline-block">
                  {event.category}
                </span>
              </div>

              {/* Action Button */}
              <div className="mt-3 pt-3 border-t border-border-color">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Ver detalles</span>
                  <ArrowRight className="icon-sm text-accent group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div className="card-event h-64 bg-body-bg border border-border-color rounded-lg animate-pulse"></div>
      )}
    </div>
  )
})

EventCard.displayName = 'EventCard'

export default EventCard
