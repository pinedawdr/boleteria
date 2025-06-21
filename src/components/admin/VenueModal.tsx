'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, Users, Building, Save, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AdminVenue } from '@/lib/admin-services'

interface VenueModalProps {
  isOpen: boolean
  onClose: () => void
  onVenueSaved: () => void
  editingVenue?: AdminVenue | null
}

const VENUE_CATEGORIES = {
  theater: { 
    label: 'Teatro', 
    icon: Building,
    capacityRange: { min: 100, max: 3000 }
  },
  stadium: { 
    label: 'Estadio', 
    icon: Building,
    capacityRange: { min: 5000, max: 100000 }
  },
  arena: { 
    label: 'Arena', 
    icon: Building,
    capacityRange: { min: 1000, max: 25000 }
  },
  convention: { 
    label: 'Centro de Convenciones', 
    icon: Building,
    capacityRange: { min: 500, max: 10000 }
  },
  club: { 
    label: 'Club/Bar', 
    icon: Building,
    capacityRange: { min: 50, max: 1000 }
  },
  outdoor: { 
    label: 'Espacio Abierto', 
    icon: Building,
    capacityRange: { min: 100, max: 50000 }
  }
}

const CITIES = [
  'Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos', 
  'Huancayo', 'Tacna', 'Ica', 'Cajamarca', 'Pucallpa', 'Chimbote', 'Ayacucho'
]

export default function VenueModal({ isOpen, onClose, onVenueSaved, editingVenue }: VenueModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    capacity: 0,
    category: 'theater',
    description: '',
    phone: '',
    website: '',
    parking_spots: 0,
    accessibility_features: [] as string[],
    amenities: [] as string[]
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingVenue) {
      setFormData({
        name: editingVenue.name || '',
        address: editingVenue.address || '',
        city: editingVenue.city || '',
        capacity: editingVenue.capacity || 0,
        category: 'theater', // Agregar este campo al tipo AdminVenue
        description: '',
        phone: '',
        website: '',
        parking_spots: 0,
        accessibility_features: [],
        amenities: []
      })
    } else {
      setFormData({
        name: '',
        address: '',
        city: '',
        capacity: 0,
        category: 'theater',
        description: '',
        phone: '',
        website: '',
        parking_spots: 0,
        accessibility_features: [],
        amenities: []
      })
    }
    setErrors({})
  }, [editingVenue, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del venue es requerido'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida'
    }
    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida'
    }
    if (formData.capacity <= 0) {
      newErrors.capacity = 'La capacidad debe ser mayor a 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      // Aquí iría la llamada a la API para crear/actualizar venue
      console.log('Saving venue:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onVenueSaved()
      onClose()
    } catch (error) {
      console.error('Error saving venue:', error)
      setErrors({ submit: 'Error al guardar el venue. Intenta nuevamente.' })
    } finally {
      setLoading(false)
    }
  }

  const toggleArrayItem = (array: string[], item: string, field: string) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item]
    handleInputChange(field, newArray)
  }

  if (!isOpen) return null

  const currentCategory = VENUE_CATEGORIES[formData.category as keyof typeof VENUE_CATEGORIES]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {editingVenue ? 'Editar Venue' : 'Nuevo Venue'}
              </h2>
              <p className="text-sm text-gray-400">
                {currentCategory.label} • {formData.city || 'Ciudad'}
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
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Nombre del Venue *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                      errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-purple-500 focus:ring-purple-500'
                    }`}
                    placeholder="Ej: Teatro Nacional"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Tipo de Venue
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  >
                    {Object.entries(VENUE_CATEGORIES).map(([key, category]) => (
                      <option key={key} value={key}>{category.label}</option>
                    ))}
                  </select>
                </div>

                {/* Dirección */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Dirección Completa *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                      errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-purple-500 focus:ring-purple-500'
                    }`}
                    placeholder="Ej: Av. 28 de Julio 540, Cercado de Lima"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Ciudad *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-1 transition-colors ${
                      errors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-purple-500 focus:ring-purple-500'
                    }`}
                  >
                    <option value="">Seleccionar ciudad</option>
                    {CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* Capacidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Capacidad Total *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-1 transition-colors ${
                      errors.capacity ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-purple-500 focus:ring-purple-500'
                    }`}
                    placeholder={`${currentCategory.capacityRange.min} - ${currentCategory.capacityRange.max}`}
                  />
                  {errors.capacity && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.capacity}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Información de Contacto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    placeholder="Ej: +51 1 234-5678"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Sitio Web
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    placeholder="https://www.ejemplo.com"
                  />
                </div>

                {/* Descripción */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-none"
                    placeholder="Descripción del venue, características especiales, etc."
                  />
                </div>
              </div>
            </div>

            {/* Servicios y Facilidades */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Servicios y Facilidades</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Estacionamiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Espacios de Estacionamiento
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.parking_spots}
                    onChange={(e) => handleInputChange('parking_spots', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    placeholder="0"
                  />
                </div>

                {/* Accesibilidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Características de Accesibilidad
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Rampas de acceso', 'Ascensores', 'Baños adaptados', 'Asientos para sillas de ruedas', 'Señalización braille'].map(feature => (
                      <label key={feature} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.accessibility_features.includes(feature)}
                          onChange={() => toggleArrayItem(formData.accessibility_features, feature, 'accessibility_features')}
                          className="rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500"
                        />
                        <span className="text-gray-300">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amenidades */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Amenidades Disponibles
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['WiFi gratuito', 'Aire acondicionado', 'Sistema de sonido', 'Iluminación profesional', 'Catering', 'Seguridad', 'Camerinos', 'Almacén', 'Área VIP'].map(amenity => (
                      <label key={amenity} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => toggleArrayItem(formData.amenities, amenity, 'amenities')}
                          className="rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500"
                        />
                        <span className="text-gray-300">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Capacidad Visual */}
            {formData.capacity > 0 && (
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="font-medium text-white">Capacidad del Venue</span>
                </div>
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {formData.capacity.toLocaleString()} personas
                </div>
                <div className="text-sm text-gray-400">
                  Rango recomendado para {currentCategory.label}: {currentCategory.capacityRange.min.toLocaleString()} - {currentCategory.capacityRange.max.toLocaleString()}
                </div>
              </div>
            )}

            {/* Errores */}
            {errors.submit && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-500 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.submit}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            {editingVenue ? 'Editando venue existente' : 'Creando nuevo venue'}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2" 
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
                  {editingVenue ? 'Actualizar Venue' : 'Crear Venue'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
