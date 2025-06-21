'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Lock,
  Activity,
  User,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  RefreshCw,
  Download
} from 'lucide-react'

interface SecurityLog {
  id: string
  timestamp: string
  event_type: 'login' | 'logout' | 'failed_login' | 'password_change' | 'account_locked'
  user_email: string
  ip_address: string
  user_agent: string
  location?: string
  risk_level: 'low' | 'medium' | 'high'
  status: 'success' | 'failed' | 'blocked'
}

interface SecurityStats {
  total_logins: number
  failed_attempts: number
  blocked_ips: number
  active_sessions: number
  security_alerts: number
}

export default function SecurityPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<SecurityLog[]>([])
  const [stats, setStats] = useState<SecurityStats | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [selectedEventType, setSelectedEventType] = useState('all')

  useEffect(() => {
    if (user?.isAdmin) {
      fetchSecurityData()
    }
  }, [user, selectedTimeRange])

  const fetchSecurityData = async () => {
    try {
      setLoading(true)
      
      // Datos de ejemplo por ahora
      const mockStats: SecurityStats = {
        total_logins: 1247,
        failed_attempts: 23,
        blocked_ips: 3,
        active_sessions: 89,
        security_alerts: 2
      }

      const mockLogs: SecurityLog[] = [
        {
          id: '1',
          timestamp: '2024-12-11T10:30:00Z',
          event_type: 'login',
          user_email: 'wdrpineda@gmail.com',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          location: 'Lima, Perú',
          risk_level: 'low',
          status: 'success'
        },
        {
          id: '2',
          timestamp: '2024-12-11T10:25:00Z',
          event_type: 'failed_login',
          user_email: 'unknown@example.com',
          ip_address: '45.123.45.123',
          user_agent: 'curl/7.68.0',
          location: 'Unknown',
          risk_level: 'high',
          status: 'blocked'
        },
        {
          id: '3',
          timestamp: '2024-12-11T10:20:00Z',
          event_type: 'password_change',
          user_email: 'cliente@gametime.com',
          ip_address: '192.168.1.105',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          location: 'Lima, Perú',
          risk_level: 'low',
          status: 'success'
        },
        {
          id: '4',
          timestamp: '2024-12-11T09:45:00Z',
          event_type: 'failed_login',
          user_email: 'admin@gametime.com',
          ip_address: '203.45.67.89',
          user_agent: 'Mozilla/5.0 (X11; Linux x86_64)',
          location: 'Brasil',
          risk_level: 'medium',
          status: 'failed'
        },
        {
          id: '5',
          timestamp: '2024-12-11T09:30:00Z',
          event_type: 'logout',
          user_email: 'operador@gametime.com',
          ip_address: '192.168.1.102',
          user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)',
          location: 'Lima, Perú',
          risk_level: 'low',
          status: 'success'
        }
      ]
      
      setStats(mockStats)
      setLogs(mockLogs)
    } catch (error) {
      console.error('Error fetching security data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(log => {
    return selectedEventType === 'all' || log.event_type === selectedEventType
  })

  const getEventTypeBadge = (eventType: string) => {
    const styles = {
      login: 'bg-success/20 text-success border-success/30',
      logout: 'bg-info/20 text-info border-info/30',
      failed_login: 'bg-error/20 text-error border-error/30',
      password_change: 'bg-warning/20 text-warning border-warning/30',
      account_locked: 'bg-error/20 text-error border-error/30'
    }
    
    const icons = {
      login: CheckCircle,
      logout: XCircle,
      failed_login: AlertTriangle,
      password_change: Lock,
      account_locked: Shield
    }
    
    const labels = {
      login: 'Inicio de Sesión',
      logout: 'Cierre de Sesión',
      failed_login: 'Acceso Fallido',
      password_change: 'Cambio de Contraseña',
      account_locked: 'Cuenta Bloqueada'
    }
    
    const Icon = icons[eventType as keyof typeof icons] || Activity
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs border flex items-center gap-1 ${styles[eventType as keyof typeof styles] || styles.login}`}>
        <Icon className="w-3 h-3" />
        {labels[eventType as keyof typeof labels] || eventType}
      </span>
    )
  }

  const getRiskLevelBadge = (riskLevel: string) => {
    const styles = {
      low: 'bg-success/20 text-success border-success/30',
      medium: 'bg-warning/20 text-warning border-warning/30',
      high: 'bg-error/20 text-error border-error/30'
    }
    
    const labels = {
      low: 'Bajo',
      medium: 'Medio',
      high: 'Alto'
    }
    
    return (
      <span className={`px-2 py-1 rounded text-xs border ${styles[riskLevel as keyof typeof styles] || styles.low}`}>
        {labels[riskLevel as keyof typeof labels] || riskLevel}
      </span>
    )
  }

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('iPhone') || userAgent.includes('Android')) {
      return <Smartphone className="w-4 h-4 text-accent" />
    }
    return <Monitor className="w-4 h-4 text-accent" />
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Shield className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">Acceso Denegado</h2>
          <p className="text-text-secondary">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando datos de seguridad...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-accent" />
            Seguridad del Sistema
          </h1>
          <p className="text-text-secondary">
            Monitoreo de accesos, logs de seguridad y alertas del sistema
          </p>
        </div>

        {/* Security Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="card-default p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Logins Exitosos</p>
                <p className="text-xl font-bold text-text-primary">{stats?.total_logins || 0}</p>
              </div>
            </div>
          </div>

          <div className="card-default p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-error/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-error" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Intentos Fallidos</p>
                <p className="text-xl font-bold text-text-primary">{stats?.failed_attempts || 0}</p>
              </div>
            </div>
          </div>

          <div className="card-default p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <XCircle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">IPs Bloqueadas</p>
                <p className="text-xl font-bold text-text-primary">{stats?.blocked_ips || 0}</p>
              </div>
            </div>
          </div>

          <div className="card-default p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/20 rounded-lg">
                <Activity className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Sesiones Activas</p>
                <p className="text-xl font-bold text-text-primary">{stats?.active_sessions || 0}</p>
              </div>
            </div>
          </div>

          <div className="card-default p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Alertas de Seguridad</p>
                <p className="text-xl font-bold text-text-primary">{stats?.security_alerts || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            >
              <option value="1h">Última hora</option>
              <option value="24h">Últimas 24 horas</option>
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
            </select>

            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="px-4 py-2 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            >
              <option value="all">Todos los eventos</option>
              <option value="login">Inicios de sesión</option>
              <option value="failed_login">Accesos fallidos</option>
              <option value="logout">Cierres de sesión</option>
              <option value="password_change">Cambios de contraseña</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={fetchSecurityData}
              variant="outline"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button className="btn-primary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar Logs
            </Button>
          </div>
        </div>

        {/* Security Logs */}
        <div className="card-default">
          <div className="p-6 border-b border-border-color">
            <h3 className="text-lg font-semibold text-text-primary">
              Logs de Seguridad ({filteredLogs.length})
            </h3>
          </div>
          
          <div className="divide-y divide-border-color">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-hover-bg transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getEventTypeBadge(log.event_type)}
                      {getRiskLevelBadge(log.risk_level)}
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.status === 'success' ? 'bg-success/20 text-success' :
                        log.status === 'failed' ? 'bg-error/20 text-error' :
                        'bg-warning/20 text-warning'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-text-secondary mb-2">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {log.user_email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTimestamp(log.timestamp)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {log.location || 'Desconocida'}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <div className="flex items-center gap-1">
                        {getDeviceIcon(log.user_agent)}
                        <span>IP: {log.ip_address}</span>
                      </div>
                      <span className="truncate max-w-md">
                        {log.user_agent}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Ver Detalles
                    </Button>
                    {log.risk_level === 'high' && (
                      <Button variant="outline" size="sm" className="flex items-center gap-1 text-error hover:text-error border-error/30 hover:border-error">
                        <Shield className="w-3 h-3" />
                        Bloquear IP
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="p-12 text-center">
              <Shield className="w-16 h-16 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">No hay logs disponibles</h3>
              <p className="text-text-secondary">
                No se encontraron eventos de seguridad para los filtros seleccionados.
              </p>
            </div>
          )}
        </div>
    </div>
  )
}
