'use client'

import { useState, useEffect } from 'react'
import { X, Bus, Ship, Plane, Car, MapPin, Clock, DollarSign, Users, Wifi, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface CreateTransportModalAdvancedProps {
  isOpen: boolean
  onClose: () => void
  onRouteCreated: () => void
}

interface TransportCompany {
  id: string
  name: string
  logo_url?: string
  rating: number
  contact_info?: string
}

// Configuración avanzada de tipos de vehículos
const VEHICLE_TYPES = {
  bus: {
    label: 'Bus',
    icon: Bus,
    color: 'blue',
    classes: ['Económico', 'Semi Cama', 'Cama', 'Premium', 'Suite'],
    capacityRange: { min: 30, max: 60 },
    amenities: ['wifi', 'ac', 'bathroom', 'entertainment', 'snacks', 'blanket', 'pillow', 'usb_charger']
  },
  train: {
    label: 'Tren',
    icon: Car,
    color: 'green',
    classes: ['Turista', 'Ejecutivo', 'Primera Clase'],
    capacityRange: { min: 100, max: 300 },
    amenities: ['wifi', 'restaurant', 'ac', 'bathroom', 'entertainment', 'power_outlets', 'observation_car']
  },
  boat: {
    label: 'Barco',
    icon: Ship,
    color: 'cyan',
    classes: ['Económico', 'Camarote', 'Suite'],
    capacityRange: { min: 50, max: 200 },
    amenities: ['restaurant', 'deck', 'ac', 'bathroom', 'entertainment', 'cabin', 'life_jackets']
  },
  plane: {
    label: 'Avión',
    icon: Plane,
    color: 'purple',
    classes: ['Económico', 'Premium', 'Business'],
    capacityRange: { min: 50, max: 300 },
    amenities: ['wifi', 'entertainment', 'meal', 'beverage', 'power_outlets', 'overhead_storage']
  }
}

const POPULAR_DESTINATIONS = [
  'Lima', 'Cusco', 'Arequipa', 'Trujillo', 'Piura', 'Chiclayo', 
  'Iquitos', 'Huancayo', 'Ayacucho', 'Tacna', 'Puno', 'Cajamarca',
  'Huaraz', 'Tarapoto', 'Tumbes', 'Chimbote', 'Huánuco', 'Pucallpa'
]

// Amenidades con iconos y categorías
const AMENITIES_CONFIG = {
  wifi: { label: 'Wi-Fi Gratuito', icon: '📶', category: 'conectividad' },
  ac: { label: 'Aire Acondicionado', icon: '❄️', category: 'comodidad' },
  bathroom: { label: 'Baño Privado', icon: '🚿', category: 'servicios' },
  entertainment: { label: 'Entretenimiento', icon: '📺', category: 'entretenimiento' },
  snacks: { label: 'Snacks Incluidos', icon: '🍿', category: 'alimentacion' },
  restaurant: { label: 'Restaurante a Bordo', icon: '🍽️', category: 'alimentacion' },
  blanket: { label: 'Manta', icon: '🛏️', category: 'comodidad' },
  pillow: { label: 'Almohada', icon: '🛌', category: 'comodidad' },
  usb_charger: { label: 'Cargador USB', icon: '🔌', category: 'conectividad' },
  power_outlets: { label: 'Enchufes 220V', icon: '⚡', category: 'conectividad' },
  deck: { label: 'Cubierta al Aire Libre', icon: '🌊', category: 'espacios' },
  cabin: { label: 'Cabina Privada', icon: '🏠', category: 'espacios' },
  meal: { label: 'Comida Incluida', icon: '🍴', category: 'alimentacion' },
  beverage: { label: 'Bebidas Incluidas', icon: '🥤', category: 'alimentacion' },
  observation_car: { label: 'Vagón Observatorio', icon: '🔭', category: 'espacios' },
  life_jackets: { label: 'Chalecos Salvavidas', icon: '🦺', category: 'seguridad' },
  overhead_storage: { label: 'Compartimiento Superior', icon: '🧳', category: 'servicios' }
}

export default function CreateTransportModalAdvanced({ isOpen, onClose, onRouteCreated }: CreateTransportModalAdvancedProps) {
  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState<TransportCompany[]>([])
  const [selectedVehicleType, setSelectedVehicleType] = useState<keyof typeof VEHICLE_TYPES>('bus')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    company_id: '',
    vehicle_type: 'bus',
    vehicle_class: 'Económico',
    origin: '',
    destination: '',
    departure_time: '',
    arrival_time: '',
    price: 0,
    total_seats: 40,
    frequency: 'daily',
    specific_days: [] as string[],
    description: '',
    status: 'active' as 'active' | 'suspended' | 'maintenance',
    route_type: 'regular' as 'regular' | 'express' | 'luxury',
    allows_pets: false,
    allows_luggage: true,
    max_luggage_weight: 23,
    cancellation_policy: '24_hours' as '24_hours' | '48_hours' | '72_hours' | 'no_cancellation',
    refund_percentage: 80
  })

  useEffect(() => {
    if (isOpen) {
      fetchCompanies()
      resetForm()
    }
  }, [isOpen])

  const fetchCompanies = async () => {
    try {
      // Datos mock de compañías con más detalles
      const mockCompanies: TransportCompany[] = [
        { id: '1', name: 'Cruz del Sur', rating: 4.5, contact_info: '+51 1 311-5050' },
        { id: '2', name: 'Oltursa', rating: 4.2, contact_info: '+51 1 708-5000' },
        { id: '3', name: 'Tepsa', rating: 4.0, contact_info: '+51 1 617-9000' },
        { id: '4', name: 'Línea', rating: 3.8, contact_info: '+51 1 424-0279' },
        { id: '5', name: 'Movil Tours', rating: 4.3, contact_info: '+51 1 716-8000' },
        { id: '6', name: 'Civa', rating: 3.9, contact_info: '+51 1 418-1111' },
        { id: '7', name: 'PeruRail', rating: 4.6, contact_info: '+51 84 238-722' },
        { id: '8', name: 'Inca Rail', rating: 4.4, contact_info: '+51 84 233-030' }
      ]
      setCompanies(mockCompanies)
    } catch (error) {
      console.error('Error fetching companies:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      company_id: '',
      vehicle_type: 'bus',
      vehicle_class: 'Económico',
      origin: '',
      destination: '',
      departure_time: '',
      arrival_time: '',
      price: 0,
      total_seats: 40,
      frequency: 'daily',
      specific_days: [],
      description: '',
      status: 'active',
      route_type: 'regular',
      allows_pets: false,
      allows_luggage: true,
      max_luggage_weight: 23,
      cancellation_policy: '24_hours',
      refund_percentage: 80
    })
    setSelectedAmenities([])
    setSelectedVehicleType('bus')
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleVehicleTypeChange = (vehicleType: keyof typeof VEHICLE_TYPES) => {
    setSelectedVehicleType(vehicleType)
    handleInputChange('vehicle_type', vehicleType)
    
    // Actualizar clase por defecto según el tipo de vehículo
    const vehicleConfig = VEHICLE_TYPES[vehicleType]
    handleInputChange('vehicle_class', vehicleConfig.classes[0])
    
    // Actualizar capacidad sugerida
    const suggestedCapacity = Math.floor((vehicleConfig.capacityRange.min + vehicleConfig.capacityRange.max) / 2)
    handleInputChange('total_seats', suggestedCapacity)
    
    // Resetear amenidades a las disponibles para este tipo de vehículo
    setSelectedAmenities([])
  }

  const handleAmenityToggle = (amenityKey: string) => {
    setSelectedAmenities(prev => {
      const newAmenities = prev.includes(amenityKey)
        ? prev.filter(a => a !== amenityKey)
        : [...prev, amenityKey]
      return newAmenities
    })
  }

  const handleSpecificDayToggle = (dayIndex: string) => {
    handleInputChange('specific_days', 
      formData.specific_days.includes(dayIndex)
        ? formData.specific_days.filter(d => d !== dayIndex)
        : [...formData.specific_days, dayIndex]
    )
  }

  const calculateDuration = () => {
    if (formData.departure_time && formData.arrival_time) {
      const departure = new Date(`2024-01-01T${formData.departure_time}:00`)
      let arrival = new Date(`2024-01-01T${formData.arrival_time}:00`)
      
      // Si la llegada es menor que la salida, asumimos que es al día siguiente
      if (arrival <= departure) {
        arrival.setDate(arrival.getDate() + 1)
      }
      
      const diffMs = arrival.getTime() - departure.getTime()
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      
      return `${hours}h ${minutes}m`
    }
    return ''
  }

  const validateForm = () => {
    const required = ['company_id', 'origin', 'destination', 'departure_time', 'arrival_time', 'price']
    const missing = required.filter(field => !formData[field as keyof typeof formData])
    
    if (missing.length > 0) {
      alert(`Faltan campos requeridos: ${missing.join(', ')}`)
      return false
    }

    if (formData.origin === formData.destination) {
      alert('El origen y destino no pueden ser iguales')
      return false
    }

    if (formData.price <= 0) {
      alert('El precio debe ser mayor a 0')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      const transportData = {
        ...formData,
        amenities: selectedAmenities,
        duration: calculateDuration(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Simular llamada a API
      console.log('Creating transport route:', transportData)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500))

      onRouteCreated()
      onClose()
      alert('¡Ruta de transporte creada exitosamente!')
    } catch (error: any) {
      console.error('Error creating transport:', error)
      alert(error.message || 'Error al crear la ruta de transporte')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const selectedVehicle = VEHICLE_TYPES[selectedVehicleType]
  const VehicleIcon = selectedVehicle.icon
  const availableAmenities = selectedVehicle.amenities
    .map(key => ({ key, ...AMENITIES_CONFIG[key as keyof typeof AMENITIES_CONFIG] }))
    .filter(Boolean)

  return (
    <div className="fixed inset-0 bg-overlay-heavy flex items-center justify-center z-50 p-4">
      <div className="card-default max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-color">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/20 rounded-lg">
              <VehicleIcon className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Crear Nueva Ruta</h2>
              <p className="text-text-secondary">
                Gestión avanzada de rutas de {selectedVehicle.label.toLowerCase()}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-hover-bg rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Selección de Tipo de Vehículo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              Tipo de Vehículo
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(VEHICLE_TYPES).map(([key, vehicle]) => {
                const Icon = vehicle.icon
                const isSelected = selectedVehicleType === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleVehicleTypeChange(key as keyof typeof VEHICLE_TYPES)}
                    className={`p-4 border-2 rounded-xl transition-all duration-200 flex flex-col items-center gap-3 ${
                      isSelected
                        ? 'border-accent bg-accent/10 text-accent shadow-lg transform scale-105'
                        : 'border-border-color hover:border-accent/50 hover:bg-card-bg'
                    }`}
                  >
                    <Icon className="w-8 h-8" />
                    <div className="text-center">
                      <span className="text-sm font-semibold block">{vehicle.label}</span>
                      <span className="text-xs text-text-secondary">
                        {vehicle.capacityRange.min}-{vehicle.capacityRange.max} asientos
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Información de la Compañía */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary">
                Compañía de Transporte *
              </label>
              <select
                value={formData.company_id}
                onChange={(e) => handleInputChange('company_id', e.target.value)}
                className="input-field w-full"
                required
              >
                <option value="">Seleccionar compañía</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name} - ⭐{company.rating}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary">
                Clase de Servicio
              </label>
              <select
                value={formData.vehicle_class}
                onChange={(e) => handleInputChange('vehicle_class', e.target.value)}
                className="input-field w-full"
              >
                {selectedVehicle.classes.map(vehicleClass => (
                  <option key={vehicleClass} value={vehicleClass}>
                    {vehicleClass}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Origen y Destino */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary">
                Ciudad de Origen *
              </label>
              <select
                value={formData.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                className="input-field w-full"
                required
              >
                <option value="">Seleccionar origen</option>
                {POPULAR_DESTINATIONS.map(destination => (
                  <option key={destination} value={destination}>
                    {destination}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary">
                Ciudad de Destino *
              </label>
              <select
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className="input-field w-full"
                required
              >
                <option value="">Seleccionar destino</option>
                {POPULAR_DESTINATIONS.filter(d => d !== formData.origin).map(destination => (
                  <option key={destination} value={destination}>
                    {destination}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary">
                Hora de Salida *
              </label>
              <input
                type="time"
                value={formData.departure_time}
                onChange={(e) => handleInputChange('departure_time', e.target.value)}
                className="input-field w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary">
                Hora de Llegada *
              </label>
              <input
                type="time"
                value={formData.arrival_time}
                onChange={(e) => handleInputChange('arrival_time', e.target.value)}
                className="input-field w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary">
                Duración del Viaje
              </label>
              <div className="input-field w-full bg-card-bg flex items-center justify-center text-text-secondary">
                <Clock className="w-4 h-4 mr-2" />
                {calculateDuration() || 'Automático'}
              </div>
            </div>
          </div>

          {/* Precio y Capacidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary">
                Precio por Persona (S/) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  className="input-field w-full pl-10"
                  min="0"
                  step="0.50"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary">
                Capacidad Total
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="number"
                  value={formData.total_seats}
                  onChange={(e) => handleInputChange('total_seats', parseInt(e.target.value) || 0)}
                  className="input-field w-full pl-10"
                  min={selectedVehicle.capacityRange.min}
                  max={selectedVehicle.capacityRange.max}
                />
              </div>
              <p className="text-xs text-text-secondary">
                Rango: {selectedVehicle.capacityRange.min}-{selectedVehicle.capacityRange.max} asientos
              </p>
            </div>
          </div>

          {/* Amenidades */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Wifi className="w-5 h-5 text-accent" />
              Amenidades Incluidas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableAmenities.map(amenity => (
                <button
                  key={amenity.key}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity.key)}
                  className={`p-3 border rounded-lg transition-all duration-200 flex items-center gap-3 text-sm ${
                    selectedAmenities.includes(amenity.key)
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border-color hover:border-accent/50 hover:bg-card-bg'
                  }`}
                >
                  <span className="text-lg">{amenity.icon}</span>
                  <span className="text-left">{amenity.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Frecuencia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Frecuencia del Servicio</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={formData.frequency}
                onChange={(e) => handleInputChange('frequency', e.target.value)}
                className="input-field w-full"
              >
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="specific_days">Días Específicos</option>
              </select>

              {formData.frequency === 'specific_days' && (
                <div className="md:col-span-2">
                  <div className="flex flex-wrap gap-2">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleSpecificDayToggle(index.toString())}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                          formData.specific_days.includes(index.toString())
                            ? 'bg-accent text-white border-accent'
                            : 'bg-transparent border-border-color hover:border-accent'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Configuración Adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary">
                Tipo de Ruta
              </label>
              <select
                value={formData.route_type}
                onChange={(e) => handleInputChange('route_type', e.target.value)}
                className="input-field w-full"
              >
                <option value="regular">Regular</option>
                <option value="express">Express (Sin paradas)</option>
                <option value="luxury">Lujo Premium</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary">
                Estado de la Ruta
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="input-field w-full"
              >
                <option value="active">Activo</option>
                <option value="suspended">Suspendido</option>
                <option value="maintenance">En Mantenimiento</option>
              </select>
            </div>
          </div>

          {/* Políticas y Restricciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Políticas del Servicio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allows_pets"
                    checked={formData.allows_pets}
                    onChange={(e) => handleInputChange('allows_pets', e.target.checked)}
                    className="w-4 h-4 text-accent border-border-color rounded focus:ring-accent"
                  />
                  <label htmlFor="allows_pets" className="text-sm text-text-primary">
                    Permite mascotas
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allows_luggage"
                    checked={formData.allows_luggage}
                    onChange={(e) => handleInputChange('allows_luggage', e.target.checked)}
                    className="w-4 h-4 text-accent border-border-color rounded focus:ring-accent"
                  />
                  <label htmlFor="allows_luggage" className="text-sm text-text-primary">
                    Incluye equipaje
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-text-primary">
                    Peso máximo equipaje (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.max_luggage_weight}
                    onChange={(e) => handleInputChange('max_luggage_weight', parseInt(e.target.value) || 0)}
                    className="input-field w-full"
                    min="0"
                    max="50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-text-primary">
                    Política de cancelación
                  </label>
                  <select
                    value={formData.cancellation_policy}
                    onChange={(e) => handleInputChange('cancellation_policy', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="24_hours">24 horas antes</option>
                    <option value="48_hours">48 horas antes</option>
                    <option value="72_hours">72 horas antes</option>
                    <option value="no_cancellation">Sin cancelación</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-primary">
              Descripción Adicional
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="input-field w-full"
              rows={4}
              placeholder="Información adicional sobre la ruta, paradas intermedias, servicios especiales..."
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-4 pt-6 border-t border-border-color">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              {loading ? 'Creando...' : 'Crear Ruta de Transporte'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
