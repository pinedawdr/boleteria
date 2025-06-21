'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import { 
  Settings,
  Save,
  RefreshCw,
  Shield,
  Bell,
  Mail,
  Globe,
  Key,
  AlertCircle,
  Info,
  CreditCard
} from 'lucide-react'

interface SystemConfig {
  site_name: string
  site_description: string
  contact_email: string
  support_phone: string
  currency: string
  timezone: string
  language: string
  maintenance_mode: boolean
  registration_enabled: boolean
  email_notifications: boolean
  sms_notifications: boolean
  max_seats_per_booking: number
  booking_cancellation_hours: number
  payment_methods: string[]
  commission_rate: number
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [config, setConfig] = useState<SystemConfig>({
    site_name: 'Gametime',
    site_description: 'Plataforma de reservas de eventos y transporte',
    contact_email: 'contacto@gametime.com',
    support_phone: '+51 999 888 777',
    currency: 'PEN',
    timezone: 'America/Lima',
    language: 'es',
    maintenance_mode: false,
    registration_enabled: true,
    email_notifications: true,
    sms_notifications: false,
    max_seats_per_booking: 10,
    booking_cancellation_hours: 24,
    payment_methods: ['card', 'bank_transfer', 'digital_wallet'],
    commission_rate: 5
  })

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      // Simular carga de configuración
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching config:', error)
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    setSaving(true)
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Configuration saved:', config)
    } catch (error) {
      console.error('Error saving config:', error)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'payments', name: 'Pagos', icon: CreditCard },
    { id: 'security', name: 'Seguridad', icon: Shield },
    { id: 'api', name: 'API', icon: Key }
  ]

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
    return <AdminLoadingState type="dashboard" message="Cargando configuración..." />
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-accent to-success bg-clip-text text-transparent flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
            Configuración del Sistema
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Gestiona la configuración global de la plataforma
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="text-sm text-text-secondary">
            Última actualización: <span className="font-semibold text-text-primary">Hoy, 14:30</span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={fetchConfig}
              variant="outline"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Recargar
            </Button>
            <Button
              onClick={saveConfig}
              className="btn-primary flex items-center gap-2"
              disabled={saving}
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tabs Navigation */}
          <div className="lg:col-span-1">
            <div className="card-default p-4">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Secciones</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-accent/20 text-accent border border-accent/30'
                          : 'text-text-secondary hover:text-text-primary hover:bg-hover-bg'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="card-default p-6">
              {activeTab === 'general' && (
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-accent" />
                    Configuración General
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Nombre del sitio
                        </label>
                        <input
                          type="text"
                          value={config.site_name}
                          onChange={(e) => setConfig({ ...config, site_name: e.target.value })}
                          className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Email de contacto
                        </label>
                        <input
                          type="email"
                          value={config.contact_email}
                          onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
                          className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Descripción del sitio
                      </label>
                      <textarea
                        value={config.site_description}
                        onChange={(e) => setConfig({ ...config, site_description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Teléfono de soporte
                        </label>
                        <input
                          type="text"
                          value={config.support_phone}
                          onChange={(e) => setConfig({ ...config, support_phone: e.target.value })}
                          className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Moneda
                        </label>
                        <select
                          value={config.currency}
                          onChange={(e) => setConfig({ ...config, currency: e.target.value })}
                          className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        >
                          <option value="PEN">Soles Peruanos (PEN)</option>
                          <option value="USD">Dólares Americanos (USD)</option>
                          <option value="EUR">Euros (EUR)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Zona horaria
                        </label>
                        <select
                          value={config.timezone}
                          onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
                          className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        >
                          <option value="America/Lima">Lima (UTC-5)</option>
                          <option value="America/New_York">New York (UTC-5)</option>
                          <option value="Europe/Madrid">Madrid (UTC+1)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-text-primary">Opciones del Sistema</h4>
                      
                      <div className="flex items-center justify-between py-3 px-0 border-b border-border-color/30 last:border-b-0">
                        <div>
                          <h5 className="font-medium text-text-primary">Modo de mantenimiento</h5>
                          <p className="text-sm text-text-secondary">Deshabilita el acceso público al sitio</p>
                        </div>
                        <button
                          onClick={() => setConfig({ ...config, maintenance_mode: !config.maintenance_mode })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            config.maintenance_mode ? 'bg-accent' : 'bg-hover-bg'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              config.maintenance_mode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 px-0 border-b border-border-color/30 last:border-b-0">
                        <div>
                          <h5 className="font-medium text-text-primary">Registro de usuarios</h5>
                          <p className="text-sm text-text-secondary">Permite que nuevos usuarios se registren</p>
                        </div>
                        <button
                          onClick={() => setConfig({ ...config, registration_enabled: !config.registration_enabled })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            config.registration_enabled ? 'bg-accent' : 'bg-hover-bg'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              config.registration_enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                    <Bell className="w-6 h-6 text-accent" />
                    Configuración de Notificaciones
                  </h3>
                  
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-text-primary border-b border-border-color/30 pb-2">Notificaciones</h4>
                      
                      <div className="flex items-center justify-between py-3 px-0 border-b border-border-color/30 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-accent" />
                          <div>
                            <h5 className="font-medium text-text-primary">Notificaciones por email</h5>
                            <p className="text-sm text-text-secondary">Enviar notificaciones importantes por correo</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setConfig({ ...config, email_notifications: !config.email_notifications })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            config.email_notifications ? 'bg-accent' : 'bg-hover-bg'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              config.email_notifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 px-0 border-b border-border-color/30 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-accent" />
                          <div>
                            <h5 className="font-medium text-text-primary">Notificaciones SMS</h5>
                            <p className="text-sm text-text-secondary">Enviar notificaciones urgentes por SMS</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setConfig({ ...config, sms_notifications: !config.sms_notifications })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            config.sms_notifications ? 'bg-accent' : 'bg-hover-bg'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              config.sms_notifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-accent" />
                    Configuración de Pagos
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Tasa de comisión (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={config.commission_rate}
                        onChange={(e) => setConfig({ ...config, commission_rate: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-4">
                        Métodos de pago habilitados
                      </label>
                      <div className="space-y-3">
                        {[
                          { id: 'card', name: 'Tarjetas de crédito/débito' },
                          { id: 'bank_transfer', name: 'Transferencia bancaria' },
                          { id: 'digital_wallet', name: 'Billeteras digitales' },
                          { id: 'cash', name: 'Pago en efectivo' }
                        ].map((method) => (
                          <div key={method.id} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={method.id}
                              checked={config.payment_methods.includes(method.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setConfig({
                                    ...config,
                                    payment_methods: [...config.payment_methods, method.id]
                                  })
                                } else {
                                  setConfig({
                                    ...config,
                                    payment_methods: config.payment_methods.filter(m => m !== method.id)
                                  })
                                }
                              }}
                              className="w-4 h-4 text-accent bg-input-bg border-border-color rounded focus:ring-accent focus:ring-2"
                            />
                            <label htmlFor={method.id} className="text-text-primary">
                              {method.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-accent" />
                    Configuración de Seguridad
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Máximo de asientos por reserva
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={config.max_seats_per_booking}
                          onChange={(e) => setConfig({ ...config, max_seats_per_booking: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Horas límite para cancelación
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="168"
                          value={config.booking_cancellation_hours}
                          onChange={(e) => setConfig({ ...config, booking_cancellation_hours: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-info pl-4 py-2">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-info mt-0.5" />
                        <div>
                          <h5 className="font-medium text-text-primary mb-1">Nota de seguridad</h5>
                          <p className="text-sm text-text-secondary">
                            Estos límites ayudan a prevenir el abuso del sistema y garantizan una experiencia justa para todos los usuarios.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'api' && (
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                    <Key className="w-6 h-6 text-accent" />
                    Configuración de API
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-warning pl-4 py-2">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                        <div>
                          <h5 className="font-medium text-text-primary mb-1">Sección en desarrollo</h5>
                          <p className="text-sm text-text-secondary">
                            La configuración de API estará disponible en una próxima actualización.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
