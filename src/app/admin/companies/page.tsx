'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminErrorState from '@/components/admin/AdminErrorState'
import { useOptimizedLoading } from '@/hooks/useOptimizedLoading'
import { getAdminCompanies, deleteCompany, type AdminCompany } from '@/lib/admin-services'
import { 
  Truck, 
  Building,
  Star,
  Phone,
  Mail,
  Globe,
  Users,
  Edit,
  Trash2,
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'

// Extendemos AdminCompany para compatibilidad con datos mock
interface CompanyWithExtras extends AdminCompany {
  status?: 'active' | 'suspended' | 'pending';
  vehicle_types?: string[];
  founded_year?: number;
}

export default function CompaniesManagementPage() {
  const { 
    loading, 
    error, 
    data: companies, 
    setData: setCompanies, 
    startLoading, 
    stopLoading, 
    setError 
  } = useOptimizedLoading({
    initialLoading: true,
    timeout: 3000,
    fallbackData: []
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCompany, setEditingCompany] = useState<CompanyWithExtras | null>(null)

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getAdminCompanies()
      setCompanies(data)
    } catch (error) {
      console.error('Error fetching companies:', error)
      setError('Error al cargar empresas')
      // Fallback con datos de ejemplo
      setCompanies([
        {
          id: '1',
          name: 'Cruz del Sur',
          description: 'Empresa líder en transporte terrestre de pasajeros',
          rating: 4.5,
          phone: '+51 1 311-5050',
          email: 'contacto@cruzdelsur.com.pe',
          website: 'https://www.cruzdelsur.com.pe',
          logo_url: '/logos/cruz-del-sur.png',
          total_routes: 45,
          total_bookings: 2500,
          status: 'active',
          vehicle_types: ['bus', 'coach'],
          founded_year: 1961,
          created_at: '2024-01-10T00:00:00Z'
        },
        {
          id: '2',
          name: 'Oltursa',
          description: 'Transporte de pasajeros y carga a nivel nacional',
          rating: 4.3,
          phone: '+51 1 708-5000',
          email: 'info@oltursa.pe',
          website: 'https://www.oltursa.pe',
          logo_url: '/logos/oltursa.png',
          total_routes: 38,
          total_bookings: 1800,
          status: 'active',
          vehicle_types: ['bus'],
          founded_year: 1978,
          created_at: '2024-01-05T00:00:00Z'
        }
      ])
      setError(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  const handleEditCompany = (company: CompanyWithExtras) => {
    setEditingCompany(company)
    setShowCreateModal(true)
  }

  const handleDeleteCompany = async (companyId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta empresa?')) {
      return
    }

    try {
      await deleteCompany(companyId)
      fetchCompanies()
    } catch (error) {
      console.error('Error deleting company:', error)
      setError('Error al eliminar empresa')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      active: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Activa' },
      suspended: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Suspendida' },
      pending: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Pendiente' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    const Icon = config.icon
    
    return (
      <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${config.bg} ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
            }`}
          />
        ))}
        <span className="text-sm text-gray-400 ml-1">({rating})</span>
      </div>
    )
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (company.description && company.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = selectedStatus === 'all' || company.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <AdminLoadingState message="Cargando empresas..." />
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 min-h-[80px]">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">
              Gestión de Empresas
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Administra las empresas de transporte registradas
            </p>
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto">
            <Button
              variant="primary"
              onClick={() => {
                setEditingCompany(null)
                setShowCreateModal(true)
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-base shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Nueva Empresa
            </Button>
          </div>
        </div>

      {/* Error State */}
      {error && (
        <AdminErrorState 
          error={error}
          type="connection"
          onRetry={fetchCompanies}
          showFallbackData={companies.length > 0}
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
              <p className="text-sm text-gray-400">Total Empresas</p>
              <p className="text-xl font-bold text-white">{companies.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Activas</p>
              <p className="text-xl font-bold text-white">
                {companies.filter(c => c.status === 'active' || !c.status).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Rutas Totales</p>
              <p className="text-xl font-bold text-white">
                {companies.reduce((sum, c) => sum + (c.total_routes || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Rating Promedio</p>
              <p className="text-xl font-bold text-white">
                {companies.length > 0 
                  ? (companies.reduce((sum, c) => sum + (c.rating || 4.0), 0) / companies.length).toFixed(1)
                  : '4.0'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar empresas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="suspended">Suspendidas</option>
            <option value="pending">Pendientes</option>
          </select>

          <div className="text-sm text-gray-400 flex items-center">
            Total: {filteredCompanies.length} empresas
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {company.logo_url && (
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{company.name}</h3>
                    {company.description && (
                      <p className="text-sm text-gray-400 mb-2">{company.description}</p>
                    )}
                    {getRatingStars(company.rating)}
                  </div>
                </div>
                {company.status && getStatusBadge(company.status)}
              </div>

              {company.founded_year && (
                <div className="text-sm text-gray-400 mb-4">
                  Fundada en {company.founded_year}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    <Truck className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-bold">{company.total_routes || 0}</p>
                  <p className="text-xs text-gray-400">Rutas</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                    <Users className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-bold">{company.total_bookings || 0}</p>
                  <p className="text-xs text-gray-400">Reservas</p>
                </div>
              </div>

              {company.vehicle_types && company.vehicle_types.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Tipos de vehículos:</p>
                  <div className="flex flex-wrap gap-1">
                    {company.vehicle_types.map((type, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                        {type === 'bus' ? 'Autobús' : type === 'coach' ? 'Coach' : type === 'minibus' ? 'Minibús' : type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-4">
                {company.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Phone className="w-4 h-4" />
                    {company.phone}
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Mail className="w-4 h-4" />
                    {company.email}
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Globe className="w-4 h-4" />
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-accent transition-colors"
                    >
                      Sitio web
                    </a>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <span className="text-xs text-gray-400">
                  Registrada: {formatDate(company.created_at)}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCompany(company)}
                    className="text-primary hover:text-accent transition-colors duration-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCompany(company.id)}
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

      {filteredCompanies.length === 0 && !loading && (
        <div className="text-center py-12">
          <Truck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No hay empresas</h3>
          <p className="text-gray-500 mb-4">No se encontraron empresas que coincidan con los filtros.</p>
          <Button
            variant="primary"
            onClick={() => {
              setEditingCompany(null)
              setShowCreateModal(true)
            }}
            className=""
          >
            <Plus className="w-4 h-4 mr-2" />
            Registrar primera empresa
          </Button>
        </div>
      )}

      {/* Modal para crear/editar empresas */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingCompany ? 'Editar Empresa' : 'Nueva Empresa'}
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
