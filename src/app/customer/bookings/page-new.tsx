'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useBookings } from '@/hooks/useBookings'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  Filter,
  Search,
  ChevronDown,
  Eye,
  Download,
  RotateCcw,
  Ticket,
  Bus,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock3,
  ArrowRight,
  Music,
  QrCode
} from 'lucide-react'

const statusConfig = {
  pending: {
    label: 'Pendiente',
    icon: Clock3,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/20'
  },
  confirmed: {
    label: 'Confirmada',
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/20'
  },
  cancelled: {
    label: 'Cancelada',
    icon: XCircle,
    color: 'text-danger',
    bgColor: 'bg-danger/10',
    borderColor: 'border-danger/20'
  },
  refunded: {
    label: 'Reembolsada',
    icon: RotateCcw,
    color: 'text-info',
    bgColor: 'bg-info/10',
    borderColor: 'border-info/20'
  }
} as const

export default function CustomerBookingsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'refunded'>('all')
  const [selectedType, setSelectedType] = useState<'all' | 'event' | 'transport'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    bookings,
    loading,
    error,
    total,
    hasMore,
    fetchMore,
    refetch
  } = useBookings({
    userId: user?.id,
    status: selectedStatus,
    type: selectedType,
    limit: 10
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [authLoading, user, router])

  const handleStatusChange = (status: typeof selectedStatus) => {
    setSelectedStatus(status)
  }

  const handleTypeChange = (type: typeof selectedType) => {
    setSelectedType(type)
  }

  const filteredBookings = bookings.filter(booking => {
    if (!searchQuery) return true
    
    const searchLower = searchQuery.toLowerCase()
    const eventTitle = booking.events?.[0]?.title?.toLowerCase() || ''
    const routeInfo = booking.transport_routes?.[0] ? 
      `${booking.transport_routes[0].origin} ${booking.transport_routes[0].destination}`.toLowerCase() : ''
    
    return eventTitle.includes(searchLower) || routeInfo.includes(searchLower) || booking.id.toLowerCase().includes(searchLower)
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-body-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-body-bg pt-20">
      {/* Header */}
      <div className="bg-body-bg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <Ticket className="w-7 h-7 text-accent" />
                Mis Reservas
              </h1>
              <p className="text-text-secondary mt-1">
                Gestiona todas tus reservas de eventos y transporte
              </p>
            </div>
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Volver
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-body-bg/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por evento, destino o ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-input-bg border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text-primary"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value as typeof selectedStatus)}
                className="px-4 py-3 bg-input-bg border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text-primary min-w-[140px]"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmada</option>
                <option value="cancelled">Cancelada</option>
                <option value="refunded">Reembolsada</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value as typeof selectedType)}
                className="px-4 py-3 bg-input-bg border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text-primary min-w-[140px]"
              >
                <option value="all">Todos los tipos</option>
                <option value="event">Eventos</option>
                <option value="transport">Transporte</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-body-bg rounded-lg p-6">
                <div className="flex gap-4">
                  <div className="w-48 h-32 bg-border rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-border rounded w-1/3"></div>
                    <div className="h-4 bg-border rounded w-1/2"></div>
                    <div className="h-4 bg-border rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <XCircle className="w-16 h-16 text-danger mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Error al cargar reservas
            </h3>
            <p className="text-text-secondary mb-6">{error}</p>
            <Button onClick={refetch} variant="primary">
              Intentar de nuevo
            </Button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Ticket className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No tienes reservas
            </h3>
            <p className="text-text-secondary mb-6">
              ¡Explora eventos y transporte para hacer tu primera reserva!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => router.push('/events')}
                className="flex items-center gap-2"
              >
                <Music className="w-4 h-4" />
                Ver Eventos
              </Button>
              <Button
                onClick={() => router.push('/transport')}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Bus className="w-4 h-4" />
                Ver Transporte
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const statusInfo = getStatusConfig(booking.status)
              const StatusIcon = statusInfo.icon
              
              return (
                <div key={booking.id} className="bg-body-bg rounded-lg border border-border hover:border-accent/50 transition-all duration-300">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Image/Icon */}
                      <div className="w-full lg:w-48 h-32 bg-gradient-to-br from-accent/20 to-info/20 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {booking.booking_type === 'event' ? (
                          <Music className="w-12 h-12 text-accent" />
                        ) : (
                          <Bus className="w-12 h-12 text-info" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-text-primary">
                              {booking.booking_type === 'event' 
                                ? booking.events?.[0]?.title || 'Evento'
                                : `${booking.transport_routes?.[0]?.origin || 'Origen'} → ${booking.transport_routes?.[0]?.destination || 'Destino'}`
                              }
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(booking.booking_date)}
                              </div>
                              
                              {booking.booking_type === 'event' && booking.events?.[0]?.venues && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {booking.events[0].venues.name}, {booking.events[0].venues.city}
                                </div>
                              )}
                              
                              {booking.booking_type === 'transport' && booking.departure_time && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {booking.departure_time}
                                </div>
                              )}
                              
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {booking.seat_numbers.length} asiento(s)
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} border`}>
                              <StatusIcon className="w-4 h-4" />
                              {statusInfo.label}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-accent">
                              {formatCurrency(booking.total_amount)}
                            </div>
                            <div className="text-xs text-text-secondary">
                              ID: {booking.id.substring(0, 8)}...
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Ver Detalles
                            </Button>
                            
                            {booking.status === 'confirmed' && (
                              <>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="flex items-center gap-2"
                                >
                                  <QrCode className="w-4 h-4" />
                                  QR Code
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" />
                                  Descargar
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-6">
                <Button
                  onClick={fetchMore}
                  variant="secondary"
                  disabled={loading}
                >
                  {loading ? 'Cargando...' : 'Cargar más reservas'}
                </Button>
              </div>
            )}

            {/* Summary */}
            <div className="mt-8 text-center text-sm text-text-secondary">
              Mostrando {filteredBookings.length} de {total} reservas
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
