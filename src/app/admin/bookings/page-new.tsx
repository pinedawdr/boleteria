'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Ticket, 
  QrCode, 
  Download, 
  Send, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  Filter,
  Search,
  Eye,
  RefreshCw,
  Phone,
  Bus,
  Music,
  ArrowRight,
  DollarSign
} from 'lucide-react'

import { 
  getAdminBookings, 
  type AdminBooking 
} from '@/lib/admin-services'

// Extendemos AdminBooking para compatibilidad con datos mock
interface Booking extends Omit<AdminBooking, 'booking_code'> {
  booking_code?: string;
  user_phone?: string;
  venue?: string;
  company?: string;
  date?: string;
  time?: string;
  seats?: BookingSeat[];
  notes?: string;
}

interface BookingSeat {
  seat_number: string;
  seat_type: string;
  price: number;
  passenger_name?: string;
  passenger_id?: string;
}

export default function BookingsAdmin() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPayment, setFilterPayment] = useState<string>('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [currentPage] = useState(1)
  const [totalBookings, setTotalBookings] = useState(0)
  const limit = 10

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const typeFilter = filterType === 'all' ? '' : filterType
      const statusFilter = filterStatus === 'all' ? '' : filterStatus

      const bookingsData = await getAdminBookings(
        currentPage, 
        limit, 
        searchTerm, 
        typeFilter, 
        statusFilter
      )

      setBookings(bookingsData.bookings)
      setTotalBookings(bookingsData.total)
    } catch (err) {
      console.error('Error loading bookings:', err)
      setError('Error al cargar las reservas')
      
      // Fallback con datos mock para desarrollo
      const mockBookings: Booking[] = [
        {
          id: '1',
          user_id: 'user1',
          user_name: 'Carlos Mendoza',
          user_email: 'carlos@email.com',
          booking_type: 'event',
          event_id: 'event1',
          event_title: 'Concierto de Marc Anthony',
          seat_ids: ['A15', 'A16'],
          total_amount: 700,
          payment_status: 'completed',
          booking_status: 'confirmed',
          created_at: '2024-12-10T14:30:00Z',
          updated_at: '2024-12-10T14:30:00Z',
          booking_code: 'BT-2024-001234',
          user_phone: '+51 987 654 321',
          venue: 'Arena Lima',
          date: '2024-12-20',
          time: '20:00',
          seats: [
            { seat_number: 'A15', seat_type: 'VIP', price: 350 },
            { seat_number: 'A16', seat_type: 'VIP', price: 350 }
          ],
          qr_code: 'QR123456789',
          notes: 'Cliente VIP - Acceso prioritario'
        },
        {
          id: '2',
          user_id: 'user2',
          user_name: 'Ana García',
          user_email: 'ana@email.com',
          booking_type: 'transport',
          route_id: 'route1',
          route_info: 'Lima - Cusco',
          seat_ids: ['12A'],
          total_amount: 120,
          payment_status: 'completed',
          booking_status: 'confirmed',
          created_at: '2024-12-08T09:15:00Z',
          updated_at: '2024-12-08T09:15:00Z',
          booking_code: 'BT-2024-001235',
          user_phone: '+51 912 345 678',
          company: 'Cruz del Sur',
          date: '2024-12-15',
          time: '21:00',
          seats: [
            { 
              seat_number: '12A', 
              seat_type: 'Premium', 
              price: 120,
              passenger_name: 'Ana García',
              passenger_id: '12345678'
            }
          ],
          qr_code: 'QR987654321'
        }
      ]
      
      setBookings(mockBookings)
      setTotalBookings(mockBookings.length)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, filterType, filterStatus])

  useEffect(() => {
    if (user?.isAdmin || user?.isOperator) {
      fetchBookings()
    }
  }, [user, fetchBookings])

  // Filtrar reservas (adicional al filtro del servidor)
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchTerm === '' || 
      (booking.booking_code?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.user_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.user_email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.event_title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.route_info?.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesPayment = filterPayment === 'all' || booking.payment_status === filterPayment
    
    return matchesSearch && matchesPayment
  })

  // Estadísticas
  const bookingStats = {
    total: totalBookings,
    confirmed: bookings.filter(b => b.booking_status === 'confirmed').length,
    pending: bookings.filter(b => b.payment_status === 'pending').length,
    revenue: bookings
      .filter(b => b.payment_status === 'completed')
      .reduce((sum, b) => sum + b.total_amount, 0),
    events: bookings.filter(b => b.booking_type === 'event').length,
    transport: bookings.filter(b => b.booking_type === 'transport').length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400'
      case 'cancelled': return 'text-red-400'
      case 'used': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      case 'refunded': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const generateQRCode = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowQRModal(true)
  }

  const sendBookingEmail = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowEmailModal(true)
  }

  const downloadTicket = (booking: Booking) => {
    console.log('Downloading ticket for booking:', booking.booking_code)
  }

  if (!user?.isAdmin && !user?.isOperator) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Acceso Denegado</h2>
          <p className="text-gray-400">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-purple-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-bold text-white mb-2">Cargando Reservas</h2>
          <p className="text-gray-400">Obteniendo datos del servidor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <Ticket className="w-8 h-8 text-purple-400" />
          Gestión de Reservas
        </h1>
        <p className="text-gray-400">
          Administra todas las reservas de eventos y transporte
        </p>
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{error} - Mostrando datos de desarrollo</p>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="text-sm text-gray-400">
          Total de reservas: <span className="font-semibold text-white">{bookingStats.total}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button 
            onClick={fetchBookings}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total</p>
              <p className="text-2xl font-bold text-white">{bookingStats.total}</p>
            </div>
            <Ticket className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Confirmadas</p>
              <p className="text-2xl font-bold text-white">{bookingStats.confirmed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pendientes</p>
              <p className="text-2xl font-bold text-white">{bookingStats.pending}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ingresos</p>
              <p className="text-2xl font-bold text-purple-400">S/ {bookingStats.revenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Eventos</p>
              <p className="text-2xl font-bold text-white">{bookingStats.events}</p>
            </div>
            <Music className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Transporte</p>
              <p className="text-2xl font-bold text-white">{bookingStats.transport}</p>
            </div>
            <Bus className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar reservas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          >
            <option value="all">Todos los tipos</option>
            <option value="event">Eventos</option>
            <option value="transport">Transporte</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          >
            <option value="all">Todos los estados</option>
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
            <option value="used">Usada</option>
          </select>

          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          >
            <option value="all">Estado de pago</option>
            <option value="completed">Completado</option>
            <option value="pending">Pendiente</option>
            <option value="failed">Fallido</option>
            <option value="refunded">Reembolsado</option>
          </select>

          <button 
            onClick={fetchBookings}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filtrar
          </button>
        </div>
      </div>

      {/* Lista de Reservas */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-300">Reserva</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-300">Cliente</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-300">Servicio</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-300">Fecha/Hora</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-300">Asientos</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-300">Total</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-300">Estado</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-white">{booking.booking_code || booking.id}</p>
                      <p className="text-gray-400 text-sm flex items-center gap-1">
                        {booking.booking_type === 'event' ? <Music className="w-4 h-4" /> : <Bus className="w-4 h-4" />}
                        {booking.booking_type === 'event' ? 'Evento' : 'Transporte'}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(booking.created_at).toLocaleDateString('es-PE')}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-white">{booking.user_name}</p>
                      <p className="text-gray-400 text-sm">{booking.user_email}</p>
                      <p className="text-gray-500 text-xs">{booking.user_phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      {booking.booking_type === 'event' ? (
                        <>
                          <p className="font-semibold text-white">{booking.event_title}</p>
                          <p className="text-gray-400 text-sm flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {booking.venue}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-white">{booking.route_info}</p>
                          <p className="text-gray-400 text-sm">{booking.company}</p>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-white flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {booking.date ? new Date(booking.date).toLocaleDateString('es-PE') : 'N/A'}
                      </p>
                      <p className="text-gray-400 text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {booking.time || 'N/A'}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-white">{booking.seat_ids.length} asiento(s)</p>
                      <p className="text-gray-400 text-sm">
                        {booking.seat_ids.join(', ')}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-white">S/ {booking.total_amount}</p>
                    <p className={`text-sm font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                      {booking.payment_status}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-medium ${getStatusColor(booking.booking_status)}`}>
                      {booking.booking_status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {booking.qr_code && (
                        <button
                          onClick={() => generateQRCode(booking)}
                          className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-lg transition-colors"
                          title="Ver QR"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => downloadTicket(booking)}
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-colors"
                        title="Descargar ticket"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => sendBookingEmail(booking)}
                        className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 rounded-lg transition-colors"
                        title="Enviar email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && !loading && (
        <div className="text-center py-12">
          <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No se encontraron reservas</h3>
          <p className="text-gray-400">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all' || filterPayment !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda.' 
              : 'No hay reservas registradas en el sistema.'}
          </p>
        </div>
      )}

      {/* Modal de detalles de reserva */}
      <AnimatePresence>
        {selectedBooking && !showQRModal && !showEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Detalles de Reserva</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Información de la reserva */}
                <div className="space-y-6">
                  <div className="bg-gray-900/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Información General</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Código:</span>
                        <span className="text-white font-mono">{selectedBooking.booking_code || selectedBooking.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tipo:</span>
                        <span className="text-white capitalize">{selectedBooking.booking_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Estado:</span>
                        <span className={`font-medium ${getStatusColor(selectedBooking.booking_status)}`}>
                          {selectedBooking.booking_status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pago:</span>
                        <span className={`font-medium ${getPaymentStatusColor(selectedBooking.payment_status)}`}>
                          {selectedBooking.payment_status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total:</span>
                        <span className="text-white font-bold">S/ {selectedBooking.total_amount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Cliente</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-purple-400" />
                        <span className="text-white">{selectedBooking.user_name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-purple-400" />
                        <span className="text-white">{selectedBooking.user_email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-purple-400" />
                        <span className="text-white">{selectedBooking.user_phone}</span>
                      </div>
                    </div>
                  </div>

                  {selectedBooking.notes && (
                    <div className="bg-gray-900/50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Notas</h4>
                      <p className="text-gray-300">{selectedBooking.notes}</p>
                    </div>
                  )}
                </div>

                {/* Información del servicio y asientos */}
                <div className="space-y-6">
                  <div className="bg-gray-900/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      {selectedBooking.booking_type === 'event' ? 'Evento' : 'Viaje'}
                    </h4>
                    {selectedBooking.booking_type === 'event' ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Music className="w-5 h-5 text-purple-400" />
                          <span className="text-white">{selectedBooking.event_title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-purple-400" />
                          <span className="text-white">{selectedBooking.venue}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-purple-400" />
                          <span className="text-white">
                            {selectedBooking.date ? new Date(selectedBooking.date).toLocaleDateString('es-PE') : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-purple-400" />
                          <span className="text-white">{selectedBooking.time}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Bus className="w-5 h-5 text-purple-400" />
                          <span className="text-white">{selectedBooking.route_info}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <ArrowRight className="w-5 h-5 text-purple-400" />
                          <span className="text-white">{selectedBooking.company}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-purple-400" />
                          <span className="text-white">
                            {selectedBooking.date ? new Date(selectedBooking.date).toLocaleDateString('es-PE') : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-purple-400" />
                          <span className="text-white">{selectedBooking.time}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Asientos</h4>
                    <div className="space-y-3">
                      {selectedBooking.seats?.map((seat, index) => (
                        <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-white font-semibold">{seat.seat_number}</span>
                            <span className="text-purple-400 font-semibold">S/ {seat.price}</span>
                          </div>
                          <div className="text-sm text-gray-400 space-y-1">
                            <p>Tipo: {seat.seat_type}</p>
                            {seat.passenger_name && (
                              <p>Pasajero: {seat.passenger_name}</p>
                            )}
                            {seat.passenger_id && (
                              <p>DNI: {seat.passenger_id}</p>
                            )}
                          </div>
                        </div>
                      )) || (
                        <div className="space-y-2">
                          {selectedBooking.seat_ids.map((seatId, index) => (
                            <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                              <span className="text-white font-semibold">{seatId}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
                {selectedBooking.qr_code && (
                  <button
                    onClick={() => generateQRCode(selectedBooking)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <QrCode className="w-5 h-5" />
                    Ver QR
                  </button>
                )}
                
                <button
                  onClick={() => downloadTicket(selectedBooking)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Descargar
                </button>
                
                <button
                  onClick={() => sendBookingEmail(selectedBooking)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Enviar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal QR Code */}
      <AnimatePresence>
        {showQRModal && selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-6">Código QR</h3>
                
                {/* Simulación de QR Code */}
                <div className="bg-white rounded-xl p-8 mb-6">
                  <div className="w-48 h-48 mx-auto bg-gray-900 rounded-lg flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-white" />
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-white font-semibold">{selectedBooking.booking_code || selectedBooking.id}</p>
                  <p className="text-gray-400 text-sm">Presenta este código al ingresar</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex-1"
                  >
                    Cerrar
                  </button>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex-1">
                    <Download className="w-5 h-5 mx-auto" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Email */}
      <AnimatePresence>
        {showEmailModal && selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Enviar Confirmación</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Para</label>
                  <input
                    type="email"
                    defaultValue={selectedBooking.user_email}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Asunto</label>
                  <input
                    type="text"
                    defaultValue={`Confirmación de reserva ${selectedBooking.booking_code || selectedBooking.id}`}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Mensaje</label>
                  <textarea
                    rows={6}
                    defaultValue={`Estimado/a ${selectedBooking.user_name},\n\nTu reserva ${selectedBooking.booking_code || selectedBooking.id} ha sido confirmada.\n\nDetalles:\n- ${selectedBooking.booking_type === 'event' ? selectedBooking.event_title : selectedBooking.route_info}\n- Fecha: ${selectedBooking.date ? new Date(selectedBooking.date).toLocaleDateString('es-PE') : 'N/A'}\n- Hora: ${selectedBooking.time || 'N/A'}\n- Total: S/ ${selectedBooking.total_amount}\n\n¡Gracias por elegir Boletería!`}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-none"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-gray-300">
                    <input type="checkbox" defaultChecked className="rounded" />
                    Incluir QR Code
                  </label>
                  <label className="flex items-center gap-2 text-gray-300">
                    <input type="checkbox" defaultChecked className="rounded" />
                    Incluir términos y condiciones
                  </label>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex-1"
                  >
                    Cancelar
                  </button>
                  <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex-1">
                    Enviar Email
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
