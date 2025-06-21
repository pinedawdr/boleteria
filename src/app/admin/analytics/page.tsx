'use client'

import { useState } from 'react'
import { useAnalyticsData } from '@/hooks/useAnalyticsData'
import { Button } from '@/components/ui/Button'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminErrorState from '@/components/admin/AdminErrorState'
import { 
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  Download,
  RefreshCw,
  Eye,
  ArrowUp,
  ArrowDown,
  Activity,
  Target,
  Bus
} from 'lucide-react'

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const { 
    loading, 
    error, 
    analyticsData, 
    revenueChart, 
    bookingsChart, 
    refetch 
  } = useAnalyticsData(selectedPeriod)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-PE').format(num)
  }

  if (loading) {
    return <AdminLoadingState message="Cargando analytics..." />
  }

  if (error) {
    return <AdminErrorState message={error} onRetry={refetch} />
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 min-h-[80px]">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-accent to-success bg-clip-text text-transparent flex items-center gap-3">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
              Analíticas y Reportes
            </h1>
            <p className="text-gray-300 text-sm sm:text-base mt-1">
              Métricas y estadísticas de rendimiento del negocio
            </p>
          </div>
        
          <div className="flex flex-shrink-0 flex-wrap gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors min-w-[140px]"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="1y">Último año</option>
            </select>
            
            <Button
              onClick={refetch}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </Button>
            
            <Button className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-default p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <span className="text-text-secondary">Ingresos Totales</span>
            </div>
            <div className={`flex items-center gap-1 ${
              (analyticsData?.revenueGrowth || 0) >= 0 ? 'text-success' : 'text-error'
            }`}>
              {(analyticsData?.revenueGrowth || 0) >= 0 ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              <span className="text-sm">
                {Math.abs(analyticsData?.revenueGrowth || 0).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {analyticsData ? formatCurrency(analyticsData.revenue) : 'S/ 0'}
          </p>
          <p className="text-sm text-text-secondary mt-1">
            vs período anterior
          </p>
        </div>

        <div className="card-default p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/20 rounded-lg">
                <Activity className="w-6 h-6 text-accent" />
              </div>
              <span className="text-text-secondary">Total Reservas</span>
            </div>
            <div className={`flex items-center gap-1 ${
              (analyticsData?.bookingsGrowth || 0) >= 0 ? 'text-success' : 'text-error'
            }`}>
              {(analyticsData?.bookingsGrowth || 0) >= 0 ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              <span className="text-sm">
                {Math.abs(analyticsData?.bookingsGrowth || 0).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {analyticsData ? formatNumber(analyticsData.bookings) : '0'}
          </p>
          <p className="text-sm text-text-secondary mt-1">
            reservas completadas
          </p>
        </div>

        <div className="card-default p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-info/20 rounded-lg">
                <Users className="w-6 h-6 text-info" />
              </div>
              <span className="text-text-secondary">Usuarios Activos</span>
            </div>
            <div className={`flex items-center gap-1 ${
              (analyticsData?.usersGrowth || 0) >= 0 ? 'text-success' : 'text-error'
            }`}>
              {(analyticsData?.usersGrowth || 0) >= 0 ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              <span className="text-sm">
                {Math.abs(analyticsData?.usersGrowth || 0).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {analyticsData ? formatNumber(analyticsData.users) : '0'}
          </p>
          <p className="text-sm text-text-secondary mt-1">
            usuarios registrados
          </p>
        </div>

        <div className="card-default p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-warning/20 rounded-lg">
                <Target className="w-6 h-6 text-warning" />
              </div>
              <span className="text-text-secondary">Tasa Conversión</span>
            </div>
            <div className={`flex items-center gap-1 ${
              (analyticsData?.conversionGrowth || 0) >= 0 ? 'text-success' : 'text-error'
            }`}>
              {(analyticsData?.conversionGrowth || 0) >= 0 ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              <span className="text-sm">
                {Math.abs(analyticsData?.conversionGrowth || 0).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {analyticsData ? `${analyticsData.conversionRate.toFixed(1)}%` : '0%'}
          </p>
          <p className="text-sm text-text-secondary mt-1">
            visitantes a clientes
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card-default p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">
              Ingresos por Mes
            </h3>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {revenueChart.length > 0 ? (
              revenueChart.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-body-bg rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{item.name}</span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{formatCurrency(item.value)}</p>
                      <div className="flex items-center gap-1">
                        {item.growth > 0 ? (
                          <ArrowUp className="w-3 h-3 text-success" />
                        ) : item.growth < 0 ? (
                          <ArrowDown className="w-3 h-3 text-error" />
                        ) : (
                          <span className="w-3 h-3" />
                        )}
                        <span className={`text-xs ${
                          item.growth > 0 ? 'text-success' : 
                          item.growth < 0 ? 'text-error' : 'text-text-secondary'
                        }`}>
                          {item.growth === 0 ? 'N/A' : `${Math.abs(item.growth).toFixed(1)}%`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-20 h-2 bg-hover-bg rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full"
                      style={{ 
                        width: `${Math.min((item.value / Math.max(...revenueChart.map(r => r.value), 1)) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-8 text-text-secondary">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 text-border-color" />
                  <p>No hay datos de ingresos disponibles</p>
                  <p className="text-sm">Los datos aparecerán cuando se realicen reservas</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bookings by Type */}
        <div className="card-default p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">
              Reservas por Tipo
            </h3>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {bookingsChart.length > 0 ? (
              bookingsChart.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-body-bg rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.name === 'Eventos' ? 'bg-accent' :
                      item.name === 'Transporte' ? 'bg-info' : 'bg-hover-bg'
                    }`}>
                      {item.name === 'Eventos' ? (
                        <Calendar className="w-5 h-5 text-white" />
                      ) : item.name === 'Transporte' ? (
                        <Bus className="w-5 h-5 text-white" />
                      ) : (
                        <Target className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{item.name}</p>
                      <p className="text-text-secondary text-sm">{formatNumber(item.value)} reservas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-text-primary">{item.value}</p>
                    <div className="flex items-center gap-1">
                      {item.growth > 0 ? (
                        <ArrowUp className="w-3 h-3 text-success" />
                      ) : item.growth === 0 ? (
                        <span className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-error" />
                      )}
                      <span className={`text-xs ${
                        item.growth > 0 ? 'text-success' : 
                        item.growth === 0 ? 'text-text-secondary' : 'text-error'
                      }`}>
                        {item.growth === 0 ? 'N/A' : `${Math.abs(item.growth).toFixed(1)}%`}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-8 text-text-secondary">
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-border-color" />
                  <p>No hay datos de reservas disponibles</p>
                  <p className="text-sm">Los datos aparecerán cuando se realicen reservas</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="card-default p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Reportes Detallados
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-body-bg hover:bg-hover-bg rounded-lg border border-border-color transition-colors text-left hover-lift">
            <Calendar className="w-8 h-8 text-accent mb-3" />
            <h4 className="font-medium text-text-primary mb-1">Eventos</h4>
            <p className="text-sm text-text-secondary">Rendimiento por evento</p>
          </button>
          
          <button className="p-4 bg-body-bg hover:bg-hover-bg rounded-lg border border-border-color transition-colors text-left hover-lift">
            <Bus className="w-8 h-8 text-info mb-3" />
            <h4 className="font-medium text-text-primary mb-1">Transporte</h4>
            <p className="text-sm text-text-secondary">Análisis de rutas</p>
          </button>
          
          <button className="p-4 bg-body-bg hover:bg-hover-bg rounded-lg border border-border-color transition-colors text-left hover-lift">
            <Users className="w-8 h-8 text-success mb-3" />
            <h4 className="font-medium text-text-primary mb-1">Usuarios</h4>
            <p className="text-sm text-text-secondary">Comportamiento de clientes</p>
          </button>
          
          <button className="p-4 bg-body-bg hover:bg-hover-bg rounded-lg border border-border-color transition-colors text-left hover-lift">
            <DollarSign className="w-8 h-8 text-warning mb-3" />
            <h4 className="font-medium text-text-primary mb-1">Finanzas</h4>
            <p className="text-sm text-text-secondary">Análisis financiero</p>
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}
