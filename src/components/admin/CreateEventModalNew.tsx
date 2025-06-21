'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, MapPin, Users, DollarSign, Clock, Tag, Image, Type, Info, Upload, Globe, Mic, Palette, Zap, Monitor, Gamepad2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onEventCreated: () => void
}

interface Venue {
  id: string
  name: string
  city: string
  capacity: number
  address: string
}

// Configuración de categorías y sus campos específicos
const EVENT_CATEGORIES = {
  concert: {
    label: 'Concierto',
    icon: Mic,
    color: 'purple',
    description: 'Eventos musicales con artistas y bandas',
    fields: {
      artist: { required: true, label: 'Artista/Banda', placeholder: 'Nombre del artista o banda' },
      venue_id: { required: true, label: 'Venue físico' },
      image_url: { required: true, label: 'Imagen del evento', placeholder: 'URL de la imagen promocional' },
      duration: { required: true, label: 'Duración', placeholder: 'ej: 2 horas 30 min' },
      age_restriction: { required: true, label: 'Restricción de edad', placeholder: 'ej: +18, Todo público' },
      seating_required: true,
      supports_virtual: false
    }
  },
  theater: {
    label: 'Teatro',
    icon: Palette,
    color: 'pink',
    description: 'Obras teatrales, musicales y espectáculos',
    fields: {
      artist: { required: true, label: 'Obra/Compañía', placeholder: 'Nombre de la obra y compañía teatral' },
      venue_id: { required: true, label: 'Teatro' },
      image_url: { required: true, label: 'Póster de la obra', placeholder: 'URL del póster oficial' },
      duration: { required: true, label: 'Duración', placeholder: 'ej: 1 hora 45 min (con intermedio)' },
      age_restriction: { required: true, label: 'Clasificación', placeholder: 'ej: Apto para toda la familia' },
      seating_required: true,
      supports_virtual: false
    }
  },
  sports: {
    label: 'Deportes',
    icon: Zap,
    color: 'green',
    description: 'Eventos deportivos y competiciones',
    fields: {
      artist: { required: true, label: 'Equipos/Competidores', placeholder: 'Equipos o competidores participantes' },
      venue_id: { required: true, label: 'Estadio/Campo' },
      image_url: { required: false, label: 'Logo del evento', placeholder: 'Logo o imagen del evento deportivo' },
      duration: { required: true, label: 'Duración estimada', placeholder: 'ej: 90 minutos + tiempo extra' },
      age_restriction: { required: false, label: 'Restricción de edad', placeholder: 'Generalmente todo público' },
      seating_required: true,
      supports_virtual: true // Transmisiones deportivas
    }
  },
  conference: {
    label: 'Conferencia',
    icon: Users,
    color: 'blue',
    description: 'Conferencias, seminarios y eventos corporativos',
    fields: {
      artist: { required: true, label: 'Ponentes principales', placeholder: 'Speakers y facilitadores' },
      venue_id: { required: false, label: 'Venue (opcional para eventos híbridos)' },
      image_url: { required: false, label: 'Banner del evento', placeholder: 'Imagen promocional de la conferencia' },
      duration: { required: true, label: 'Duración', placeholder: 'ej: 1 día completo (8 horas)' },
      age_restriction: { required: false, label: 'Audiencia objetivo', placeholder: 'ej: Profesionales, Estudiantes' },
      seating_required: false,
      supports_virtual: true // Conferencias híbridas
    }
  },
  club: {
    label: 'Club/Fiesta',
    icon: Gamepad2,
    color: 'orange',
    description: 'Eventos nocturnos, fiestas y entretenimiento',
    fields: {
      artist: { required: false, label: 'DJ/Artista (opcional)', placeholder: 'DJ o artista principal' },
      venue_id: { required: true, label: 'Club/Local' },
      image_url: { required: true, label: 'Flyer del evento', placeholder: 'Flyer promocional del evento' },
      duration: { required: false, label: 'Duración', placeholder: 'ej: 22:00 - 04:00' },
      age_restriction: { required: true, label: 'Restricción de edad', placeholder: 'ej: +21, +18' },
      seating_required: false,
      supports_virtual: false // Eventos presenciales
    }
  }
} as const

type EventCategory = keyof typeof EVENT_CATEGORIES

export default function CreateEventModal({ isOpen, onClose, onEventCreated }: CreateEventModalProps) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('concert')
  const [isVirtualEvent, setIsVirtualEvent] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue_id: '',
    artist: '',
    category: 'concert' as EventCategory,
    start_date: '',
    end_date: '',
    price_from: '',
    price_to: '',
    image_url: '',
    duration: '',
    age_restriction: '',
    status: 'active' as 'active' | 'cancelled',
    // Campos adicionales para eventos virtuales/híbridos
    virtual_link: '',
    max_attendees: '',
    streaming_platform: '',
    recording_available: false,
    special_requirements: '',
    sponsorship_info: ''
  })

  useEffect(() => {
    if (isOpen) {
      fetchVenues()
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedCategory(formData.category)
    // Reset virtual event cuando cambia la categoría
    if (!EVENT_CATEGORIES[formData.category].fields.supports_virtual) {
      setIsVirtualEvent(false)
    }
  }, [formData.category])

  const fetchVenues = async () => {
    try {
      const response = await fetch('/api/venues')
      if (response.ok) {
        const data = await response.json()
        setVenues(data.venues || [])
      }
    } catch (error) {
      console.error('Error fetching venues:', error)
    }
  }

  const handleCategoryChange = (category: EventCategory) => {
    setFormData(prev => ({
      ...prev,
      category,
      // Reset campos específicos cuando cambia la categoría
      artist: '',
      venue_id: category === 'conference' ? '' : prev.venue_id,
      duration: '',
      age_restriction: '',
      image_url: '',
      virtual_link: '',
      streaming_platform: ''
    }))
    setSelectedCategory(category)
    setIsVirtualEvent(false)
  }

  const getCategoryConfig = () => EVENT_CATEGORIES[selectedCategory]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const categoryConfig = getCategoryConfig()
      
      // Validar campos requeridos según la categoría
      const requiredFields = Object.entries(categoryConfig.fields)
        .filter(([_, config]) => typeof config === 'object' && config.required)
        .map(([field]) => field)

      for (const field of requiredFields) {
        if (field === 'venue_id' && isVirtualEvent) continue // Skip venue validation for virtual events
        
        if (!formData[field as keyof typeof formData]) {
          const fieldConfig = categoryConfig.fields[field as keyof typeof categoryConfig.fields]
          throw new Error(`El campo "${fieldConfig.label}" es requerido para ${categoryConfig.label.toLowerCase()}`)
        }
      }

      // Validar venue para eventos no virtuales
      if (!isVirtualEvent && categoryConfig.fields.venue_id?.required && !formData.venue_id) {
        throw new Error('Debe seleccionar un venue para eventos presenciales')
      }

      // Validar link virtual para eventos virtuales
      if (isVirtualEvent && !formData.virtual_link) {
        throw new Error('Debe proporcionar un link de acceso para eventos virtuales')
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        venue_id: isVirtualEvent ? null : formData.venue_id,
        artist: formData.artist,
        category: formData.category,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        price_from: parseFloat(formData.price_from),
        price_to: parseFloat(formData.price_to),
        image_url: formData.image_url || null,
        duration: formData.duration || null,
        age_restriction: formData.age_restriction || null,
        status: formData.status,
        // Campos adicionales según el tipo de evento
        metadata: {
          is_virtual: isVirtualEvent,
          virtual_link: isVirtualEvent ? formData.virtual_link : null,
          streaming_platform: isVirtualEvent ? formData.streaming_platform : null,
          max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
          recording_available: formData.recording_available,
          special_requirements: formData.special_requirements || null,
          sponsorship_info: formData.sponsorship_info || null,
          requires_seating: categoryConfig.fields.seating_required,
          category_specific: {
            type: selectedCategory,
            supports_virtual: categoryConfig.fields.supports_virtual
          }
        }
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      })

      if (response.ok) {
        onEventCreated()
        onClose()
        resetForm()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear evento')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert(error instanceof Error ? error.message : 'Error al crear el evento. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      venue_id: '',
      artist: '',
      category: 'concert',
      start_date: '',
      end_date: '',
      price_from: '',
      price_to: '',
      image_url: '',
      duration: '',
      age_restriction: '',
      status: 'active',
      virtual_link: '',
      max_attendees: '',
      streaming_platform: '',
      recording_available: false,
      special_requirements: '',
      sponsorship_info: ''
    })
    setSelectedCategory('concert')
    setIsVirtualEvent(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (!isOpen) return null

  const categoryConfig = getCategoryConfig()
  const CategoryIcon = categoryConfig.icon

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-default max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border-color">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-3">
              <Calendar className="w-6 h-6 text-accent" />
              Crear Nuevo Evento
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              Configura los detalles del evento según su categoría
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

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Selector de Categoría */}
          <div className="space-y-4">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <Tag className="w-4 h-4 text-accent" />
              Tipo de Evento
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(EVENT_CATEGORIES).map(([key, config]) => {
                const Icon = config.icon
                const isSelected = selectedCategory === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleCategoryChange(key as EventCategory)}
                    className={`p-4 rounded-lg border-2 transition-all hover-lift ${
                      isSelected 
                        ? 'border-accent bg-accent/10 text-accent' 
                        : 'border-border-color hover:border-accent/50 text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">{config.label}</div>
                  </button>
                )
              })}
            </div>
            <div className="p-4 bg-hover-bg rounded-lg">
              <div className="flex items-start gap-3">
                <CategoryIcon className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <h4 className="font-medium text-text-primary">{categoryConfig.label}</h4>
                  <p className="text-sm text-text-secondary">{categoryConfig.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modo Virtual (solo para categorías que lo soportan) */}
          {categoryConfig.fields.supports_virtual && (
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary flex items-center gap-2">
                <Monitor className="w-4 h-4 text-accent" />
                Modalidad del Evento
              </h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="event_mode"
                    checked={!isVirtualEvent}
                    onChange={() => setIsVirtualEvent(false)}
                    className="text-accent"
                  />
                  <span className="text-text-primary">Presencial</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="event_mode"
                    checked={isVirtualEvent}
                    onChange={() => setIsVirtualEvent(true)}
                    className="text-accent"
                  />
                  <span className="text-text-primary">Virtual/Online</span>
                </label>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-accent" />
                Información Básica
              </h3>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Título del evento *
                </label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    placeholder={`Título del ${categoryConfig.label.toLowerCase()}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                  placeholder={`Describe los detalles del ${categoryConfig.label.toLowerCase()}...`}
                />
              </div>

              {categoryConfig.fields.artist && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    {categoryConfig.fields.artist.label} {categoryConfig.fields.artist.required ? '*' : ''}
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                    <input
                      type="text"
                      name="artist"
                      value={formData.artist}
                      onChange={handleInputChange}
                      required={categoryConfig.fields.artist.required}
                      className="w-full pl-10 pr-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      placeholder={categoryConfig.fields.artist.placeholder}
                    />
                  </div>
                </div>
              )}

              {categoryConfig.fields.image_url && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    {categoryConfig.fields.image_url.label} {categoryConfig.fields.image_url.required ? '*' : ''}
                  </label>
                  <div className="relative">
                    <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      required={categoryConfig.fields.image_url.required}
                      className="w-full pl-10 pr-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      placeholder={categoryConfig.fields.image_url.placeholder}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Detalles del Evento */}
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-accent" />
                Detalles del Evento
              </h3>

              {/* Venue - Solo para eventos no virtuales */}
              {!isVirtualEvent && categoryConfig.fields.venue_id && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    {categoryConfig.fields.venue_id.label} {categoryConfig.fields.venue_id.required ? '*' : ''}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                    <select
                      name="venue_id"
                      value={formData.venue_id}
                      onChange={handleInputChange}
                      required={categoryConfig.fields.venue_id.required && !isVirtualEvent}
                      className="w-full pl-10 pr-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    >
                      <option value="">Selecciona un venue</option>
                      {venues.map((venue) => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name} - {venue.city} (Cap: {venue.capacity})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Link Virtual - Solo para eventos virtuales */}
              {isVirtualEvent && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Link de acceso virtual *
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                    <input
                      type="url"
                      name="virtual_link"
                      value={formData.virtual_link}
                      onChange={handleInputChange}
                      required={isVirtualEvent}
                      className="w-full pl-10 pr-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      placeholder="https://zoom.us/j/... o link de streaming"
                    />
                  </div>
                </div>
              )}

              {/* Plataforma de Streaming - Solo para eventos virtuales */}
              {isVirtualEvent && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Plataforma de streaming
                  </label>
                  <select
                    name="streaming_platform"
                    value={formData.streaming_platform}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  >
                    <option value="">Selecciona una plataforma</option>
                    <option value="zoom">Zoom</option>
                    <option value="youtube">YouTube Live</option>
                    <option value="twitch">Twitch</option>
                    <option value="facebook">Facebook Live</option>
                    <option value="teams">Microsoft Teams</option>
                    <option value="other">Otra</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Fecha de inicio *
                  </label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Fecha de fin
                  </label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Precio mínimo (S/.) *
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
                    Precio máximo (S/.) *
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

              {categoryConfig.fields.duration && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    {categoryConfig.fields.duration.label} {categoryConfig.fields.duration.required ? '*' : ''}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required={categoryConfig.fields.duration.required}
                      className="w-full pl-10 pr-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      placeholder={categoryConfig.fields.duration.placeholder}
                    />
                  </div>
                </div>
              )}

              {categoryConfig.fields.age_restriction && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    {categoryConfig.fields.age_restriction.label} {categoryConfig.fields.age_restriction.required ? '*' : ''}
                  </label>
                  <input
                    type="text"
                    name="age_restriction"
                    value={formData.age_restriction}
                    onChange={handleInputChange}
                    required={categoryConfig.fields.age_restriction.required}
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    placeholder={categoryConfig.fields.age_restriction.placeholder}
                  />
                </div>
              )}

              {/* Máximo de asistentes para eventos virtuales */}
              {isVirtualEvent && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Máximo de asistentes
                  </label>
                  <input
                    type="number"
                    name="max_attendees"
                    value={formData.max_attendees}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    placeholder="Límite de participantes (opcional)"
                  />
                </div>
              )}

              {/* Grabación disponible para eventos virtuales */}
              {isVirtualEvent && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="recording_available"
                    name="recording_available"
                    checked={formData.recording_available}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-accent focus:ring-accent focus:ring-2"
                  />
                  <label htmlFor="recording_available" className="text-sm text-text-primary">
                    Grabación estará disponible después del evento
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Campos adicionales */}
          <div className="space-y-4">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <Info className="w-4 h-4 text-accent" />
              Información Adicional
            </h3>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Requerimientos especiales
              </label>
              <textarea
                name="special_requirements"
                value={formData.special_requirements}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                placeholder="Equipos especiales, accesibilidad, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Información de patrocinadores
              </label>
              <input
                type="text"
                name="sponsorship_info"
                value={formData.sponsorship_info}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                placeholder="Patrocinadores y colaboradores"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Estado del evento
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              >
                <option value="active">Activo</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
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
              {loading ? 'Creando...' : 'Crear Evento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
