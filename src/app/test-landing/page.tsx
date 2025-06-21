"use client"

import { useLandingData } from "@/hooks/useLandingData";
import AdminLoadingState from "@/components/admin/AdminLoadingState";

export default function TestLandingPage() {
  const { events, routes, loading, error } = useLandingData();

  if (loading) {
    return (
      <div className="min-h-screen bg-body-bg flex items-center justify-center">
        <AdminLoadingState type="dashboard" message="Cargando datos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-body-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Error</h1>
          <p className="text-text-secondary mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary px-6 py-2 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-body-bg">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8">
          Prueba de Integración de Datos
        </h1>
        
        {/* Sección de Eventos */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">
            Eventos ({events.length})
          </h2>
          
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="card-event p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary mb-2">{event.title}</h3>
                      <p className="text-text-secondary text-sm mb-2">
                        Categoría: {event.category}
                      </p>
                      <p className="text-text-secondary text-sm mb-2">
                        Fecha: {new Date(event.start_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-accent font-bold">
                        S/ {event.price_from}
                      </p>
                    </div>
                  </div>
                  
                  {event.image_url && (
                    <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <img 
                        src={event.image_url} 
                        alt={event.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {event.venues && (
                    <p className="text-text-muted text-sm">
                      📍 {event.venues.name}, {event.venues.city}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted">No hay eventos disponibles (usando datos fallback)</p>
          )}
        </section>

        {/* Sección de Rutas */}
        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-6">
            Rutas de Transporte ({routes.length})
          </h2>
          
          {routes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((route) => (
                <div key={route.id} className="card-transport p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary mb-2">
                        {route.origin} → {route.destination}
                      </h3>
                      <p className="text-text-secondary text-sm mb-2">
                        Compañía: {route.company}
                      </p>
                      <p className="text-text-secondary text-sm mb-2">
                        Vehículo: {route.vehicle_type}
                      </p>
                      <p className="text-text-secondary text-sm mb-2">
                        Duración: {route.duration_hours}h
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-accent font-bold">
                        S/ {route.price_range.min}
                      </p>
                    </div>
                  </div>
                  
                  {route.image_url && (
                    <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <img 
                        src={route.image_url} 
                        alt={`${route.origin} - ${route.destination}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {route.services && route.services.length > 0 && (
                    <div className="mt-4">
                      <p className="text-text-muted text-sm mb-2">Servicios:</p>
                      <div className="flex flex-wrap gap-2">
                        {route.services.slice(0, 3).map((service, idx) => (
                          <span key={idx} className="text-xs bg-body-bg text-text-muted px-2 py-1 rounded">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted">No hay rutas disponibles (usando datos fallback)</p>
          )}
        </section>
      </div>
    </div>
  );
}
