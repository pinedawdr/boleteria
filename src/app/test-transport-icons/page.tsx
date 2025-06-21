"use client"

import { RouteCard } from "@/components/transport/RouteCard";
import { Bus, Train, Ship } from "lucide-react";

export default function TestTransportIcons() {
  // Rutas de prueba sin image_url para verificar íconos
  const testRoutes = [
    {
      id: '1',
      origin: 'Lima',
      destination: 'Cusco',
      vehicle_type: 'bus' as const,
      duration: 22,
      price_from: 120,
      price_to: 200,
      departure_times: ['08:00', '14:00', '20:00'],
      company: 'Cruz del Sur',
      rating: 4.5,
      image_url: '', // Sin imagen para mostrar ícono
      amenities: ['WiFi', 'A/C', 'Reclinable']
    },
    {
      id: '2',
      origin: 'Lima',
      destination: 'Arequipa',
      vehicle_type: 'train' as const,
      duration: 16,
      price_from: 150,
      price_to: 250,
      departure_times: ['07:00', '15:00'],
      company: 'PeruRail',
      rating: 4.7,
      image_url: '', // Sin imagen para mostrar ícono
      amenities: ['Comida', 'WiFi', 'Vista panorámica']
    },
    {
      id: '3',
      origin: 'Iquitos',
      destination: 'Leticia',
      vehicle_type: 'boat' as const,
      duration: 8,
      price_from: 80,
      price_to: 120,
      departure_times: ['06:00', '12:00'],
      company: 'Amazonas Express',
      rating: 4.2,
      image_url: '', // Sin imagen para mostrar ícono
      amenities: ['Hamacas', 'Comida', 'Baño']
    },
    {
      id: '4',
      origin: 'Lima',
      destination: 'Trujillo',
      vehicle_type: 'bus' as const,
      duration: 8,
      price_from: 60,
      price_to: 100,
      departure_times: ['09:00', '16:00', '22:00'],
      company: 'Oltursa',
      rating: 4.3,
      image_url: 'https://picsum.photos/400/300', // Con imagen para comparar
      amenities: ['WiFi', 'A/C', 'Entretenimiento']
    }
  ];

  const getVehicleIcon = (vehicleType: 'bus' | 'train' | 'boat') => {
    switch (vehicleType) {
      case 'train': return Train;
      case 'boat': return Ship;
      default: return Bus;
    }
  };

  return (
    <div className="min-h-screen bg-body-bg p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-8">
          Prueba de Íconos de Transporte
        </h1>
        
        <p className="text-text-secondary mb-8">
          Esta página prueba los íconos de fallback para diferentes tipos de vehículos.
          Las primeras 3 rutas NO tienen image_url, por lo que deben mostrar íconos.
          La última ruta SÍ tiene image_url para comparar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testRoutes.map((route, index) => {
            const VehicleIcon = getVehicleIcon(route.vehicle_type);
            
            return (
              <div key={route.id} className="relative">
                <RouteCard 
                  route={route}
                  index={index}
                  VehicleIcon={VehicleIcon}
                />
                <div className="mt-2 p-3 bg-card-bg rounded-lg border border-border-color text-center">
                  <p className="text-sm text-text-primary font-medium mb-1">
                    {route.origin} → {route.destination}
                  </p>
                  <p className="text-sm text-text-muted mb-1">
                    Vehículo: <strong className="text-accent">{route.vehicle_type}</strong>
                  </p>
                  <p className="text-xs text-text-muted mb-2">
                    {route.image_url ? '✅ Con imagen' : '🚌 Sin imagen (debe mostrar ícono)'}
                  </p>
                  
                  {/* Vista previa del ícono directo */}
                  <div className="flex items-center justify-center gap-2 p-2 bg-body-bg rounded border">
                    <span className="text-xs text-text-muted">Vista previa:</span>
                    <VehicleIcon className="w-4 h-4 text-accent" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 bg-card-bg rounded-lg border border-border-color">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Íconos Esperados por Tipo de Vehículo:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 p-4 bg-body-bg rounded">
              <Bus className="w-6 h-6 text-accent" />
              <div>
                <p className="font-medium text-text-primary">Bus</p>
                <p className="text-text-muted">Transporte terrestre</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 bg-body-bg rounded">
              <Train className="w-6 h-6 text-accent" />
              <div>
                <p className="font-medium text-text-primary">Tren</p>
                <p className="text-text-muted">Transporte ferroviario</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 bg-body-bg rounded">
              <Ship className="w-6 h-6 text-accent" />
              <div>
                <p className="font-medium text-text-primary">Barco</p>
                <p className="text-text-muted">Transporte fluvial</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-card-bg rounded-lg border border-border-color">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            🎯 Grid de Eventos (Columnas de 3)
          </h2>
          <p className="text-text-secondary mb-4">
            Verificación del nuevo grid de eventos en columnas de 3:
          </p>
          <div className="grid-events">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <div key={num} className="card-event p-6 text-center">
                <div className="h-40 bg-gradient-to-br from-surface to-card-hover rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">#{num}</span>
                </div>
                <p className="text-text-primary font-medium">Evento {num}</p>
                <p className="text-text-muted text-sm">Grid de 3 columnas</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
