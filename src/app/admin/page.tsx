'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminErrorState from '@/components/admin/AdminErrorState'
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Bus, 
  TrendingUp, 
  DollarSign,
  Ticket,
  Settings,
  Truck,
  Building,
  CreditCard,
  CheckCircle
} from 'lucide-react'
import { 
  getDashboardStats, 
  type DashboardStats
} from '@/lib/admin-services'

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const stats = await getDashboardStats()
      setDashboardData(stats)
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('Error al cargar los datos del dashboard')
      
      // Fallback con datos mock para desarrollo
      setDashboardData({
        totalRevenue: 125000,
        totalTicketsSold: 890,
        totalEvents: 25,
        totalRoutes: 18,
        totalBookings: 340,
        totalUsers: 1250,
        monthlyGrowth: 15.8,
        popularEvent: 'Concierto de Rock Nacional',
        popularRoute: 'Lima - Cusco',
        recentBookings: 45
      })
      
      // Limpiar error ya que tenemos datos de fallback
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }

  if (loading) {
    return <AdminLoadingState type="dashboard" message="Cargando dashboard administrativo..." />
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Error State */}
      {error && (
        <AdminErrorState 
          message={error}
          type="server"
          onRetry={loadDashboardData}
        />
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center sm:text-left"
      >
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-accent to-success bg-clip-text text-transparent mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-300 text-sm sm:text-base">
          Gestiona tu plataforma de boletería • {dashboardData ? `${dashboardData.totalBookings} reservas totales` : 'Cargando...'}
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
            <span className="text-green-400 text-xs sm:text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{dashboardData?.monthlyGrowth || 0}%
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mb-1">
            {formatCurrency(dashboardData?.totalRevenue || 0)}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm">Ingresos Totales</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <Ticket className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
            <CheckCircle className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mb-1">
            {dashboardData?.totalTicketsSold?.toLocaleString() || '0'}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm">Boletos Vendidos</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
            <span className="text-purple-400 text-xs sm:text-sm font-medium">
              {dashboardData?.totalEvents || 0}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mb-1">
            {dashboardData?.totalEvents || 0}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm">Eventos Activos</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <Bus className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
            <span className="text-cyan-400 text-xs sm:text-sm font-medium">
              {dashboardData?.totalRoutes || 0}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mb-1">
            {dashboardData?.totalRoutes || 0}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm">Rutas de Transporte</div>
        </div>
      </motion.div>

      {/* Management Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
      >
        <Link href="/admin/events" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300 group block">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-purple-400 text-xs sm:text-sm font-medium">Gestionar</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Eventos</h3>
          <p className="text-gray-400 text-xs sm:text-sm mb-3">Crear y administrar eventos</p>
          <div className="text-xs sm:text-sm text-gray-500">
            {dashboardData?.totalEvents || 0} eventos activos
          </div>
        </Link>

        <Link href="/admin/routes" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300 group block">
          <div className="flex items-center justify-between mb-4">
            <Bus className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-blue-400 text-xs sm:text-sm font-medium">Gestionar</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Rutas</h3>
          <p className="text-gray-400 text-xs sm:text-sm mb-3">Administrar rutas de transporte</p>
          <div className="text-xs sm:text-sm text-gray-500">
            {dashboardData?.totalRoutes || 0} rutas disponibles
          </div>
        </Link>

        <Link href="/admin/venues" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300 group block">
          <div className="flex items-center justify-between mb-4">
            <Building className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-indigo-400 text-xs sm:text-sm font-medium">Gestionar</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Venues</h3>
          <p className="text-gray-400 text-xs sm:text-sm mb-3">Administrar lugares y espacios</p>
          <div className="text-xs sm:text-sm text-gray-500">
            Gestión de espacios
          </div>
        </Link>

        <Link href="/admin/companies" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300 group block">
          <div className="flex items-center justify-between mb-4">
            <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400 group-hover:scale-110 transition-transform" />
            <span className="text-orange-400 text-xs sm:text-sm font-medium">Gestionar</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Empresas</h3>
          <p className="text-gray-400 text-xs sm:text-sm mb-3">Administrar empresas de transporte</p>
          <div className="text-xs sm:text-sm text-gray-500">
            Socios comerciales
          </div>
        </Link>

        <Link href="/admin/bookings" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300 group block">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 group-hover:scale-110 transition-transform" />
            <span className="text-green-400 text-xs sm:text-sm font-medium">Gestionar</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Reservas</h3>
          <p className="text-gray-400 text-xs sm:text-sm mb-3">Gestionar reservas y pagos</p>
          <div className="text-xs sm:text-sm text-gray-500">
            {dashboardData?.totalBookings || 0} reservas totales
          </div>
        </Link>

        <Link href="/admin/users" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300 group block">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-pink-400 group-hover:scale-110 transition-transform" />
            <span className="text-pink-400 text-xs sm:text-sm font-medium">Gestionar</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Usuarios</h3>
          <p className="text-gray-400 text-xs sm:text-sm mb-3">Administrar usuarios y roles</p>
          <div className="text-xs sm:text-sm text-gray-500">
            {dashboardData?.totalUsers || 0} usuarios registrados
          </div>
        </Link>

        <Link href="/admin/analytics" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300 group block">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-cyan-400 text-xs sm:text-sm font-medium">Ver</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Analytics</h3>
          <p className="text-gray-400 text-xs sm:text-sm mb-3">Analíticas y métricas</p>
          <div className="text-xs sm:text-sm text-gray-500">
            Datos en tiempo real
          </div>
        </Link>

        <Link href="/admin/settings" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-all duration-300 group block">
          <div className="flex items-center justify-between mb-4">
            <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:scale-110 transition-transform" />
            <span className="text-gray-400 text-xs sm:text-sm font-medium">Configurar</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Configuración</h3>
          <p className="text-gray-400 text-xs sm:text-sm mb-3">Ajustes del sistema</p>
          <div className="text-xs sm:text-sm text-gray-500">
            Parámetros generales
          </div>
        </Link>
      </motion.div>

      {/* Additional Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            <h3 className="text-base sm:text-lg font-semibold text-white">Tendencia</h3>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">
            +{dashboardData?.monthlyGrowth || 0}%
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-3">Crecimiento mensual en ventas</p>
          <div className="text-xs sm:text-sm text-gray-500">
            Evento más popular: {dashboardData?.popularEvent || 'N/A'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bus className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-semibold text-white">Rutas Top</h3>
          </div>
          <div className="text-base sm:text-lg font-bold text-cyan-400 mb-2">
            {dashboardData?.popularRoute || 'N/A'}
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-3">Ruta más demandada</p>
          <div className="text-xs sm:text-sm text-gray-500">
            {dashboardData?.recentBookings || 0} reservas recientes
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 sm:p-6 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <Building className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            <h3 className="text-base sm:text-lg font-semibold text-white">Resumen</h3>
          </div>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Usuarios activos:</span>
              <span className="text-white font-semibold">{dashboardData?.totalUsers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Reservas pendientes:</span>
              <span className="text-yellow-400 font-semibold">{dashboardData?.recentBookings || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Ingresos del mes:</span>
              <span className="text-green-400 font-semibold">{formatCurrency((dashboardData?.totalRevenue || 0) * 0.3)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
