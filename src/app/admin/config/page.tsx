'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Globe, 
  CreditCard, 
  Shield, 
  Database,
  Bell,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Upload,
  Download,
  Key
} from 'lucide-react'

interface SystemConfig {
  siteName: string
  siteDescription: string
  supportEmail: string
  adminEmail: string
  defaultLanguage: string
  currency: string
  timezone: string
  maintenanceMode: boolean
  registrationEnabled: boolean
  emailVerificationRequired: boolean
  twoFactorEnabled: boolean
  autoBackup: boolean
  backupFrequency: string
  maxFileSize: number
  allowedFileTypes: string[]
  socialLogin: {
    google: boolean
    facebook: boolean
    apple: boolean
  }
  paymentGateways: {
    mercadoPago: boolean
    yape: boolean
    plin: boolean
    creditCard: boolean
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    orderConfirmations: boolean
    promotionalEmails: boolean
  }
}

const initialConfig: SystemConfig = {
  siteName: 'Boletería Perú',
  siteDescription: 'Tu plataforma de eventos y transporte de confianza',
  supportEmail: 'soporte@boleteria.pe',
  adminEmail: 'admin@boleteria.pe',
  defaultLanguage: 'es',
  currency: 'PEN',
  timezone: 'America/Lima',
  maintenanceMode: false,
  registrationEnabled: true,
  emailVerificationRequired: true,
  twoFactorEnabled: false,
  autoBackup: true,
  backupFrequency: 'daily',
  maxFileSize: 10,
  allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf'],
  socialLogin: {
    google: true,
    facebook: true,
    apple: false
  },
  paymentGateways: {
    mercadoPago: true,
    yape: true,
    plin: true,
    creditCard: true
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderConfirmations: true,
    promotionalEmails: false
  }
}

const languages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'qu', name: 'Quechua' }
]

const currencies = [
  { code: 'PEN', name: 'Sol Peruano (PEN)' },
  { code: 'USD', name: 'Dólar Americano (USD)' },
  { code: 'EUR', name: 'Euro (EUR)' }
]

const timezones = [
  { value: 'America/Lima', label: 'Lima (UTC-5)' },
  { value: 'America/New_York', label: 'Nueva York (UTC-5)' },
  { value: 'Europe/Madrid', label: 'Madrid (UTC+1)' }
]

export default function ConfigPage() {
  const [config, setConfig] = useState<SystemConfig>(initialConfig)
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'integrations', label: 'Integraciones', icon: Globe },
    { id: 'backup', label: 'Respaldos', icon: Database }
  ]

  const updateConfig = (key: keyof SystemConfig, value: string | boolean | number | string[]) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const updateNestedConfig = (parent: keyof SystemConfig, key: string, value: boolean) => {
    setConfig(prev => {
      const parentConfig = prev[parent] as Record<string, boolean>
      return {
        ...prev,
        [parent]: {
          ...parentConfig,
          [key]: value
        }
      }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const [apiKey] = useState(generateApiKey())

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3 mb-2">
                <Settings className="w-8 h-8 text-accent" />
                Configuración del Sistema
              </h1>
              <p className="text-text-secondary">
                Administra la configuración global de la plataforma
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : saved ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar Cambios'}
            </motion.button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <div className="card-default p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeTab === tab.id
                          ? 'bg-accent/20 text-accent border border-accent/30'
                          : 'text-text-secondary hover:bg-hover-bg'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="card-default overflow-hidden">
              
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-6">Configuración General</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Nombre del Sitio
                      </label>
                      <input
                        type="text"
                        value={config.siteName}
                        onChange={(e) => updateConfig('siteName', e.target.value)}
                        className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Email de Soporte
                      </label>
                      <input
                        type="email"
                        value={config.supportEmail}
                        onChange={(e) => updateConfig('supportEmail', e.target.value)}
                        className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Descripción del Sitio
                      </label>
                      <textarea
                        value={config.siteDescription}
                        onChange={(e) => updateConfig('siteDescription', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Idioma por Defecto
                      </label>
                      <select
                        value={config.defaultLanguage}
                        onChange={(e) => updateConfig('defaultLanguage', e.target.value)}
                        className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Moneda
                      </label>
                      <select
                        value={config.currency}
                        onChange={(e) => updateConfig('currency', e.target.value)}
                        className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      >
                        {currencies.map(currency => (
                          <option key={currency.code} value={currency.code}>{currency.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zona Horaria
                      </label>
                      <select
                        value={config.timezone}
                        onChange={(e) => updateConfig('timezone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {timezones.map(tz => (
                          <option key={tz.value} value={tz.value}>{tz.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamaño Máximo de Archivo (MB)
                      </label>
                      <input
                        type="number"
                        value={config.maxFileSize}
                        onChange={(e) => updateConfig('maxFileSize', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Opciones del Sistema</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Modo de Mantenimiento</label>
                          <p className="text-xs text-gray-500">Desactiva temporalmente el sitio para mantenimiento</p>
                        </div>
                        <button
                          onClick={() => updateConfig('maintenanceMode', !config.maintenanceMode)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            config.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              config.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Registro de Usuarios</label>
                          <p className="text-xs text-gray-500">Permite que nuevos usuarios se registren</p>
                        </div>
                        <button
                          onClick={() => updateConfig('registrationEnabled', !config.registrationEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            config.registrationEnabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              config.registrationEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración de Seguridad</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Verificación de Email Requerida</label>
                        <p className="text-xs text-gray-500">Los usuarios deben verificar su email al registrarse</p>
                      </div>
                      <button
                        onClick={() => updateConfig('emailVerificationRequired', !config.emailVerificationRequired)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          config.emailVerificationRequired ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            config.emailVerificationRequired ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Autenticación de Dos Factores</label>
                        <p className="text-xs text-gray-500">Requiere verificación adicional para administradores</p>
                      </div>
                      <button
                        onClick={() => updateConfig('twoFactorEnabled', !config.twoFactorEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          config.twoFactorEnabled ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            config.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Clave API del Sistema
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <input
                            type={showApiKey ? 'text' : 'password'}
                            value={apiKey}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                          />
                        </div>
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="p-2 text-gray-500 hover:text-gray-700"
                        >
                          {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Regenerar
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Esta clave se usa para autenticar solicitudes a la API del sistema
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payments' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración de Pagos</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Métodos de Pago Habilitados</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(config.paymentGateways).map(([key, enabled]) => (
                          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <CreditCard className="w-5 h-5 text-gray-600" />
                              <span className="font-medium text-gray-900 capitalize">
                                {key === 'mercadoPago' ? 'Mercado Pago' : 
                                 key === 'creditCard' ? 'Tarjetas de Crédito' : 
                                 key.toUpperCase()}
                              </span>
                            </div>
                            <button
                              onClick={() => updateNestedConfig('paymentGateways', key, !enabled)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                enabled ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  enabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Comisiones</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comisión Eventos (%)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            defaultValue="5.0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comisión Transporte (%)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            defaultValue="3.5"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración de Notificaciones</h2>
                  
                  <div className="space-y-6">
                    {Object.entries(config.notifications).map(([key, enabled]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-700 capitalize">
                            {key === 'emailNotifications' ? 'Notificaciones por Email' :
                             key === 'smsNotifications' ? 'Notificaciones por SMS' :
                             key === 'pushNotifications' ? 'Notificaciones Push' :
                             key === 'orderConfirmations' ? 'Confirmaciones de Pedido' :
                             'Emails Promocionales'}
                          </label>
                          <p className="text-xs text-gray-500">
                            {key === 'emailNotifications' ? 'Enviar notificaciones por correo electrónico' :
                             key === 'smsNotifications' ? 'Enviar notificaciones por mensaje de texto' :
                             key === 'pushNotifications' ? 'Enviar notificaciones push a dispositivos móviles' :
                             key === 'orderConfirmations' ? 'Enviar confirmaciones automáticas de pedidos' :
                             'Enviar ofertas y promociones por email'}
                          </p>
                        </div>
                        <button
                          onClick={() => updateNestedConfig('notifications', key, !enabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            enabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Integrations Settings */}
              {activeTab === 'integrations' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Integraciones</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Inicio de Sesión Social</h3>
                      <div className="space-y-4">
                        {Object.entries(config.socialLogin).map(([key, enabled]) => (
                          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Globe className="w-5 h-5 text-gray-600" />
                              <span className="font-medium text-gray-900 capitalize">
                                {key === 'google' ? 'Google' : 
                                 key === 'facebook' ? 'Facebook' : 'Apple'}
                              </span>
                            </div>
                            <button
                              onClick={() => updateNestedConfig('socialLogin', key, !enabled)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                enabled ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  enabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">APIs Externas</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Google Maps API Key
                          </label>
                          <input
                            type="password"
                            placeholder="Ingresa tu clave de API de Google Maps"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SendGrid API Key
                          </label>
                          <input
                            type="password"
                            placeholder="Ingresa tu clave de API de SendGrid"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Backup Settings */}
              {activeTab === 'backup' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración de Respaldos</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Respaldos Automáticos</label>
                        <p className="text-xs text-gray-500">Crear respaldos automáticos de la base de datos</p>
                      </div>
                      <button
                        onClick={() => updateConfig('autoBackup', !config.autoBackup)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          config.autoBackup ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            config.autoBackup ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frecuencia de Respaldo
                      </label>
                      <select
                        value={config.backupFrequency}
                        onChange={(e) => updateConfig('backupFrequency', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="hourly">Cada hora</option>
                        <option value="daily">Diario</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensual</option>
                      </select>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones de Respaldo</h3>
                      <div className="flex flex-wrap gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <Download className="w-4 h-4" />
                          Crear Respaldo Manual
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <Upload className="w-4 h-4" />
                          Restaurar Respaldo
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-body-bg transition-colors">
                          <Database className="w-4 h-4" />
                          Ver Historial
                        </button>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">Información Importante</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Los respaldos se almacenan en un servidor seguro externo. 
                            Se recomienda mantener respaldos locales adicionales para mayor seguridad.
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
  )
}
