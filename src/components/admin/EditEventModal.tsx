'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, MapPin, Users, DollarSign, Clock, Tag, ImageIcon, Type, Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Venue {
  id: string
  name: string
  address: string
  city: string
  capacity: number
}

interface Event {
  id: string
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
}

interface EditEventModalProps {
  isOpen: boolean
  onClose: () => void
  onEventUpdated: () => void
  event: Event | null
}

export default function EditEventModal({ isOpen, onClose, onEventUpdated, event }: EditEventModalProps) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'concert',
    start_date: '',
    end_date: '',
    venue_id: '',
    price_from: 0,
    price_to: 0,
    status: 'active' as 'active' | 'sold_out' | 'cancelled',
    image_url: '',
    artist: '',
    duration: 120,
    age_restriction: 'all'
  })

  // Cargar venues al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchVenues()
      if (event) {
        setFormData({
          title: event.title,
          description: event.description,
          category: event.category,
          start_date: event.start_date?.split('T')[0] || '',
          end_date: event.end_date?.split('T')[0] || '',
          venue_id: event.venue_id || '',
          price_from: event.price_from,
          price_to: event.price_to,
          status: event.status,
          image_url: event.image_url || '',
          artist: event.artist || '',
          duration: event.duration || 120,
          age_restriction: event.age_restriction || 'all'
        })
      }
    }
  }, [isOpen, event])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return

    setLoading(true)
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          start_date: new Date(formData.start_date).toISOString(),
          end_date: new Date(formData.end_date).toISOString(),
        }),
      })

      if (response.ok) {
        onEventUpdated()
        onClose()
        // Reset form
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
          age_restriction: 'all'
        })
      } else {
        throw new Error('Error al actualizar evento')
      }
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Error al actualizar el evento. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('price') || name === 'duration' ? Number(value) : value
    }))
  }

  if (!isOpen || !event) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-default max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border-color">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Editar Evento</h2>
            <p className="text-text-secondary text-sm">Modifica los detalles del evento</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica */}
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
                    placeholder="Ej: Concierto de Rock"
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
                  placeholder="Describe el evento..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Artista/Protagonista
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                  <input
                    type="text"
                    name="artist"
                    value={formData.artist}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    placeholder="Nombre del artista o protagonista"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Categoría *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  >
                    <option value="concert">Concierto</option>
                    <option value="theater">Teatro</option>
                    <option value="sports">Deportes</option>
                    <option value="conference">Conferencia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Estado *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                >
                  <option value="active">Activo</option>
                  <option value="sold_out">Agotado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>

            {/* Detalles del evento */}
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-accent" />
                Detalles del Evento
              </h3>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Venue *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                  <select
                    name="venue_id"
                    value={formData.venue_id}
                    onChange={handleInputChange}
                    required
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Fecha de inicio *
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Fecha de fin *
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
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

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Duración (minutos)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="30"
                    step="15"
                    className="w-full pl-10 pr-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Restricción de edad
                </label>
                <select
                  name="age_restriction"
                  value={formData.age_restriction}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                >
                  <option value="all">Todas las edades</option>
                  <option value="12+">12+</option>
                  <option value="16+">16+</option>
                  <option value="18+">18+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  URL de imagen
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              </div>
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
              {loading ? 'Actualizando...' : 'Actualizar Evento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
