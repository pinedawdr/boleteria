'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Bus, Ship, Train, Users } from 'lucide-react'

interface TransportSeat {
  id: string
  row: number
  col: number
  number: string
  status: 'available' | 'occupied' | 'selected' | 'blocked'
  type: 'window' | 'aisle' | 'middle'
  price: number
  position: { x: number; y: number }
}

interface CuscoTransportSeatMapProps {
  routeId: string
  companyId: string
  vehicleType: 'minivan' | 'bus' | 'boat' | 'train' | 'combi' | 'auto'
  seatLayout: any
  onSeatSelect: (seats: TransportSeat[]) => void
  basePrice: number
  maxSeats?: number
}

const CuscoTransportSeatMap: React.FC<CuscoTransportSeatMapProps> = ({
  routeId,
  companyId,
  vehicleType,
  seatLayout,
  onSeatSelect,
  basePrice,
  maxSeats = 4
}) => {
  const [selectedSeats, setSelectedSeats] = useState<TransportSeat[]>([])
  const [hoveredSeat, setHoveredSeat] = useState<TransportSeat | null>(null)
  const [seats, setSeats] = useState<TransportSeat[]>([])
  const [loading, setLoading] = useState(true)

  // Generar asientos basado en el tipo de vehículo y layout
  useEffect(() => {
    const generateSeats = () => {
      const allSeats: TransportSeat[] = []
      let seatNumber = 1

      switch (vehicleType) {
        case 'minivan':
          // Layout típico de minivan: 3 filas de 4 asientos (2+2)
          for (let row = 0; row < seatLayout.rows; row++) {
            for (let col = 0; col < seatLayout.cols; col++) {
              // Saltar asiento del conductor
              if (row === 0 && col === 0) continue
              
              // Definir pasillo entre asientos 1 y 2
              const isAisle = col === 1
              const seatType = col === 0 || col === 2 ? 'window' : 'aisle'
              
              allSeats.push({
                id: `seat-${row}-${col}`,
                row,
                col,
                number: seatNumber.toString(),
                status: Math.random() > 0.8 ? 'occupied' : 'available',
                type: seatType,
                price: basePrice,
                position: { 
                  x: col * 60 + (col > 1 ? 40 : 0) + 50, 
                  y: row * 80 + 50 
                }
              })
              seatNumber++
            }
          }
          break

        case 'bus':
          // Layout típico de bus: 2+2 o 2+1 según el tipo
          for (let row = 0; row < seatLayout.rows; row++) {
            for (let col = 0; col < seatLayout.cols; col++) {
              // Saltar asientos bloqueados (baño, etc.)
              if (seatLayout.blocked_seats?.includes(seatNumber)) {
                seatNumber++
                continue
              }
              
              const seatType = col === 0 || col === 3 ? 'window' : 
                             col === 1 || col === 2 ? 'aisle' : 'middle'
              
              allSeats.push({
                id: `seat-${row}-${col}`,
                row,
                col,
                number: seatNumber.toString(),
                status: Math.random() > 0.85 ? 'occupied' : 'available',
                type: seatType,
                price: basePrice + (seatType === 'window' ? 5 : 0),
                position: { 
                  x: col * 50 + (col > 1 ? 30 : 0) + 80, 
                  y: row * 60 + 80 
                }
              })
              seatNumber++
            }
          }
          break

        case 'boat':
          // Layout de lancha: asientos en filas de 4
          for (let row = 0; row < seatLayout.rows; row++) {
            for (let col = 0; col < seatLayout.cols; col++) {
              const seatType = col === 0 || col === 3 ? 'window' : 'middle'
              
              allSeats.push({
                id: `seat-${row}-${col}`,
                row,
                col,
                number: `${String.fromCharCode(65 + row)}${col + 1}`,
                status: Math.random() > 0.9 ? 'occupied' : 'available',
                type: seatType,
                price: basePrice + (row < 2 ? 10 : 0), // Primeras filas más caras
                position: { 
                  x: col * 45 + 100, 
                  y: row * 70 + 50 
                }
              })
              seatNumber++
            }
          }
          break

        case 'train':
          // Layout de tren: 2+1 para mejor vista
          for (let row = 0; row < seatLayout.rows; row++) {
            for (let col = 0; col < seatLayout.cols; col++) {
              const seatType = col === 0 || col === 1 ? 'window' : 'aisle'
              
              allSeats.push({
                id: `seat-${row}-${col}`,
                row,
                col,
                number: `${row + 1}${String.fromCharCode(65 + col)}`,
                status: Math.random() > 0.7 ? 'occupied' : 'available',
                type: seatType,
                price: basePrice + (seatType === 'window' ? 15 : 0),
                position: { 
                  x: col * 80 + 60, 
                  y: row * 50 + 40 
                }
              })
              seatNumber++
            }
          }
          break

        case 'auto':
          // Layout de auto: 2 filas, 2 asientos por fila
          for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
              // Saltar asiento del conductor
              if (row === 0 && col === 0) continue
              
              allSeats.push({
                id: `seat-${row}-${col}`,
                row,
                col,
                number: row === 0 ? 'Copiloto' : `Pasajero ${col + 1}`,
                status: 'available',
                type: 'window',
                price: basePrice,
                position: { 
                  x: col * 120 + 50, 
                  y: row * 100 + 50 
                }
              })
              seatNumber++
            }
          }
          break

        case 'combi':
          // Layout de combi: similar a minivan pero más asientos
          for (let row = 0; row < seatLayout.rows; row++) {
            for (let col = 0; col < seatLayout.cols; col++) {
              // Saltar asiento del conductor y copiloto si está bloqueado
              if (seatLayout.blocked_seats?.includes(seatNumber)) {
                seatNumber++
                continue
              }
              
              const seatType = col === 0 || col === 2 ? 'window' : 'aisle'
              
              allSeats.push({
                id: `seat-${row}-${col}`,
                row,
                col,
                number: seatNumber.toString(),
                status: Math.random() > 0.85 ? 'occupied' : 'available',
                type: seatType,
                price: basePrice,
                position: { 
                  x: col * 55 + 40, 
                  y: row * 70 + 60 
                }
              })
              seatNumber++
            }
          }
          break
      }

      return allSeats
    }

    setSeats(generateSeats())
    setLoading(false)
  }, [vehicleType, seatLayout, basePrice])

  const handleSeatClick = (seat: TransportSeat) => {
    if (seat.status === 'occupied' || seat.status === 'blocked') return

    setSelectedSeats(prev => {
      let newSelected
      
      if (prev.some(s => s.id === seat.id)) {
        // Deseleccionar asiento
        newSelected = prev.filter(s => s.id !== seat.id)
      } else {
        // Seleccionar asiento si no se excede el límite
        if (prev.length >= maxSeats) {
          return prev
        }
        newSelected = [...prev, { ...seat, status: 'selected' }]
      }
      
      onSeatSelect(newSelected)
      return newSelected
    })
  }

  const getSeatColor = (seat: TransportSeat) => {
    switch (seat.status) {
      case 'selected':
        return '#4CAF50'
      case 'occupied':
        return '#f44336'
      case 'blocked':
        return '#9e9e9e'
      default:
        switch (seat.type) {
          case 'window':
            return '#2196F3'
          case 'aisle':
            return '#FF9800'
          case 'middle':
            return '#9C27B0'
          default:
            return '#607D8B'
        }
    }
  }

  const getVehicleIcon = () => {
    switch (vehicleType) {
      case 'bus':
        return <Bus className="w-6 h-6" />
      case 'boat':
        return <Ship className="w-6 h-6" />
      case 'train':
        return <Train className="w-6 h-6" />
      case 'auto':
      case 'minivan':
      case 'combi':
      default:
        return <Car className="w-6 h-6" />
    }
  }

  const getVehicleDescription = () => {
    switch (vehicleType) {
      case 'minivan':
        return 'Minivan cómoda para rutas cortas y medianas'
      case 'bus':
        return 'Bus turístico con aire acondicionado'
      case 'boat':
        return 'Lancha para navegación fluvial'
      case 'train':
        return 'Tren panorámico con vistas espectaculares'
      case 'auto':
        return 'Auto privado para mayor comodidad'
      case 'combi':
        return 'Combi para rutas urbanas y rurales'
      default:
        return 'Vehículo de transporte'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header del vehículo */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg">
        <div className="flex items-center space-x-3 text-white">
          {getVehicleIcon()}
          <div>
            <h3 className="font-bold text-lg capitalize">{vehicleType}</h3>
            <p className="text-sm opacity-90">{getVehicleDescription()}</p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span className="font-medium">{seats.length} asientos</span>
          </div>
        </div>
      </div>

      {/* Mapa de asientos */}
      <div className="relative bg-gray-900 rounded-lg p-6 overflow-auto">
        {/* Indicador de dirección */}
        <div className="mb-4 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-full text-sm">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>Dirección del viaje</span>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-green-400"></div>
          </div>
        </div>

        <svg
          width="100%"
          height="400"
          viewBox="0 0 800 400"
          className="border border-gray-700 rounded"
        >
          {/* Contorno del vehículo */}
          <rect
            x="20"
            y="20"
            width="760"
            height="360"
            rx="20"
            fill="none"
            stroke="#4a5568"
            strokeWidth="2"
            strokeDasharray="5,5"
          />

          {/* Asientos */}
          {seats.map((seat) => (
            <motion.g
              key={seat.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: Math.random() * 0.3 }}
            >
              {/* Asiento */}
              <motion.rect
                x={seat.position.x}
                y={seat.position.y}
                width="35"
                height="40"
                rx="8"
                fill={getSeatColor(seat)}
                stroke={selectedSeats.some(s => s.id === seat.id) ? '#ffffff' : '#2d3748'}
                strokeWidth={selectedSeats.some(s => s.id === seat.id) ? 3 : 1}
                className="cursor-pointer"
                onClick={() => handleSeatClick(seat)}
                onMouseEnter={() => setHoveredSeat(seat)}
                onMouseLeave={() => setHoveredSeat(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
              
              {/* Respaldo del asiento */}
              <rect
                x={seat.position.x + 5}
                y={seat.position.y - 8}
                width="25"
                height="12"
                rx="6"
                fill={getSeatColor(seat)}
                opacity="0.7"
                className="pointer-events-none"
              />
              
              {/* Número del asiento */}
              <text
                x={seat.position.x + 17.5}
                y={seat.position.y + 25}
                textAnchor="middle"
                fontSize="10"
                fill="white"
                className="pointer-events-none font-bold"
                style={{ userSelect: 'none' }}
              >
                {seat.number}
              </text>
            </motion.g>
          ))}

          {/* Indicador del conductor */}
          <circle
            cx="60"
            cy="60"
            r="20"
            fill="#1a202c"
            stroke="#4a5568"
            strokeWidth="2"
          />
          <text
            x="60"
            y="65"
            textAnchor="middle"
            fontSize="8"
            fill="white"
            className="font-bold"
          >
            CHOFER
          </text>
        </svg>

        {/* Tooltip de asiento */}
        <AnimatePresence>
          {hoveredSeat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bg-black/90 text-white p-3 rounded-lg shadow-xl pointer-events-none z-10"
              style={{
                left: hoveredSeat.position.x + 200,
                top: hoveredSeat.position.y + 100
              }}
            >
              <div className="text-sm">
                <div className="font-bold">Asiento {hoveredSeat.number}</div>
                <div className="capitalize">{hoveredSeat.type}</div>
                <div className="text-accent font-bold">S/ {hoveredSeat.price}</div>
                <div className="text-xs text-gray-300">
                  {hoveredSeat.type === 'window' ? 'Vista a la ventana' : 
                   hoveredSeat.type === 'aisle' ? 'Acceso al pasillo' : 'Asiento central'}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Leyenda */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-blue-500" />
          <span className="text-sm">Ventana</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-orange-500" />
          <span className="text-sm">Pasillo</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span className="text-sm">Seleccionado</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span className="text-sm">Ocupado</span>
        </div>
      </div>

      {/* Información de selección */}
      {selectedSeats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gray-800 rounded-lg"
        >
          <h3 className="font-bold text-lg mb-2">Asientos Seleccionados</h3>
          <div className="space-y-2">
            {selectedSeats.map((seat) => (
              <div key={seat.id} className="flex justify-between items-center text-sm">
                <span>Asiento {seat.number} ({seat.type})</span>
                <span className="font-bold text-accent">S/ {seat.price}</span>
              </div>
            ))}
            <div className="border-t border-gray-600 pt-2 flex justify-between items-center font-bold">
              <span>Total ({selectedSeats.length} asientos)</span>
              <span className="text-accent text-lg">
                S/ {selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default CuscoTransportSeatMap
