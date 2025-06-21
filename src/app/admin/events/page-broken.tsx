'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import EventModalAdvanced from '@/components/admin/EventModalAdvanced'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminErrorState from '@/components/admin/AdminErrorState'
import { getAdminEvents, deleteEvent, type AdminEvent } from '@/lib/admin-services'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  Music,
  Theater,
  Trophy,
  Briefcase,
  Star
} from 'lucide-react'

// Extendemos AdminEvent para compatibilidad con datos mock
interface EventWithExtras extends AdminEvent {
  tickets_sold?: number;
  capacity?: number;
  artist?: string;
}

export default function EventsManagementPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<EventWithExtras[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventWithExtras | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalEvents, setTotalEvents] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const searchParam = searchQuery || ''
      const categoryParam = selectedCategory !== 'all' ? selectedCategory : ''
      const statusParam = selectedStatus !== 'all' ? selectedStatus : ''
      
      const data = await getAdminEvents(currentPage, 10, searchParam, categoryParam, statusParam)
      
      setEvents(data.events)
      setTotalEvents(data.total)
    } catch (error) {
      console.error('Error fetching events:', error)
      setError('Error al cargar eventos')
      // Fallback con datos de ejemplo
      setEvents([
        {
          id: '1',
          title: 'Concierto de Rock Nacional',
          description: 'Una noche épica de rock peruano',
          category: 'concert',
          start_date: '2024-12-20T20:00:00Z',
          end_date: '2024-12-20T23:00:00Z',
          venue_id: '1',
          venue_name: 'Teatro Nacional',
          price_from: 50,
          price_to: 150,
          status: 'active',
          artist: 'Libido',
          duration: '180',
          tickets_sold: 450,
          capacity: 800,
          rating: 4.5,
          revenue: 67500,
          sold_seats: 450,
          total_seats: 800,
          created_at: '2024-12-01T00:00:00Z'
        }
      ])
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchQuery, selectedCategory, selectedStatus])

  useEffect(() => {
    if (user?.isAdmin || user?.isOperator) {
      fetchEvents()
    }
  }, [user, fetchEvents])

  // Función para manejar la creación exitosa de un evento
  const handleEventCreated = () => {
    fetchEvents() // Recargar la lista de eventos
  }

  // Función para abrir el modal de edición
  const handleEditEvent = (event: EventWithExtras) => {
    // Convertir EventWithExtras al tipo Event que espera el modal
    const eventForModal = {
      id: event.id,
      title: event.title,
      description: event.description || '',
      category: event.category,
      start_date: event.start_date,
      end_date: event.end_date,
      venue_id: event.venue_id,
      venue_name: event.venue_name,
      price_from: event.price_from,
      price_to: event.price_to,
      status: event.status,
      image_url: event.image_url,
      artist: event.artist,
      duration: typeof event.duration === 'string' ? parseInt(event.duration) : event.duration,
      tickets_sold: event.tickets_sold,
      capacity: event.capacity
    }
    setEditingEvent(eventForModal as EventWithExtras)
    setShowEditModal(true)
  }

  // Función para eliminar un evento
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      return
    }

    try {
      await deleteEvent(eventId)
      fetchEvents() // Recargar la lista
    } catch (error) {
      console.error('Error deleting event:', error)
      setError('Error al eliminar evento')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryBadge = (category: string) => {
    const styles = {
      concert: 'bg-accent/20 text-accent border-accent/30',
      theater: 'bg-info/20 text-info border-info/30',
      sports: 'bg-success/20 text-success border-success/30',
      conference: 'bg-warning/20 text-warning border-warning/30'
    }
    
    const icons = {
      concert: Music,
      theater: Theater,
      sports: Trophy,
      conference: Briefcase
    }
    
    const labels = {
      concert: 'Concierto',
      theater: 'Teatro',
      sports: 'Deportes',
      conference: 'Conferencia'
    }
    
    const Icon = icons[category as keyof typeof icons] || Music
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs border flex items-center gap-1 ${styles[category as keyof typeof styles] || styles.concert}`}>
        <Icon className="w-3 h-3" />
        {labels[category as keyof typeof labels] || category}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      sold_out: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    }
    
    const icons = {
      active: CheckCircle,
      sold_out: AlertCircle,
      cancelled: XCircle
    }
    
    const labels = {
      active: 'Activo',
      sold_out: 'Agotado',
      cancelled: 'Cancelado'
    }
    
    const Icon = icons[status as keyof typeof icons] || CheckCircle
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs border flex items-center gap-1 ${styles[status as keyof typeof styles] || styles.active}`}>
        <Icon className="w-3 h-3" />
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  const calculateOccupancy = (sold: number = 0, capacity: number = 0) => {
    if (capacity === 0) return 0
    return Math.round((sold / capacity) * 100)
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.venue_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  if (!user?.isAdmin && !user?.isOperator) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Acceso Denegado</h2>
          <p className="text-gray-400">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <AdminLoadingState type="grid" message="Cargando eventos..." />
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Error State */}
      {error && (
        <AdminErrorState 
          error={error}
          type="connection"
          onRetry={fetchEvents}
          showFallbackData={events.length > 0}
        />
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-accent to-success bg-clip-text text-transparent flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8 text-accent" />
          Gestión de Eventos
        </h1>
        <p className="text-gray-300">
          Administra eventos, precios y disponibilidad • {totalEvents} eventos totales
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Eventos</p>
              <p className="text-xl font-bold text-white">{events.length}</p>
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
                {events.filter(e => e.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Agotados</p>
              <p className="text-xl font-bold text-white">
                {events.filter(e => e.status === 'sold_out').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info/20 rounded-lg">
              <Users className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Vendidos</p>
              <p className="text-xl font-bold text-white">
                {events.reduce((sum, e) => sum + (e.tickets_sold || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-gray-400">
          Mostrando <span className="font-semibold text-white">{filteredEvents.length}</span> de <span className="font-semibold text-white">{events.length}</span> eventos
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-accent to-success hover:from-accent/80 hover:to-success/80 text-black px-6 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-bold"
        >
          <Plus className="w-4 h-4" />
          Nuevo Evento
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Buscar eventos
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, artista o venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filtrar por categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            >
              <option value="all">Todas las categorías</option>
              <option value="concert">Conciertos</option>
              <option value="theater">Teatro</option>
              <option value="sports">Deportes</option>
              <option value="conference">Conferencias</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filtrar por estado
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="sold_out">Agotados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>
      </div>      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
            <div key={event.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300 group">
              {/* Event Image */}
              <div className="aspect-video bg-white/10 rounded-lg mb-4 flex items-center justify-center">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>

              {/* Event Info */}
              <div className="mb-4">
                <h3 className="font-semibold text-white mb-2 text-lg line-clamp-2">
                  {event.title}
                </h3>
                
                {event.artist && (
                  <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                    <Users className="w-4 h-4 text-accent" />
                    {event.artist}
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  {event.venue_name}
                </div>
                
                <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
                  <Clock className="w-4 h-4 text-accent" />
                  {formatDate(event.start_date)}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {getCategoryBadge(event.category)}
                  {getStatusBadge(event.status)}
                </div>
              </div>

              {/* Event Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Precio</span>
                  <span className="text-sm font-semibold text-white">
                    {formatCurrency(event.price_from)} - {formatCurrency(event.price_to)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Vendidos</span>
                  <span className="text-sm font-semibold text-white">
                    {event.tickets_sold?.toLocaleString()} / {event.capacity?.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Ocupación</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${calculateOccupancy(event.tickets_sold, event.capacity)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-accent">
                      {calculateOccupancy(event.tickets_sold, event.capacity)}%
                    </span>
                  </div>
                </div>

                {event.rating && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Calificación</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-3 h-3 ${star <= event.rating! ? 'text-warning fill-current' : 'text-gray-600'}`} />
                      ))}
                      <span className="text-sm text-warning ml-1">{event.rating}</span>
                    </div>
                  </div>
                )}

                {event.revenue && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Ingresos</span>
                    <span className="text-sm font-semibold text-success">
                      {formatCurrency(event.revenue)}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-white/20">
                <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-1 text-gray-300 border-white/20 hover:bg-white/10">
                  <Eye className="w-3 h-3" />
                  Ver
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 flex items-center justify-center gap-1 text-gray-300 border-white/20 hover:bg-white/10"
                  onClick={() => handleEditEvent(event)}
                >
                  <Edit className="w-3 h-3" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center justify-center gap-1 text-red-400 border-red-500/30 hover:bg-red-500/20 px-3" 
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredEvents.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No se encontraron eventos</h3>
          <p className="text-gray-400">
            {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda.' 
              : 'No hay eventos registrados en el sistema.'}
          </p>
        </div>
      )}

      {/* Paginación */}
      {totalEvents > 10 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm"
          >
            Anterior
          </Button>
          <span className="px-3 py-1 text-sm text-gray-400">
            Página {currentPage} de {Math.ceil(totalEvents / 10)}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage >= Math.ceil(totalEvents / 10)}
            className="px-3 py-1 text-sm"
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Event Modal Advanced */}
      <EventModalAdvanced 
        isOpen={showCreateModal || showEditModal} 
        onClose={() => {
          setShowCreateModal(false)
          setShowEditModal(false)
          setEditingEvent(null)
        }} 
        onEventSaved={handleEventCreated}
        editingEvent={editingEvent ? {
          id: editingEvent.id,
          title: editingEvent.title,
          description: editingEvent.description || '',
          category: editingEvent.category,
          start_date: editingEvent.start_date,
          end_date: editingEvent.end_date || editingEvent.start_date,
          venue_id: editingEvent.venue_id || '',
          venue_name: editingEvent.venue_name || '',
          price_from: editingEvent.price_from,
          price_to: editingEvent.price_to,
          status: editingEvent.status,
          image_url: editingEvent.image_url,
          artist: editingEvent.artist,
          duration: typeof editingEvent.duration === 'string' ? parseInt(editingEvent.duration) : editingEvent.duration,
          tickets_sold: editingEvent.tickets_sold,
          capacity: editingEvent.capacity
        } : null}
      />
      </div>
    </div>
  )
}
