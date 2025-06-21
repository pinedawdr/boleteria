import { memo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react'
import { useUltraLazyLoading } from '@/hooks/useScrollOptimizations'

interface TransportRoute {
  id: string
  origin: string
  destination: string
  vehicle_type: 'bus' | 'boat' | 'train'
  duration: number
  price_from: number
  price_to: number
  departure_times: string[]
  company: string
  rating: number
  image_url: string
  amenities: string[]
}

interface RouteCardProps {
  route: TransportRoute
  index: number
  VehicleIcon: React.ComponentType<{ className?: string }>
}

// Componente de tarjeta memoizado para evitar re-renders innecesarios
export const RouteCard = memo<RouteCardProps>(({ route, index, VehicleIcon }) => {
  const { targetRef, isVisible } = useUltraLazyLoading(0.1)
  const [imageError, setImageError] = useState(false)
  
  const hasValidImage = route.image_url && route.image_url.trim() !== '' && !imageError
  
  console.log('🚌 Route:', `${route.origin} → ${route.destination}`, '| Has Image:', !!route.image_url, '| Image Error:', imageError, '| Will Show Icon:', !hasValidImage)

  return (
    <div ref={targetRef as React.RefObject<HTMLDivElement>} className="w-full h-full">
      {isVisible ? (
        <Link 
          href={`/transport/seat-selection?route=${route.id}&origin=${route.origin}&destination=${route.destination}&company=${route.company}&date=2024-12-15&time=21:00`}
          className="block w-full h-full group"
        >
          <div 
            className="card-transport cursor-pointer h-full flex flex-col transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.02]"
            style={{ 
              animationDelay: `${Math.min(index * 0.02, 0.15)}s`,
              contain: 'layout style paint',
              willChange: 'transform'
            }}
          >
            {/* Route Image - Información esencial */}
            <div className="relative h-40 bg-body-bg rounded-lg mb-3 flex-shrink-0 border border-border-color overflow-hidden">
              {hasValidImage ? (
                <Image 
                  src={route.image_url} 
                  alt={`${route.origin} - ${route.destination}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={() => {
                    console.log('Route image failed to load:', route.image_url)
                    setImageError(true)
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface to-card-hover">
                  <VehicleIcon className="w-16 h-16 text-accent opacity-90" />
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-accent text-black text-xs rounded-full capitalize font-semibold">
                  {route.vehicle_type}
                </span>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-body-bg px-2 py-1 rounded-full border border-border-color">
                <Star className="icon-xs text-accent fill-current" />
                <span className="text-text-primary text-xs font-medium">{route.rating}</span>
              </div>
            </div>

            <div className="flex flex-col flex-grow">
              {/* Company */}
              <h3 className="text-text-primary font-semibold text-base mb-2 line-clamp-1">
                {route.company}
              </h3>
              
              {/* Route - Información esencial */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="icon-xs text-accent" />
                  <span className="text-text-primary font-medium">{route.origin}</span>
                </div>
                <ArrowRight className="icon-xs text-accent" />
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-text-primary font-medium">{route.destination}</span>
                  <MapPin className="icon-xs text-accent" />
                </div>
              </div>

              {/* Precio y duración - Layout compacto */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1 text-text-secondary">
                  <Clock className="icon-xs text-accent" />
                  <span className="text-sm">{route.duration}h</span>
                </div>
                <div className="text-accent font-bold text-base">
                  S/ {route.price_from}
                </div>
              </div>

              {/* Horario principal */}
              <div className="mb-auto">
                <div className="text-text-secondary text-xs mb-1">Próximo:</div>
                <div className="px-2 py-1 bg-body-bg border border-border-color text-text-primary text-sm rounded font-medium inline-block">
                  {route.departure_times[0]}
                </div>
              </div>

              {/* Button compacto */}
              <div className="mt-3 pt-3 border-t border-border-color">
                <div className="btn-primary w-full text-center py-2 text-sm">
                  Seleccionar
                </div>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        // Skeleton optimizado
        <div className="card-transport h-full flex flex-col animate-pulse">
          <div className="h-40 bg-body-bg rounded-lg mb-3"></div>
          <div className="flex flex-col flex-grow space-y-2">
            <div className="h-4 bg-body-bg rounded w-3/4"></div>
            <div className="h-3 bg-body-bg rounded w-1/2"></div>
            <div className="h-3 bg-body-bg rounded w-2/3"></div>
            <div className="h-6 bg-body-bg rounded mt-auto"></div>
          </div>
        </div>
      )}
    </div>
  )
})

RouteCard.displayName = 'RouteCard'
