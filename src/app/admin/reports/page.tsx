'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useReportsData } from '@/hooks/useReportsData'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminErrorState from '@/components/admin/AdminErrorState'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  PieChart,
  LineChart,
  Activity,
  MapPin,
  Star,
  Zap
} from 'lucide-react'

const timeRanges = ['Últimos 7 días', 'Últimos 30 días', 'Últimos 3 meses', 'Último año']

export default function ReportsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('Últimos 30 días')
  const [activeChart, setActiveChart] = useState('sales')
  
  const { loading, error, reportsData, refetch } = useReportsData(selectedTimeRange)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`icon-xs ${
              star <= rating ? 'text-warning fill-current' : 'text-text-muted'
            }`}
          />
        ))}
        <span className="text-xs text-text-secondary ml-1">{rating.toFixed(1)}</span>
      </div>
    )
  }

  if (loading) {
    return <AdminLoadingState />
  }

  if (error) {
    return <AdminErrorState message={error} onRetry={refetch} />
  }

  if (!reportsData) {
    return <AdminErrorState message="No se pudieron cargar los datos de reportes" onRetry={refetch} />
  }

  const { 
    totalRevenue, 
    eventsRevenue, 
    transportRevenue, 
    avgMonthlyGrowth,
    salesData,
    topEvents,
    topRoutes,
    categoryData
  } = reportsData

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3 mb-2">
                <BarChart3 className="w-8 h-8 text-accent" />
                Reportes y Análisis
              </h1>
              <p className="text-text-secondary">
                Insights detallados de tu plataforma de boletos y transporte
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              >
                {timeRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Exportar Reporte
              </motion.button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-default p-6 hover-lift"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Ingresos Totales</p>
                <p className="text-2xl font-bold text-text-primary">{formatCurrency(totalRevenue)}</p>
                <p className="text-sm text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  {formatPercentage(avgMonthlyGrowth)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-accent to-accent-light p-3 rounded-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-default p-6 hover-lift"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Ingresos Eventos</p>
                <p className="text-2xl font-bold text-text-primary">{formatCurrency(eventsRevenue)}</p>
                <p className="text-sm text-accent flex items-center gap-1 mt-1">
                  <Activity className="w-4 h-4" />
                  {((eventsRevenue / totalRevenue) * 100).toFixed(1)}% del total
                </p>
              </div>
              <div className="bg-gradient-to-r from-accent to-accent-light p-3 rounded-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-default p-6 hover-lift"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Ingresos Transporte</p>
                <p className="text-2xl font-bold text-text-primary">{formatCurrency(transportRevenue)}</p>
                <p className="text-sm text-secondary flex items-center gap-1 mt-1">
                  <Activity className="w-4 h-4" />
                  {((transportRevenue / totalRevenue) * 100).toFixed(1)}% del total
                </p>
              </div>
              <div className="bg-gradient-to-r from-secondary to-secondary-light p-3 rounded-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-default p-6 hover-lift"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Crecimiento Mensual</p>
                <p className="text-2xl font-bold text-text-primary">{formatPercentage(avgMonthlyGrowth)}</p>
                <p className="text-sm text-success flex items-center gap-1 mt-1">
                  <Zap className="w-4 h-4" />
                  Excelente rendimiento
                </p>
              </div>
              <div className="bg-gradient-to-r from-success to-success-light p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 card-default p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">Evolución de Ingresos</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveChart('sales')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    activeChart === 'sales'
                      ? 'bg-accent/20 text-accent'
                      : 'text-text-secondary hover:bg-hover-bg'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-1" />
                  Ventas
                </button>
                <button
                  onClick={() => setActiveChart('trends')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    activeChart === 'trends'
                      ? 'bg-accent/20 text-accent'
                      : 'text-text-secondary hover:bg-hover-bg'
                  }`}
                >
                  <LineChart className="w-4 h-4 inline mr-1" />
                  Tendencias
                </button>
              </div>
            </div>
            
            {/* Mock Chart */}
            <div className="h-64 flex items-end justify-between gap-4 bg-gradient-to-t from-card-light to-transparent rounded-lg p-4">
              {salesData.map((data) => (
                <div key={data.period} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col gap-1 mb-2">
                    <div 
                      className="bg-gradient-to-t from-accent to-accent-light rounded-t"
                      style={{ height: `${(data.events / 1000)}px` }}
                    ></div>
                    <div 
                      className="bg-gradient-to-t from-secondary to-secondary-light rounded-b"
                      style={{ height: `${(data.transport / 1000)}px` }}
                    ></div>
                  </div>
                  <span className="text-xs text-text-secondary">{data.period}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded"></div>
                <span className="text-sm text-text-secondary">Eventos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-body-bg rounded"></div>
                <span className="text-sm text-text-secondary">Transporte</span>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="card-default p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-6">Distribución por Categoría</h3>
            
            {/* Mock Pie Chart */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-accent to-secondary"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-text-secondary" />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {categoryData.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${category.color}`}></div>
                    <span className="text-sm text-text-secondary">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-text-primary">
                      {formatCurrency(category.revenue)}
                    </div>
                    <div className="text-xs text-text-muted">{category.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Events */}
          <div className="card-default p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">Eventos Más Exitosos</h3>
              <button className="text-accent hover:text-accent-light text-sm font-medium">
                Ver todos
              </button>
            </div>
            
            <div className="space-y-4">
              {topEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-card-light rounded-lg hover:bg-hover-bg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-accent to-accent-light rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">{event.name}</div>
                      <div className="text-sm text-text-secondary">{event.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-text-primary">{formatCurrency(event.revenue)}</div>
                    <div className="text-sm text-text-secondary">{event.tickets} tickets</div>
                    <div className={`text-xs flex items-center gap-1 ${
                      event.growth >= 0 ? 'text-success' : 'text-error'
                    }`}>
                      {event.growth >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {formatPercentage(event.growth)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Top Routes */}
          <div className="card-default p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">Rutas Más Populares</h3>
              <button className="text-accent hover:text-accent-light text-sm font-medium">
                Ver todas
              </button>
            </div>
            
            <div className="space-y-4">
              {topRoutes.map((route, index) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-card-light rounded-lg hover:bg-hover-bg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-secondary to-secondary-light rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">
                        {route.origin} → {route.destination}
                      </div>
                      <div className="text-sm text-text-secondary">{route.company}</div>
                      {renderStars(route.rating)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-text-primary">{formatCurrency(route.revenue)}</div>
                    <div className="text-sm text-text-secondary">{route.bookings} reservas</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 card-default p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-accent/10 hover:bg-accent/20 rounded-lg transition-all duration-200 text-center"
            >
              <Calendar className="w-8 h-8 text-accent mx-auto mb-2" />
              <span className="text-sm font-medium text-text-primary">Crear Evento</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-body-bg/10 hover:bg-body-bg/20 rounded-lg transition-all duration-200 text-center"
            >
              <MapPin className="w-8 h-8 text-secondary mx-auto mb-2" />
              <span className="text-sm font-medium text-text-primary">Nueva Ruta</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-success/10 hover:bg-success/20 rounded-lg transition-all duration-200 text-center"
            >
              <BarChart3 className="w-8 h-8 text-success mx-auto mb-2" />
              <span className="text-sm font-medium text-text-primary">Análisis Detallado</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-warning/10 hover:bg-warning/20 rounded-lg transition-all duration-200 text-center"
            >
              <Download className="w-8 h-8 text-warning mx-auto mb-2" />
              <span className="text-sm font-medium text-text-primary">Exportar Todo</span>
            </motion.button>
          </div>
        </div>
    </div>
  )
}
