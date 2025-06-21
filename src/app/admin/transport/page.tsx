'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import EditRouteModal from '@/components/admin/EditRouteModal'
import { 
  Bus, 
  Plane, 
  Ship,
  Clock, 
  MapPin,
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Star,
  CheckCircle,
  XCircle,
  Route
} from 'lucide-react'

interface TransportRoute {
  id: string
  company_name: string
  company_logo?: string
  company_rating: number
  origin: string
  destination: string
  vehicle_type: 'bus' | 'boat' | 'train'
  departure_time: string
  arrival_time: string
  duration: number
  price_from: number
  price_to: number
  total_seats: number
  occupied_seats: number
  amenities: string[]
  status: 'active' | 'cancelled'
  created_at: string
  transport_companies?: {
    name: string
    logo_url?: string
    rating: number
  }
}

const VEHICLE_TYPES = {
  bus: { label: 'Bus', icon: Bus, color: 'blue' },
  boat: { label: 'Barco', icon: Ship, color: 'cyan' },
  train: { label: 'Tren', icon: Plane, color: 'green' }
}

const POPULAR_ROUTES = [
  'Lima - Cusco',
  'Lima - Arequipa', 
  'Lima - Trujillo',
  'Cusco - Arequipa',
  'Lima - Huancayo',
  'Lima - Ica'
]

export default function TransportManagementPage() {
  const { user } = useAuth()
  const [routes, setRoutes] = useState<TransportRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedRoute, setSelectedRoute] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (user?.isAdmin || user?.isOperator) {
      fetchRoutes()
    }
  }, [user])

  const fetchRoutes = async () => {
    try {
      setLoading(true)
      // Obtener rutas reales de la API
      const response = await fetch('/api/transport/admin-routes?status=all')
      
      if (!response.ok) {
        throw new Error('Error al obtener rutas')
      }
      
      const data = await response.json()
      
      // Transformar los datos para que coincidan con la interfaz
      const transformedRoutes = data.routes?.map((route: TransportRoute) => ({
        id: route.id,
        company_name: route.transport_companies?.name || 'Sin compañía',
        company_logo: route.transport_companies?.logo_url,
        company_rating: route.transport_companies?.rating || 0,
        origin: route.origin,
        destination: route.destination,
        vehicle_type: route.vehicle_type,
        departure_time: route.departure_time,
        arrival_time: route.arrival_time,
        duration: route.duration,
        price_from: route.price_from,
        price_to: route.price_to,
        total_seats: route.total_seats,
        occupied_seats: route.occupied_seats || 0,
        amenities: route.amenities || [],
        status: route.status,
        created_at: route.created_at
      })) || []
      
      setRoutes(transformedRoutes)
    } catch (error) {
      console.error('Error fetching routes:', error)
      // Fallback a datos de ejemplo si falla la API
      setRoutes([])
    } finally {
      setLoading(false)
    }
  }

  // Función para eliminar una ruta
  const handleDeleteRoute = async (routeId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta ruta?')) {
      return
    }

    try {
      const response = await fetch(`/api/transport/admin-routes/${routeId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchRoutes() // Recargar la lista
      } else {
        throw new Error('Error al eliminar ruta')
      }
    } catch (error) {
      console.error('Error deleting route:', error)
      alert('Error al eliminar la ruta. Por favor, intenta de nuevo.')
    }
  }

  // Función para cambiar el estado de una ruta
  const handleToggleRouteStatus = async (routeId: string, newStatus: 'active' | 'cancelled') => {
    try {
      const response = await fetch(`/api/transport/admin-routes/${routeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchRoutes() // Recargar la lista
      } else {
        throw new Error('Error al actualizar estado de la ruta')
      }
    } catch (error) {
      console.error('Error updating route status:', error)
      alert('Error al actualizar el estado de la ruta.')
    }
  }

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.company_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesVehicleType = selectedVehicleType === 'all' || route.vehicle_type === selectedVehicleType
    const matchesStatus = selectedStatus === 'all' || route.status === selectedStatus
    const matchesRoute = selectedRoute === 'all' || `${route.origin} - ${route.destination}` === selectedRoute
    return matchesSearch && matchesVehicleType && matchesStatus && matchesRoute
  })

  const getVehicleTypeBadge = (type: string) => {
    const config = VEHICLE_TYPES[type as keyof typeof VEHICLE_TYPES]
    if (!config) return null
    
    const Icon = config.icon
    return (
      <span className={`px-3 py-1 rounded-full text-xs border flex items-center gap-1 bg-${config.color}-500/20 text-${config.color}-400 border-${config.color}-500/30`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-success/20 text-success border-success/30',
      cancelled: 'bg-error/20 text-error border-error/30'
    }
    
    const icons = {
      active: CheckCircle,
      cancelled: XCircle
    }
    
    const labels = {
      active: 'Activa',
      cancelled: 'Cancelada'
    }
    
    const Icon = icons[status as keyof typeof icons] || CheckCircle
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs border flex items-center gap-1 ${styles[status as keyof typeof styles] || styles.active}`}>
        <Icon className="w-3 h-3" />
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  const calculateOccupancy = (occupied: number, total: number) => {
    if (total === 0) return 0
    return Math.round((occupied / total) * 100)
  }

  const formatPrice = (price: number) => {
    return `S/. ${price.toFixed(0)}`
  }

  const formatTime = (time: string) => {
    return time.substring(0, 5) // HH:MM
  }

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m > 0 ? `${m}min` : ''}`
  }

  if (!user?.isAdmin && !user?.isOperator) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Bus className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">Acceso Denegado</h2>
          <p className="text-text-secondary">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3 mb-2">
          <Route className="w-8 h-8 text-accent" />
          Gestión de Transporte
        </h1>
        <p className="text-text-secondary">
          Administra rutas, horarios y disponibilidad de transporte
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card-default p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Route className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Total Rutas</p>
              <p className="text-xl font-bold text-text-primary">{routes.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card-default p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Activas</p>
              <p className="text-xl font-bold text-text-primary">
                {routes.filter(r => r.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card-default p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Bus className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Buses</p>
              <p className="text-xl font-bold text-text-primary">
                {routes.filter(r => r.vehicle_type === 'bus').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card-default p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Ocupación Promedio</p>
              <p className="text-xl font-bold text-text-primary">
                {Math.round(routes.reduce((acc, r) => acc + calculateOccupancy(r.occupied_seats, r.total_seats), 0) / routes.length || 0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="text-sm text-text-secondary">
          Mostrando <span className="font-semibold text-text-primary">{filteredRoutes.length}</span> de <span className="font-semibold text-text-primary">{routes.length}</span> rutas
        </div>
        <Button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          Nueva Ruta
        </Button>
      </div>

      {/* Filters */}
      <div className="card-default p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Buscar rutas
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por origen, destino o compañía..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Tipo de vehículo
            </label>
            <select
              value={selectedVehicleType}
              onChange={(e) => setSelectedVehicleType(e.target.value)}
              className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            >
              <option value="all">Todos los tipos</option>
              <option value="bus">Bus</option>
              <option value="boat">Barco</option>
              <option value="train">Tren</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Estado
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Ruta popular
            </label>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            >
              <option value="all">Todas las rutas</option>
              {POPULAR_ROUTES.map(route => (
                <option key={route} value={route}>{route}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Routes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-default p-6">
              <div className="animate-pulse">
                <div className="h-20 bg-hover-bg rounded-lg mb-4"></div>
                <div className="h-4 bg-hover-bg rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-hover-bg rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-hover-bg rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => (
            <div key={route.id} className="card-default p-6 hover-lift group">
              {/* Route Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    {route.company_logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={route.company_logo} alt={route.company_name} className="w-8 h-8 object-contain" />
                    ) : (
                      <Bus className="w-6 h-6 text-accent" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary text-sm">{route.company_name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-text-secondary">{route.company_rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {getVehicleTypeBadge(route.vehicle_type)}
                  {getStatusBadge(route.status)}
                </div>
              </div>

              {/* Route Info */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-text-primary mb-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="font-medium">{route.origin}</span>
                  <span className="text-text-secondary">→</span>
                  <span className="font-medium">{route.destination}</span>
                </div>
                
                <div className="flex items-center gap-4 text-text-secondary text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(route.departure_time)} - {formatTime(route.arrival_time)}
                  </div>
                  <div className="text-text-muted">
                    {formatDuration(route.duration)}
                  </div>
                </div>
              </div>

              {/* Route Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Precio</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {formatPrice(route.price_from)} - {formatPrice(route.price_to)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Ocupación</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-hover-bg rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${calculateOccupancy(route.occupied_seats, route.total_seats)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-accent">
                      {calculateOccupancy(route.occupied_seats, route.total_seats)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Asientos</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {route.occupied_seats}/{route.total_seats}
                  </span>
                </div>
              </div>

              {/* Amenities */}
              {route.amenities.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {route.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="px-2 py-1 bg-hover-bg text-text-secondary text-xs rounded">
                        {amenity}
                      </span>
                    ))}
                    {route.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-hover-bg text-text-secondary text-xs rounded">
                        +{route.amenities.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border-color">
                <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-1">
                  <Eye className="w-3 h-3" />
                  Ver
                </Button>
                <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-1">
                  <Edit className="w-3 h-3" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center justify-center gap-1 px-3" 
                  onClick={() => handleToggleRouteStatus(route.id, route.status === 'active' ? 'cancelled' : 'active')}
                >
                  {route.status === 'active' ? (
                    <>
                      <XCircle className="w-3 h-3" />
                      Cancelar
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      Activar
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center justify-center gap-1 text-error hover:text-error border-error/30 hover:border-error px-3" 
                  onClick={() => handleDeleteRoute(route.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredRoutes.length === 0 && !loading && (
        <div className="text-center py-12">
          <Bus className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No se encontraron rutas</h3>
          <p className="text-text-secondary">
            {searchQuery || selectedVehicleType !== 'all' || selectedStatus !== 'all' || selectedRoute !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda.' 
              : 'No hay rutas registradas en el sistema.'}
          </p>
        </div>
      )}

      {/* Modal para crear/editar rutas */}
      <EditRouteModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onRouteSaved={fetchRoutes}
        editingRoute={null}
      />
    </div>
  )
}
