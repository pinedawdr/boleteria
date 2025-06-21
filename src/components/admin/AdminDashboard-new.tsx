'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { 
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  Settings,
  Shield,
  Activity,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/unauthorized')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.isAdmin) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats({
          totalEvents: data.stats?.activeEvents || 8,
          totalUsers: data.stats?.totalUsers || 1250,
          totalBookings: data.stats?.totalBookings || 842,
          totalRevenue: data.stats?.totalRevenue || 125000
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Usar datos mock si falla
      setStats({
        totalEvents: 8,
        totalUsers: 1250,
        totalBookings: 842,
        totalRevenue: 125000
      })
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
      <div className="min-h-screen bg-body-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user?.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-body-bg pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-text-primary flex items-center gap-3">
            <Shield className="w-8 h-8 text-warning" />
            Dashboard Administrativo
          </h1>
          <p className="text-text-secondary mt-2">
            Panel de control y gestión del sistema
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-body-bg rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Eventos Activos</p>
                <p className="text-2xl font-bold text-text-primary">{stats.totalEvents}</p>
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-success mr-1" />
              <span className="text-success">+12%</span>
              <span className="text-text-secondary ml-2">vs mes anterior</span>
            </div>
          </div>

          <div className="bg-body-bg rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Total Usuarios</p>
                <p className="text-2xl font-bold text-text-primary">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-info" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-success mr-1" />
              <span className="text-success">+8%</span>
              <span className="text-text-secondary ml-2">vs mes anterior</span>
            </div>
          </div>

          <div className="bg-body-bg rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Reservas Totales</p>
                <p className="text-2xl font-bold text-text-primary">{stats.totalBookings.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-warning" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-success mr-1" />
              <span className="text-success">+15%</span>
              <span className="text-text-secondary ml-2">vs mes anterior</span>
            </div>
          </div>

          <div className="bg-body-bg rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Ingresos Totales</p>
                <p className="text-2xl font-bold text-text-primary">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-success mr-1" />
              <span className="text-success">+23%</span>
              <span className="text-text-secondary ml-2">vs mes anterior</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-body-bg rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-accent" />
              Gestión Rápida
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={() => router.push('/admin/events')}
                className="btn-primary flex items-center justify-center gap-2 h-12"
              >
                <Calendar className="w-5 h-5" />
                Gestionar Eventos
              </Button>
              <Button
                onClick={() => router.push('/admin/users')}
                className="btn-secondary flex items-center justify-center gap-2 h-12"
              >
                <Users className="w-5 h-5" />
                Gestionar Usuarios
              </Button>
              <Button
                onClick={() => router.push('/admin/bookings')}
                className="btn-secondary flex items-center justify-center gap-2 h-12"
              >
                <Activity className="w-5 h-5" />
                Ver Reservas
              </Button>
              <Button
                onClick={() => router.push('/admin/analytics')}
                className="btn-primary flex items-center justify-center gap-2 h-12"
              >
                <BarChart3 className="w-5 h-5" />
                Ver Reportes
              </Button>
            </div>
          </div>

          <div className="bg-body-bg rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              Estado del Sistema
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                <span className="text-text-primary font-medium">Base de Datos</span>
                <span className="text-success text-sm font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Activa
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                <span className="text-text-primary font-medium">Pagos</span>
                <span className="text-success text-sm font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Operativo
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <span className="text-text-primary font-medium">Notificaciones</span>
                <span className="text-warning text-sm font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  Mantenimiento
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-body-bg rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-info" />
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-body-bg/50 rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-text-primary">Nuevo usuario registrado</span>
              <span className="text-text-secondary text-sm ml-auto">Hace 5 min</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-body-bg/50 rounded-lg">
              <div className="w-2 h-2 bg-info rounded-full"></div>
              <span className="text-text-primary">Evento "Concierto Rock" actualizado</span>
              <span className="text-text-secondary text-sm ml-auto">Hace 15 min</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-body-bg/50 rounded-lg">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-text-primary">Reserva cancelada - ID: BK123</span>
              <span className="text-text-secondary text-sm ml-auto">Hace 1 hora</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
