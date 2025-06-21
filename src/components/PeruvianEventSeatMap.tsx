'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Seat {
  id: string
  sectionId: string
  sectionName: string
  row: number
  number: number
  type: 'platea' | 'mezzanine' | 'balcon' | 'palco' | 'tribuna' | 'campo' | 'preferencia' | 'popular'
  status: 'available' | 'occupied' | 'selected' | 'blocked'
  price: number
  position: { x: number; y: number }
  view_quality: 'excelente' | 'buena' | 'regular'
}

interface VenueSection {
  id: string
  name: string
  type: 'platea' | 'mezzanine' | 'balcon' | 'palco' | 'tribuna' | 'campo' | 'preferencia' | 'popular'
  position: 'front' | 'middle' | 'back'
  rows: number
  seats_per_row: number
  base_price: number
  view_quality: 'excelente' | 'buena' | 'regular'
  color: string
}

interface VenueLayout {
  id: string
  name: string
  capacity: number
  city: string
  type: string
  sections: VenueSection[]
}

interface SeatMapProps {
  eventId: string
  venueLayout: VenueLayout
  onSeatSelect: (seats: Seat[]) => void
  maxSeats?: number
}

const PeruvianEventSeatMap: React.FC<SeatMapProps> = ({
  venueLayout,
  onSeatSelect,
  maxSeats = 8
}) => {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null)
  const [seats, setSeats] = useState<Seat[]>([])
  const [loading, setLoading] = useState(true)

  // Generar asientos basado en el layout del venue
  useEffect(() => {
    if (!venueLayout) return

    const generateSeats = () => {
      const allSeats: Seat[] = []
      let seatId = 1

      venueLayout.sections.forEach((section: VenueSection) => {
        // Para secciones tipo "campo" (sin asientos numerados)
        if (section.type === 'campo') {
          // Crear una representación visual de zona general - MENOS ASIENTOS PARA MEJOR VISUALIZACIÓN
          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 15; j++) {
              allSeats.push({
                id: `${section.id}-${seatId++}`,
                sectionId: section.id,
                sectionName: section.name,
                row: i + 1,
                number: j + 1,
                type: section.type,
                status: Math.random() > 0.85 ? 'occupied' : 'available',
                price: section.base_price,
                position: { x: j * 60 + 100, y: i * 60 + 100 },
                view_quality: section.view_quality
              })
            }
          }
        } else {
          // Para secciones con asientos numerados - MENOS FILAS PARA MEJOR VISUALIZACIÓN
          const maxRows = Math.min(section.rows, 12)
          const maxSeatsPerRow = Math.min(section.seats_per_row, 20)
          
          for (let row = 1; row <= maxRows; row++) {
            for (let seat = 1; seat <= maxSeatsPerRow; seat++) {
              // Calcular posición usando el mismo sistema que funciona en transporte
              let x, y
              
              switch (section.position) {
                case 'front':
                  x = seat * 55 + (row % 2) * 25
                  y = row * 55 + 150
                  break
                case 'middle':
                  x = seat * 55 + (row % 2) * 25
                  y = row * 55 + 400
                  break
                case 'back':
                  x = seat * 55 + (row % 2) * 25
                  y = row * 55 + 650
                  break
                default:
                  x = seat * 55
                  y = row * 55
              }

              allSeats.push({
                id: `${section.id}-${row}-${seat}`,
                sectionId: section.id,
                sectionName: section.name,
                row,
                number: seat,
                type: section.type,
                status: Math.random() > 0.8 ? 'occupied' : 'available',
                price: section.base_price + (section.view_quality === 'excelente' ? 20 : 0),
                position: { x, y },
                view_quality: section.view_quality
              })
            }
          }
        }
      })

      return allSeats
    }

    setSeats(generateSeats())
    setLoading(false)
  }, [venueLayout])

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'occupied' || seat.status === 'blocked') return

    setSelectedSeats(prev => {
      let newSelected
      
      if (prev.some(s => s.id === seat.id)) {
        // Deseleccionar asiento
        newSelected = prev.filter(s => s.id !== seat.id)
      } else {
        // Seleccionar asiento si no se excede el límite
        if (prev.length >= maxSeats) {
          return prev // No agregar más asientos
        }
        newSelected = [...prev, { ...seat, status: 'selected' as const }]
      }
      
      onSeatSelect(newSelected)
      return newSelected
    })
  }

  const getSeatColor = (seat: Seat) => {
    switch (seat.status) {
      case 'selected':
        return 'bg-green-600 hover:bg-green-700 border-green-400 text-white'
      case 'occupied':
        return 'bg-red-600 border-red-400 text-white'
      case 'blocked':
        return 'bg-gray-600 border-gray-400 text-white'
      default:
        // Color por tipo de sección con mejor contraste
        switch (seat.type) {
          case 'platea':
            return 'bg-red-500 hover:bg-red-600 border-red-300 text-white'
          case 'mezzanine':
            return 'bg-teal-500 hover:bg-teal-600 border-teal-300 text-white'
          case 'balcon':
            return 'bg-blue-500 hover:bg-blue-600 border-blue-300 text-white'
          case 'tribuna':
            return 'bg-emerald-500 hover:bg-emerald-600 border-emerald-300 text-white'
          case 'campo':
            return 'bg-yellow-500 hover:bg-yellow-600 border-yellow-300 text-black'
          case 'preferencia':
            return 'bg-pink-500 hover:bg-pink-600 border-pink-300 text-white'
          case 'popular':
            return 'bg-blue-600 hover:bg-blue-700 border-blue-400 text-white'
          default:
            return 'bg-gray-500 hover:bg-gray-600 border-gray-300 text-white'
        }
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
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      {/* Flyer del Evento - SIN EMOJI */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs text-gray-200">EVENTO</div>
              <div className="text-lg font-bold">CUSCO</div>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Evento Cultural Cusco</h2>
            <p className="text-sm sm:text-base opacity-90 mb-2">Fecha: 15 de Julio, 2025 - 8:00 PM</p>
            <p className="text-xs sm:text-sm opacity-75">Lugar: Teatro Municipal de Cusco</p>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-200">Desde</div>
            <div className="text-2xl font-bold">S/ 25</div>
          </div>
        </div>
      </div>

      {/* Escenario/Campo - Reducido */}
      <div className="mb-4 sm:mb-6">
        <div className="w-full h-12 sm:h-16 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg border-2 border-yellow-300">
          {venueLayout.type === 'estadio_futbol' ? 'CAMPO DE JUEGO' : 'ESCENARIO'}
        </div>
      </div>

      {/* Mapa de asientos usando GRID - TAMAÑOS OPTIMIZADOS */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-3 sm:p-4 lg:p-6 shadow-xl border border-gray-700">
        {/* Renderizar por secciones */}
        <div className="space-y-4 sm:space-y-6">
          {venueLayout.sections.map((section: VenueSection) => {
            const sectionSeats = seats.filter(seat => seat.sectionId === section.id)
            
            if (sectionSeats.length === 0) return null

            // Agrupar asientos por filas
            const seatsByRow = sectionSeats.reduce((acc, seat) => {
              if (!acc[seat.row]) acc[seat.row] = []
              acc[seat.row].push(seat)
              return acc
            }, {} as { [key: number]: Seat[] })

            return (
              <div key={section.id} className="space-y-2 sm:space-y-3">
                {/* Header de sección - Compacto */}
                <div className="text-center p-2 sm:p-3 bg-gray-700/40 rounded-lg border border-gray-600">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">{section.name}</h3>
                  <div className="text-xs sm:text-sm text-gray-200 font-medium">
                    <span className="inline-block bg-green-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">
                      S/ {section.base_price}
                    </span>
                    <span className="inline-block bg-blue-500 text-white px-2 py-1 rounded text-xs">
                      Vista {section.view_quality}
                    </span>
                  </div>
                </div>

                {/* Grid de asientos por filas - ASIENTOS MÁS PEQUEÑOS */}
                <div className="space-y-1 max-w-5xl mx-auto overflow-x-auto">
                  {Object.entries(seatsByRow)
                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                    .map(([rowNum, rowSeats]) => (
                      <div key={`${section.id}-row-${rowNum}`} className="flex items-center justify-center gap-1 min-w-fit px-1">
                        {/* Número de fila - Más pequeño */}
                        <div className="w-5 sm:w-6 text-center text-xs font-bold text-gray-300 bg-gray-700 rounded px-1 py-0.5">
                          {section.type !== 'campo' ? rowNum : ''}
                        </div>

                        {/* Asientos de la fila - TAMAÑO REDUCIDO */}
                        <div className="flex gap-0.5 sm:gap-1 flex-nowrap justify-center overflow-x-auto pb-1">
                          {rowSeats
                            .sort((a, b) => a.number - b.number)
                            .map(seat => (
                              <motion.button
                                key={seat.id}
                                onClick={() => handleSeatClick(seat)}
                                onMouseEnter={() => setHoveredSeat(seat)}
                                onMouseLeave={() => setHoveredSeat(null)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                  w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded text-xs font-bold
                                  transition-all duration-200 border border-white/30 flex-shrink-0
                                  ${getSeatColor(seat)}
                                  ${hoveredSeat?.id === seat.id ? 'ring-1 sm:ring-2 ring-yellow-400 transform scale-110' : ''}
                                  ${seat.status === 'occupied' || seat.status === 'blocked' ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-white/50'}
                                `}
                                disabled={seat.status === 'occupied' || seat.status === 'blocked'}
                                title={`${seat.sectionName} - Fila ${seat.row}, Asiento ${seat.number} - S/ ${seat.price}`}
                              >
                                {section.type === 'campo' ? '●' : seat.number}
                              </motion.button>
                            ))}
                        </div>

                        {/* Número de fila del otro lado - Más pequeño */}
                        <div className="w-5 sm:w-6 text-center text-xs font-bold text-gray-300 bg-gray-700 rounded px-1 py-0.5">
                          {section.type !== 'campo' ? rowNum : ''}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Tooltip - Compacto y Responsivo */}
        <AnimatePresence>
          {hoveredSeat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bg-black/95 text-white p-3 sm:p-4 rounded-lg shadow-2xl pointer-events-none z-50 border border-yellow-400 max-w-xs"
              style={{
                left: '50%',
                top: '10%',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="text-center">
                <div className="font-bold text-sm sm:text-base text-yellow-400 mb-1">{hoveredSeat.sectionName}</div>
                {hoveredSeat.type !== 'campo' && (
                  <div className="text-gray-200 text-xs sm:text-sm mb-1">
                    Fila {hoveredSeat.row}, Asiento {hoveredSeat.number}
                  </div>
                )}
                <div className="text-green-400 font-bold text-lg sm:text-xl mb-1">S/ {hoveredSeat.price}</div>
                <div className="text-xs text-gray-300">
                  Vista: <span className="text-blue-400 font-semibold">{hoveredSeat.view_quality}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Leyenda - REDISEÑADA COMPLETAMENTE */}
      <div className="mt-4 sm:mt-6 space-y-4">
        {/* Título de la leyenda */}
        <h3 className="text-lg font-bold text-white text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Información de Asientos
        </h3>
        
        {/* Secciones del venue */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Secciones del Evento</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {venueLayout.sections.map((section: VenueSection) => (
              <div key={section.id} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-600/50 hover:bg-gray-700/50 transition-all duration-200">
                <div
                  className="w-6 h-6 rounded border-2 border-white/80 flex-shrink-0 shadow-lg"
                  style={{ backgroundColor: section.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-white text-sm truncate">{section.name}</div>
                  <div className="text-xs text-green-400 font-bold">S/ {section.base_price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Estados de los asientos - MÁS COMPACTO */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Estados</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2 p-2 bg-gray-800/50 rounded border border-gray-600/50">
              <div className="w-5 h-5 rounded bg-blue-500 border border-blue-300 flex-shrink-0" />
              <span className="text-xs font-medium text-blue-300">Disponible</span>
            </div>
            
            <div className="flex items-center space-x-2 p-2 bg-gray-800/50 rounded border border-gray-600/50">
              <div className="w-5 h-5 rounded bg-green-600 border border-green-400 flex-shrink-0" />
              <span className="text-xs font-medium text-green-300">Seleccionado</span>
            </div>
            
            <div className="flex items-center space-x-2 p-2 bg-gray-800/50 rounded border border-gray-600/50">
              <div className="w-5 h-5 rounded bg-red-600 border border-red-400 flex-shrink-0" />
              <span className="text-xs font-medium text-red-300">Ocupado</span>
            </div>
            
            <div className="flex items-center space-x-2 p-2 bg-gray-800/50 rounded border border-gray-600/50">
              <div className="w-5 h-5 rounded bg-gray-600 border border-gray-400 flex-shrink-0" />
              <span className="text-xs font-medium text-gray-300">Bloqueado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Información de selección - COMPACTA */}
      {selectedSeats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm rounded-lg shadow-xl border border-green-400/30"
        >
          <h3 className="font-bold text-lg sm:text-xl mb-3 text-green-300 text-center">
            Asientos Seleccionados
          </h3>
          <div className="space-y-2">
            {selectedSeats.map((seat) => (
              <div key={seat.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded border border-white/20 gap-1 sm:gap-2">
                <span className="text-white font-medium flex-1 text-xs sm:text-sm">
                  <span className="inline-block bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-bold mr-2">
                    {seat.sectionName}
                  </span>
                  {seat.type !== 'campo' && (
                    <span className="text-gray-200">
                      Fila {seat.row}, Asiento {seat.number}
                    </span>
                  )}
                </span>
                <span className="font-bold text-green-300 text-sm sm:text-base">S/ {seat.price}</span>
              </div>
            ))}
            <div className="border-t border-white/20 pt-3 flex flex-col sm:flex-row justify-between items-center font-bold bg-white/10 backdrop-blur-sm p-3 rounded gap-1 sm:gap-2">
              <span className="text-white text-sm sm:text-base">
                Total ({selectedSeats.length} asiento{selectedSeats.length !== 1 ? 's' : ''})
              </span>
              <span className="text-green-300 text-lg sm:text-xl font-black">
                S/ {selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default PeruvianEventSeatMap
