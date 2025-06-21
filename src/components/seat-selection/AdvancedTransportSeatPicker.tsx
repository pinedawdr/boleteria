'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Bus, Ship, Car, Train } from 'lucide-react'
import { TransportRoute } from '@/data/cusco-transport-routes'

interface TransportSeat {
  id: string
  number: string
  type: 'standard' | 'premium' | 'vip' | 'suite'
  status: 'available' | 'occupied' | 'selected' | 'reserved'
  price: number
  position: { row: number; col: number }
  features?: string[]
}

interface AdvancedTransportSeatPickerProps {
  route: TransportRoute
  onSeatSelect: (seat: TransportSeat) => void
  selectedSeats: string[]
  className?: string
}

const AdvancedTransportSeatPicker: React.FC<AdvancedTransportSeatPickerProps> = ({
  route,
  onSeatSelect,
  selectedSeats,
  className = ''
}) => {
  const [seats, setSeats] = useState<TransportSeat[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null)

  // Configuraciones específicas por tipo de vehículo y empresa
  const getVehicleConfig = useCallback(() => {
    const basePrice = (route.price_range.min + route.price_range.max) / 2

    switch (route.vehicle_type) {
      case 'bus':
        if (route.company === 'Cruz del Sur' || route.company === 'Transportes Ampay') {
          return {
            layout: 'luxury_bus',
            rows: 20,
            seatsPerRow: 4,
            configuration: '2-2',
            premiumRows: 5,
            suitRows: 2,
            prices: {
              suite: Math.round(basePrice * 2.5),
              premium: Math.round(basePrice * 1.8),
              standard: basePrice
            }
          }
        } else {
          return {
            layout: 'standard_bus',
            rows: 25,
            seatsPerRow: 4,
            configuration: '2-2',
            premiumRows: 3,
            prices: {
              premium: Math.round(basePrice * 1.5),
              standard: basePrice
            }
          }
        }

      case 'minivan':
        // Para empresas como APU Las Bambas, Transportes Valle Sagrado
        return {
          layout: 'minivan',
          rows: route.capacity <= 12 ? 4 : 5,
          seatsPerRow: 3,
          configuration: '3-2' as string,
          premiumRows: 1,
          prices: {
            premium: Math.round(basePrice * 1.3),
            standard: basePrice
          }
        }

      case 'boat':
        // Para rutas fluviales como Megantoni
        return {
          layout: 'river_boat',
          rows: 8,
          seatsPerRow: 6,
          configuration: '3-3',
          premiumRows: 2,
          prices: {
            premium: Math.round(basePrice * 1.5),
            standard: basePrice
          }
        }

      case 'train':
        // Para PeruRail
        return {
          layout: 'tourist_train',
          rows: 21,
          seatsPerRow: 4,
          configuration: '2-2',
          premiumRows: 7,
          suitRows: 3,
          prices: {
            vip: Math.round(basePrice * 3.0),
            premium: Math.round(basePrice * 2.0),
            standard: basePrice
          }
        }

      default:
        return {
          layout: 'standard',
          rows: 15,
          seatsPerRow: 4,
          configuration: '2-2',
          premiumRows: 3,
          prices: {
            premium: Math.round(basePrice * 1.5),
            standard: basePrice
          }
        }
    }
  }, [route.vehicle_type, route.company, route.capacity, route.price_range])

  useEffect(() => {
    const generateSeats = () => {
      const config = getVehicleConfig()
      const generatedSeats: TransportSeat[] = []

      for (let row = 1; row <= config.rows; row++) {
        for (let seat = 1; seat <= config.seatsPerRow; seat++) {
          const seatId = `${row}${String.fromCharCode(64 + seat)}`
          
          let type: TransportSeat['type'] = 'standard'
          let price = config.prices.standard
          let features: string[] = []

          // Determinar tipo de asiento basado en la fila y configuración
          if (config.suitRows && row <= config.suitRows) {
            type = 'suite'
            price = config.prices.vip || config.prices.suite || price
            features = ['Cama completa', 'Servicio premium', 'Comidas incluidas', 'Wi-Fi']
          } else if (row <= config.premiumRows) {
            type = 'premium'
            price = config.prices.premium
            features = ['Asiento reclinable', 'Más espacio', 'Refrigerio']
          } else {
            features = ['Asiento estándar']
          }

          // Ajustes específicos por empresa
          if (route.company === 'PeruRail') {
            if (row <= 3) {
              type = 'vip'
              price = config.prices.vip || price
              features = ['Vista panorámica', 'Servicio gourmet', 'Bar', 'Observatorio']
            }
          }

          if (route.company === 'Empresa APU Las Bambas') {
            // Minivans más pequeñas para rutas difíciles
            features = ['Equipaje limitado', 'Viaje económico']
          }

          if (route.company === 'Navegación Urubamba') {
            features = ['Hamaca disponible', 'Comidas típicas', 'Guía naturalista']
          }

          generatedSeats.push({
            id: seatId,
            number: seatId,
            type,
            status: Math.random() > 0.75 ? 'occupied' : 'available',
            price,
            position: { row, col: seat },
            features
          })
        }
      }

      return generatedSeats
    }

    setLoading(true)
    setTimeout(() => {
      const newSeats = generateSeats()
      setSeats(newSeats)
      setLoading(false)
    }, 800)
  }, [route, getVehicleConfig])

  const handleSeatClick = (seat: TransportSeat) => {
    if (seat.status === 'occupied' || seat.status === 'reserved') return

    const newStatus = selectedSeats.includes(seat.id) ? 'available' : 'selected'
    
    setSeats(prevSeats => 
      prevSeats.map(s => 
        s.id === seat.id 
          ? { ...s, status: newStatus }
          : s
      )
    )

    onSeatSelect(seat)
  }

  const getSeatColor = (seat: TransportSeat) => {
    if (seat.status === 'occupied') return 'bg-red-500 cursor-not-allowed'
    if (seat.status === 'reserved') return 'bg-orange-500 cursor-not-allowed'
    if (selectedSeats.includes(seat.id)) return 'bg-accent hover:bg-accent/80 cursor-pointer'
    
    switch (seat.type) {
      case 'vip':
      case 'suite':
        return 'bg-purple-600 hover:bg-purple-500 cursor-pointer'
      case 'premium':
        return 'bg-blue-600 hover:bg-blue-500 cursor-pointer'
      default:
        return 'bg-green-600 hover:bg-green-500 cursor-pointer'
    }
  }

  const getVehicleIcon = () => {
    switch (route.vehicle_type) {
      case 'bus': return Bus
      case 'boat': return Ship
      case 'train': return Train
      case 'minivan':
      case 'car':
      default:
        return Car
    }
  }

  const renderBusLayout = () => {
    const config = getVehicleConfig()
    const VehicleIcon = getVehicleIcon()
    
    return (
      <div className="max-w-md mx-auto">
        {/* Cabecera del vehículo */}
        <div className="flex items-center justify-between mb-4 p-3 bg-body-bg rounded-lg border border-border-color">
          <div className="flex items-center gap-2">
            <VehicleIcon className="h-5 w-5 text-accent" />
            <span className="font-semibold text-text-primary">{route.company}</span>
          </div>
          <span className="text-sm text-text-secondary">{config.configuration}</span>
        </div>

        {/* Área del conductor */}
        <div className="w-full h-12 bg-body-bg rounded-t-2xl mb-4 flex items-center justify-center border border-border-color">
          <span className="text-text-secondary text-sm">
            {route.vehicle_type === 'boat' ? 'Capitán' : 'Conductor'}
          </span>
        </div>

        {/* Disposición de asientos */}
        <div className="space-y-2">
          {Array.from({ length: config.rows }, (_, rowIndex) => {
            const row = rowIndex + 1
            const rowSeats = seats.filter(seat => seat.position.row === row)
            
            if (rowSeats.length === 0) return null
            
            return (
              <div key={row} className="flex items-center gap-6">
                {/* Número de fila mejorado */}
                <div className="w-10 text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/30 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-text-primary text-base font-bold">{row}</span>
                  </div>
                </div>
                
                {/* Asientos lado izquierdo - Mejorados */}
                <div className="flex gap-2">
                  {rowSeats
                    .filter(seat => seat.position.col <= Math.floor(config.seatsPerRow / 2))
                    .map(seat => (
                      <motion.button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        onMouseEnter={() => setHoveredSeat(seat.id)}
                        onMouseLeave={() => setHoveredSeat(null)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className={`
                          w-12 h-12 rounded-lg text-white text-sm font-bold
                          transition-all duration-200 border-2 border-white/30 shadow-md
                          ${getSeatColor(seat)}
                          ${hoveredSeat === seat.id ? 'ring-4 ring-white/50 shadow-xl' : ''}
                          ${seat.status === 'occupied' || seat.status === 'reserved' ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
                        `}
                        disabled={seat.status === 'occupied' || seat.status === 'reserved'}
                        title={`Asiento ${seat.number} - ${seat.type.charAt(0).toUpperCase() + seat.type.slice(1)} - S/ ${seat.price}`}
                      >
                        {seat.number.slice(-1)}
                      </motion.button>
                    ))}
                </div>

                {/* Pasillo mejorado */}
                <div className="w-8 flex justify-center">
                  {route.vehicle_type === 'minivan' && config.seatsPerRow === 3 && row <= 3 && (
                    <div className="w-3 h-12 bg-gradient-to-b from-gray-400 to-gray-500 rounded-lg"></div>
                  )}
                </div>

                {/* Asientos lado derecho - Mejorados */}
                <div className="flex gap-2">
                  {rowSeats
                    .filter(seat => seat.position.col > Math.floor(config.seatsPerRow / 2))
                    .map(seat => (
                      <motion.button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        onMouseEnter={() => setHoveredSeat(seat.id)}
                        onMouseLeave={() => setHoveredSeat(null)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className={`
                          w-12 h-12 rounded-lg text-white text-sm font-bold
                          transition-all duration-200 border-2 border-white/30 shadow-md
                          ${getSeatColor(seat)}
                          ${hoveredSeat === seat.id ? 'ring-4 ring-white/50 shadow-xl' : ''}
                          ${seat.status === 'occupied' || seat.status === 'reserved' ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
                        `}
                        disabled={seat.status === 'occupied' || seat.status === 'reserved'}
                        title={`Asiento ${seat.number} - ${seat.type.charAt(0).toUpperCase() + seat.type.slice(1)} - S/ ${seat.price}`}
                      >
                        {seat.number.slice(-1)}
                      </motion.button>
                    ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Información específica del vehículo */}
        <div className="mt-6 p-3 bg-body-bg rounded-lg border border-border-color">
          <h4 className="font-semibold text-text-primary mb-2">Información del viaje</h4>
          <div className="space-y-1 text-sm text-text-secondary">
            <div>Duración: {route.duration_hours}h</div>
            <div>Distancia: {route.distance_km} km</div>
            <div>Tipo de vía: {route.road_type}</div>
            <div>Servicios: {route.services.join(', ')}</div>
          </div>
        </div>
      </div>
    )
  }

  const renderTrainLayout = () => {
    const VehicleIcon = getVehicleIcon()
    
    return (
      <div className="max-w-4xl mx-auto">
        {/* Cabecera del tren */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
          <div className="flex items-center gap-3">
            <VehicleIcon className="h-6 w-6" />
            <div>
              <h3 className="font-bold">{route.company}</h3>
              <p className="text-sm opacity-90">Tren turístico a Machu Picchu</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm">Vagón Panorámico</div>
            <div className="text-xs opacity-75">Vista 360°</div>
          </div>
        </div>

        {/* Vagones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['Vagón VIP', 'Vagón Premium', 'Vagón Estándar'].map((vagon, vagonIndex) => {
            const vagonSeats = seats.filter(seat => {
              if (vagonIndex === 0) return seat.type === 'vip'
              if (vagonIndex === 1) return seat.type === 'premium' 
              return seat.type === 'standard'
            })

            return (
              <motion.div
                key={vagon}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: vagonIndex * 0.1 }}
                className="space-y-3"
              >
                <h4 className="font-semibold text-text-primary text-center bg-body-bg p-2 rounded border border-border-color">
                  {vagon}
                </h4>
                
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {vagonSeats
                    .reduce((rows, seat) => {
                      const rowIndex = Math.floor((rows.flat().length) / 4)
                      if (!rows[rowIndex]) rows[rowIndex] = []
                      rows[rowIndex].push(seat)
                      return rows
                    }, [] as TransportSeat[][])
                    .map((rowSeats, rowIndex) => (
                      <div key={rowIndex} className="flex gap-1 justify-center">
                        {rowSeats.map(seat => (
                          <motion.button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            onMouseEnter={() => setHoveredSeat(seat.id)}
                            onMouseLeave={() => setHoveredSeat(null)}
                            whileHover={{ scale: 1.1 }}
                            className={`
                              w-8 h-8 rounded text-white text-xs font-bold
                              transition-all duration-200
                              ${getSeatColor(seat)}
                            `}
                            disabled={seat.status === 'occupied'}
                            title={`${seat.number} - ${seat.type} - S/ ${seat.price}`}
                          >
                            {seat.position.col}
                          </motion.button>
                        ))}
                      </div>
                    ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderBoatLayout = () => {
    const VehicleIcon = getVehicleIcon()
    
    return (
      <div className="max-w-2xl mx-auto">
        {/* Cabecera del bote */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white">
          <div className="flex items-center gap-3">
            <VehicleIcon className="h-6 w-6" />
            <div>
              <h3 className="font-bold">{route.company}</h3>
              <p className="text-sm opacity-90">Navegación fluvial</p>
            </div>
          </div>
        </div>

        {/* Cubierta superior */}
        <div className="mb-4">
          <h4 className="text-center font-semibold mb-2 text-text-primary">Cubierta Superior</h4>
          <div className="bg-blue-100 rounded-lg p-3 grid grid-cols-6 gap-2">
            {seats.filter(s => s.type === 'premium').slice(0, 12).map(seat => (
              <motion.button
                key={seat.id}
                onClick={() => handleSeatClick(seat)}
                whileHover={{ scale: 1.1 }}
                className={`w-8 h-8 rounded ${getSeatColor(seat)} text-white text-xs font-bold`}
                title={`${seat.number} - Premium - S/ ${seat.price}`}
              >
                {seat.position.col}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Cubierta principal */}
        <div>
          <h4 className="text-center font-semibold mb-2 text-text-primary">Cubierta Principal</h4>
          <div className="bg-green-100 rounded-lg p-3 grid grid-cols-6 gap-2">
            {seats.filter(s => s.type === 'standard').map(seat => (
              <motion.button
                key={seat.id}
                onClick={() => handleSeatClick(seat)}
                whileHover={{ scale: 1.1 }}
                className={`w-8 h-8 rounded ${getSeatColor(seat)} text-white text-xs font-bold`}
                title={`${seat.number} - Estándar - S/ ${seat.price}`}
              >
                {seat.position.col}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center py-12`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando asientos disponibles...</p>
        </div>
      </div>
    )
  }

  const renderLayout = () => {
    switch (route.vehicle_type) {
      case 'train':
        return renderTrainLayout()
      case 'boat':
        return renderBoatLayout()
      default:
        return renderBusLayout()
    }
  }

  return (
    <div className={className}>
      {/* Leyenda mejorada */}
      <div className="flex flex-wrap gap-6 mb-8 p-6 bg-gradient-to-r from-body-bg to-card-bg rounded-xl border border-border-color shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-green-600 rounded-lg shadow-sm border-2 border-white/30"></div>
          <span className="text-base font-medium text-text-primary">Estándar</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-600 rounded-lg shadow-sm border-2 border-white/30"></div>
          <span className="text-base font-medium text-text-primary">Premium</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-purple-600 rounded-lg shadow-sm border-2 border-white/30"></div>
          <span className="text-base font-medium text-text-primary">VIP/Suite</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-accent rounded-lg shadow-sm border-2 border-white/30"></div>
          <span className="text-base font-medium text-text-primary">Seleccionado</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-red-500 rounded-lg shadow-sm border-2 border-white/30"></div>
          <span className="text-base font-medium text-text-primary">Ocupado</span>
        </div>
      </div>

      {/* Layout del vehículo */}
      {renderLayout()}

      {/* Información del asiento hover mejorada */}
      {hoveredSeat && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-card-bg border-2 border-accent/30 rounded-xl p-4 shadow-2xl backdrop-blur-sm"
        >
          {(() => {
            const seat = seats.find(s => s.id === hoveredSeat)
            if (!seat) return null
            return (
              <div className="space-y-3 text-base max-w-xs">
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-lg shadow-sm border-2 border-white/30 ${getSeatColor(seat)}`}></div>
                  <span className="text-text-primary font-bold text-lg">Asiento {seat.number}</span>
                  <span className="text-accent font-bold text-xl">S/ {seat.price}</span>
                </div>
                <div className="text-text-secondary leading-relaxed">
                  <div className="font-medium">Tipo: {seat.type.charAt(0).toUpperCase() + seat.type.slice(1)}</div>
                  <div className="text-sm mt-1">{seat.features?.join(' • ')}</div>
                </div>
              </div>
            )
          })()}
        </motion.div>
      )}
    </div>
  )
}

export default AdvancedTransportSeatPicker
