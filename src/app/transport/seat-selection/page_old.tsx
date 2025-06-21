'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
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
  CreditCard,
  Check
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

// Generate mock seats for a bus layout (2-2 configuration)
const generateBusSeats = (): Seat[] => {
  const seats: Seat[] = []
  const rows = 20
  
  for (let row = 1; row <= rows; row++) {
    // Left side seats (A, B)
    seats.push({
      id: `${row}A`,
      number: `${row}A`,
      type: row <= 5 ? 'premium' : 'standard',
      status: Math.random() > 0.7 ? 'occupied' : 'available',
      price: row <= 5 ? 120 : 80,
      position: { row, col: 1 }
    })
    
    seats.push({
      id: `${row}B`,
      number: `${row}B`,
      type: row <= 5 ? 'premium' : 'standard',
      status: Math.random() > 0.7 ? 'occupied' : 'available',
      price: row <= 5 ? 120 : 80,
      position: { row, col: 2 }
    })
    
    // Right side seats (C, D)
    seats.push({
      id: `${row}C`,
      number: `${row}C`,
      type: row <= 5 ? 'premium' : 'standard',
      status: Math.random() > 0.7 ? 'occupied' : 'available',
      price: row <= 5 ? 120 : 80,
      position: { row, col: 4 }
    })
    
    seats.push({
      id: `${row}D`,
      number: `${row}D`,
      type: row <= 5 ? 'premium' : 'standard',
      status: Math.random() > 0.7 ? 'occupied' : 'available',
      price: row <= 5 ? 120 : 80,
      position: { row, col: 5 }
    })
  }
  
  return seats
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
  const [showPayment, setShowPayment] = useState(false)
  const [passengerInfo, setPassengerInfo] = useState<{[key: string]: {name: string, dni: string}}>({})

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

  const handlePassengerInfoChange = (seatId: string, field: 'name' | 'dni', value: string) => {
    setPassengerInfo(prev => ({
      ...prev,
      [seatId]: {
        ...prev[seatId],
        [field]: value
      }
    }))
  }

  if (showPayment) {
    return (
      <div className="min-h-screen bg-body-bg">
        <div className="particles-bg"></div>
        <Container className="py-8 relative z-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setShowPayment(false)}
              className="p-2 hover:bg-card-hover rounded-lg transition-colors"
            >
              <ArrowLeft className="icon-md text-text-primary" />
            </button>
            <h1 className="text-2xl font-bold text-text-primary">Información de Pasajeros</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Passenger Information Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-default p-6"
              >
                <h2 className="text-xl font-bold text-text-primary mb-6">Datos de los Pasajeros</h2>
                
                {selectedSeats.map((seatId, index) => {
                  const seat = seats.find(s => s.id === seatId)
                  return (
                    <div key={seatId} className="mb-8 p-4 border border-border-default rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{seat?.number}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary">
                          Pasajero {index + 1} - Asiento {seat?.number}
                        </h3>
                        <span className="px-2 py-1 bg-accent/20 text-accent text-sm rounded">
                          S/ {seat?.price}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-text-secondary text-sm mb-2">
                            Nombres y Apellidos *
                          </label>
                          <input
                            type="text"
                            value={passengerInfo[seatId]?.name || ''}
                            onChange={(e) => handlePassengerInfoChange(seatId, 'name', e.target.value)}
                            className="input-default"
                            placeholder="Ingrese nombres completos"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-text-secondary text-sm mb-2">
                            DNI *
                          </label>
                          <input
                            type="text"
                            value={passengerInfo[seatId]?.dni || ''}
                            onChange={(e) => handlePassengerInfoChange(seatId, 'dni', e.target.value)}
                            className="input-default"
                            placeholder="12345678"
                            maxLength={8}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            </div>

            {/* Payment Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card-default p-6 sticky top-8"
              >
                <h3 className="text-xl font-bold text-text-primary mb-6">Resumen de Compra</h3>
                
                {/* Route Info */}
                <div className="mb-6 p-4 card-info rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <VehicleIcon className="icon-sm text-accent" />
                    <span className="text-text-primary font-semibold">{route.company}</span>
                  </div>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <div className="flex justify-between">
                      <span>Ruta:</span>
                      <span>{route.origin} → {route.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fecha:</span>
                      <span>{route.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hora:</span>
                      <span>{route.departure_time}</span>
                    </div>
                  </div>
                </div>

                {/* Selected Seats */}
                <div className="mb-6">
                  <h4 className="text-text-primary font-semibold mb-3">Asientos Seleccionados</h4>
                  {selectedSeats.map(seatId => {
                    const seat = seats.find(s => s.id === seatId)
                    return (
                      <div key={seatId} className="flex justify-between items-center py-2">
                        <span className="text-text-secondary">Asiento {seat?.number}</span>
                        <span className="text-accent font-semibold">S/ {seat?.price}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Total */}
                <div className="border-t border-border-default pt-4 mb-6">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-text-primary">Total:</span>
                    <span className="text-accent">S/ {getTotalPrice()}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <button 
                  onClick={handleContinueToPayment}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                  <CreditCard className="icon-sm" />
                  Proceder al Pago
                </button>
              </motion.div>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-body-bg">
      <div className="particles-bg"></div>
      <Container className="py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/transport"
            className="p-2 hover:bg-card-hover rounded-lg transition-colors"
          >
            <ArrowLeft className="icon-md text-text-primary" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Selección de Asientos</h1>
            <p className="text-text-secondary">{route.origin} → {route.destination}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Seat Map */}
          <div className="xl:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-default p-6"
            >
              {/* Vehicle Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <VehicleIcon className="icon-md text-accent" />
                  <span className="text-text-primary font-semibold">{route.company}</span>
                </div>
                <div className="text-sm text-text-secondary">
                  {route.departure_time} • {route.duration}h viaje
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-6 mb-8 p-4 bg-body-bg rounded-lg border border-border-color">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-success rounded"></div>
                  <span className="text-sm text-text-secondary">Disponible (S/ 80)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-warning rounded"></div>
                  <span className="text-sm text-text-secondary">Premium (S/ 120)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-accent rounded"></div>
                  <span className="text-sm text-text-secondary">Seleccionado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-danger rounded"></div>
                  <span className="text-sm text-text-secondary">Ocupado</span>
                </div>
              </div>

              {/* Bus Layout */}
              <div className="max-w-md mx-auto">
                {/* Driver Area */}
                <div className="w-full h-12 bg-body-bg rounded-t-2xl mb-4 flex items-center justify-center border border-border-color">
                  <span className="text-text-secondary text-sm">Conductor</span>
                </div>

                {/* Seats Grid */}
                <div className="space-y-2">
                  {Array.from({ length: 20 }, (_, rowIndex) => {
                    const row = rowIndex + 1
                    const rowSeats = seats.filter(seat => seat.position.row === row)
                    
                    return (
                      <div key={row} className="flex items-center gap-4">
                        {/* Row Number */}
                        <div className="w-6 text-center text-gray-400 text-sm">
                          {row}
                        </div>
                        
                        {/* Left Side Seats */}
                        <div className="flex gap-1">
                          {rowSeats
                            .filter(seat => seat.position.col <= 2)
                            .map(seat => (
                              <button
                                key={seat.id}
                                onClick={() => handleSeatClick(seat.id)}
                                className={`w-8 h-8 rounded transition-all duration-200 text-white text-xs font-semibold ${getSeatColor(seat)}`}
                                disabled={seat.status === 'occupied'}
                              >
                                {seat.number.slice(-1)}
                              </button>
                            ))}
                        </div>

                        {/* Aisle */}
                        <div className="w-6"></div>

                        {/* Right Side Seats */}
                        <div className="flex gap-1">
                          {rowSeats
                            .filter(seat => seat.position.col > 2)
                            .map(seat => (
                              <button
                                key={seat.id}
                                onClick={() => handleSeatClick(seat.id)}
                                className={`w-8 h-8 rounded transition-all duration-200 text-white text-xs font-semibold ${getSeatColor(seat)}`}
                                disabled={seat.status === 'occupied'}
                              >
                                {seat.number.slice(-1)}
                              </button>
                            ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-default p-6 sticky top-8"
            >
              <h3 className="text-xl font-bold text-text-primary mb-6">Resumen del Viaje</h3>
              
              {/* Route Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <MapPin className="icon-sm text-accent" />
                  <div>
                    <div className="text-text-primary font-semibold">{route.origin}</div>
                    <div className="text-text-secondary text-sm">Origen</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="icon-sm text-accent" />
                  <div>
                    <div className="text-text-primary font-semibold">{route.destination}</div>
                    <div className="text-text-secondary text-sm">Destino</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="icon-sm text-accent" />
                  <div>
                    <div className="text-text-primary font-semibold">{route.date}</div>
                    <div className="text-text-secondary text-sm">Fecha</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="icon-sm text-accent" />
                  <div>
                    <div className="text-text-primary font-semibold">{route.departure_time}</div>
                    <div className="text-text-secondary text-sm">Salida</div>
                  </div>
                </div>
              </div>

              {/* Selected Seats */}
              {selectedSeats.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-text-primary font-semibold mb-3">Asientos Seleccionados</h4>
                  <div className="space-y-2">
                    {selectedSeats.map(seatId => {
                      const seat = seats.find(s => s.id === seatId)
                      return (
                        <div key={seatId} className="flex justify-between items-center py-2 px-3 bg-body-bg rounded border border-border-color">
                          <span className="text-text-secondary">Asiento {seat?.number}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-accent font-semibold">S/ {seat?.price}</span>
                            <button
                              onClick={() => handleSeatClick(seatId)}
                              className="text-danger hover:text-danger/80 transition-colors"
                            >
                              <X className="icon-xs" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Total */}
              {selectedSeats.length > 0 && (
                <div className="border-t border-border-color pt-4 mb-6">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-text-primary">Total:</span>
                    <span className="text-accent">S/ {getTotalPrice()}</span>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={handleContinueToPayment}
                disabled={selectedSeats.length === 0}
                className={`btn-primary w-full flex items-center justify-center gap-2 ${
                  selectedSeats.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Check className="icon-sm" />
                Continuar
              </button>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  )
}
