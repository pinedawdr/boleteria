'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Users, Mic, Palette, Zap } from 'lucide-react'
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
    fields: {
      artist: { required: true, label: 'Artista/Banda' },
      venue_id: { required: true, label: 'Venue físico' },
      image_url: { required: true, label: 'Imagen del evento' },
      duration: { required: true, label: 'Duración' },
      age_restriction: { required: true, label: 'Restricción de edad' },
      seating_required: true,
      ticket_types: ['general', 'preferencial', 'vip', 'platea']
    }
  },
  theater: {
    label: 'Teatro',
    icon: Palette,
    color: 'pink',
    fields: {
      artist: { required: true, label: 'Obra/Compañía' },
      venue_id: { required: true, label: 'Teatro' },
      image_url: { required: true, label: 'Póster de la obra' },
      duration: { required: true, label: 'Duración' },
      age_restriction: { required: true, label: 'Clasificación' },
      seating_required: true,
      ticket_types: ['general', 'preferencial', 'platea']
    }
  },
  sports: {
    label: 'Deportes',
    icon: Zap,
    color: 'green',
    fields: {
      artist: { required: true, label: 'Equipos/Competidores' },
      venue_id: { required: true, label: 'Estadio/Campo' },
      image_url: { required: false, label: 'Logo del evento' },
      duration: { required: true, label: 'Duración estimada' },
      age_restriction: { required: false, label: 'Restricción de edad' },
      seating_required: true,
      ticket_types: ['general', 'preferencial', 'vip', 'tribuna']
    }
  },
  conference: {
    label: 'Conferencia',
    icon: Users,
    color: 'blue',
    fields: {
      artist: { required: true, label: 'Ponentes principales' },
      venue_id: { required: false, label: 'Venue (opcional para eventos híbridos)' },
      image_url: { required: false, label: 'Banner del evento' },
      duration: { required: true, label: 'Duración' },
      age_restriction: { required: false, label: 'Audiencia objetivo' },
      seating_required: false, // Puede ser virtual
      is_virtual: true, // Opción virtual disponible
      ticket_types: ['general', 'vip', 'speaker_pass']
    }
  },
  club: {
    label: 'Club/Fiesta',
    icon: Calendar,
    color: 'orange',
    fields: {
      artist: { required: false, label: 'DJ/Artista (opcional)' },
      venue_id: { required: true, label: 'Club/Local' },
      image_url: { required: true, label: 'Flyer del evento' },
      duration: { required: false, label: 'Duración' },
      age_restriction: { required: true, label: 'Restricción de edad' },
      seating_required: false, // Eventos de pie generalmente
      ticket_types: ['general', 'vip', 'backstage']
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
    // Campos adicionales
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

  const getCategoryConfig = () => EVENT_CATEGORIES[selectedCategory]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const categoryConfig = getCategoryConfig()
      
      // Validar campos requeridos según la categoría
      const requiredFields = Object.entries(categoryConfig.fields)
        .filter(([, config]) => typeof config === 'object' && 'required' in config && config.required)
        .map(([field]) => field)

      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          const fieldConfig = categoryConfig.fields[field as keyof typeof categoryConfig.fields]
          const fieldLabel = typeof fieldConfig === 'object' && 'label' in fieldConfig ? fieldConfig.label : field
          throw new Error(`El campo ${fieldLabel} es requerido`)
        }
      }

      // Validar venue para eventos no virtuales
      if (!isVirtualEvent && categoryConfig.fields.venue_id?.required && !formData.venue_id) {
        throw new Error('Debe seleccionar un venue para eventos presenciales')
      }

      const eventData = {
        ...formData,
        price_from: parseFloat(formData.price_from),
        price_to: parseFloat(formData.price_to),
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        // Campos adicionales según el tipo de evento
        is_virtual: isVirtualEvent,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        metadata: {
          virtual_link: isVirtualEvent ? formData.virtual_link : null,
          streaming_platform: isVirtualEvent ? formData.streaming_platform : null,
          recording_available: formData.recording_available,
          special_requirements: formData.special_requirements || null,
          sponsorship_info: formData.sponsorship_info || null,
          requires_seating: categoryConfig.fields.seating_required
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-body-bg border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Crear Nuevo Evento</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título del Evento *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {categoryConfig.fields.artist?.label || 'Artista/Performer'} 
                {categoryConfig.fields.artist?.required && ' *'}
              </label>
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                required={categoryConfig.fields.artist?.required}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoría *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                >
                  <option value="concert">Concierto</option>
                  <option value="theater">Teatro</option>
                  <option value="sports">Deportes</option>
                  <option value="conference">Conferencia</option>
                  <option value="club">Club/Fiesta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Venue *
                </label>
                <select
                  name="venue_id"
                  value={formData.venue_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                >
                  <option value="">Seleccionar venue</option>
                  {venues.map(venue => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name} - {venue.city} (Cap: {venue.capacity})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha y Hora de Inicio *
                </label>
                <input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha y Hora de Fin
                </label>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio Desde (S/) *
                </label>
                <input
                  type="number"
                  name="price_from"
                  value={formData.price_from}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio Hasta (S/) *
                </label>
                <input
                  type="number"
                  name="price_to"
                  value={formData.price_to}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duración{categoryConfig.fields.duration?.required && ' *'}
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required={categoryConfig.fields.duration?.required}
                  placeholder="ej: 2 horas"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Restricción de Edad{categoryConfig.fields.age_restriction?.required && ' *'}
                </label>
                <input
                  type="text"
                  name="age_restriction"
                  value={formData.age_restriction}
                  onChange={handleInputChange}
                  required={categoryConfig.fields.age_restriction?.required}
                  placeholder="ej: +18, Todo público"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL de Imagen{categoryConfig.fields.image_url?.required && ' *'}
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                required={categoryConfig.fields.image_url?.required}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>

            {/* Sección de eventos virtuales */}
            {(selectedCategory === 'conference' || selectedCategory === 'club') && (
              <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_virtual"
                    checked={isVirtualEvent}
                    onChange={(e) => setIsVirtualEvent(e.target.checked)}
                    className="w-4 h-4 text-accent bg-gray-700 border-gray-600 rounded focus:ring-accent focus:ring-2"
                  />
                  <label htmlFor="is_virtual" className="text-sm font-medium text-gray-300">
                    Evento Virtual/Híbrido
                  </label>
                </div>

                {isVirtualEvent && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Link de Transmisión *
                      </label>
                      <input
                        type="url"
                        name="virtual_link"
                        value={formData.virtual_link}
                        onChange={handleInputChange}
                        required={isVirtualEvent}
                        placeholder="https://zoom.us/..."
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Plataforma
                      </label>
                      <select
                        name="streaming_platform"
                        value={formData.streaming_platform}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="zoom">Zoom</option>
                        <option value="teams">Microsoft Teams</option>
                        <option value="meet">Google Meet</option>
                        <option value="youtube">YouTube Live</option>
                        <option value="twitch">Twitch</option>
                        <option value="other">Otra</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Máximo de Asistentes
                      </label>
                      <input
                        type="number"
                        name="max_attendees"
                        value={formData.max_attendees}
                        onChange={handleInputChange}
                        min="1"
                        placeholder="Ej: 100"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="recording_available"
                        name="recording_available"
                        checked={formData.recording_available}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-accent bg-gray-700 border-gray-600 rounded focus:ring-accent focus:ring-2"
                      />
                      <label htmlFor="recording_available" className="text-sm font-medium text-gray-300">
                        Grabación disponible después del evento
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              >
                <option value="active">Activo</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creando...' : 'Crear Evento'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
