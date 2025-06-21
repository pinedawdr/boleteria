'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users, Star, Info } from 'lucide-react'

interface SeatProps {
  id: string
  number: string
  section: string
  type: 'vip' | 'premium' | 'general' | 'palco' | 'platea' | 'galeria'
  status: 'available' | 'occupied' | 'selected' | 'reserved'
  price: number
  position: { row: number; col: number }
  color?: string
}

interface VenueLayoutProps {
  venueId: string
  eventType: 'concert' | 'theater' | 'sports' | 'conference'
  basePrice: number
  onSeatSelect: (seat: SeatProps) => void
  selectedSeats: string[]
  className?: string
}

const AdvancedSeatPicker: React.FC<VenueLayoutProps> = ({
  venueId,
  eventType,
  basePrice,
  onSeatSelect,
  selectedSeats,
  className = ''
}) => {
  const [seats, setSeats] = useState<SeatProps[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null)

  // Configuraciones específicas por venue
  const venueConfigs = {
    'teatro-municipal-lima': {
      layout: 'traditional_theater',
      sections: [
        { id: 'palcos', name: 'Palcos', rows: 3, seatsPerRow: 8, multiplier: 3.0, color: '#8B5CF6' },
        { id: 'platea', name: 'Platea', rows: 12, seatsPerRow: 24, multiplier: 2.0, color: '#3B82F6' },
        { id: 'galeria-baja', name: 'Galería Baja', rows: 8, seatsPerRow: 28, multiplier: 1.5, color: '#10B981' },
        { id: 'galeria-alta', name: 'Galería Alta', rows: 6, seatsPerRow: 30, multiplier: 1.0, color: '#6B7280' }
      ]
    },
    'estadio-nacional-lima': {
      layout: 'stadium',
      sections: [
        { id: 'palco-presidencial', name: 'Palco Presidencial', rows: 3, seatsPerRow: 50, multiplier: 5.0, color: '#8B5CF6' },
        { id: 'tribuna-occidente', name: 'Tribuna Occidente', rows: 25, seatsPerRow: 180, multiplier: 2.5, color: '#3B82F6' },
        { id: 'tribuna-oriente', name: 'Tribuna Oriente', rows: 25, seatsPerRow: 180, multiplier: 2.0, color: '#06B6D4' },
        { id: 'norte-popular', name: 'Norte Popular', rows: 30, seatsPerRow: 150, multiplier: 1.0, color: '#10B981' },
        { id: 'sur-popular', name: 'Sur Popular', rows: 30, seatsPerRow: 150, multiplier: 1.0, color: '#84CC16' }
      ]
    },
    'arena-nacional': {
      layout: 'arena',
      sections: [
        { id: 'pista-vip', name: 'Pista VIP', rows: 10, seatsPerRow: 50, multiplier: 4.0, color: '#8B5CF6' },
        { id: 'pista-general', name: 'Pista General', rows: 25, seatsPerRow: 80, multiplier: 2.0, color: '#10B981' },
        { id: 'tribuna-baja', name: 'Tribuna Baja', rows: 15, seatsPerRow: 120, multiplier: 2.5, color: '#3B82F6' },
        { id: 'tribuna-alta', name: 'Tribuna Alta', rows: 20, seatsPerRow: 150, multiplier: 1.5, color: '#6B7280' }
      ]
    },
    'qosqo-arte-nativo': {
      layout: 'cultural_center',
      sections: [
        { id: 'platea-qosqo', name: 'Platea', rows: 12, seatsPerRow: 20, multiplier: 1.5, color: '#3B82F6' },
        { id: 'galeria-qosqo', name: 'Galería', rows: 8, seatsPerRow: 25, multiplier: 1.0, color: '#10B981' }
      ]
    },
    'estadio-garcilaso': {
      layout: 'high_altitude_stadium',
      sections: [
        { id: 'tribuna-sur-garcilaso', name: 'Tribuna Sur', rows: 20, seatsPerRow: 200, multiplier: 2.0, color: '#3B82F6' },
        { id: 'popular-norte', name: 'Popular Norte', rows: 35, seatsPerRow: 180, multiplier: 1.0, color: '#10B981' },
        { id: 'oriente-garcilaso', name: 'Tribuna Oriente', rows: 30, seatsPerRow: 150, multiplier: 1.2, color: '#84CC16' },
        { id: 'occidente-garcilaso', name: 'Tribuna Occidente', rows: 30, seatsPerRow: 150, multiplier: 1.2, color: '#6B7280' }
      ]
    }
  }

  useEffect(() => {
    const generateSeats = () => {
      const config = venueConfigs[venueId as keyof typeof venueConfigs]
      if (!config) return []

      const generatedSeats: SeatProps[] = []
      let seatCounter = 1

      config.sections.forEach(section => {
        for (let row = 1; row <= section.rows; row++) {
          for (let seat = 1; seat <= section.seatsPerRow; seat++) {
            const seatId = `${section.id}-R${row}-S${seat}`
            const seatType = section.multiplier >= 3.0 ? 'vip' : 
                           section.multiplier >= 2.0 ? 'premium' : 'general'
            
            generatedSeats.push({
              id: seatId,
              number: `${row}-${seat}`,
              section: section.name,
              type: seatType as any,
              status: Math.random() > 0.8 ? 'occupied' : 'available',
              price: Math.round(basePrice * section.multiplier),
              position: { row, col: seat },
              color: section.color
            })
          }
        }
      })

      return generatedSeats
    }

    setLoading(true)
    setTimeout(() => {
      const newSeats = generateSeats()
      setSeats(newSeats)
      setLoading(false)
    }, 1000)
  }, [venueId, basePrice])

  const handleSeatClick = (seat: SeatProps) => {
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

  const getSeatColor = (seat: SeatProps) => {
    if (seat.status === 'occupied') return 'bg-red-500 cursor-not-allowed'
    if (seat.status === 'reserved') return 'bg-orange-500 cursor-not-allowed'
    if (selectedSeats.includes(seat.id)) return 'bg-accent hover:bg-accent/80 cursor-pointer'
    
    // Usar el color de la sección
    return `hover:opacity-80 cursor-pointer`
  }

  const getSeatStyle = (seat: SeatProps) => {
    if (seat.status === 'occupied') return { backgroundColor: '#EF4444' }
    if (seat.status === 'reserved') return { backgroundColor: '#F97316' }
    if (selectedSeats.includes(seat.id)) return { backgroundColor: '#10B981' }
    
    return { backgroundColor: seat.color || '#6B7280' }
  }

  const seatsBySection = seats.reduce((acc, seat) => {
    if (!acc[seat.section]) acc[seat.section] = []
    acc[seat.section].push(seat)
    return acc
  }, {} as Record<string, SeatProps[]>)

  const renderTheaterLayout = () => (
    <div className="space-y-8">
      {/* Escenario */}
      <div className="text-center mb-8">
        <div className="w-full h-16 bg-gradient-to-r from-accent/30 to-accent/60 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">ESCENARIO</span>
        </div>
      </div>

      {Object.entries(seatsBySection).map(([sectionName, sectionSeats]) => (
        <motion.div
          key={sectionName}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-text-primary border-b border-border-color pb-2">
            {sectionName}
          </h3>
          
          <div className="overflow-x-auto">
            <div className="flex flex-col gap-1 min-w-max">
              {/* Agrupar por filas */}
              {Object.entries(
                sectionSeats.reduce((rowAcc, seat) => {
                  const row = seat.position.row
                  if (!rowAcc[row]) rowAcc[row] = []
                  rowAcc[row].push(seat)
                  return rowAcc
                }, {} as Record<number, SeatProps[]>)
              )
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([row, rowSeats]) => (
                <div key={`${sectionName}-row-${row}`} className="flex items-center gap-2">
                  {/* Número de fila */}
                  <div className="w-8 text-center text-text-secondary text-sm font-medium">
                    {row}
                  </div>
                  
                  {/* Asientos de la fila */}
                  <div className="flex gap-1">
                    {rowSeats
                      .sort((a, b) => a.position.col - b.position.col)
                      .map(seat => (
                        <motion.button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          onMouseEnter={() => setHoveredSeat(seat.id)}
                          onMouseLeave={() => setHoveredSeat(null)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          style={getSeatStyle(seat)}
                          className={`
                            w-8 h-8 rounded text-white text-xs font-bold
                            transition-all duration-200 border border-white/20
                            ${getSeatColor(seat)}
                            ${hoveredSeat === seat.id ? 'ring-2 ring-white' : ''}
                          `}
                          disabled={seat.status === 'occupied' || seat.status === 'reserved'}
                          title={`${seat.section} - Fila ${row} - Asiento ${seat.position.col} - S/ ${seat.price}`}
                        >
                          {seat.position.col}
                        </motion.button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderStadiumLayout = () => (
    <div className="space-y-6">
      {/* Campo/Cancha */}
      <div className="text-center mb-8">
        <div className="w-full h-32 bg-green-600 rounded-lg flex items-center justify-center relative">
          <span className="text-white font-bold text-xl">CAMPO DE JUEGO</span>
          <div className="absolute inset-4 border-2 border-white/50 rounded"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Object.entries(seatsBySection).map(([sectionName, sectionSeats]) => (
          <motion.div
            key={sectionName}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3"
          >
            <h3 className="text-md font-semibold text-text-primary bg-body-bg p-3 rounded-lg border border-border-color">
              {sectionName}
            </h3>
            
            <div className="grid gap-1 max-h-64 overflow-y-auto p-2">
              {sectionSeats
                .sort((a, b) => a.position.row * 1000 + a.position.col - (b.position.row * 1000 + b.position.col))
                .reduce((rows, seat) => {
                  const rowIndex = Math.floor(rows.length / 20)
                  if (!rows[rowIndex]) rows[rowIndex] = []
                  rows[rowIndex].push(seat)
                  return rows
                }, [] as SeatProps[][])
                .map((rowSeats, rowIndex) => (
                  <div key={rowIndex} className="flex gap-1 justify-center">
                    {rowSeats.map(seat => (
                      <motion.button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={getSeatStyle(seat)}
                        className={`
                          w-6 h-6 rounded text-white text-xs font-bold
                          transition-all duration-200
                          ${getSeatColor(seat)}
                        `}
                        disabled={seat.status === 'occupied' || seat.status === 'reserved'}
                        title={`${seat.section} - S/ ${seat.price}`}
                      >
                        {seat.position.col % 10}
                      </motion.button>
                    ))}
                  </div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderArenaLayout = () => (
    <div className="space-y-6">
      {/* Escenario Central */}
      <div className="text-center mb-8">
        <div className="w-64 h-32 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">ESCENARIO</span>
        </div>
      </div>

      {/* Disposición radial */}
      <div className="relative">
        {Object.entries(seatsBySection).map(([sectionName, sectionSeats], sectionIndex) => (
          <motion.div
            key={sectionName}
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            className={`
              absolute transform-gpu
              ${sectionIndex === 0 ? 'top-40 left-1/2 -translate-x-1/2' : ''}
              ${sectionIndex === 1 ? 'top-64 left-1/2 -translate-x-1/2' : ''}
              ${sectionIndex === 2 ? 'top-8 left-8' : ''}
              ${sectionIndex === 3 ? 'top-8 right-8' : ''}
            `}
          >
            <h4 className="text-sm font-semibold text-text-primary mb-2 text-center">
              {sectionName}
            </h4>
            <div className="grid grid-cols-10 gap-1">
              {sectionSeats.slice(0, 100).map(seat => (
                <motion.button
                  key={seat.id}
                  onClick={() => handleSeatClick(seat)}
                  whileHover={{ scale: 1.2 }}
                  style={getSeatStyle(seat)}
                  className={`
                    w-4 h-4 rounded text-white text-xs
                    transition-all duration-200
                    ${getSeatColor(seat)}
                  `}
                  disabled={seat.status === 'occupied' || seat.status === 'reserved'}
                  title={`${seat.section} - S/ ${seat.price}`}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center py-12`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando mapa de asientos...</p>
        </div>
      </div>
    )
  }

  const renderLayout = () => {
    const config = venueConfigs[venueId as keyof typeof venueConfigs]
    if (!config) return <div>Venue no encontrado</div>

    switch (config.layout) {
      case 'traditional_theater':
      case 'cultural_center':
      case 'colonial_theater':
        return renderTheaterLayout()
      case 'stadium':
      case 'high_altitude_stadium':
        return renderStadiumLayout()
      case 'arena':
        return renderArenaLayout()
      default:
        return renderTheaterLayout()
    }
  }

  return (
    <div className={className}>
      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-body-bg rounded-lg border border-border-color">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10B981' }}></div>
          <span className="text-sm text-text-secondary">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-accent rounded"></div>
          <span className="text-sm text-text-secondary">Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-text-secondary">Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-sm text-text-secondary">Reservado</span>
        </div>
      </div>

      {/* Layout del venue */}
      <div className="min-h-96">
        {renderLayout()}
      </div>

      {/* Información adicional */}
      {hoveredSeat && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-body-bg border border-border-color rounded-lg p-3 shadow-lg"
        >
          {(() => {
            const seat = seats.find(s => s.id === hoveredSeat)
            if (!seat) return null
            return (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: seat.color }}></div>
                <span className="text-text-primary font-medium">{seat.section}</span>
                <span className="text-text-secondary">Fila {seat.position.row}</span>
                <span className="text-text-secondary">Asiento {seat.position.col}</span>
                <span className="text-accent font-bold">S/ {seat.price}</span>
              </div>
            )
          })()}
        </motion.div>
      )}
    </div>
  )
}

export default AdvancedSeatPicker
