'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, MapPin, Users, DollarSign, Clock, Tag, ImageIcon, Type, Info, Mic, Palette, Trophy, Briefcase, Users as UserGroup, Star, AlertTriangle, CheckCircle, Save, Upload, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Venue {
  id: string
  name: string
  address: string
  city: string
  capacity: number
  type: string
  amenities: string[]
}

interface Event {
  id?: string
  title: string
  description: string
  category: string
  start_date: string
  end_date: string
  venue_id?: string
  venue_name?: string
  price_from: number
  price_to: number
  status: 'active' | 'sold_out' | 'cancelled'
  image_url?: string
  artist?: string
  duration?: number
  age_restriction?: string
  tickets_sold?: number
  capacity?: number
  ticket_types?: TicketType[]
  organizer_info?: string
  cancellation_policy?: string
  special_requirements?: string[]
}

interface TicketType {
  id: string
  name: string
  price: number
  quantity: number
  available: number
  description?: string
  benefits?: string[]
}

interface EventModalAdvancedProps {
  isOpen: boolean
  onClose: () => void
  onEventSaved: () => void
  editingEvent?: Event | null
}

// Configuración avanzada de categorías de eventos
const EVENT_CATEGORIES = {
  concert: {
    label: 'Concierto',
    icon: Mic,
    color: 'purple',
    fields: {
      artist: { required: true, label: 'Artista/Banda', placeholder: 'Ej: Los Tigres del Norte' },
      venue_id: { required: true, label: 'Venue' },
      image_url: { required: true, label: 'Imagen promocional' },
      duration: { required: true, label: 'Duración estimada (minutos)', type: 'number' },
      age_restriction: { required: false, label: 'Restricción de edad', options: ['Todo público', '12+', '16+', '18+'] },
    },
    ticketTypes: ['general', 'preferencial', 'vip', 'platea'],
    requirements: ['sound_system', 'stage_lighting', 'security']
  },
  theater: {
    label: 'Teatro',
    icon: Palette,
    color: 'pink',
    fields: {
      artist: { required: true, label: 'Obra/Compañía', placeholder: 'Ej: Romeo y Julieta - Teatro Municipal' },
      venue_id: { required: true, label: 'Teatro' },
      image_url: { required: true, label: 'Póster de la obra' },
      duration: { required: true, label: 'Duración (minutos)', type: 'number' },
      age_restriction: { required: true, label: 'Clasificación', options: ['Todo público', 'Familiar', 'Adultos'] },
    },
    ticketTypes: ['platea', 'palco', 'galeria'],
    requirements: ['stage_lighting', 'sound_system']
  },
  sports: {
    label: 'Deportes',
    icon: Trophy,
    color: 'green',
    fields: {
      artist: { required: true, label: 'Equipos/Competencia', placeholder: 'Ej: Alianza Lima vs Universitario' },
      venue_id: { required: true, label: 'Estadio/Venue' },
      image_url: { required: false, label: 'Imagen del evento' },
      duration: { required: true, label: 'Duración estimada (minutos)', type: 'number' },
      age_restriction: { required: false, label: 'Restricción de edad', options: ['Todo público', '12+'] },
    },
    ticketTypes: ['general', 'preferencial', 'palco', 'tribuna'],
    requirements: ['security', 'medical_assistance']
  },
  conference: {
    label: 'Conferencia',
    icon: Briefcase,
    color: 'blue',
    fields: {
      artist: { required: true, label: 'Organizador/Ponente', placeholder: 'Ej: Tech Summit 2024' },
      venue_id: { required: true, label: 'Centro de convenciones' },
      image_url: { required: false, label: 'Banner del evento' },
      duration: { required: true, label: 'Duración (minutos)', type: 'number' },
      age_restriction: { required: false, label: 'Dirigido a', options: ['Profesionales', 'Estudiantes', 'Todo público'] },
    },
    ticketTypes: ['standard', 'premium', 'vip'],
    requirements: ['av_equipment', 'wifi', 'catering']
  },
  festival: {
    label: 'Festival',
    icon: UserGroup,
    color: 'orange',
    fields: {
      artist: { required: true, label: 'Festival/Artistas', placeholder: 'Ej: Festival de Rock Lima' },
      venue_id: { required: true, label: 'Venue' },
      image_url: { required: true, label: 'Arte del festival' },
      duration: { required: true, label: 'Duración total (minutos)', type: 'number' },
      age_restriction: { required: false, label: 'Restricción de edad', options: ['Todo público', '16+', '18+'] },
    },
    ticketTypes: ['general', 'early_bird', 'vip', 'backstage'],
    requirements: ['sound_system', 'stage_lighting', 'security', 'food_vendors']
  }
}

const TICKET_TYPE_TEMPLATES = {
  general: { name: 'General', benefits: ['Acceso al evento'] },
  preferencial: { name: 'Preferencial', benefits: ['Acceso preferencial', 'Mejores ubicaciones'] },
  vip: { name: 'VIP', benefits: ['Acceso VIP', 'Zona exclusiva', 'Bebida de cortesía'] },
  platea: { name: 'Platea', benefits: ['Ubicación premium', 'Vista privilegiada'] },
  palco: { name: 'Palco', benefits: ['Palco privado', 'Servicio personalizado'] },
  galeria: { name: 'Galería', benefits: ['Vista elevada', 'Acceso rápido'] },
  tribuna: { name: 'Tribuna', benefits: ['Ubicación techada', 'Asientos numerados'] },
  standard: { name: 'Estándar', benefits: ['Acceso completo', 'Material del evento'] },
  premium: { name: 'Premium', benefits: ['Acceso premium', 'Almuerzo incluido', 'Kit de bienvenida'] },
  early_bird: { name: 'Early Bird', benefits: ['Precio especial', 'Acceso anticipado'] },
  backstage: { name: 'Backstage', benefits: ['Acceso tras bambalinas', 'Meet & Greet'] }
}

export default function EventModalAdvanced({ isOpen, onClose, onEventSaved, editingEvent }: EventModalAdvancedProps) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<Event>({
    title: '',
    description: '',
    category: 'concert',
    start_date: '',
    end_date: '',
    venue_id: '',
    price_from: 0,
    price_to: 0,
    status: 'active',
    image_url: '',
    artist: '',
    duration: 120,
    age_restriction: 'Todo público',
    tickets_sold: 0,
    capacity: 0,
    ticket_types: [],
    organizer_info: '',
    cancellation_policy: 'Cancelación permitida hasta 24 horas antes del evento con reembolso del 80%',
    special_requirements: []
  })

  // Inicializar datos si es edición
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        ...editingEvent,
        ticket_types: editingEvent.ticket_types || []
      })
    } else {
      // Reset para nuevo evento
      setFormData({
        title: '',
        description: '',
        category: 'concert',
        start_date: '',
        end_date: '',
        venue_id: '',
        price_from: 0,
        price_to: 0,
        status: 'active',
        image_url: '',
        artist: '',
        duration: 120,
        age_restriction: 'Todo público',
        tickets_sold: 0,
        capacity: 0,
        ticket_types: [],
        organizer_info: '',
        cancellation_policy: 'Cancelación permitida hasta 24 horas antes del evento con reembolso del 80%',
        special_requirements: []
      })
    }
    setStep(1)
    setErrors({})
  }, [editingEvent, isOpen])

  useEffect(() => {
    if (isOpen) {
      fetchVenues()
    }
  }, [isOpen])

  const fetchVenues = async () => {
    try {
      // Mock data - en producción vendría de la API
      const mockVenues: Venue[] = [
        {
          id: '1',
          name: 'Teatro Nacional',
          address: 'Av. Garcilaso de la Vega 1234',
          city: 'Lima',
          capacity: 1500,
          type: 'theater',
          amenities: ['sound_system', 'stage_lighting', 'ac', 'parking']
        },
        {
          id: '2',
          name: 'Estadio Nacional',
          address: 'Av. José Díaz 1234',
          city: 'Lima',
          capacity: 45000,
          type: 'stadium',
          amenities: ['sound_system', 'large_screens', 'security', 'medical_assistance']
        },
        {
          id: '3',
          name: 'Centro de Convenciones',
          address: 'Av. El Sol 567',
          city: 'Lima',
          capacity: 2000,
          type: 'convention',
          amenities: ['av_equipment', 'wifi', 'catering', 'parking', 'ac']
        },
        {
          id: '4',
          name: 'Arena Rockstar',
          address: 'Av. Universitaria 890',
          city: 'Lima',
          capacity: 8000,
          type: 'arena',
          amenities: ['sound_system', 'stage_lighting', 'security', 'bar']
        }
      ]
      setVenues(mockVenues)
    } catch (error) {
      console.error('Error fetching venues:', error)
    }
  }

  const handleInputChange = (field: keyof Event, value: string | number | Date | TicketType[] | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addTicketType = () => {
    const category = EVENT_CATEGORIES[formData.category as keyof typeof EVENT_CATEGORIES]
    const availableTypes = category.ticketTypes.filter(type => 
      !formData.ticket_types?.some(ticket => ticket.name.toLowerCase().includes(type))
    )
    
    if (availableTypes.length > 0) {
      const typeKey = availableTypes[0]
      const template = TICKET_TYPE_TEMPLATES[typeKey as keyof typeof TICKET_TYPE_TEMPLATES]
      
      const newTicket: TicketType = {
        id: Date.now().toString(),
        name: template.name,
        price: formData.price_from,
        quantity: 100,
        available: 100,
        description: `Entrada ${template.name}`,
        benefits: template.benefits
      }
      
      setFormData(prev => ({
        ...prev,
        ticket_types: [...(prev.ticket_types || []), newTicket]
      }))
    }
  }

  const updateTicketType = (ticketId: string, field: keyof TicketType, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      ticket_types: prev.ticket_types?.map(ticket => 
        ticket.id === ticketId ? { ...ticket, [field]: value } : ticket
      ) || []
    }))
  }

  const removeTicketType = (ticketId: string) => {
    setFormData(prev => ({
      ...prev,
      ticket_types: prev.ticket_types?.filter(ticket => ticket.id !== ticketId) || []
    }))
  }

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (stepNum === 1) {
      if (!formData.title.trim()) newErrors.title = 'El título es requerido'
      if (!formData.description.trim()) newErrors.description = 'La descripción es requerida'
      if (!formData.category) newErrors.category = 'La categoría es requerida'
      if (!formData.start_date) newErrors.start_date = 'La fecha de inicio es requerida'
      if (!formData.venue_id) newErrors.venue_id = 'El venue es requerido'
      
      const category = EVENT_CATEGORIES[formData.category as keyof typeof EVENT_CATEGORIES]
      if (category?.fields.artist?.required && !formData.artist?.trim()) {
        newErrors.artist = `${category.fields.artist.label} es requerido`
      }
    }
    
    if (stepNum === 2) {
      if (formData.price_from <= 0) newErrors.price_from = 'El precio mínimo debe ser mayor a 0'
      if (formData.price_to < formData.price_from) newErrors.price_to = 'El precio máximo debe ser mayor o igual al mínimo'
      if (!formData.ticket_types || formData.ticket_types.length === 0) {
        newErrors.ticket_types = 'Debe agregar al menos un tipo de entrada'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(step)) return
    
    try {
      setLoading(true)
      
      // Calcular precios basados en ticket types
      const prices = formData.ticket_types?.map(t => t.price) || [formData.price_from]
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      
      const eventData = {
        ...formData,
        price_from: minPrice,
        price_to: maxPrice,
        capacity: venues.find(v => v.id === formData.venue_id)?.capacity || 0
      }
      
      if (editingEvent) {
        // Actualizar evento existente
        const response = await fetch(`/api/events/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData)
        })
        
        if (!response.ok) throw new Error('Error al actualizar evento')
      } else {
        // Crear nuevo evento
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData)
        })
        
        if (!response.ok) throw new Error('Error al crear evento')
      }
      
      onEventSaved()
      onClose()
    } catch (error) {
      console.error('Error saving event:', error)
      setErrors({ submit: 'Error al guardar el evento. Intenta nuevamente.' })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const currentCategory = EVENT_CATEGORIES[formData.category as keyof typeof EVENT_CATEGORIES]
  const CategoryIcon = currentCategory.icon

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg border border-border-color rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-color">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-${currentCategory.color}-500/20 rounded-lg`}>
              <CategoryIcon className={`w-6 h-6 text-${currentCategory.color}-400`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                {editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
              </h2>
              <p className="text-sm text-text-secondary">
                {currentCategory.label} • Paso {step} de 3
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-hover-bg/50">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  stepNum === step 
                    ? 'bg-accent text-white' 
                    : stepNum < step 
                      ? 'bg-success text-white' 
                      : 'bg-hover-bg text-text-secondary'
                }`}>
                  {stepNum < step ? <CheckCircle className="w-4 h-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`h-1 w-12 mx-2 rounded-full transition-colors ${
                    stepNum < step ? 'bg-success' : 'bg-hover-bg'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Información Básica</h3>
              
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Categoría del Evento
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(EVENT_CATEGORIES).map(([key, category]) => {
                    const Icon = category.icon
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleInputChange('category', key)}
                        className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                          formData.category === key
                            ? `border-${category.color}-500 bg-${category.color}-500/10`
                            : 'border-border-color hover:border-accent'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${
                          formData.category === key ? `text-${category.color}-500` : 'text-text-secondary'
                        }`} />
                        <span className={`text-sm font-medium ${
                          formData.category === key ? 'text-text-primary' : 'text-text-secondary'
                        }`}>
                          {category.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {errors.category && (
                  <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Título del Evento *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-bg border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 transition-colors ${
                    errors.title ? 'border-error focus:border-error focus:ring-error' : 'border-border-color focus:border-accent focus:ring-accent'
                  }`}
                  placeholder="Ej: Concierto de Los Tigres del Norte"
                />
                {errors.title && (
                  <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Artist/Organizer */}
              {currentCategory.fields.artist && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    {currentCategory.fields.artist.label} {currentCategory.fields.artist.required && '*'}
                  </label>
                  <input
                    type="text"
                    value={formData.artist || ''}
                    onChange={(e) => handleInputChange('artist', e.target.value)}
                    className={`w-full px-4 py-3 bg-input-bg border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 transition-colors ${
                      errors.artist ? 'border-error focus:border-error focus:ring-error' : 'border-border-color focus:border-accent focus:ring-accent'
                    }`}
                    placeholder={currentCategory.fields.artist.placeholder}
                  />
                  {errors.artist && (
                    <p className="text-error text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.artist}
                    </p>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 bg-input-bg border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 transition-colors resize-none ${
                    errors.description ? 'border-error focus:border-error focus:ring-error' : 'border-border-color focus:border-accent focus:ring-accent'
                  }`}
                  placeholder="Describe el evento, artistas, programa, etc."
                />
                {errors.description && (
                  <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Fecha y Hora de Inicio *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    className={`w-full px-4 py-3 bg-input-bg border rounded-lg text-text-primary focus:outline-none focus:ring-1 transition-colors ${
                      errors.start_date ? 'border-error focus:border-error focus:ring-error' : 'border-border-color focus:border-accent focus:ring-accent'
                    }`}
                  />
                  {errors.start_date && (
                    <p className="text-error text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.start_date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Fecha y Hora de Fin
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Lugar del Evento *
                </label>
                <select
                  value={formData.venue_id}
                  onChange={(e) => handleInputChange('venue_id', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-bg border rounded-lg text-text-primary focus:outline-none focus:ring-1 transition-colors ${
                    errors.venue_id ? 'border-error focus:border-error focus:ring-error' : 'border-border-color focus:border-accent focus:ring-accent'
                  }`}
                >
                  <option value="">Selecciona un venue</option>
                  {venues.map(venue => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name} - {venue.city} (Cap: {venue.capacity.toLocaleString()})
                    </option>
                  ))}
                </select>
                {errors.venue_id && (
                  <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {errors.venue_id}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Precios y Entradas</h3>
              
              {/* Base Price Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Precio Desde (S/.) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_from}
                    onChange={(e) => handleInputChange('price_from', parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-3 bg-input-bg border rounded-lg text-text-primary focus:outline-none focus:ring-1 transition-colors ${
                      errors.price_from ? 'border-error focus:border-error focus:ring-error' : 'border-border-color focus:border-accent focus:ring-accent'
                    }`}
                  />
                  {errors.price_from && (
                    <p className="text-error text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.price_from}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Precio Hasta (S/.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_to}
                    onChange={(e) => handleInputChange('price_to', parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-3 bg-input-bg border rounded-lg text-text-primary focus:outline-none focus:ring-1 transition-colors ${
                      errors.price_to ? 'border-error focus:border-error focus:ring-error' : 'border-border-color focus:border-accent focus:ring-accent'
                    }`}
                  />
                  {errors.price_to && (
                    <p className="text-error text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.price_to}
                    </p>
                  )}
                </div>
              </div>

              {/* Ticket Types */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-text-secondary">
                    Tipos de Entrada *
                  </label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addTicketType}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Tipo
                  </Button>
                </div>

                {formData.ticket_types && formData.ticket_types.length > 0 ? (
                  <div className="space-y-4">
                    {formData.ticket_types.map((ticket, index) => (
                      <div key={ticket.id} className="p-4 bg-hover-bg rounded-lg border border-border-color">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-text-primary">Entrada #{index + 1}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeTicketType(ticket.id)}
                            className="text-error hover:text-error border-error/30 hover:border-error"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                              Nombre
                            </label>
                            <input
                              type="text"
                              value={ticket.name}
                              onChange={(e) => updateTicketType(ticket.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                              Precio (S/.)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={ticket.price}
                              onChange={(e) => updateTicketType(ticket.id, 'price', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                              Cantidad
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={ticket.quantity}
                              onChange={(e) => {
                                const quantity = parseInt(e.target.value) || 0
                                updateTicketType(ticket.id, 'quantity', quantity)
                                updateTicketType(ticket.id, 'available', quantity)
                              }}
                              className="w-full px-3 py-2 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                            />
                          </div>
                        </div>

                        {ticket.benefits && ticket.benefits.length > 0 && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                              Beneficios incluidos
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {ticket.benefits.map((benefit, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md"
                                >
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-border-color rounded-lg">
                    <Tag className="w-12 h-12 text-text-secondary mx-auto mb-2" />
                    <p className="text-text-secondary">No hay tipos de entrada configurados</p>
                    <p className="text-sm text-text-muted">Haz clic en &quot;Agregar Tipo&quot; para comenzar</p>
                  </div>
                )}

                {errors.ticket_types && (
                  <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {errors.ticket_types}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Configuración Adicional</h3>
              
              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  URL de Imagen Promocional
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.image_url || ''}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    className="flex-1 px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Subir
                  </Button>
                </div>
              </div>

              {/* Duration and Age Restriction */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Duración (minutos)
                  </label>
                  <input
                    type="number"
                    min="15"
                    value={formData.duration || 120}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 120)}
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Restricción de Edad
                  </label>
                  <select
                    value={formData.age_restriction || 'Todo público'}
                    onChange={(e) => handleInputChange('age_restriction', e.target.value)}
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  >
                    {currentCategory.fields.age_restriction?.options?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    )) || (
                      <>
                        <option value="Todo público">Todo público</option>
                        <option value="12+">12+</option>
                        <option value="16+">16+</option>
                        <option value="18+">18+</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Organizer Info */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Información del Organizador
                </label>
                <textarea
                  value={formData.organizer_info || ''}
                  onChange={(e) => handleInputChange('organizer_info', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                  placeholder="Información de contacto del organizador, empresa, etc."
                />
              </div>

              {/* Cancellation Policy */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Política de Cancelación
                </label>
                <textarea
                  value={formData.cancellation_policy || ''}
                  onChange={(e) => handleInputChange('cancellation_policy', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                  placeholder="Política de reembolsos y cancelaciones"
                />
              </div>

              {/* Event Status */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Estado del Evento
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                >
                  <option value="active">Activo</option>
                  <option value="sold_out">Agotado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              {/* Event Summary */}
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <h4 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Resumen del Evento
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Título:</span>
                    <span className="text-text-primary font-medium">{formData.title || 'Sin título'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Categoría:</span>
                    <span className="text-text-primary">{currentCategory.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Lugar:</span>
                    <span className="text-text-primary">
                      {venues.find(v => v.id === formData.venue_id)?.name || 'No seleccionado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Rango de precios:</span>
                    <span className="text-text-primary font-medium">
                      S/. {Math.min(...(formData.ticket_types?.map(t => t.price) || [formData.price_from]))} - 
                      S/. {Math.max(...(formData.ticket_types?.map(t => t.price) || [formData.price_to]))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Tipos de entrada:</span>
                    <span className="text-text-primary">{formData.ticket_types?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Global Errors */}
          {errors.submit && (
            <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-error text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {errors.submit}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border-color">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                Anterior
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            {step < 3 ? (
              <Button className="btn-primary" onClick={handleNext}>
                Siguiente
              </Button>
            ) : (
              <Button 
                className="btn-primary flex items-center gap-2" 
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
                    {editingEvent ? 'Actualizar Evento' : 'Crear Evento'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
