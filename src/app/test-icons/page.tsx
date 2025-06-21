"use client"

import { EventCard } from "@/components/events/EventCard";
import { Music, Mic, Trophy, PartyPopper, GraduationCap } from "lucide-react";

export default function TestEventIcons() {
  // Eventos de prueba sin image_url para verificar íconos
  const testEvents = [
    {
      id: '1',
      title: 'Concierto de Rock',
      start_date: '2025-07-15T20:00:00',
      price_from: 80,
      category: 'concert',
      artist: 'Banda Nacional',
      venues: {
        name: 'Estadio Nacional',
        city: 'Lima'
      }
    },
    {
      id: '2',
      title: 'Obra de Teatro',
      start_date: '2025-07-20T19:00:00',
      price_from: 50,
      category: 'teatro',
      artist: 'Compañía Nacional',
      venues: {
        name: 'Teatro Municipal',
        city: 'Lima'
      }
    },
    {
      id: '3',
      title: 'Match de Fútbol',
      start_date: '2025-07-25T15:30:00',
      price_from: 30,
      category: 'deportes',
      venues: {
        name: 'Estadio Nacional',
        city: 'Lima'
      }
    },
    {
      id: '4',
      title: 'Fiesta Electrónica',
      start_date: '2025-07-30T22:00:00',
      price_from: 120,
      category: 'fiesta',
      artist: 'DJ Internacional',
      venues: {
        name: 'Centro de Convenciones',
        city: 'Lima'
      }
    },
    {
      id: '5',
      title: 'Curso de IA',
      start_date: '2025-08-15T10:00:00',
      price_from: 250,
      category: 'educativo',
      venues: {
        name: 'Aula Virtual',
        city: 'Lima'
      }
    },
    {
      id: '6',
      title: 'Concierto con Imagen',
      start_date: '2025-08-20T20:00:00',
      price_from: 90,
      category: 'concert',
      image_url: 'https://picsum.photos/400/300',
      artist: 'Banda Nacional',
      venues: {
        name: 'Teatro Municipal',
        city: 'Lima'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-body-bg p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-8">
          Prueba de Íconos de Eventos
        </h1>
        
        <p className="text-text-secondary mb-8">
          Esta página prueba los íconos de fallback para diferentes categorías de eventos.
          Los primeros 5 eventos NO tienen image_url, por lo que deben mostrar íconos.
          El último evento SÍ tiene image_url para comparar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testEvents.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Componente EventCard */}
              <EventCard 
                event={event}
                index={index} 
              />
              
              {/* Información de debug */}
              <div className="mt-2 p-3 bg-card-bg rounded-lg border border-border-color text-center">
                <p className="text-sm text-text-primary font-medium mb-1">
                  {event.title}
                </p>
                <p className="text-sm text-text-muted mb-1">
                  Categoría: <strong className="text-accent">{event.category}</strong>
                </p>
                <p className="text-xs text-text-muted mb-2">
                  {event.image_url ? '✅ Con imagen' : '🎯 Sin imagen (debe mostrar ícono)'}
                </p>
                
                {/* Vista previa del ícono directo */}
                <div className="flex items-center justify-center gap-2 p-2 bg-body-bg rounded border">
                  <span className="text-xs text-text-muted">Vista previa:</span>
                  {event.category === 'concert' && <Music className="w-4 h-4 text-accent" />}
                  {event.category === 'teatro' && <Mic className="w-4 h-4 text-accent" />}
                  {event.category === 'deportes' && <Trophy className="w-4 h-4 text-accent" />}
                  {event.category === 'fiesta' && <PartyPopper className="w-4 h-4 text-accent" />}
                  {event.category === 'educativo' && <GraduationCap className="w-4 h-4 text-accent" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-card-bg rounded-lg border border-border-color">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Íconos Esperados por Categoría:
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-accent">🎵</span>
              <span>concert, concierto, music → Ícono de Música</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">🎭</span>
              <span>teatro, theater → Ícono de Micrófono</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">🏆</span>
              <span>deportes, sports → Ícono de Trofeo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">🎉</span>
              <span>fiesta, party, club → Ícono de Fiesta</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">🎓</span>
              <span>educativo, curso → Ícono de Graduación</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">🎵</span>
              <span>Categoría desconocida → Ícono de Música (default)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
