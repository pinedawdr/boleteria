"use client"

import { 
  Calendar, 
  MapPin, 
  Music, 
  TheaterIcon, 
  Trophy, 
  PartyPopper,
  Bus,
  Ship,
  Train,
  ArrowRight,
  GraduationCap,
  Users,
  Shield
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import { EventCard } from "@/components/events/EventCard";
import { RouteCard } from "@/components/transport/RouteCard";
import { useLandingData } from "@/hooks/useLandingData";
import { useLandingDetails } from "@/hooks/useLandingDetails";
import { useStatsData } from "@/hooks/useStatsData";
import AdminLoadingState from "@/components/admin/AdminLoadingState";

export default function Home() {
  const { events, routes, loading, error } = useLandingData();
  const { activeUsers, totalEvents, totalDestinations, securityRate, loading: statsLoading } = useStatsData();
  const { upcomingEvents, popularRoutes, loading: detailsLoading } = useLandingDetails();

  return (
    <main className="bg-body-bg min-h-screen relative">
      {/* Hero Section */}
      <Section variant="default" padding="xl" className="relative z-10">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold mb-4 sm:mb-6 text-text-primary animate-slideUp">
              Tu acceso a experiencias<br />
              <span className="text-accent">inolvidables</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-text-secondary mb-6 sm:mb-8 md:mb-12 max-w-2xl md:max-w-3xl mx-auto px-4">
              Descubre eventos únicos y viaja cómodamente por todo el Perú. 
              Boletería te conecta con las mejores experiencias y destinos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link href="/events">
                <Button size="lg" variant="primary" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                  Explorar Eventos
                </Button>
              </Link>
              <Link href="/transport">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                  Ver Rutas de Transporte
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Categorías */}
      <Section id="categorias" variant="surface" padding="xl" className="relative z-10 bg-body-bg/50">
        <Container>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-center mb-8 sm:mb-12 text-text-primary">
            Categorías <span className="text-accent">Populares</span>
          </h2>
          <div className="grid-categories gap-4 md:gap-6">
            {[
              { icon: Music, name: "Conciertos", color: "text-accent", href: "/events?category=conciertos" },
              { icon: TheaterIcon, name: "Teatro", color: "text-text-primary", href: "/events?category=teatro" },
              { icon: Trophy, name: "Deportes", color: "text-success", href: "/events?category=deportes" },
              { icon: PartyPopper, name: "Fiestas", color: "text-warning", href: "/events?category=fiestas" },
              { icon: GraduationCap, name: "Cursos", color: "text-info", href: "/events?category=educativo" },
              { icon: Bus, name: "Buses", color: "text-accent", href: "/transport?vehicle=bus" },
              { icon: Ship, name: "Barcos", color: "text-text-secondary", href: "/transport?vehicle=boat" },
              { icon: Train, name: "Trenes", color: "text-text-primary", href: "/transport?vehicle=train" },
            ].map((category, index) => (
              <Link key={index} href={category.href}>
                <div className="card-category group cursor-pointer h-full">
                  <div className="flex flex-col items-center justify-center h-full">
                    <category.icon className={`icon-md ${category.color} mb-3 transition-colors duration-300 flex-shrink-0`} />
                    <p className="text-text-primary font-medium text-sm leading-tight group-hover:text-accent transition-colors duration-300">{category.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Eventos Destacados */}
      <Section id="eventos" variant="default" padding="xl" className="relative z-10">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4 text-text-primary">
              Eventos <span className="text-accent">Imperdibles</span>
            </h2>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
              Desde conciertos hasta cursos especializados, encuentra la experiencia perfecta para ti
            </p>
          </div>
          <div className="grid-events gap-6 mb-8">
            {loading ? (
              <div className="col-span-full flex justify-center">
                <AdminLoadingState type="grid" message="Cargando eventos destacados..." />
              </div>
            ) : error ? (
              <div className="col-span-full text-center p-8 text-text-muted">
                <p className="mb-4">Error al cargar eventos: {error}</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  Reintentar
                </Button>
              </div>
            ) : events.length > 0 ? (
              events.map((event, index) => (
                <EventCard 
                  key={event.id} 
                  event={{
                    ...event,
                    start_date: event.start_date,
                    venues: event.venues ? {
                      name: event.venues.name,
                      city: event.venues.city
                    } : undefined
                  }} 
                  index={index} 
                />
              ))
            ) : (
              <div className="col-span-full text-center p-8 text-text-muted">
                <p>No hay eventos disponibles en este momento.</p>
              </div>
            )}
          </div>
          <div className="text-center mt-8">
            <Link href="/events">
              <button className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold">
                Ver Todos los Eventos
                <ArrowRight className="icon-sm" />
              </button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Transportes Destacados */}
      <Section variant="surface" padding="xl" className="relative z-10">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4 text-text-primary">
              Viaja con <span className="text-accent">Comodidad</span>
            </h2>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
              Conectamos las principales ciudades del Perú con los mejores servicios de transporte
            </p>
          </div>
          <div className="grid-transport gap-6 mb-8">
            {loading ? (
              <div className="col-span-full flex justify-center">
                <AdminLoadingState type="grid" message="Cargando rutas de transporte..." />
              </div>
            ) : error ? (
              <div className="col-span-full text-center p-8 text-text-muted">
                <p className="mb-4">Error al cargar rutas: {error}</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  Reintentar
                </Button>
              </div>
            ) : routes.length > 0 ? (
              routes.slice(0, 3).map((route, index) => {
                const getVehicleIcon = (vehicleType: string) => {
                  switch (vehicleType) {
                    case 'train': return Train;
                    case 'boat': return Ship;
                    default: return Bus;
                  }
                };
                
                const VehicleIcon = getVehicleIcon(route.vehicle_type);
                
                // Transform route data to match RouteCard interface
                const transformedRoute = {
                  id: route.id,
                  origin: route.origin,
                  destination: route.destination,
                  vehicle_type: route.vehicle_type as 'bus' | 'boat' | 'train',
                  duration: route.duration_hours,
                  price_from: route.price_range.min,
                  price_to: route.price_range.max,
                  departure_times: [route.departure_time],
                  company: route.company,
                  rating: 4.5, // Default rating
                  image_url: route.image_url || '',
                  amenities: route.services || []
                };
                
                return (
                  <RouteCard 
                    key={route.id} 
                    route={transformedRoute} 
                    index={index}
                    VehicleIcon={VehicleIcon}
                  />
                );
              })
            ) : (
              // Fallback con datos estáticos cuando no hay rutas de API
              [
                {
                  icon: Bus,
                  title: "Buses Premium",
                  description: "Viajes cómodos y seguros a todos los destinos",
                  routes: "50+ rutas disponibles",
                  color: "bg-info"
                },
                {
                  icon: Train,
                  title: "Trenes Turísticos",
                  description: "Experiencias únicas hacia destinos mágicos",
                  routes: "Rutas exclusivas",
                  color: "bg-success"
                },
                {
                  icon: Ship,
                  title: "Transporte Fluvial",
                  description: "Navega por los ríos amazónicos",
                  routes: "Rutas amazónicas",
                  color: "bg-accent"
                }
              ].map((transport, index) => (
                <div key={index} className="card-transport group cursor-pointer h-full">
                  {/* Icono del transporte */}
                  <div className="w-full h-40 bg-body-bg rounded-lg mb-3 flex items-center justify-center">
                    <transport.icon className="icon-lg text-accent" />
                  </div>
                  
                  {/* Contenido */}
                  <h3 className="text-text-primary font-semibold mb-3 group-hover:text-accent transition-colors">
                    {transport.title}
                  </h3>
                  
                  <p className="text-text-muted text-sm mb-4 line-clamp-2">
                    {transport.description}
                  </p>
                  
                  {/* Footer con rutas */}
                  <div className="mt-auto pt-3 border-t border-border">
                    <div className="flex items-center text-accent font-medium text-sm">
                      <MapPin className="icon-xs mr-2" />
                      <span>{transport.routes}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-8">
            <Link href="/transport">
              <button className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold">
                Explorar Rutas
                <ArrowRight className="icon-sm" />
              </button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Sección de Aplicaciones Móviles */}
      <Section variant="surface" padding="xl" className="relative z-10 bg-gradient-to-r from-accent/10 to-accent/5">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4 text-text-primary">
              Próximamente en <span className="text-accent">Móviles</span>
            </h2>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto mb-8">
              Muy pronto podrás llevar toda la experiencia de Boletería en tu dispositivo móvil. 
              Compra boletos, gestiona tus reservas y descubre eventos desde cualquier lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <div className="flex items-center gap-4 p-4 bg-body-bg/80 rounded-xl border border-text-primary/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
                <Image 
                  src="/google-play-badge.svg" 
                  alt="Descargar en Google Play"
                  width={120}
                  height={48}
                  className="h-12 w-auto opacity-75 hover:opacity-100 transition-opacity duration-300"
                />
                <div className="text-left">
                  <p className="text-text-secondary text-xs">Próximamente en</p>
                  <p className="text-text-primary font-semibold">Android</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-body-bg/80 rounded-xl border border-text-primary/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
                <Image 
                  src="/app-store-badge.svg" 
                  alt="Descargar en App Store"
                  width={120}
                  height={48}
                  className="h-12 w-auto opacity-75 hover:opacity-100 transition-opacity duration-300"
                />
                <div className="text-left">
                  <p className="text-text-secondary text-xs">Próximamente en</p>
                  <p className="text-text-primary font-semibold">iOS</p>
                </div>
              </div>
            </div>
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-3">
                    <Calendar className="icon-md text-accent" />
                  </div>
                  <h3 className="text-text-primary font-semibold mb-2">Compra Rápida</h3>
                  <p className="text-text-secondary text-sm">Adquiere tus boletos en segundos desde tu móvil</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-3">
                    <MapPin className="icon-md text-accent" />
                  </div>
                  <h3 className="text-text-primary font-semibold mb-2">Ubicación GPS</h3>
                  <p className="text-text-secondary text-sm">Encuentra eventos y rutas cerca de ti</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-3">
                    <Shield className="icon-md text-accent" />
                  </div>
                  <h3 className="text-text-primary font-semibold mb-2">Pago Seguro</h3>
                  <p className="text-text-secondary text-sm">Transacciones protegidas con biometría</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Estadísticas y Características */}
      <Section variant="default" padding="xl" className="relative z-10">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4 text-text-primary">
              ¿Por qué elegir <span className="text-accent">Boletería</span>?
            </h2>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
              Somos la plataforma líder en entretenimiento y transporte en Perú
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statsLoading ? (
              <div className="col-span-full flex justify-center">
                <AdminLoadingState type="grid" message="Cargando estadísticas..." />
              </div>
            ) : (
              [
                {
                  icon: Users,
                  number: activeUsers >= 1000 ? `${Math.floor(activeUsers / 1000)}K+` : `${activeUsers}+`,
                  label: "Usuarios activos",
                  color: "text-info"
                },
                {
                  icon: Calendar,
                  number: totalEvents >= 1000 ? `${Math.floor(totalEvents / 1000)}K+` : `${totalEvents}+`,
                  label: "Eventos anuales",
                  color: "text-accent"
                },
                {
                  icon: MapPin,
                  number: `${totalDestinations}+`,
                  label: "Destinos disponibles",
                  color: "text-success"
                },
                {
                  icon: Shield,
                  number: `${securityRate}%`,
                  label: "Transacciones seguras",
                  color: "text-warning"
                }
              ].map((stat, index) => (
                <div key={index} className="card-stat text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-body-bg mb-4">
                    <stat.icon className={`icon-md ${stat.color}`} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-text-secondary text-sm md:text-base">
                    {stat.label}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-info p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-6 flex items-center">
                <Calendar className="icon-md text-accent mr-3" />
                Eventos Próximos en Lima
              </h3>
              <div className="space-y-4">
                {detailsLoading ? (
                  <div className="flex justify-center py-4">
                    <AdminLoadingState type="grid" message="Cargando eventos próximos..." />
                  </div>
                ) : upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="flex justify-between items-center p-3 bg-body-bg rounded-lg hover:bg-card-hover transition-colors">
                      <div className="flex-1">
                        <p className="text-text-primary font-medium text-sm md:text-base">{event.name}</p>
                        <p className="text-text-secondary text-xs md:text-sm">{event.venue} • {event.category}</p>
                      </div>
                      <span className="text-accent text-xs md:text-sm font-medium whitespace-nowrap ml-4">{event.date}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-text-muted">
                    <p className="text-sm">No hay eventos próximos programados en Lima.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="card-info p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-6 flex items-center">
                <Bus className="icon-md text-accent mr-3" />
                Rutas Populares
              </h3>
              <div className="space-y-4">
                {detailsLoading ? (
                  <div className="flex justify-center py-4">
                    <AdminLoadingState type="grid" message="Cargando rutas populares..." />
                  </div>
                ) : popularRoutes.length > 0 ? (
                  popularRoutes.map((route) => (
                    <div key={route.id} className="flex justify-between items-center p-3 bg-body-bg rounded-lg hover:bg-card-hover transition-colors">
                      <div className="flex-1">
                        <p className="text-text-primary font-medium text-sm md:text-base">{route.route}</p>
                        <p className="text-text-secondary text-xs md:text-sm">{route.company} • {route.duration}</p>
                      </div>
                      <span className="text-accent text-xs md:text-sm font-medium whitespace-nowrap ml-4">{route.price}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-text-muted">
                    <p className="text-sm">No hay rutas disponibles en este momento.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
