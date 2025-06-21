'use client'

import { useState, useEffect } from 'react'
import { Bell, X, Check, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { getUserNotifications, markNotificationAsRead, getCurrentUser } from '@/lib/supabase'

interface Notification {
  id: string
  title: string
  message: string
  type: 'booking' | 'payment' | 'reminder' | 'general'
  read: boolean
  created_at: string
}

interface UserType {
  id: string
  email?: string
}

interface NotificationDropdownProps {
  className?: string
}

export default function NotificationDropdown({ className = '' }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    loadUser()
  }, [])

  useEffect(() => {
    if (user) {
      loadNotifications()
      
      // Set up real-time subscription (simulated with polling for now)
      const interval = setInterval(() => {
        loadNotifications()
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }

  const loadNotifications = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await getUserNotifications(user.id)
      if (!error && data) {
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read)
    
    try {
      await Promise.all(
        unreadNotifications.map(n => markNotificationAsRead(n.id))
      )
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'payment':
        return <Check className="h-5 w-5 text-blue-400" />
      case 'reminder':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      default:
        return <Info className="h-5 w-5 text-gray-400" />
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!user) {
    return null
  }

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-300 hover:text-white transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-300 hover:text-blue-200"
                  >
                    Marcar todas como leídas
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                  <p className="text-gray-300 text-sm mt-2">Cargando notificaciones...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-300">No tienes notificaciones</p>
                  <p className="text-gray-400 text-sm">Te notificaremos sobre tus reservas y ofertas especiales</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-500/10' : ''
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-medium ${
                            !notification.read ? 'text-white' : 'text-gray-300'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.created_at).toLocaleString('es-PE', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-white/20">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm text-blue-300 hover:text-blue-200"
                >
                  Ver todas las notificaciones
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Toast notification component for real-time notifications
export function NotificationToast({ 
  notification, 
  onClose 
}: { 
  notification: Notification
  onClose: () => void 
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl z-50 max-w-sm">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-white">{notification.title}</h4>
          <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'booking':
      return <CheckCircle className="h-5 w-5 text-green-400" />
    case 'payment':
      return <Check className="h-5 w-5 text-blue-400" />
    case 'reminder':
      return <AlertTriangle className="h-5 w-5 text-yellow-400" />
    default:
      return <Info className="h-5 w-5 text-gray-400" />
  }
}
