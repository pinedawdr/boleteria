'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout'
import { 
  Ticket, 
  Calendar, 
  CheckCircle,
  XCircle,
  Search,
  ArrowRight,
  Bus,
  Music,
  QrCode,
  Download
} from 'lucide-react'

export default function BookingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Datos mock temporales mientras implementamos las reservas reales
  const mockBookings = [
    {
      id: '1',
      user_id: user?.id || '',
      booking_type: 'event' as const,
      booking_date: '2024-12-10T10:00:00Z',
      seat_numbers: ['A12', 'A13'],
      total_amount: 150.00,
      status: 'confirmed' as const,
      created_at: '2024-12-10T10:00:00Z',
      updated_at: '2024-12-10T10:00:00Z',
      passenger_info: {
        name: 'Usuario Test',
        email: 'test@example.com'
      }
    },
    {
      id: '2',
      user_id: user?.id || '',
      booking_type: 'transport' as const,
      booking_date: '2024-12-08T14:30:00Z',
      seat_numbers: ['12B'],
      total_amount: 45.00,
      status: 'pending' as const,
      created_at: '2024-12-08T14:30:00Z',
      updated_at: '2024-12-08T14:30:00Z',
      passenger_info: {
        name: 'Usuario Test',
        email: 'test@example.com'
      }
    },
    {
      id: '3',
      user_id: user?.id || '',
      booking_type: 'event' as const,
      booking_date: '2024-12-05T18:00:00Z',
      seat_numbers: ['B5'],
      total_amount: 75.00,
      status: 'cancelled' as const,
      created_at: '2024-12-05T18:00:00Z',
      updated_at: '2024-12-05T18:00:00Z',
      passenger_info: {
        name: 'Usuario Test',
        email: 'test@example.com'
      }
    }
  ] as const

  // Usar datos mock por ahora
  const bookings = mockBookings
  const bookingsLoading = false
  const error = null

  const refetch = () => {
    console.log('Refetch called - usando datos mock')
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }
  }, [user, loading, router])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'used':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado'
      case 'used':
        return 'Usado'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400'
      case 'used':
        return 'bg-blue-500/20 text-blue-400'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus
    const matchesType = selectedType === 'all' || booking.booking_type === selectedType
    const matchesSearch = searchQuery === '' || 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesType && matchesSearch
  })

  if (loading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-body-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando reservas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-body-bg flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Error al cargar reservas
          </h3>
          <p className="text-text-secondary mb-4">{error}</p>
          <Button onClick={refetch} variant="primary">
            Intentar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-body-bg">
      <Container className="py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-secondary text-sm mb-6">
          <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
          <ArrowRight className="w-4 h-4 mx-2" />
          <Link href="/customer/dashboard" className="hover:text-accent transition-colors">Dashboard</Link>
          <ArrowRight className="w-4 h-4 mx-2" />
          <span className="text-primary">Mis Reservas</span>
        </div>
      </Container>

      {/* Header */}
      <div className="bg-body-bg border-b border-border-color">
        <div className="max-w-7xl mx-auto responsive-padding py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <Ticket className="w-7 h-7 text-purple-500" />
                Mis Reservas
              </h1>
              <p className="text-text-secondary mt-1">
                Gestiona todas tus reservas de eventos y transporte
              </p>
            </div>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Volver
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-body-bg/50 border-b border-border-color">
        <div className="max-w-7xl mx-auto responsive-padding py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por ID de reserva..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-gametime pl-10 w-full"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-gametime min-w-[140px]"
              >
                <option value="all">Todos los estados</option>
                <option value="confirmed">Confirmado</option>
                <option value="cancelled">Cancelado</option>
                <option value="used">Usado</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input-gametime min-w-[140px]"
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
      <div className="max-w-7xl mx-auto responsive-padding py-8">
        {filteredBookings.length === 0 ? (
          <div className="card-gametime text-center py-12">
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
                variant="outline"
                className="flex items-center gap-2"
              >
                <Bus className="w-4 h-4" />
                Ver Transporte
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="card-gametime card-hover">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Image */}
                  <div className="w-full lg:w-48 h-32 bg-body-bg rounded-lg overflow-hidden flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      {booking.booking_type === 'event' ? (
                        <Music className="w-8 h-8 text-white" />
                      ) : (
                        <Bus className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary">
                          {booking.booking_type === 'event' ? 'Reserva de Evento' : 'Reserva de Transporte'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-text-secondary mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(booking.created_at).toLocaleDateString('es-ES', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Ticket className="w-4 h-4" />
                            {booking.id.substring(0, 8)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span>{getStatusText(booking.status)}</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-text-secondary">
                      <strong>Tipo:</strong> {booking.booking_type === 'event' ? 'Evento' : 'Transporte'}
                      <span className="ml-4">
                        <strong>Asientos:</strong> {booking.seat_numbers.length} asiento(s)
                      </span>
                      <span className="ml-4">
                        <strong>Estado:</strong> {booking.status === 'confirmed' ? 'Confirmado' : booking.status === 'pending' ? 'Pendiente' : booking.status}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="text-lg font-bold text-purple-400">
                        S/ {booking.total_amount.toFixed(2)}
                      </div>
                      
                      {booking.status === 'confirmed' && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <QrCode className="w-4 h-4" />
                            Ver QR
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Descargar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
