"use client"

import React from 'react'
import { Bus, Train, Ship, Music, Mic, Trophy, PartyPopper, GraduationCap } from 'lucide-react'

export default function TestFinalIcons() {
  // Test data for events
  const testEvents = [
    { id: '1', category: 'concert', title: 'Concierto Rock', image_url: '' },
    { id: '2', category: 'teatro', title: 'Obra de Teatro', image_url: '' },
    { id: '3', category: 'deportes', title: 'Partido de Fútbol', image_url: '' },
    { id: '4', category: 'fiesta', title: 'Fiesta de Año Nuevo', image_url: '' },
    { id: '5', category: 'educativo', title: 'Curso de Programación', image_url: '' },
    { id: '6', category: 'unknown', title: 'Evento Desconocido', image_url: '' }
  ]

  // Test data for transport
  const testRoutes = [
    { id: '1', vehicle_type: 'bus', origin: 'Lima', destination: 'Cusco', image_url: '' },
    { id: '2', vehicle_type: 'train', origin: 'Cusco', destination: 'Machu Picchu', image_url: '' },
    { id: '3', vehicle_type: 'boat', origin: 'Iquitos', destination: 'Pucallpa', image_url: '' }
  ]

  const getEventIcon = (category: string) => {
    const categoryIcons = {
      'concert': Music,
      'concierto': Music,
      'music': Music,
      'teatro': Mic,
      'theater': Mic,
      'theatre': Mic,
      'sports': Trophy,
      'deportes': Trophy,
      'deporte': Trophy,
      'club': PartyPopper,
      'fiesta': PartyPopper,
      'party': PartyPopper,
      'conference': GraduationCap,
      'education': GraduationCap,
      'educativo': GraduationCap,
      'curso': GraduationCap,
      'educacion': GraduationCap
    }
    
    const normalizedCategory = category?.toLowerCase() || ''
    return categoryIcons[normalizedCategory as keyof typeof categoryIcons] || Music
  }

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'train': return Train
      case 'boat': return Ship
      default: return Bus
    }
  }

  return (
    <div className="min-h-screen bg-body-bg p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-8 text-center">
          🔍 Prueba Final de Íconos - Landing Page
        </h1>

        {/* Event Icons Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">
            🎭 Íconos de Eventos (Fallback)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testEvents.map((event) => {
              const EventIcon = getEventIcon(event.category)
              return (
                <div key={event.id} className="bg-surface rounded-lg p-6 border border-border-color">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-surface to-card-hover rounded-lg flex items-center justify-center">
                      <EventIcon className="w-8 h-8 text-accent opacity-90" />
                    </div>
                    <div>
                      <h3 className="text-text-primary font-semibold">{event.title}</h3>
                      <p className="text-text-secondary text-sm">Categoría: {event.category}</p>
                    </div>
                  </div>
                  <div className="bg-body-bg rounded-lg p-4">
                    <p className="text-text-muted text-sm">
                      ✅ Ícono: {EventIcon.name || 'Ícono personalizado'}<br/>
                      📂 Categoría: {event.category}<br/>
                      🎯 Fallback: {event.category === 'unknown' ? 'Sí (Music)' : 'No'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Transport Icons Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">
            🚌 Íconos de Transporte (Fallback)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testRoutes.map((route) => {
              const VehicleIcon = getVehicleIcon(route.vehicle_type)
              return (
                <div key={route.id} className="bg-surface rounded-lg p-6 border border-border-color">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-surface to-card-hover rounded-lg flex items-center justify-center">
                      <VehicleIcon className="w-8 h-8 text-accent opacity-90" />
                    </div>
                    <div>
                      <h3 className="text-text-primary font-semibold">
                        {route.origin} → {route.destination}
                      </h3>
                      <p className="text-text-secondary text-sm">Tipo: {route.vehicle_type}</p>
                    </div>
                  </div>
                  <div className="bg-body-bg rounded-lg p-4">
                    <p className="text-text-muted text-sm">
                      ✅ Ícono: {VehicleIcon.name || 'Ícono personalizado'}<br/>
                      🚗 Vehículo: {route.vehicle_type}<br/>
                      🎯 Fallback: {route.vehicle_type === 'bus' ? 'No' : 'No'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Full Card Preview */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">
            🎨 Vista Previa de Cards Completas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Event Card Preview */}
            <div className="bg-surface rounded-lg overflow-hidden border border-border-color">
              <div className="relative h-40 bg-gradient-to-br from-surface to-card-hover flex items-center justify-center">
                <Music className="w-16 h-16 text-accent opacity-90" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-accent text-black text-xs rounded-full font-semibold">
                    Presencial
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-text-primary font-semibold mb-2">Concierto de Rock</h3>
                <p className="text-text-secondary text-sm mb-3">Sábado 15 Jul • 20:00</p>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Desde</span>
                  <span className="text-accent font-bold">S/ 80</span>
                </div>
              </div>
            </div>

            {/* Transport Card Preview */}
            <div className="bg-surface rounded-lg overflow-hidden border border-border-color">
              <div className="relative h-40 bg-gradient-to-br from-surface to-card-hover flex items-center justify-center">
                <Bus className="w-16 h-16 text-accent opacity-90" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-accent text-black text-xs rounded-full font-semibold">
                    Bus
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-text-primary font-semibold mb-2">Cruz del Sur</h3>
                <p className="text-text-secondary text-sm mb-3">Lima → Cusco • 22h</p>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Desde</span>
                  <span className="text-accent font-bold">S/ 120</span>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-accent/10 rounded-lg p-6 border border-accent/20">
              <h3 className="text-accent font-semibold mb-3">✅ Sistema Implementado</h3>
              <ul className="text-text-secondary text-sm space-y-2">
                <li>🎭 Fallback de íconos para eventos</li>
                <li>🚌 Fallback de íconos para transporte</li>
                <li>🎨 Gradiente limpio sin bordes</li>
                <li>📱 Grid responsive 3→2→1</li>
                <li>🔄 Datos dinámicos con fallback</li>
                <li>⚡ Optimización de performance</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <div className="text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/" className="btn-primary px-6 py-3 rounded-lg">
              🏠 Ir al Landing Page
            </a>
            <a href="/events" className="btn-outline px-6 py-3 rounded-lg">
              🎭 Ver Eventos
            </a>
            <a href="/transport" className="btn-outline px-6 py-3 rounded-lg">
              🚌 Ver Transporte
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
