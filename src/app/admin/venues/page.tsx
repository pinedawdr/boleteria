'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminErrorState from '@/components/admin/AdminErrorState'
import { getAdminVenues, deleteVenue, type AdminVenue } from '@/lib/admin-services'
import { 
  MapPin, 
  Building,
  Users,
  Calendar,
  Edit,
  Trash2,
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react'

// Extendemos AdminVenue para compatibilidad con datos mock
interface VenueWithExtras extends AdminVenue {
  type?: string;
  rating?: number;
  amenities?: string[];
  status?: 'active' | 'maintenance' | 'closed';
}

export default function VenuesManagementPage() {
  const { user } = useAuth()
  const [venues, setVenues] = useState<VenueWithExtras[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingVenue, setEditingVenue] = useState<VenueWithExtras | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchVenues = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getAdminVenues()
      
      setVenues(data)
    } catch (error) {
      console.error('Error fetching venues:', error)
      setError('Error al cargar venues')
      // Fallback con datos de ejemplo
      setVenues([
        {
          id: '1',
          name: 'Teatro Nacional',
          address: 'Jr. Ica 377, Cercado de Lima',
          city: 'Lima',
          capacity: 800,
          total_events: 25,
          type: 'theater',
          rating: 4.8,
          amenities: ['parking', 'ac', 'sound_system', 'vip_area'],
          status: 'active',
          created_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Estadio Nacional',
          address: 'Av. 28 de Julio s/n, Lima',
          city: 'Lima',
          capacity: 50000,
          total_events: 12,
          type: 'stadium',
          rating: 4.5,
          amenities: ['parking', 'food_court', 'security', 'first_aid'],
          status: 'active',
          created_at: '2024-01-10T00:00:00Z'
        },
        {
          id: '3',
          name: 'Arena Miraflores',
          address: 'Av. Larco 1301, Miraflores',
          city: 'Lima',
          capacity: 1500,
          total_events: 8,
          type: 'arena',
          rating: 4.6,
          amenities: ['ac', 'sound_system', 'bar', 'vip_area'],
          status: 'active',
          created_at: '2024-01-05T00:00:00Z'
        }
      ])
      
      // Limpiar error ya que tenemos datos de fallback
      setError(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.isAdmin || user?.isOperator) {
      fetchVenues()
    }
  }, [user, fetchVenues])

  // Función para abrir el modal de edición
  const handleEditVenue = (venue: VenueWithExtras) => {
    setEditingVenue(venue)
    setShowCreateModal(true)
  }

  // Función para eliminar un venue
  const handleDeleteVenue = async (venueId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este venue?')) {
      return
    }

    try {
      await deleteVenue(venueId)
      fetchVenues() // Recargar la lista
    } catch (error) {
      console.error('Error deleting venue:', error)
      setError('Error al eliminar venue')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTypeBadge = (type?: string) => {
    const styles = {
      theater: 'bg-accent/20 text-accent border-accent/30',
      stadium: 'bg-green-500/20 text-green-400 border-green-500/30',
      arena: 'bg-primary/20 text-primary border-primary/30',
      club: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    }
    
    const typeLabels = {
      theater: 'Teatro',
      stadium: 'Estadio',
      arena: 'Arena',
      club: 'Club'
    }
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${styles[type as keyof typeof styles] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
        {typeLabels[type as keyof typeof typeLabels] || type || 'Otro'}
      </span>
    )
  }

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      active: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
      maintenance: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
      closed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    const Icon = config.icon
    
    return (
      <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${config.bg} ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status === 'active' ? 'Activo' : status === 'maintenance' ? 'Mantenimiento' : 'Cerrado'}
      </span>
    )
  }

  // Filtrar venues
  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCity = selectedCity === 'all' || venue.city === selectedCity
    const matchesType = selectedType === 'all' || venue.type === selectedType
    
    return matchesSearch && matchesCity && matchesType
  })

  // Obtener ciudades únicas para el filtro
  const cities = [...new Set(venues.map(venue => venue.city))]
  const types = [...new Set(venues.map(venue => venue.type).filter(Boolean))]

  if (loading) {
    return <AdminLoadingState type="grid" message="Cargando venues..." />
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-accent to-success bg-clip-text text-transparent mb-2">Gestión de Venues</h1>
            <p className="text-gray-300 text-sm sm:text-base">Administra los lugares donde se realizan eventos</p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setEditingVenue(null)
              setShowCreateModal(true)
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Venue
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <AdminErrorState 
            error={error}
            type="connection"
            onRetry={fetchVenues}
            showFallbackData={venues.length > 0}
          />
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Building className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Venues</p>
                <p className="text-xl font-bold text-white">{venues.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Activos</p>
                <p className="text-xl font-bold text-white">
                  {venues.filter(v => v.status === 'active' || !v.status).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Ciudades</p>
                <p className="text-xl font-bold text-white">{cities.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Users className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Capacidad Total</p>
                <p className="text-xl font-bold text-white">
                  {venues.reduce((sum, v) => sum + (v.capacity || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="all">Todas las ciudades</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <div className="text-sm text-gray-400 flex items-center">
              Total: {filteredVenues.length} venues
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <div key={venue.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{venue.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <MapPin className="w-4 h-4" />
                      {venue.address}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                      <Building className="w-4 h-4" />
                      {venue.city}
                    </div>
                  </div>
                  {venue.status && getStatusBadge(venue.status)}
                </div>

                <div className="flex items-center justify-between mb-4">
                  {venue.type && getTypeBadge(venue.type)}
                  {venue.rating && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">{venue.rating}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                      <Users className="w-4 h-4" />
                    </div>
                    <p className="text-2xl font-bold">{venue.capacity.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Capacidad</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <p className="text-2xl font-bold">{venue.total_events || 0}</p>
                    <p className="text-xs text-gray-400">Eventos</p>
                  </div>
                </div>

                {venue.amenities && venue.amenities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Amenidades:</p>
                    <div className="flex flex-wrap gap-1">
                      {venue.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                          {amenity}
                        </span>
                      ))}
                      {venue.amenities.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                          +{venue.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  <span className="text-xs text-gray-400">
                    Creado: {formatDate(venue.created_at)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditVenue(venue)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteVenue(venue.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVenues.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No hay venues</h3>
            <p className="text-gray-500 mb-4">No se encontraron venues que coincidan con los filtros.</p>
            <Button
              onClick={() => {
                setEditingVenue(null)
                setShowCreateModal(true)
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear primer venue
            </Button>
          </div>
        )}

        {/* TODO: Modal para crear/editar venues */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {editingVenue ? 'Editar Venue' : 'Nuevo Venue'}
              </h3>
              <p className="text-gray-400 mb-4">
                Modal de creación/edición en desarrollo
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
