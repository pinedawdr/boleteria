'use client'

import { useState, useEffect } from 'react'
import { X, Truck, Star, Phone, Mail, Globe, Save, AlertTriangle, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AdminCompany } from '@/lib/admin-services'

interface CompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onCompanySaved: () => void
  editingCompany?: AdminCompany | null
}

const COMPANY_TYPES = {
  bus: { 
    label: 'Empresa de Buses', 
    icon: Truck,
    services: ['Transporte interprovincial', 'Servicio premium', 'Carga']
  },
  train: { 
    label: 'Empresa Ferroviaria', 
    icon: Truck,
    services: ['Transporte de pasajeros', 'Turismo', 'Carga ferroviaria']
  },
  boat: { 
    label: 'Empresa Naviera', 
    icon: Truck,
    services: ['Transporte fluvial', 'Turismo náutico', 'Carga marítima']
  },
  plane: { 
    label: 'Aerolínea', 
    icon: Truck,
    services: ['Vuelos domésticos', 'Vuelos internacionales', 'Carga aérea']
  }
}

const VEHICLE_FLEETS = {
  bus: ['Buses económicos', 'Buses semi-cama', 'Buses cama', 'Buses suite'],
  train: ['Trenes locales', 'Trenes express', 'Trenes turísticos'],
  boat: ['Lanchas rápidas', 'Ferries', 'Catamaranes'],
  plane: ['Aviones regionales', 'Aviones comerciales', 'Jets privados']
}

export default function CompanyModal({ isOpen, onClose, onCompanySaved, editingCompany }: CompanyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    company_type: 'bus',
    rating: 4.0,
    phone: '',
    email: '',
    website: '',
    logo_url: '',
    address: '',
    city: '',
    founded_year: new Date().getFullYear(),
    license_number: '',
    fleet_size: 0,
    vehicle_types: [] as string[],
    services: [] as string[],
    coverage_areas: [] as string[],
    certifications: [] as string[]
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingCompany) {
      setFormData({
        name: editingCompany.name || '',
        description: editingCompany.description || '',
        company_type: 'bus',
        rating: editingCompany.rating || 4.0,
        phone: editingCompany.phone || '',
        email: editingCompany.email || '',
        website: editingCompany.website || '',
        logo_url: '',
        address: '',
        city: '',
        founded_year: new Date().getFullYear(),
        license_number: '',
        fleet_size: 0,
        vehicle_types: [],
        services: [],
        coverage_areas: [],
        certifications: []
      })
    } else {
      setFormData({
        name: '',
        description: '',
        company_type: 'bus',
        rating: 4.0,
        phone: '',
        email: '',
        website: '',
        logo_url: '',
        address: '',
        city: '',
        founded_year: new Date().getFullYear(),
        license_number: '',
        fleet_size: 0,
        vehicle_types: [],
        services: [],
        coverage_areas: [],
        certifications: []
      })
    }
    setErrors({})
  }, [editingCompany, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la empresa es requerido'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'El rating debe estar entre 1 y 5'
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
      // Aquí iría la llamada a la API para crear/actualizar empresa
      console.log('Saving company:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onCompanySaved()
      onClose()
    } catch (error) {
      console.error('Error saving company:', error)
      setErrors({ submit: 'Error al guardar la empresa. Intenta nuevamente.' })
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

  const currentType = COMPANY_TYPES[formData.company_type as keyof typeof COMPANY_TYPES]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Truck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {editingCompany ? 'Editar Empresa' : 'Nueva Empresa de Transporte'}
              </h2>
              <p className="text-sm text-gray-400">
                {currentType.label} • {formData.name || 'Empresa'}
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
              <h3 className="text-lg font-semibold text-white mb-4">Información de la Empresa</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Nombre de la Empresa *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                      errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    placeholder="Ej: Cruz del Sur"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Tipo de Empresa */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Tipo de Empresa
                  </label>
                  <select
                    value={formData.company_type}
                    onChange={(e) => handleInputChange('company_type', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    {Object.entries(COMPANY_TYPES).map(([key, type]) => (
                      <option key={key} value={key}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Rating de la Empresa *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 4.0)}
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-1 transition-colors ${
                        errors.rating ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-4 h-4 ${star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                      ))}
                    </div>
                  </div>
                  {errors.rating && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.rating}
                    </p>
                  )}
                </div>

                {/* Año de Fundación */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Año de Fundación
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.founded_year}
                    onChange={(e) => handleInputChange('founded_year', parseInt(e.target.value) || new Date().getFullYear())}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                {/* Descripción */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Descripción de la Empresa
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                    placeholder="Descripción de la empresa, historia, especialidades, etc."
                  />
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
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                      errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    placeholder="Ej: +51 1 311-5050"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                      errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    placeholder="info@empresa.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
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
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="https://www.empresa.com"
                  />
                </div>

                {/* Número de Licencia */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Número de Licencia
                  </label>
                  <input
                    type="text"
                    value={formData.license_number}
                    onChange={(e) => handleInputChange('license_number', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Ej: LIC-2024-001"
                  />
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Dirección Principal
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Dirección de la oficina principal"
                  />
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Ciudad Principal
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Ej: Lima"
                  />
                </div>
              </div>
            </div>

            {/* Información Operativa */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Información Operativa</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tamaño de Flota */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Tamaño de Flota
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.fleet_size}
                    onChange={(e) => handleInputChange('fleet_size', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Número total de vehículos"
                  />
                </div>

                {/* Tipos de Vehículos */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Tipos de Vehículos
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {VEHICLE_FLEETS[formData.company_type as keyof typeof VEHICLE_FLEETS]?.map(vehicle => (
                      <label key={vehicle} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.vehicle_types.includes(vehicle)}
                          onChange={() => toggleArrayItem(formData.vehicle_types, vehicle, 'vehicle_types')}
                          className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-gray-300">{vehicle}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Servicios */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Servicios Ofrecidos
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {currentType.services.map(service => (
                      <label key={service} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={() => toggleArrayItem(formData.services, service, 'services')}
                          className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-gray-300">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Áreas de Cobertura */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Principales Áreas de Cobertura
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos', 'Huancayo'].map(area => (
                      <label key={area} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.coverage_areas.includes(area)}
                          onChange={() => toggleArrayItem(formData.coverage_areas, area, 'coverage_areas')}
                          className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-gray-300">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Certificaciones */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Certificaciones y Acreditaciones
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['ISO 9001', 'Certificado MTC', 'IATA', 'Certificado Ambiental', 'Certificado de Seguridad', 'Turismo Responsable'].map(cert => (
                    <label key={cert} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.certifications.includes(cert)}
                        onChange={() => toggleArrayItem(formData.certifications, cert, 'certifications')}
                        className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Resumen de la Empresa */}
            {formData.name && (
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-white text-lg">{formData.name}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-4 h-4 ${star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                    ))}
                    <span className="text-sm text-gray-400 ml-1">({formData.rating})</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Tipo:</span>
                    <span className="text-white ml-2">{currentType.label}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Flota:</span>
                    <span className="text-white ml-2">{formData.fleet_size} vehículos</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Fundada:</span>
                    <span className="text-white ml-2">{formData.founded_year}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Cobertura:</span>
                    <span className="text-white ml-2">{formData.coverage_areas.length} ciudades</span>
                  </div>
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
            {editingCompany ? 'Editando empresa existente' : 'Creando nueva empresa de transporte'}
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
                  {editingCompany ? 'Actualizar Empresa' : 'Crear Empresa'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
