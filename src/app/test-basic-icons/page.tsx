"use client"

import { Music, Mic, Trophy, PartyPopper, GraduationCap, Bus, Train, Ship } from "lucide-react";

export default function IconsBasicTest() {
  return (
    <div className="min-h-screen bg-body-bg p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-8">
          Prueba Básica de Íconos Lucide React
        </h1>
        
        <div className="mb-8 p-6 bg-card-bg rounded-lg border border-border-color">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Íconos de Eventos (Tamaño Normal)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-body-bg rounded border">
              <Music className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-sm text-text-muted">Music</p>
              <p className="text-xs text-text-secondary">concert</p>
            </div>
            <div className="text-center p-4 bg-body-bg rounded border">
              <Mic className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-sm text-text-muted">Mic</p>
              <p className="text-xs text-text-secondary">teatro</p>
            </div>
            <div className="text-center p-4 bg-body-bg rounded border">
              <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-sm text-text-muted">Trophy</p>
              <p className="text-xs text-text-secondary">deportes</p>
            </div>
            <div className="text-center p-4 bg-body-bg rounded border">
              <PartyPopper className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-sm text-text-muted">PartyPopper</p>
              <p className="text-xs text-text-secondary">fiesta</p>
            </div>
            <div className="text-center p-4 bg-body-bg rounded border">
              <GraduationCap className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-sm text-text-muted">GraduationCap</p>
              <p className="text-xs text-text-secondary">educativo</p>
            </div>
          </div>
        </div>

        <div className="mb-8 p-6 bg-card-bg rounded-lg border border-border-color">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Íconos de Eventos (Tamaño Grande - Como en EventCard)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-body-bg rounded border">
              <Music className="w-16 h-16 text-accent mx-auto mb-2" />
              <p className="text-sm text-text-muted">Music</p>
            </div>
            <div className="text-center p-4 bg-body-bg rounded border">
              <Mic className="w-16 h-16 text-accent mx-auto mb-2" />
              <p className="text-sm text-text-muted">Mic</p>
            </div>
            <div className="text-center p-4 bg-body-bg rounded border">
              <Trophy className="w-16 h-16 text-accent mx-auto mb-2" />
              <p className="text-sm text-text-muted">Trophy</p>
            </div>
            <div className="text-center p-4 bg-body-bg rounded border">
              <PartyPopper className="w-16 h-16 text-accent mx-auto mb-2" />
              <p className="text-sm text-text-muted">PartyPopper</p>
            </div>
            <div className="text-center p-4 bg-body-bg rounded border">
              <GraduationCap className="w-16 h-16 text-accent mx-auto mb-2" />
              <p className="text-sm text-text-muted">GraduationCap</p>
            </div>
          </div>
        </div>

        <div className="mb-8 p-6 bg-card-bg rounded-lg border border-border-color">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Íconos de Transporte
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-body-bg rounded border">
              <Bus className="w-16 h-16 text-accent mx-auto mb-2" />
              <p className="text-sm text-text-muted">Bus</p>
            </div>
            <div className="text-center p-4 bg-body-bg rounded border">
              <Train className="w-16 h-16 text-accent mx-auto mb-2" />
              <p className="text-sm text-text-muted">Train</p>
            </div>
            <div className="text-center p-4 bg-body-bg rounded border">
              <Ship className="w-16 h-16 text-accent mx-auto mb-2" />
              <p className="text-sm text-text-muted">Ship</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card-bg rounded-lg border border-border-color">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Simulación de EventCard sin imagen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { category: 'concert', icon: Music, title: 'Concierto Rock' },
              { category: 'teatro', icon: Mic, title: 'Obra de Teatro' },
              { category: 'deportes', icon: Trophy, title: 'Match de Fútbol' }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="card-event p-4">
                  {/* Simulación del área de imagen con ícono */}
                  <div className="relative h-40 bg-gradient-to-br from-surface to-card-hover rounded-lg mb-3 flex flex-col items-center justify-center border-2 border-dashed border-border-color">
                    <IconComponent className="w-16 h-16 text-accent opacity-90 mb-2" />
                    <span className="text-xs text-text-muted font-medium capitalize">
                      {item.category}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Categoría: {item.category}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    🎯 Sin imagen - mostrando ícono
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 p-4 bg-info/10 border border-info/20 rounded-lg">
          <h3 className="text-lg font-medium text-text-primary mb-2">
            ℹ️ Información de Debug
          </h3>
          <p className="text-sm text-text-secondary mb-2">
            Si puedes ver todos los íconos arriba, entonces el problema no está en Lucide React.
          </p>
          <p className="text-sm text-text-secondary">
            El problema podría estar en:
          </p>
          <ul className="list-disc list-inside text-sm text-text-secondary mt-2">
            <li>La lógica condicional en EventCard</li>
            <li>El mapeo de categorías</li>
            <li>Los datos que se pasan al componente</li>
            <li>Estados de error o carga</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
