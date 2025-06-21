'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layout'
import { 
  ArrowLeft, 
  Bus, 
  Ship, 
  Train, 
  Car,
  X,
  MapPin,
  Clock,
  Calendar,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'
import { CUSCO_TRANSPORT_COMPANIES, CUSCO_ROUTES } from '@/data/cusco-transport-data'
import AdvancedTransportSeatPicker from '@/components/seat-selection/AdvancedTransportSeatPicker'

interface TransportSeat {
  id: string
  number: string
  type: 'standard' | 'premium' | 'vip' | 'suite'
  status: 'available' | 'occupied' | 'selected' | 'reserved'
  price: number
  position: { row: number; col: number }
  features?: string[]
}

interface RouteDetails {
  id: string
  origin: string
  destination: string
  vehicle_type: 'bus' | 'minivan' | 'boat' | 'train' | 'combi' | 'auto'
  company: string
  departure_time: string
  arrival_time?: string
  duration_hours: number
  distance_km: number
  price_range: { min: number; max: number }
  date: string
  road_type: 'asfaltado' | 'afirmado' | 'trocha' | 'ferrocarril'
  services: string[]
  capacity: number
}

// Usar datos reales de Cusco - Ruta hacia Quillabamba (selva)
const getCuscoRoute = (): RouteDetails => {
  const route = CUSCO_ROUTES.find(r => r.id === 'cusco-quillabamba')!
  const company = CUSCO_TRANSPORT_COMPANIES.find(c => c.id === 'selva-sur')!
  const vehicle = company.vehicles[0]
  
  return {
    id: route.id,
    origin: route.origin,
    destination: route.destination,
    vehicle_type: vehicle.type,
    company: company.name,
    departure_time: '08:00',
    arrival_time: '12:30',
    duration_hours: route.duration_hours,
    distance_km: route.distance_km,
    price_range: { min: route.base_price, max: route.base_price + 15 },
    date: '2024-12-15',
    road_type: route.road_type,
    services: vehicle.amenities,
    capacity: vehicle.capacity
  }
}

const vehicleIcons = {
  bus: Bus,
  minivan: Car,
  combi: Bus,
  auto: Car,
  boat: Ship,
  train: Train
}

export default function SeatSelectionPage() {
  const router = useRouter()
  
  // Usar datos reales de Cusco
  const [route] = useState<RouteDetails>(getCuscoRoute())
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  const VehicleIcon = vehicleIcons[route.vehicle_type]

  // Manejar selección de asientos con el componente avanzado
  const handleSeatSelect = (seat: TransportSeat) => {
    setSelectedSeats(prev => {
      if (prev.includes(seat.id)) {
        return prev.filter(id => id !== seat.id)
      } else {
        return [...prev, seat.id]
      }
    })
  }

  const getTotalPrice = () => {
    return selectedSeats.length * route.price_range.min
  }

  const handleContinueToPayment = () => {
    if (selectedSeats.length === 0) return
    
    // Create URL with booking details for payment page
    const paymentParams = new URLSearchParams({
      amount: getTotalPrice().toString(),
      type: 'transport',
      seats: selectedSeats.join(','),
      title: `${route.origin} → ${route.destination}`,
      route_id: route.id,
      date: route.date,
      time: route.departure_time
    })
    
    router.push(`/payment?${paymentParams.toString()}`)
  }

  return (
    <div className="min-h-screen bg-body-bg">
      <div className="particles-bg"></div>
      <Container className="py-8 relative z-10">
        {/* Header Mejorado */}
        <div className="flex items-center gap-6 mb-10">
          <Link 
            href="/transport"
            className="p-3 hover:bg-card-hover rounded-xl transition-colors shadow-sm bg-card-bg border border-border-color"
          >
            <ArrowLeft className="w-6 h-6 text-text-primary" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Selección de Asientos</h1>
            <div className="flex items-center gap-3 text-lg md:text-xl text-text-secondary">
              <MapPin className="w-5 h-5 text-accent" />
              <span className="font-semibold">{route.origin}</span>
              <span className="text-accent">→</span>
              <span className="font-semibold">{route.destination}</span>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Salida: {route.departure_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{route.date}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Seat Map - Using Advanced Component with Enhanced Styling */}
          <div className="xl:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-default p-8 shadow-lg"
            >
              {/* Vehicle Header Enhanced */}
              <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl border border-accent/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/20 rounded-full">
                    <VehicleIcon className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">{route.company}</h3>
                    <p className="text-base text-text-secondary">
                      {route.departure_time} • {route.duration_hours}h de viaje
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-text-muted">
                      <span className="px-2 py-1 bg-accent/10 rounded-full text-accent font-medium">
                        {route.vehicle_type === 'combi' ? 'Combi' : 
                         route.vehicle_type === 'auto' ? 'Auto' : 
                         route.vehicle_type.charAt(0).toUpperCase() + route.vehicle_type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-text-secondary mb-1">Distancia</div>
                  <div className="text-2xl font-bold text-text-primary">{route.distance_km} km</div>
                  <div className="text-sm text-accent font-medium mt-1">
                    Desde S/ {route.price_range.min}
                  </div>
                </div>
              </div>

              {/* Advanced Transport Seat Picker Component - Enhanced */}
              <AdvancedTransportSeatPicker
                route={{
                  id: route.id,
                  origin: route.origin,
                  destination: route.destination,
                  company: route.company,
                  vehicle_type: route.vehicle_type === 'combi' ? 'minivan' : route.vehicle_type === 'auto' ? 'car' : route.vehicle_type,
                  departure_times: [route.departure_time],
                  duration_hours: route.duration_hours,
                  distance_km: route.distance_km,
                  price_range: route.price_range,
                  road_type: route.road_type === 'ferrocarril' ? 'rio' : route.road_type,
                  services: route.services,
                  capacity: route.capacity,
                  province: 'Cusco',
                  seat_configuration: '2x2',
                  description: `Viaje de ${route.origin} a ${route.destination}`
                }}
                onSeatSelect={handleSeatSelect}
                selectedSeats={selectedSeats}
                className="mt-6"
              />
            </motion.div>
          </div>

          {/* Booking Summary - Enhanced Design */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-default p-8 sticky top-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-text-primary mb-8 border-b border-border-color pb-4">
                Resumen del Viaje
              </h3>
              
              {/* Route Details - Enhanced */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4 p-4 bg-body-bg rounded-lg border border-border-color">
                  <div className="p-2 bg-accent/20 rounded-full">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="text-text-primary font-semibold text-lg">{route.origin}</div>
                    <div className="text-text-secondary text-sm">Punto de origen</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="w-full h-px bg-border-color relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">→</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-body-bg rounded-lg border border-border-color">
                  <div className="p-2 bg-accent/20 rounded-full">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="text-text-primary font-semibold text-lg">{route.destination}</div>
                    <div className="text-text-secondary text-sm">Punto de destino</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-body-bg rounded-lg border border-border-color">
                    <Calendar className="w-5 h-5 text-accent" />
                    <div>
                      <div className="text-text-primary font-semibold">{route.date}</div>
                      <div className="text-text-secondary text-xs">Fecha</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-body-bg rounded-lg border border-border-color">
                    <Clock className="w-5 h-5 text-accent" />
                    <div>
                      <div className="text-text-primary font-semibold">{route.departure_time}</div>
                      <div className="text-text-secondary text-xs">Salida</div>
                    </div>
                  </div>
                </div>

                {/* Services Enhanced */}
                <div className="p-4 bg-gradient-to-r from-accent/5 to-primary/5 rounded-lg border border-accent/20">
                  <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Servicios incluidos
                  </h4>
                  <div className="text-sm text-text-secondary leading-relaxed">
                    {route.services.join(' • ')}
                  </div>
                </div>
              </div>

              {/* Selected Seats - Enhanced */}
              {selectedSeats.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-text-primary font-semibold mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 bg-accent rounded-full"></span>
                    Asientos Seleccionados
                  </h4>
                  <div className="space-y-3">
                    {selectedSeats.map(seatId => (
                      <div key={seatId} className="flex justify-between items-center py-3 px-4 bg-accent/5 rounded-lg border border-accent/20 hover:bg-accent/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            {seatId}
                          </div>
                          <span className="text-text-primary font-medium">Asiento {seatId}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-accent font-bold text-lg">S/ {route.price_range.min}</span>
                          <button
                            onClick={() => setSelectedSeats(prev => prev.filter(id => id !== seatId))}
                            className="p-1 hover:bg-danger/10 text-danger hover:text-danger/80 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total - Enhanced */}
              {selectedSeats.length > 0 && (
                <div className="border-t border-border-color pt-6 mb-8">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20">
                    <span className="text-xl font-bold text-text-primary">Total a pagar:</span>
                    <span className="text-3xl font-bold text-accent">S/ {getTotalPrice()}</span>
                  </div>
                  <div className="text-center text-text-muted text-sm mt-2">
                    {selectedSeats.length} asiento{selectedSeats.length !== 1 ? 's' : ''} seleccionado{selectedSeats.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )}

              {/* Continue Button - Enhanced */}
              <button
                onClick={handleContinueToPayment}
                disabled={selectedSeats.length === 0}
                className={`btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${
                  selectedSeats.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                <CreditCard className="w-6 h-6" />
                {selectedSeats.length === 0 ? 'Continuar' : 'Proceder al Pago'}
              </button>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  )
}
