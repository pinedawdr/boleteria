'use client'

import { useState, useEffect } from 'react'
import { X, Bus, Ship, Plane, MapPin, Clock, DollarSign, Users, Plus, Trash2, Car, Truck, Wifi, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface CreateTransportModalProps {
  isOpen: boolean
  onClose: () => void
  onRouteCreated: () => void
}

interface Company {
  id: string
  name: string
  logo_url?: string
  rating: number
  contact_info?: string
}

// Tipos de vehículos mejorados con más detalles
const VEHICLE_TYPES = {
  bus: {
    value: 'bus',
    label: 'Bus',
    icon: Bus,
    color: 'blue',
    classes: ['Económico', 'Semi Cama', 'Cama', 'Premium'],
    capacityRange: { min: 30, max: 60 },
    amenities: ['wifi', 'ac', 'bathroom', 'entertainment', 'snacks', 'blanket', 'pillow', 'usb_charger']
  },
  train: {
    value: 'train',
    label: 'Tren',
    icon: Car,
    color: 'green',
    classes: ['Turista', 'Ejecutivo', 'Primera Clase'],
    capacityRange: { min: 100, max: 300 },
    amenities: ['wifi', 'restaurant', 'ac', 'bathroom', 'entertainment', 'power_outlets', 'observation_car']
  },
  boat: {
    value: 'boat',
    label: 'Barco',
    icon: Ship,
    color: 'cyan',
    classes: ['Económico', 'Camarote', 'Suite'],
    capacityRange: { min: 50, max: 200 },
    amenities: ['restaurant', 'deck', 'ac', 'bathroom', 'entertainment', 'cabin', 'life_jackets']
  },
  plane: {
    value: 'plane',
    label: 'Avión',
    icon: Plane,
    color: 'purple',
    classes: ['Económico', 'Premium', 'Business'],
    capacityRange: { min: 50, max: 300 },
    amenities: ['wifi', 'entertainment', 'meal', 'beverage', 'power_outlets', 'overhead_storage']
  }
}

const POPULAR_ORIGINS = [
  'Lima', 'Cusco', 'Arequipa', 'Trujillo', 'Piura', 'Chiclayo', 
  'Iquitos', 'Huancayo', 'Ayacucho', 'Tacna', 'Puno', 'Cajamarca',
  'Huaraz', 'Tarapoto', 'Tumbes', 'Chimbote', 'Huánuco', 'Pucallpa'
]

const POPULAR_DESTINATIONS = [
  'Lima', 'Cusco', 'Arequipa', 'Trujillo', 'Piura', 'Chiclayo', 
  'Iquitos', 'Huancayo', 'Ayacucho', 'Tacna', 'Puno', 'Cajamarca',
  'Huaraz', 'Tarapoto', 'Tumbes', 'Chimbote', 'Huánuco', 'Pucallpa'
]

// Amenidades mejoradas con iconos
const DEFAULT_AMENITIES = {
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

export default function CreateTransportModal({ isOpen, onClose, onRouteCreated }: CreateTransportModalProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    company_id: '',
    origin: '',
    destination: '',
    vehicle_type: 'bus',
    vehicle_class: 'Económico',
    departure_time: '',
    arrival_time: '',
    duration: '',
    price: 0,
    total_seats: '',
    status: 'active' as 'active' | 'cancelled'
  })

  useEffect(() => {
    if (isOpen) {
      fetchCompanies()
    }
  }, [isOpen])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/transport/companies')
      if (response.ok) {
        const data = await response.json()
        setCompanies(data.companies || [])
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
    }
  }

  const calculateDuration = () => {
    if (formData.departure_time && formData.arrival_time) {
      const departure = new Date(`2000-01-01T${formData.departure_time}`)
      const arrival = new Date(`2000-01-01T${formData.arrival_time}`)
      
      let diff = arrival.getTime() - departure.getTime()
      
      // Si la llegada es al día siguiente
      if (diff < 0) {
        diff += 24 * 60 * 60 * 1000 // Agregar 24 horas
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      setFormData(prev => ({
        ...prev,
        duration: hours.toString() + (minutes > 0 ? `.${Math.round(minutes/60*10)/10}` : '')
      }))
    }
  }

  useEffect(() => {
    calculateDuration()
  }, [formData.departure_time, formData.arrival_time, calculateDuration])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validaciones
      if (!formData.company_id || !formData.origin || !formData.destination) {
        throw new Error('Todos los campos obligatorios deben estar completos')
      }

      if (formData.origin === formData.destination) {
        throw new Error('El origen y destino no pueden ser iguales')
      }

      const routeData = {
        company_id: formData.company_id,
        origin: formData.origin,
        destination: formData.destination,
        vehicle_type: formData.vehicle_type,
        departure_time: formData.departure_time,
        arrival_time: formData.arrival_time,
        duration: parseFloat(formData.duration),
        price_from: parseFloat(formData.price_from),
        price_to: parseFloat(formData.price_to),
        total_seats: parseInt(formData.total_seats),
        amenities: selectedAmenities,
        status: formData.status
      }

      const response = await fetch('/api/transport/admin-routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(routeData)
      })

      if (response.ok) {
        onRouteCreated()
        onClose()
        resetForm()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear ruta')
      }
    } catch (error) {
      console.error('Error creating route:', error)
      alert(error instanceof Error ? error.message : 'Error al crear la ruta. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      company_id: '',
      origin: '',
      destination: '',
      vehicle_type: 'bus',
      departure_time: '',
      arrival_time: '',
      duration: '',
      price_from: '',
      price_to: '',
      total_seats: '',
      status: 'active'
    })
    setSelectedAmenities([])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-default max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border-color">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-3">
              <Bus className="w-6 h-6 text-accent" />
              Crear Nueva Ruta
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              Configura una nueva ruta de transporte
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-accent" />
                Información de la Ruta
              </h3>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Compañía de transporte *
                </label>
                <select
                  name="company_id"
                  value={formData.company_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                >
                  <option value="">Selecciona una compañía</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name} (★ {company.rating.toFixed(1)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Origen *
                  </label>
                  <select
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  >
                    <option value="">Selecciona origen</option>
                    {POPULAR_ORIGINS.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Destino *
                  </label>
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  >
                    <option value="">Selecciona destino</option>
                    {POPULAR_DESTINATIONS.filter(city => city !== formData.origin).map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Tipo de vehículo *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {VEHICLE_TYPES.map((vehicle) => {
                    const Icon = vehicle.icon
                    const isSelected = formData.vehicle_type === vehicle.value
                    return (
                      <button
                        key={vehicle.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, vehicle_type: vehicle.value }))}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          isSelected 
                            ? 'border-accent bg-accent/10 text-accent' 
                            : 'border-border-color hover:border-accent/50 text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-medium">{vehicle.label}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Horarios y Precios */}
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-accent" />
                Horarios y Precios
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Hora de salida *
                  </label>
                  <input
                    type="time"
                    name="departure_time"
                    value={formData.departure_time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Hora de llegada *
                  </label>
                  <input
                    type="time"
                    name="arrival_time"
                    value={formData.arrival_time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Duración (horas)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  step="0.5"
                  min="0.5"
                  readOnly
                  className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors bg-hover-bg"
                  placeholder="Se calcula automáticamente"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Precio desde (S/.) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                    <input
                      type="number"
                      name="price_from"
                      value={formData.price_from}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Precio hasta (S/.) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                    <input
                      type="number"
                      name="price_to"
                      value={formData.price_to}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Total de asientos *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                  <input
                    type="number"
                    name="total_seats"
                    value={formData.total_seats}
                    onChange={handleInputChange}
                    min="1"
                    max="60"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Estado
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                >
                  <option value="active">Activa</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Comodidades */}
          <div className="space-y-4">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <Plus className="w-4 h-4 text-accent" />
              Comodidades y Servicios
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {DEFAULT_AMENITIES.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`p-2 rounded-lg border text-sm transition-all ${
                    selectedAmenities.includes(amenity)
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border-color hover:border-accent/50 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-muted">
              Selecciona las comodidades disponibles en este vehículo
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border-color">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Ruta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
