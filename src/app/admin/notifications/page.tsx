'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  Send, 
  Users, 
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Megaphone,
  Mail,
  MessageSquare,
  Smartphone,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  BarChart3,
  Target
} from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'promotion'
  channel: 'email' | 'sms' | 'push' | 'in-app'
  target: 'all' | 'users' | 'admins' | 'specific'
  target_users?: string[]
  status: 'draft' | 'sent' | 'scheduled' | 'failed'
  created_at: string
  sent_at?: string
  scheduled_for?: string
  read_count: number
  click_count: number
  total_recipients: number
  created_by: string
}

interface NotificationTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: 'booking_confirmation' | 'payment_reminder' | 'event_update' | 'transport_delay' | 'promotion' | 'custom'
  variables: string[]
  usage_count: number
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Evento Cancelado: Concierto de Marc Anthony',
    message: 'Estimados usuarios, lamentamos informar que el concierto de Marc Anthony ha sido cancelado. Se realizará el reembolso automático.',
    type: 'error',
    channel: 'email',
    target: 'specific',
    status: 'sent',
    created_at: '2024-12-10T09:00:00Z',
    sent_at: '2024-12-10T09:30:00Z',
    read_count: 1250,
    click_count: 890,
    total_recipients: 1500,
    created_by: 'Admin Principal'
  },
  {
    id: '2',
    title: 'Nueva Ruta: Lima - Arequipa',
    message: 'Descubre nuestra nueva ruta directa Lima - Arequipa con buses de lujo. ¡Reserva ahora con 20% de descuento!',
    type: 'promotion',
    channel: 'push',
    target: 'all',
    status: 'sent',
    created_at: '2024-12-09T14:00:00Z',
    sent_at: '2024-12-09T15:00:00Z',
    read_count: 3200,
    click_count: 450,
    total_recipients: 4500,
    created_by: 'Marketing Team'
  },
  {
    id: '3',
    title: 'Recordatorio: Tu viaje es mañana',
    message: 'No olvides tu viaje Lima - Cusco programado para mañana a las 21:00. Presenta tu QR en el terminal.',
    type: 'info',
    channel: 'sms',
    target: 'specific',
    status: 'scheduled',
    created_at: '2024-12-10T10:00:00Z',
    scheduled_for: '2024-12-11T18:00:00Z',
    read_count: 0,
    click_count: 0,
    total_recipients: 45,
    created_by: 'Sistema Automático'
  },
  {
    id: '4',
    title: 'Mantenimiento del Sistema',
    message: 'El sistema estará en mantenimiento el domingo de 2:00 AM a 4:00 AM. Disculpe las molestias.',
    type: 'warning',
    channel: 'in-app',
    target: 'all',
    status: 'draft',
    created_at: '2024-12-10T11:00:00Z',
    read_count: 0,
    click_count: 0,
    total_recipients: 0,
    created_by: 'Soporte Técnico'
  }
]

const mockTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Confirmación de Reserva',
    subject: 'Confirmación de tu reserva #{booking_id}',
    content: 'Hola {user_name}, tu reserva para {event_name} el {date} ha sido confirmada. Código de reserva: {booking_id}',
    type: 'booking_confirmation',
    variables: ['user_name', 'event_name', 'date', 'booking_id'],
    usage_count: 1200
  },
  {
    id: '2',
    name: 'Recordatorio de Pago',
    subject: 'Recordatorio: Pago pendiente de tu reserva',
    content: 'Hola {user_name}, tienes un pago pendiente por {amount} para tu reserva {booking_id}. Vence el {due_date}.',
    type: 'payment_reminder',
    variables: ['user_name', 'amount', 'booking_id', 'due_date'],
    usage_count: 89
  },
  {
    id: '3',
    name: 'Promoción Especial',
    subject: 'Oferta especial: {discount}% de descuento',
    content: 'Aprovecha nuestra oferta especial de {discount}% en {category}. Válido hasta el {expiry_date}. Código: {promo_code}',
    type: 'promotion',
    variables: ['discount', 'category', 'expiry_date', 'promo_code'],
    usage_count: 45
  }
]

export default function NotificationsAdmin() {
  const [notifications] = useState<Notification[]>(mockNotifications)
  const [templates] = useState<NotificationTemplate[]>(mockTemplates)
  const [activeTab, setActiveTab] = useState<'notifications' | 'templates' | 'analytics'>('notifications')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterChannel, setFilterChannel] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null)

  // Filtrar notificaciones
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || notification.type === filterType
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus
    const matchesChannel = filterChannel === 'all' || notification.channel === filterChannel
    
    return matchesSearch && matchesType && matchesStatus && matchesChannel
  })

  // Estadísticas de notificaciones
  const notificationStats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    scheduled: notifications.filter(n => n.status === 'scheduled').length,
    drafts: notifications.filter(n => n.status === 'draft').length,
    totalRecipients: notifications.reduce((sum, n) => sum + n.total_recipients, 0),
    avgOpenRate: (notifications.reduce((sum, n) => sum + (n.total_recipients > 0 ? (n.read_count / n.total_recipients) * 100 : 0), 0) / notifications.length).toFixed(1),
    avgClickRate: (notifications.reduce((sum, n) => sum + (n.total_recipients > 0 ? (n.click_count / n.total_recipients) * 100 : 0), 0) / notifications.length).toFixed(1)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return Info
      case 'success': return CheckCircle
      case 'warning': return AlertCircle
      case 'error': return XCircle
      case 'promotion': return Megaphone
      default: return Bell
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return Mail
      case 'sms': return MessageSquare
      case 'push': return Smartphone
      case 'in-app': return Bell
      default: return Bell
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-success'
      case 'scheduled': return 'text-secondary'
      case 'draft': return 'text-text-muted'
      case 'failed': return 'text-error'
      default: return 'text-text-muted'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-body-bg/20 text-secondary'
      case 'success': return 'bg-success/20 text-success'
      case 'warning': return 'bg-warning/20 text-warning'
      case 'error': return 'bg-error/20 text-error'
      case 'promotion': return 'bg-accent/20 text-accent'
      default: return 'bg-body-bg text-text-muted'
    }
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3 mb-2">
              <Bell className="w-8 h-8 text-accent" />
              Gestión de Notificaciones
            </h1>
            <p className="text-text-secondary">Administra las comunicaciones con los usuarios</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva Notificación
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-default p-6 hover-lift"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Total Notificaciones</p>
                <p className="text-3xl font-bold text-text-primary">{notificationStats.total}</p>
              </div>
              <Bell className="w-8 h-8 text-accent" />
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
                <p className="text-text-secondary text-sm">Enviadas</p>
                <p className="text-3xl font-bold text-text-primary">{notificationStats.sent}</p>
              </div>
              <Send className="w-8 h-8 text-success" />
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
                <p className="text-text-secondary text-sm">Tasa de Apertura</p>
                <p className="text-3xl font-bold text-text-primary">{notificationStats.avgOpenRate}%</p>
              </div>
              <Eye className="w-8 h-8 text-secondary" />
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
                <p className="text-text-secondary text-sm">Tasa de Clics</p>
                <p className="text-3xl font-bold text-text-primary">{notificationStats.avgClickRate}%</p>
              </div>
              <Target className="w-8 h-8 text-warning" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/10 backdrop-blur-lg rounded-xl p-1 mb-8">
          {[
            { id: 'notifications', label: 'Notificaciones', icon: Bell },
            { id: 'templates', label: 'Plantillas', icon: Mail },
            { id: 'analytics', label: 'Analíticas', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'notifications' | 'templates' | 'analytics')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-purple-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Notificaciones Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar notificaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="info">Información</option>
                  <option value="success">Éxito</option>
                  <option value="warning">Advertencia</option>
                  <option value="error">Error</option>
                  <option value="promotion">Promoción</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="draft">Borrador</option>
                  <option value="sent">Enviado</option>
                  <option value="scheduled">Programado</option>
                  <option value="failed">Fallido</option>
                </select>

                <select
                  value={filterChannel}
                  onChange={(e) => setFilterChannel(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Todos los canales</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push</option>
                  <option value="in-app">In-App</option>
                </select>

                <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all">
                  <Download className="w-5 h-5" />
                  Exportar
                </button>
              </div>
            </div>

            {/* Lista de Notificaciones */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-purple-200">Notificación</th>
                      <th className="text-left py-4 px-6 font-semibold text-purple-200">Tipo</th>
                      <th className="text-left py-4 px-6 font-semibold text-purple-200">Canal</th>
                      <th className="text-left py-4 px-6 font-semibold text-purple-200">Estado</th>
                      <th className="text-left py-4 px-6 font-semibold text-purple-200">Destinatarios</th>
                      <th className="text-left py-4 px-6 font-semibold text-purple-200">Métricas</th>
                      <th className="text-left py-4 px-6 font-semibold text-purple-200">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNotifications.map((notification, index) => {
                      const TypeIcon = getTypeIcon(notification.type)
                      const ChannelIcon = getChannelIcon(notification.channel)
                      
                      return (
                        <motion.tr
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-semibold text-white mb-1">{notification.title}</p>
                              <p className="text-purple-200 text-sm line-clamp-2">{notification.message}</p>
                              <p className="text-purple-300 text-xs mt-1">
                                {new Date(notification.created_at).toLocaleDateString('es-PE')}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                              <TypeIcon className="w-4 h-4" />
                              {notification.type}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-purple-200">
                              <ChannelIcon className="w-4 h-4" />
                              {notification.channel}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`font-medium ${getStatusColor(notification.status)}`}>
                              {notification.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-purple-200">
                              <Users className="w-4 h-4" />
                              {notification.total_recipients.toLocaleString()}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            {notification.status === 'sent' && (
                              <div className="text-sm text-purple-200">
                                <div>Aperturas: {notification.read_count} ({((notification.read_count / notification.total_recipients) * 100).toFixed(1)}%)</div>
                                <div>Clics: {notification.click_count} ({((notification.click_count / notification.total_recipients) * 100).toFixed(1)}%)</div>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedNotification(notification)}
                                className="p-2 text-purple-300 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-purple-300 hover:text-white hover:bg-white/20 rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-red-300 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Plantillas de Notificación</h2>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Nueva Plantilla
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{template.name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        className="p-2 text-purple-300 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-300 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-purple-200 text-sm mb-4">{template.subject}</p>
                  <p className="text-purple-300 text-sm mb-4 line-clamp-3">{template.content}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-200">Usado {template.usage_count} veces</span>
                    <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                      {template.type}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Analíticas de Notificaciones</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Notificaciones por Canal</h3>
                <div className="space-y-3">
                  {['email', 'sms', 'push', 'in-app'].map((channel) => {
                    const count = notifications.filter(n => n.channel === channel).length
                    const percentage = (count / notifications.length) * 100
                    return (
                      <div key={channel} className="flex items-center justify-between">
                        <span className="text-purple-200 capitalize">{channel}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-white/20 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-white font-medium">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Notificaciones por Tipo</h3>
                <div className="space-y-3">
                  {['info', 'success', 'warning', 'error', 'promotion'].map((type) => {
                    const count = notifications.filter(n => n.type === type).length
                    const percentage = (count / notifications.length) * 100
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-purple-200 capitalize">{type}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-white/20 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-white font-medium">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Rendimiento de Notificaciones</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 text-purple-200">Canal</th>
                      <th className="text-left py-3 text-purple-200">Enviadas</th>
                      <th className="text-left py-3 text-purple-200">Entregadas</th>
                      <th className="text-left py-3 text-purple-200">Abiertas</th>
                      <th className="text-left py-3 text-purple-200">Clics</th>
                      <th className="text-left py-3 text-purple-200">Tasa Apertura</th>
                      <th className="text-left py-3 text-purple-200">Tasa Clics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['email', 'sms', 'push', 'in-app'].map((channel) => {
                      const channelNotifications = notifications.filter(n => n.channel === channel && n.status === 'sent')
                      const totalSent = channelNotifications.reduce((sum, n) => sum + n.total_recipients, 0)
                      const totalRead = channelNotifications.reduce((sum, n) => sum + n.read_count, 0)
                      const totalClicks = channelNotifications.reduce((sum, n) => sum + n.click_count, 0)
                      const openRate = totalSent > 0 ? (totalRead / totalSent) * 100 : 0
                      const clickRate = totalSent > 0 ? (totalClicks / totalSent) * 100 : 0

                      return (
                        <tr key={channel} className="border-b border-white/10">
                          <td className="py-3 text-white capitalize">{channel}</td>
                          <td className="py-3 text-purple-200">{totalSent.toLocaleString()}</td>
                          <td className="py-3 text-purple-200">{totalSent.toLocaleString()}</td>
                          <td className="py-3 text-purple-200">{totalRead.toLocaleString()}</td>
                          <td className="py-3 text-purple-200">{totalClicks.toLocaleString()}</td>
                          <td className="py-3 text-green-400">{openRate.toFixed(1)}%</td>
                          <td className="py-3 text-blue-400">{clickRate.toFixed(1)}%</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      {/* Modal para crear/editar notificación */}
      <AnimatePresence>
        {(showCreateModal || selectedNotification) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-body-bg/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowCreateModal(false)
              setSelectedNotification(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                {selectedNotification ? 'Detalles de Notificación' : 'Nueva Notificación'}
              </h3>

              <div className="space-y-6">
                {selectedNotification ? (
                  <>
                    <div>
                      <label className="block text-purple-200 text-sm font-medium mb-2">Título</label>
                      <p className="text-white bg-white/10 p-3 rounded-xl">{selectedNotification.title}</p>
                    </div>
                    <div>
                      <label className="block text-purple-200 text-sm font-medium mb-2">Mensaje</label>
                      <p className="text-white bg-white/10 p-3 rounded-xl">{selectedNotification.message}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-2">Tipo</label>
                        <p className="text-white bg-white/10 p-3 rounded-xl capitalize">{selectedNotification.type}</p>
                      </div>
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-2">Canal</label>
                        <p className="text-white bg-white/10 p-3 rounded-xl capitalize">{selectedNotification.channel}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-purple-200 text-sm font-medium mb-2">Título</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Título de la notificación"
                      />
                    </div>
                    <div>
                      <label className="block text-purple-200 text-sm font-medium mb-2">Mensaje</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="Contenido del mensaje"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-2">Tipo</label>
                        <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                          <option value="info">Información</option>
                          <option value="success">Éxito</option>
                          <option value="warning">Advertencia</option>
                          <option value="error">Error</option>
                          <option value="promotion">Promoción</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-2">Canal</label>
                        <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                          <option value="email">Email</option>
                          <option value="sms">SMS</option>
                          <option value="push">Push</option>
                          <option value="in-app">In-App</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      setSelectedNotification(null)
                    }}
                    className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors"
                  >
                    {selectedNotification ? 'Cerrar' : 'Cancelar'}
                  </button>
                  {!selectedNotification && (
                    <button className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all">
                      Crear Notificación
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para templates */}
      <AnimatePresence>
        {(showTemplateModal || selectedTemplate) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-body-bg/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowTemplateModal(false)
              setSelectedTemplate(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                {selectedTemplate ? 'Editar Plantilla' : 'Nueva Plantilla'}
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Nombre</label>
                  <input
                    type="text"
                    defaultValue={selectedTemplate?.name}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nombre de la plantilla"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Asunto</label>
                  <input
                    type="text"
                    defaultValue={selectedTemplate?.subject}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Asunto del mensaje"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Contenido</label>
                  <textarea
                    rows={6}
                    defaultValue={selectedTemplate?.content}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Contenido de la plantilla (usa {variable} para variables dinámicas)"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Tipo</label>
                  <select 
                    defaultValue={selectedTemplate?.type}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="booking_confirmation">Confirmación de Reserva</option>
                    <option value="payment_reminder">Recordatorio de Pago</option>
                    <option value="event_update">Actualización de Evento</option>
                    <option value="transport_delay">Retraso de Transporte</option>
                    <option value="promotion">Promoción</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => {
                      setShowTemplateModal(false)
                      setSelectedTemplate(null)
                    }}
                    className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all">
                    {selectedTemplate ? 'Actualizar' : 'Crear'} Plantilla
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
