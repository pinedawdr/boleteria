'use client'

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
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
  CheckCircle,
  AlertCircle
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
      
      // Fallback con datos mock
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
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Cargando dashboard administrativo...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-300">
          Gestiona tu plataforma de boletería • {dashboardData ? `${dashboardData.totalBookings} reservas totales` : 'Cargando...'}
        </p>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-red-400 font-medium">Error de Conexión</p>
            <p className="text-red-300 text-sm">Mostrando datos de respaldo. Algunos datos pueden no estar actualizados.</p>
          </div>
          <button 
            onClick={loadDashboardData}
            className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-green-400" />
            <span className="text-green-400 text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{dashboardData?.monthlyGrowth || 0}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatCurrency(dashboardData?.totalRevenue || 0)}
          </div>
          <div className="text-gray-400 text-sm">Ingresos Totales</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <Ticket className="h-8 w-8 text-blue-400" />
            <CheckCircle className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {dashboardData?.totalTicketsSold?.toLocaleString() || '0'}
          </div>
          <div className="text-gray-400 text-sm">Boletos Vendidos</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">
              {dashboardData?.totalEvents || 0}
            </span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {dashboardData?.totalEvents || 0}
          </div>
          <div className="text-gray-400 text-sm">Eventos Activos</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <Bus className="h-8 w-8 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">
              {dashboardData?.totalRoutes || 0}
            </span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {dashboardData?.totalRoutes || 0}
          </div>
          <div className="text-gray-400 text-sm">Rutas de Transporte</div>
        </div>
      </motion.div>

      {/* Management Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <Link href="/admin/events" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 group block">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-purple-400 text-sm font-medium">Gestionar</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Eventos</h3>
          <p className="text-gray-400 text-sm mb-3">Crear y administrar eventos</p>
          <div className="text-sm text-gray-500">
            {dashboardData?.totalEvents || 0} eventos activos
          </div>
        </Link>

        <Link href="/admin/routes" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 group block">
          <div className="flex items-center justify-between mb-4">
            <Bus className="h-8 w-8 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-blue-400 text-sm font-medium">Gestionar</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Rutas</h3>
          <p className="text-gray-400 text-sm mb-3">Administrar rutas de transporte</p>
          <div className="text-sm text-gray-500">
            {dashboardData?.totalRoutes || 0} rutas disponibles
          </div>
        </Link>

        <Link href="/admin/venues" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 group block">
          <div className="flex items-center justify-between mb-4">
            <Building className="h-8 w-8 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-indigo-400 text-sm font-medium">Gestionar</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Venues</h3>
          <p className="text-gray-400 text-sm mb-3">Administrar lugares y espacios</p>
          <div className="text-sm text-gray-500">
            Gestión de espacios
          </div>
        </Link>

        <Link href="/admin/companies" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 group block">
          <div className="flex items-center justify-between mb-4">
            <Truck className="h-8 w-8 text-orange-400 group-hover:scale-110 transition-transform" />
            <span className="text-orange-400 text-sm font-medium">Gestionar</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Empresas</h3>
          <p className="text-gray-400 text-sm mb-3">Administrar empresas de transporte</p>
          <div className="text-sm text-gray-500">
            Socios comerciales
          </div>
        </Link>

        <Link href="/admin/bookings" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 group block">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="h-8 w-8 text-green-400 group-hover:scale-110 transition-transform" />
            <span className="text-green-400 text-sm font-medium">Gestionar</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Reservas</h3>
          <p className="text-gray-400 text-sm mb-3">Gestionar reservas y pagos</p>
          <div className="text-sm text-gray-500">
            {dashboardData?.totalBookings || 0} reservas totales
          </div>
        </Link>

        <Link href="/admin/users" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 group block">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-pink-400 group-hover:scale-110 transition-transform" />
            <span className="text-pink-400 text-sm font-medium">Gestionar</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Usuarios</h3>
          <p className="text-gray-400 text-sm mb-3">Administrar usuarios y roles</p>
          <div className="text-sm text-gray-500">
            {dashboardData?.totalUsers || 0} usuarios registrados
          </div>
        </Link>

        <Link href="/admin/analytics" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 group block">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="h-8 w-8 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-cyan-400 text-sm font-medium">Ver</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Analytics</h3>
          <p className="text-gray-400 text-sm mb-3">Analíticas y métricas</p>
          <div className="text-sm text-gray-500">
            Datos en tiempo real
          </div>
        </Link>

        <Link href="/admin/settings" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 group block">
          <div className="flex items-center justify-between mb-4">
            <Settings className="h-8 w-8 text-gray-400 group-hover:scale-110 transition-transform" />
            <span className="text-gray-400 text-sm font-medium">Configurar</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Configuración</h3>
          <p className="text-gray-400 text-sm mb-3">Ajustes del sistema</p>
          <div className="text-sm text-gray-500">
            Parámetros generales
          </div>
        </Link>
      </motion.div>
    </div>
  )
}
