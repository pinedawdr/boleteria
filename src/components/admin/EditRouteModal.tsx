'use client'

import { useState, useEffect } from 'react'
import { X, Clock, DollarSign, Users, Star, Save, AlertTriangle, CheckCircle, Bus, Ship, Plane, Truck } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Route {
  id?: string
  origin: string
  destination: string
  company_name: string
  vehicle_type: 'bus' | 'train' | 'boat' | 'plane'
  vehicle_class: string
  departure_time: string
  arrival_time: string
  price: number
  available_seats: number
  total_seats: number
  status: 'active' | 'suspended' | 'maintenance'
  duration: string
  frequency: string
  amenities: string[]
  route_type: string
  rating: number
  total_bookings: number
  revenue: number
  created_at: string
}

interface EditRouteModalProps {
  isOpen: boolean
  onClose: () => void
  onRouteSaved: () => void
  editingRoute?: Route | null
}

// Configuración avanzada de tipos de vehículos
const VEHICLE_TYPES = {
  bus: {
    label: 'Bus',
    icon: Bus,
    color: 'blue',
    bgClass: 'bg-blue-500/20',
    textClass: 'text-blue-400',
    classes: ['Económico', 'Semi Cama', 'Cama', 'Premium', 'Suite'],
    capacityRange: { min: 30, max: 60 },
    amenities: ['wifi', 'ac', 'bathroom', 'entertainment', 'snacks', 'blanket', 'pillow', 'usb_charger']
  },
  train: {
    label: 'Tren',
    icon: Truck,
    color: 'green',
    bgClass: 'bg-green-500/20',
    textClass: 'text-green-400',
    classes: ['Turista', 'Ejecutivo', 'Primera Clase'],
    capacityRange: { min: 100, max: 300 },
    amenities: ['wifi', 'restaurant', 'ac', 'bathroom', 'entertainment', 'power_outlets', 'observation_car']
  },
  boat: {
    label: 'Barco',
    icon: Ship,
    color: 'cyan',
    bgClass: 'bg-cyan-500/20',
    textClass: 'text-cyan-400',
    classes: ['Económico', 'Camarote', 'Suite'],
    capacityRange: { min: 50, max: 200 },
    amenities: ['restaurant', 'deck', 'ac', 'bathroom', 'entertainment', 'cabin', 'life_jackets']
  },
  plane: {
    label: 'Avión',
    icon: Plane,
    color: 'purple',
    bgClass: 'bg-purple-500/20',
    textClass: 'text-purple-400',
    classes: ['Económico', 'Premium', 'Business'],
    capacityRange: { min: 120, max: 350 },
    amenities: ['wifi', 'entertainment', 'meal', 'beverage', 'reclining_seats', 'overhead_storage']
  }
}

const AMENITY_LABELS = {
  wifi: 'WiFi Gratis',
  ac: 'Aire Acondicionado',
  bathroom: 'Baño a Bordo',
  entertainment: 'Sistema de Entretenimiento',
  snacks: 'Snacks Incluidos',
  blanket: 'Manta',
  pillow: 'Almohada',
  usb_charger: 'Puerto USB',
  restaurant: 'Restaurante',
  power_outlets: 'Enchufes Eléctricos',
  observation_car: 'Vagón Panorámico',
  deck: 'Cubierta',
  cabin: 'Camarote',
  life_jackets: 'Chalecos Salvavidas',
  meal: 'Comida',
  beverage: 'Bebida',
  reclining_seats: 'Asientos Reclinables',
  overhead_storage: 'Compartimientos Superiores'
}

const ROUTE_TYPES = {
  express: { label: 'Express', description: 'Servicio directo sin paradas' },
  regular: { label: 'Regular', description: 'Servicio con paradas programadas' },
  luxury: { label: 'Lujo', description: 'Servicio premium con máximo confort' },
  economy: { label: 'Económico', description: 'Servicio básico a precio accesible' }
}

const FREQUENCY_OPTIONS = [
  'Diario',
  'Lunes a Viernes',
  'Fines de Semana',
  'Lunes, Miércoles, Viernes',
  'Martes, Jueves, Sábado',
  'Semanal'
]

export default function EditRouteModal({ isOpen, onClose, onRouteSaved, editingRoute }: EditRouteModalProps) {
  const [formData, setFormData] = useState<Partial<Route>>({
    origin: '',
    destination: '',
    company_name: '',
    vehicle_type: 'bus',
    vehicle_class: '',
    departure_time: '',
    arrival_time: '',
    price: 0,
    available_seats: 0,
    total_seats: 0,
    status: 'active',
    duration: '',
    frequency: 'Diario',
    amenities: [],
    route_type: 'regular',
    rating: 4.0,
    total_bookings: 0,
    revenue: 0,
    created_at: new Date().toISOString().split('T')[0]
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Cargar datos del evento si estamos editando
  useEffect(() => {
    if (editingRoute) {
      setFormData(editingRoute)
    } else {
      // Reset form for new route
      setFormData({
        origin: '',
        destination: '',
        company_name: '',
        vehicle_type: 'bus',
        vehicle_class: '',
        departure_time: '',
        arrival_time: '',
        price: 0,
        available_seats: 0,
        total_seats: 0,
        status: 'active',
        duration: '',
        frequency: 'Diario',
        amenities: [],
        route_type: 'regular',
        rating: 4.0,
        total_bookings: 0,
        revenue: 0,
        created_at: new Date().toISOString().split('T')[0]
      })
    }
    setErrors({})
  }, [editingRoute, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.origin?.trim()) {
      newErrors.origin = 'El origen es requerido'
    }
    if (!formData.destination?.trim()) {
      newErrors.destination = 'El destino es requerido'
    }
    if (!formData.company_name?.trim()) {
      newErrors.company_name = 'El nombre de la empresa es requerido'
    }
    if (!formData.departure_time) {
      newErrors.departure_time = 'La hora de salida es requerida'
    }
    if (!formData.arrival_time) {
      newErrors.arrival_time = 'La hora de llegada es requerida'
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0'
    }
    if (!formData.total_seats || formData.total_seats <= 0) {
      newErrors.total_seats = 'El total de asientos debe ser mayor a 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }

    // Cálculo automático de duración
    if (field === 'departure_time' || field === 'arrival_time') {
      const departure = field === 'departure_time' ? value : formData.departure_time
      const arrival = field === 'arrival_time' ? value : formData.arrival_time
      
      if (departure && arrival) {
        const depTime = new Date(`1970-01-01T${departure}`)
        const arrTime = new Date(`1970-01-01T${arrival}`)
        
        // Si la hora de llegada es menor, asumimos que es al día siguiente
        if (arrTime < depTime) {
          arrTime.setDate(arrTime.getDate() + 1)
        }
        
        const diffMs = arrTime.getTime() - depTime.getTime()
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        
        setFormData(prev => ({
          ...prev,
          duration: `${diffHours}h ${diffMinutes.toString().padStart(2, '0')}m`
        }))
      }
    }

    // Actualizar capacidad basada en el tipo de vehículo
    if (field === 'vehicle_type') {
      const vehicleConfig = VEHICLE_TYPES[value as keyof typeof VEHICLE_TYPES]
      if (vehicleConfig && formData.total_seats === 0) {
        const avgCapacity = Math.floor((vehicleConfig.capacityRange.min + vehicleConfig.capacityRange.max) / 2)
        setFormData(prev => ({
          ...prev,
          total_seats: avgCapacity,
          available_seats: avgCapacity,
          vehicle_class: vehicleConfig.classes[0],
          amenities: vehicleConfig.amenities.slice(0, 3) // Amenidades por defecto
        }))
      }
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const routeData = {
        ...formData,
        available_seats: formData.available_seats || formData.total_seats,
        created_at: editingRoute?.created_at || new Date().toISOString()
      }

      // Aquí iría la lógica para guardar en la API
      console.log('Guardando ruta:', routeData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onRouteSaved()
      onClose()
    } catch (error) {
      console.error('Error al guardar:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVehicleTypeChange = (vehicleType: string) => {
    const vehicleConfig = VEHICLE_TYPES[vehicleType as keyof typeof VEHICLE_TYPES]
    setFormData(prev => ({
      ...prev,
      vehicle_type: vehicleType as Route['vehicle_type'],
      vehicle_class: vehicleConfig.classes[0], // Set default class
      total_seats: vehicleConfig.capacityRange.min, // Set default capacity
      available_seats: vehicleConfig.capacityRange.min,
      amenities: [] // Clear amenities when changing vehicle type
    }))
  }

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = formData.amenities || []
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity]
    
    handleInputChange('amenities', newAmenities)
  }

  if (!isOpen) return null

  const currentVehicleType = VEHICLE_TYPES[formData.vehicle_type as keyof typeof VEHICLE_TYPES]
  const VehicleIcon = currentVehicleType.icon

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${currentVehicleType.bgClass} rounded-lg`}>
              <VehicleIcon className={`w-6 h-6 ${currentVehicleType.textClass}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {editingRoute ? 'Editar Ruta' : 'Nueva Ruta'}
              </h2>
              <p className="text-sm text-gray-400">
                {currentVehicleType.label} • {formData.origin || 'Origen'} → {formData.destination || 'Destino'}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Origin */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Ciudad de Origen *
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => handleInputChange('origin', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                      errors.origin ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    placeholder="Ej: Lima"
                  />
                  {errors.origin && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.origin}
                    </p>
                  )}
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Ciudad de Destino *
                  </label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                      errors.destination ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    placeholder="Ej: Arequipa"
                  />
                  {errors.destination && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.destination}
                    </p>
                  )}
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Nombre de la Empresa *
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                      errors.company_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    placeholder="Ej: Cruz del Sur"
                  />
                  {errors.company_name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.company_name}
                    </p>
                  )}
                </div>

                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Tipo de Vehículo
                  </label>
                  <select
                    value={formData.vehicle_type}
                    onChange={(e) => handleVehicleTypeChange(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    {Object.entries(VEHICLE_TYPES).map(([key, vehicle]) => (
                      <option key={key} value={key}>{vehicle.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Vehicle Class and Route Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Clase de Servicio *
                  </label>
                  <select
                    value={formData.vehicle_class}
                    onChange={(e) => handleInputChange('vehicle_class', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    <option value="">Seleccionar clase</option>
                    {currentVehicleType.classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Tipo de Ruta
                  </label>
                  <select
                    value={formData.route_type}
                    onChange={(e) => handleInputChange('route_type', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    {Object.entries(ROUTE_TYPES).map(([key, route]) => (
                      <option key={key} value={key}>{route.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Schedule and Pricing */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Horarios y Precios</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Departure Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Hora de Salida *
                  </label>
                  <input
                    type="time"
                    value={formData.departure_time}
                    onChange={(e) => handleInputChange('departure_time', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-1 transition-colors ${
                      errors.departure_time ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {errors.departure_time && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.departure_time}
                    </p>
                  )}
                </div>

                {/* Arrival Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Hora de Llegada *
                  </label>
                  <input
                    type="time"
                    value={formData.arrival_time}
                    onChange={(e) => handleInputChange('arrival_time', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-1 transition-colors ${
                      errors.arrival_time ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {errors.arrival_time && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.arrival_time}
                    </p>
                  )}
                </div>

                {/* Duration (Auto-calculated) */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Duración
                  </label>
                  <div className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formData.duration || 'Calculando...'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Precio (S/.) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-1 transition-colors ${
                      errors.price ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.price}
                    </p>
                  )}
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Frecuencia
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    {FREQUENCY_OPTIONS.map(freq => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Capacity and Status */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Capacidad y Estado</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Seats */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Capacidad Total *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.total_seats}
                    onChange={(e) => handleInputChange('total_seats', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-1 transition-colors ${
                      errors.total_seats ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {errors.total_seats && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.total_seats}
                    </p>
                  )}
                </div>

                {/* Available Seats */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Asientos Disponibles
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={formData.total_seats}
                    value={formData.available_seats}
                    onChange={(e) => handleInputChange('available_seats', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    <option value="active">Activa</option>
                    <option value="suspended">Suspendida</option>
                    <option value="maintenance">En Mantenimiento</option>
                  </select>
                </div>
              </div>

              {/* Occupancy Visual */}
              {formData.total_seats && formData.total_seats > 0 && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Ocupación Actual</span>
                    <span className="text-white font-semibold">
                      {Math.round(((formData.total_seats - (formData.available_seats || 0)) / formData.total_seats) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${((formData.total_seats - (formData.available_seats || 0)) / formData.total_seats) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Servicios y Amenidades</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {currentVehicleType.amenities.map(amenity => (
                  <label 
                    key={amenity}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                      formData.amenities?.includes(amenity)
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-gray-600 hover:border-blue-500 text-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities?.includes(amenity) || false}
                      onChange={() => toggleAmenity(amenity)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 border rounded transition-colors ${
                      formData.amenities?.includes(amenity)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-600'
                    }`}>
                      {formData.amenities?.includes(amenity) && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {AMENITY_LABELS[amenity as keyof typeof AMENITY_LABELS] || amenity}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Statistics (for editing existing routes) */}
            {editingRoute && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Estadísticas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-gray-400">Rating</span>
                    </div>
                    <div className="text-xl font-bold text-white">{formData.rating}/5</div>
                  </div>

                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-gray-400">Total Reservas</span>
                    </div>
                    <div className="text-xl font-bold text-white">{formData.total_bookings?.toLocaleString()}</div>
                  </div>

                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-gray-400">Ingresos</span>
                    </div>
                    <div className="text-xl font-bold text-white">S/. {formData.revenue?.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            {editingRoute ? 'Editando ruta existente' : 'Creando nueva ruta de transporte'}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {editingRoute ? 'Actualizar Ruta' : 'Crear Ruta'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
