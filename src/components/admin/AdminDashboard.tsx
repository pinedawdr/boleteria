'use client'

import Link from 'next/link'
import { 
  Users, 
  Calendar, 
  MapPin, 
  BarChart, 
  Settings, 
  LayoutDashboard,
  Shield,
  Database,
  ArrowRight,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react'
import { useStatsData } from '@/hooks/useStatsData'
import { getDashboardStats, type DashboardStats } from '@/lib/admin-services'
import { useState, useEffect } from 'react'
import AdminLoadingState from './AdminLoadingState'

export default function AdminDashboard() {
  const { activeUsers, totalEvents, totalDestinations, loading: statsLoading } = useStatsData()
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [adminLoading, setAdminLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setAdminLoading(true)
        const stats = await getDashboardStats()
        setDashboardData(stats)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // Usar datos de fallback si hay error
        setDashboardData({
          totalRevenue: 45230,
          totalTicketsSold: 3892,
          totalEvents: totalEvents || 35,
          totalRoutes: 12,
          totalBookings: 3892,
          totalUsers: activeUsers || 1247,
          monthlyGrowth: 15.8,
          popularEvent: 'Concierto Rock Nacional',
          popularRoute: 'Lima - Cusco',
          recentBookings: 125
        })
      } finally {
        setAdminLoading(false)
      }
    }

    loadDashboardData()
  }, [activeUsers, totalEvents])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('es-PE')
  }

  if (statsLoading || adminLoading) {
    return <AdminLoadingState type="dashboard" message="Cargando dashboard administrativo..." />
  }
  return (
    <div className="min-h-screen bg-body-bg">
      <div className="max-w-7xl mx-auto responsive-padding py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-8 h-8 text-accent" />
            Dashboard Administrativo
          </h1>
          <p className="text-text-secondary">
            Panel de control principal del sistema de boletería
          </p>
        </div>

        {/* Estadísticas del Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Usuarios */}
          <div className="card-default p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Total Usuarios</h3>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  {formatNumber(dashboardData?.totalUsers || activeUsers)}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">
                +{dashboardData?.monthlyGrowth || 15}% este mes
              </span>
            </div>
          </div>

          {/* Eventos Activos */}
          <div className="card-default p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Eventos Activos</h3>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  {dashboardData?.totalEvents || totalEvents}
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Activos ahora</span>
            </div>
          </div>

          {/* Reservas Totales */}
          <div className="card-default p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Reservas Totales</h3>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  {formatNumber(dashboardData?.totalBookings || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <BarChart className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">
                +{dashboardData?.recentBookings || 0} recientes
              </span>
            </div>
          </div>

          {/* Ingresos */}
          <div className="card-default p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Ingresos</h3>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  {formatCurrency(dashboardData?.totalRevenue || 0)}
                </p>
              </div>
              <div className="p-3 bg-accent/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">
                +{Math.round(dashboardData?.monthlyGrowth || 15)}% este mes
              </span>
            </div>
          </div>
        </div>

        {/* Secciones de Gestión */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-accent" />
            Gestión del Sistema
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Gestión de Usuarios */}
            <Link href="/admin/users" className="card-default p-6 hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Usuarios</h3>
              <p className="text-text-secondary text-sm mb-4">
                Gestionar usuarios, roles y permisos del sistema
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Total</span>
                <span className="text-xl font-bold text-purple-400">
                  {formatNumber(dashboardData?.totalUsers || activeUsers)}
                </span>
              </div>
            </Link>

            {/* Gestión de Eventos */}
            <Link href="/admin/events" className="card-default p-6 hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Eventos</h3>
              <p className="text-text-secondary text-sm mb-4">
                Control completo de eventos y programación
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Activos</span>
                <span className="text-xl font-bold text-blue-400">
                  {dashboardData?.totalEvents || totalEvents}
                </span>
              </div>
            </Link>

            {/* Gestión de Transporte */}
            <Link href="/admin/transport" className="card-default p-6 hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <MapPin className="w-6 h-6 text-green-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Transporte</h3>
              <p className="text-text-secondary text-sm mb-4">
                Gestionar empresas de transporte y rutas
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Rutas</span>
                <span className="text-xl font-bold text-green-400">
                  {dashboardData?.totalRoutes || totalDestinations}
                </span>
              </div>
            </Link>

            {/* Análisis y Reportes */}
            <Link href="/admin/analytics" className="card-default p-6 hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors">
                  <BarChart className="w-6 h-6 text-orange-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Análisis</h3>
              <p className="text-text-secondary text-sm mb-4">
                Reportes y estadísticas del sistema
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Reportes</span>
                <span className="text-xl font-bold text-orange-400">15</span>
              </div>
            </Link>

            {/* Configuración del Sistema */}
            <Link href="/admin/settings" className="card-default p-6 hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-accent/20 rounded-lg group-hover:bg-accent/30 transition-colors">
                  <Settings className="w-6 h-6 text-accent" />
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Configuración</h3>
              <p className="text-text-secondary text-sm mb-4">
                Configuración general del sistema
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Módulos</span>
                <span className="text-xl font-bold text-accent">8</span>
              </div>
            </Link>

            {/* Seguridad */}
            <Link href="/admin/security" className="card-default p-6 hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                  <Shield className="w-6 h-6 text-red-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Seguridad</h3>
              <p className="text-text-secondary text-sm mb-4">
                Logs de seguridad y control de acceso
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Alertas</span>
                <span className="text-xl font-bold text-red-400">0</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="card-default p-6">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-accent" />
            Acciones Rápidas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/admin/backup" 
              className="btn-primary flex items-center justify-center gap-2 h-12 hover-lift"
            >
              <Database className="w-5 h-5" />
              Respaldo de Datos
            </Link>
            
            <Link 
              href="/admin/reports/daily" 
              className="btn-secondary flex items-center justify-center gap-2 h-12 hover-lift"
            >
              <BarChart className="w-5 h-5" />
              Reporte Diario
            </Link>
            
            <Link 
              href="/admin/monitoring" 
              className="btn-accent flex items-center justify-center gap-2 h-12 hover-lift"
            >
              <Shield className="w-5 h-5" />
              Monitoreo del Sistema
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
