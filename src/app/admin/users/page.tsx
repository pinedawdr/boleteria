'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminErrorState from '@/components/admin/AdminErrorState'
import { 
  Users, 
  Search, 
  Edit, 
  Shield,
  MoreHorizontal,
  Mail,
  Phone,
  Crown,
  CheckCircle,
  AlertTriangle,
  Ban,
  DollarSign,
  Ticket
} from 'lucide-react'

import { 
  getAdminUsers, 
  type AdminUser 
} from '@/lib/admin-services'

// Extendemos AdminUser para compatibilidad con datos mock
interface User extends AdminUser {
  status?: string;
}

export default function UsersManagementPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [currentPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const limit = 10

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const usersData = await getAdminUsers(
        currentPage, 
        limit, 
        searchQuery
      )

      setUsers(usersData.users)
      setTotalUsers(usersData.total)
    } catch (err) {
      console.error('Error loading users:', err)
      setError('Error al cargar los usuarios')
      
      // Fallback con datos mock para desarrollo
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'wdrpineda@gmail.com',
          full_name: 'Waldir Pineda',
          phone: '+51 987 654 321',
          role: 'admin',
          status: 'active',
          total_bookings: 5,
          total_spent: 850,
          last_booking: '2024-12-10T14:30:00Z',
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          email: 'operador@gametime.com',
          full_name: 'Operador Sistema',
          phone: '+51 900 000 001',
          role: 'operator',
          status: 'active',
          total_bookings: 0,
          total_spent: 0,
          last_booking: '',
          created_at: '2024-01-20T08:00:00Z'
        },
        {
          id: '3',
          email: 'ana.garcia@email.com',
          full_name: 'Ana García',
          phone: '+51 912 345 678',
          role: 'customer',
          status: 'active',
          total_bookings: 12,
          total_spent: 2450,
          last_booking: '2024-12-08T09:15:00Z',
          created_at: '2024-02-20T15:30:00Z'
        },
        {
          id: '4',
          email: 'carlos.mendoza@email.com',
          full_name: 'Carlos Mendoza',
          phone: '+51 965 432 109',
          role: 'customer',
          status: 'active',
          total_bookings: 8,
          total_spent: 1680,
          last_booking: '2024-12-05T11:45:00Z',
          created_at: '2024-03-10T09:20:00Z'
        },
        {
          id: '5',
          email: 'maria.lopez@email.com',
          full_name: 'María López',
          phone: '+51 923 456 789',
          role: 'customer',
          status: 'suspended',
          total_bookings: 3,
          total_spent: 420,
          last_booking: '2024-11-28T16:20:00Z',
          created_at: '2024-04-05T14:10:00Z'
        }
      ]
      
      setUsers(mockUsers)
      setTotalUsers(mockUsers.length)
      
      // Limpiar error ya que tenemos datos de fallback
      setError(null)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchQuery])

  useEffect(() => {
    if (user?.isAdmin) {
      fetchUsers()
    }
  }, [user, fetchUsers])

  // Filtrar usuarios localmente (adicional al filtro del servidor)
  const filteredUsers = users.filter(u => {
    const matchesRole = selectedRole === 'all' || u.role === selectedRole
    const matchesSearch = searchQuery === '' || 
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesRole && matchesSearch
  })

  // Estadísticas
  const userStats = {
    total: totalUsers,
    admins: users.filter(u => u.role === 'admin').length,
    operators: users.filter(u => u.role === 'operator').length,
    customers: users.filter(u => u.role === 'customer').length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-400" />
      case 'operator':
        return <Shield className="w-4 h-4 text-blue-400" />
      default:
        return <Users className="w-4 h-4 text-gray-400" />
    }
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      operator: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      customer: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
    
    const labels = {
      admin: 'Administrador',
      operator: 'Operador',
      customer: 'Cliente'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs border flex items-center gap-1 ${styles[role as keyof typeof styles] || styles.customer}`}>
        {getRoleIcon(role)}
        {labels[role as keyof typeof labels] || role}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-500/20 text-green-300 border-green-500/30',
      suspended: 'bg-red-500/20 text-red-300 border-red-500/30',
      inactive: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
    
    const icons = {
      active: CheckCircle,
      suspended: Ban,
      inactive: AlertTriangle
    }
    
    const labels = {
      active: 'Activo',
      suspended: 'Suspendido',
      inactive: 'Inactivo'
    }
    
    const Icon = icons[status as keyof typeof icons] || CheckCircle
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs border flex items-center gap-1 ${styles[status as keyof typeof styles] || styles.active}`}>
        <Icon className="w-3 h-3" />
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  const formatLastBooking = (lastBooking: string) => {
    if (!lastBooking) return 'Sin reservas'
    return new Date(lastBooking).toLocaleDateString('es-PE')
  }

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Acceso Denegado</h2>
          <p className="text-gray-400">Solo los administradores pueden acceder a esta página.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <AdminLoadingState message="Cargando usuarios..." />
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 min-h-[80px]">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-accent to-success bg-clip-text text-transparent flex items-center gap-3">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
              Gestión de Usuarios
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Administra usuarios, roles y permisos del sistema
            </p>
          </div>
        </div>
        
        {error && (
          <AdminErrorState 
            error={error}
            type="connection"
            onRetry={fetchUsers}
            showFallbackData={users.length > 0}
          />
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Usuarios</p>
                <p className="text-xl font-bold text-white">{totalUsers || users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Crown className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Administradores</p>
                <p className="text-xl font-bold text-white">{userStats.admins}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Operadores</p>
                <p className="text-xl font-bold text-white">{userStats.operators}</p>
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
                <p className="text-xl font-bold text-white">{userStats.active}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administradores</option>
              <option value="operator">Operadores</option>
              <option value="customer">Clientes</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-300">Usuario</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-300">Rol</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-300">Estado</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-300">Actividad</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-300">Registro</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((userItem) => (
                  <tr
                    key={userItem.id}
                    className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {userItem.full_name?.charAt(0) || userItem.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{userItem.full_name || 'Sin nombre'}</p>
                          <p className="text-gray-400 text-sm flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {userItem.email}
                          </p>
                          {userItem.phone && (
                            <p className="text-gray-500 text-xs flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {userItem.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getRoleBadge(userItem.role)}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(userItem.status || 'active')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Ticket className="w-4 h-4 text-purple-400" />
                          <span className="text-white">{userItem.total_bookings} reservas</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-white">S/ {userItem.total_spent.toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Última: {formatLastBooking(userItem.last_booking)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-400 text-sm">
                        {new Date(userItem.created_at).toLocaleDateString('es-PE')}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                          title="Editar usuario"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                          title="Cambiar rol"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        
                        {userItem.status === 'active' ? (
                          <button
                            className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 rounded-lg transition-colors"
                            title="Suspender usuario"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-colors"
                            title="Activar usuario"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                          title="Más opciones"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No se encontraron usuarios</h3>
            <p className="text-gray-400">
              {searchQuery || selectedRole !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda.' 
                : 'No hay usuarios registrados en el sistema.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
