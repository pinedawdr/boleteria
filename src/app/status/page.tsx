'use client'

import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Activity, 
  Server,
  Database,
  Globe,
  CreditCard,
  MessageCircle,
  Calendar,
  Wifi,
  Bell,
  TrendingUp,
  Eye,
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Container } from '@/components/layout'

export default function StatusPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date())
      }, 30000) // Actualizar cada 30 segundos

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-accent'
      case 'degraded': return 'text-yellow-400'
      case 'outage': return 'text-red-400'
      case 'maintenance': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle
      case 'degraded': return AlertTriangle
      case 'outage': return XCircle
      case 'maintenance': return Clock
      default: return CheckCircle
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational': return 'Operativo'
      case 'degraded': return 'Degradado'
      case 'outage': return 'Fuera de Servicio'
      case 'maintenance': return 'Mantenimiento'
      default: return 'Desconocido'
    }
  }

  const services = [
    {
      name: 'Página Web Principal',
      description: 'Sitio web de Boletería y funcionalidades principales',
      status: 'operational',
      uptime: 99.97,
      responseTime: 245,
      icon: Globe
    },
    {
      name: 'API de Eventos',
      description: 'Servicio para consultar y reservar eventos',
      status: 'operational',
      uptime: 99.95,
      responseTime: 189,
      icon: Calendar
    },
    {
      name: 'Sistema de Pagos',
      description: 'Procesamiento de pagos y transacciones',
      status: 'operational',
      uptime: 99.99,
      responseTime: 156,
      icon: CreditCard
    },
    {
      name: 'Base de Datos Principal',
      description: 'Almacenamiento de datos de usuarios y reservas',
      status: 'operational',
      uptime: 99.98,
      responseTime: 78,
      icon: Database
    },
    {
      name: 'Servicio de Transporte',
      description: 'Reservas y gestión de transportes',
      status: 'operational',
      uptime: 99.94,
      responseTime: 203,
      icon: Server
    },
    {
      name: 'Notificaciones',
      description: 'Emails, SMS y notificaciones push',
      status: 'degraded',
      uptime: 98.87,
      responseTime: 423,
      icon: Bell
    },
    {
      name: 'Soporte en Vivo',
      description: 'Chat y soporte al cliente',
      status: 'operational',
      uptime: 99.92,
      responseTime: 298,
      icon: MessageCircle
    },
    {
      name: 'CDN y Assets',
      description: 'Entrega de contenido y archivos estáticos',
      status: 'operational',
      uptime: 99.96,
      responseTime: 89,
      icon: Wifi
    }
  ]

  const incidents = [
    {
      id: 1,
      title: 'Retrasos en el servicio de notificaciones',
      status: 'investigating',
      severity: 'minor',
      startTime: '2024-03-15 14:30',
      description: 'Algunos usuarios pueden experimentar retrasos en la recepción de emails de confirmación.',
      updates: [
        {
          time: '2024-03-15 15:45',
          message: 'Hemos identificado la causa del problema y estamos trabajando en una solución.',
          status: 'investigating'
        },
        {
          time: '2024-03-15 14:30',
          message: 'Recibimos reportes de retrasos en notificaciones. Investigando la causa.',
          status: 'identified'
        }
      ]
    }
  ]

  const metrics = [
    {
      name: 'Tiempo de actividad promedio',
      value: '99.94%',
      change: '+0.02%',
      trend: 'up',
      period: 'Últimos 30 días'
    },
    {
      name: 'Tiempo de respuesta promedio',
      value: '187ms',
      change: '-12ms',
      trend: 'up',
      period: 'Última semana'
    },
    {
      name: 'Transacciones exitosas',
      value: '99.97%',
      change: '+0.01%',
      trend: 'up',
      period: 'Últimas 24 horas'
    },
    {
      name: 'Incidentes resueltos',
      value: '< 2 horas',
      change: '-15 min',
      trend: 'up',
      period: 'Tiempo promedio'
    }
  ]

  const maintenanceSchedule = [
    {
      title: 'Actualización del sistema de pagos',
      date: '20 de Marzo, 2024',
      time: '02:00 - 04:00 AM',
      impact: 'Los pagos podrían estar temporalmente no disponibles',
      status: 'scheduled'
    },
    {
      title: 'Migración de servidores de base de datos',
      date: '25 de Marzo, 2024',
      time: '01:00 - 03:00 AM',
      impact: 'Posibles interrupciones menores en la consulta de eventos',
      status: 'scheduled'
    }
  ]

  const overallStatus = services.every(service => service.status === 'operational') 
    ? 'operational' 
    : services.some(service => service.status === 'outage') 
    ? 'outage' 
    : 'degraded'

  return (
    <main className="min-h-screen bg-body-bg">
      <div className="particles-bg"></div>
      
      <Container className="py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <Activity className="h-5 w-5" />
            <span className="text-sm font-medium">Estado del Sistema</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-6">
            Estado del <span className="text-accent">Servicio</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 px-4">
            Monitoreo en tiempo real del estado de todos nuestros servicios y sistemas. 
            Mantente informado sobre el rendimiento y disponibilidad de Boletería.
          </p>
        </div>

        {/* Overall Status */}
        <div className="mb-12">
          <div className={`bg-card border rounded-2xl p-6 md:p-8 text-center ${
            overallStatus === 'operational' 
              ? 'border-success/20' 
              : overallStatus === 'outage'
              ? 'border-error/20'
              : 'border-warning/20'
          }`}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              {overallStatus === 'operational' && <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-green-400" />}
              {overallStatus === 'degraded' && <AlertTriangle className="h-10 w-10 md:h-12 md:w-12 text-yellow-400" />}
              {overallStatus === 'outage' && <XCircle className="h-10 w-10 md:h-12 md:w-12 text-red-400" />}
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                {overallStatus === 'operational' && 'Todos los Sistemas Operativos'}
                {overallStatus === 'degraded' && 'Algunos Servicios Degradados'}
                {overallStatus === 'outage' && 'Problemas en el Sistema'}
              </h2>
            </div>
            <p className="text-gray-300 text-base md:text-lg mb-6 px-4">
              {overallStatus === 'operational' && 'Todos nuestros servicios están funcionando correctamente.'}
              {overallStatus === 'degraded' && 'Algunos servicios pueden experimentar rendimiento reducido.'}
              {overallStatus === 'outage' && 'Estamos trabajando para resolver los problemas actuales.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                <span>Última actualización: {lastUpdated.toLocaleTimeString()}</span>
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  autoRefresh 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-body-bg/50 text-gray-400 hover:bg-gray-600/50'
                }`}
              >
                Auto-actualización {autoRefresh ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Current Incidents */}
        {incidents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
              Incidentes Activos
            </h2>
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                    <div>
                      <h3 className="text-white font-semibold text-base md:text-lg mb-2">
                        {incident.title}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm">
                        <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                          {incident.severity.toUpperCase()}
                        </span>
                        <span className="text-gray-400">
                          Iniciado: {incident.startTime}
                        </span>
                      </div>
                    </div>
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                      Investigando
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{incident.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Actualizaciones:</h4>
                    {incident.updates.map((update, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-body-bg/30 rounded-lg">
                        <div className="text-gray-400 text-sm min-w-[100px]">
                          {update.time}
                        </div>
                        <div className="text-gray-300 text-sm">{update.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Services Status */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Server className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
            Estado de Servicios
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {services.map((service, index) => {
              const StatusIcon = getStatusIcon(service.status)
              return (
                <div key={index} className="bg-body-bg/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 md:p-6 hover:bg-body-bg/50 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <service.icon className="h-5 w-5 md:h-6 md:w-6 text-blue-400 flex-shrink-0" />
                      <div>
                        <h3 className="text-white font-semibold text-sm md:text-base">{service.name}</h3>
                        <p className="text-gray-400 text-xs md:text-sm">{service.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                      <StatusIcon className={`h-5 w-5 ${getStatusColor(service.status)}`} />
                      <span className={`text-xs md:text-sm font-medium ${getStatusColor(service.status)}`}>
                        {getStatusText(service.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-body-bg/30 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1">Tiempo de actividad</div>
                      <div className="text-white font-semibold">{service.uptime}%</div>
                    </div>
                    <div className="bg-body-bg/30 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1">Tiempo de respuesta</div>
                      <div className="text-white font-semibold">{service.responseTime}ms</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-400" />
            Métricas de Rendimiento
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-body-bg/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-300 text-sm">{metric.name}</h3>
                  <div className={`flex items-center gap-1 ${
                    metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <TrendingUp className={`h-4 w-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                    <span className="text-xs">{metric.change}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-2">{metric.value}</div>
                <div className="text-gray-400 text-xs">{metric.period}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Scheduled Maintenance */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-purple-400" />
            Mantenimientos Programados
          </h2>
          
          {maintenanceSchedule.length > 0 ? (
            <div className="space-y-4">
              {maintenanceSchedule.map((maintenance, index) => (
                <div key={index} className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">
                        {maintenance.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span>{maintenance.date}</span>
                        <span>{maintenance.time}</span>
                      </div>
                    </div>
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                      Programado
                    </span>
                  </div>
                  <p className="text-gray-300">{maintenance.impact}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-body-bg/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No hay mantenimientos programados</h3>
              <p className="text-gray-300">
                Actualmente no tenemos mantenimientos programados que puedan afectar el servicio.
              </p>
            </div>
          )}
        </section>

        {/* Subscribe to Updates */}
        <section>
          <div className="bg-card border border-accent/20 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Mantente Informado
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Suscríbete para recibir notificaciones automáticas sobre el estado de nuestros servicios 
              y mantenimientos programados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="px-6 py-3 bg-body-bg/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400 min-w-[300px]"
              />
              <button className="btn-primary px-8 py-3 rounded-lg font-semibold shadow-lg">
                Suscribirse
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                <ExternalLink className="h-4 w-4" />
                Página de estado externa
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                <Eye className="h-4 w-4" />
                Historial completo
              </a>
            </div>
          </div>
        </section>
      </Container>
    </main>
  )
}
