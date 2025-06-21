'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useUserBookings } from '@/hooks/useUserBookings'
import { Button } from '@/components/ui/Button'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  LogOut,
  ArrowRight
} from 'lucide-react'

export default function CustomerDashboard() {
  const { user, signOut } = useAuth()
  const { recentBookings, loading: bookingsLoading } = useUserBookings()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Mañana'
    if (diffDays > 0 && diffDays <= 7) return `En ${diffDays} días`
    
    return date.toLocaleDateString('es-PE', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado'
      case 'pending': return 'Pendiente'
      case 'cancelled': return 'Cancelado'
      case 'refunded': return 'Reembolsado'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'cancelled': return 'text-red-400'
      case 'refunded': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-body-bg">
      {/* Header */}
      <div className="bg-body-bg border-b border-border-color">
        <div className="max-w-7xl mx-auto responsive-padding py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Bienvenido, {user?.profile?.full_name || 'Usuario'}
              </h1>
              <p className="text-text-secondary mt-1">
                Explora eventos y reserva tu transporte
              </p>
            </div>
            <Button
              onClick={signOut}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto responsive-padding py-8">
        {/* Quick Actions */}
        <div className="responsive-grid mb-8">
          {/* Eventos */}
          <Link href="/events" className="card-gametime card-hover block">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-text-primary">Eventos</h2>
            </div>
            <p className="text-text-secondary mb-4">
              Descubre los mejores eventos y conciertos
            </p>
            <div className="flex items-center justify-between">
              <span className="text-accent font-medium">Ver eventos disponibles</span>
              <ArrowRight className="w-4 h-4 text-text-secondary" />
            </div>
          </Link>

          {/* Transporte */}
          <Link href="/transport" className="card-gametime card-hover block">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-text-primary">Transporte</h2>
            </div>
            <p className="text-text-secondary mb-4">
              Reserva tu transporte de manera fácil
            </p>
            <div className="flex items-center justify-between">
              <span className="text-accent font-medium">Ver rutas disponibles</span>
              <ArrowRight className="w-4 h-4 text-text-secondary" />
            </div>
          </Link>

          {/* Mis Reservas */}
          <Link href="/customer/bookings" className="card-gametime card-hover block">
            <div className="flex items-center gap-3 mb-4">
              <Ticket className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-semibold text-text-primary">Mis Reservas</h2>
            </div>
            <p className="text-text-secondary mb-4">
              Gestiona tus boletos y reservas
            </p>
            <div className="flex items-center justify-between">
              <span className="text-accent font-medium">Ver mis reservas</span>
              <ArrowRight className="w-4 h-4 text-text-secondary" />
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="card-gametime mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            {bookingsLoading ? (
              <div className="flex justify-center py-4">
                <AdminLoadingState type="grid" message="Cargando reservas..." />
              </div>
            ) : recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center gap-3 p-3 bg-body-bg rounded-lg border border-border-color">
                  {booking.booking_type === 'event' ? (
                    <Calendar className="w-5 h-5 text-purple-500" />
                  ) : (
                    <MapPin className="w-5 h-5 text-blue-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-text-primary font-medium">
                      {booking.booking_type === 'event' 
                        ? booking.event?.title || 'Evento'
                        : `${booking.route?.origin} → ${booking.route?.destination}` || 'Ruta'
                      }
                    </p>
                    <p className="text-text-secondary text-sm">
                      {booking.booking_type === 'event'
                        ? `${booking.event?.venues?.name || 'Venue'} • ${formatDate(booking.event?.start_date || booking.created_at)}`
                        : `${booking.route?.transport_companies?.name || 'Empresa'} • ${formatDate(booking.route?.departure_time || booking.created_at)}`
                      }
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center p-6 text-text-muted">
                <Ticket className="w-12 h-12 mx-auto mb-3 text-text-muted/50" />
                <p className="text-sm">No tienes reservas recientes.</p>
                <p className="text-xs text-text-secondary mt-1">¡Explora eventos y rutas disponibles!</p>
              </div>
            )}
          </div>
        </div>

        {/* Información del Usuario */}
        <div className="card-gametime">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Información de la Cuenta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Nombre Completo
              </label>
              <p className="text-text-primary">{user?.profile?.full_name || 'No especificado'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email
              </label>
              <p className="text-text-primary">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Teléfono
              </label>
              <p className="text-text-primary">{user?.profile?.phone || 'No especificado'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Miembro desde
              </label>
              <p className="text-text-primary">
                {user?.profile?.created_at ? new Date(user.profile.created_at).toLocaleDateString() : 'No disponible'}
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border-color">
            <Link href="/profile">
              <Button className="btn-secondary">
                Editar Perfil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
