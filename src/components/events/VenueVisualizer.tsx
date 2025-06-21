'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface VenueVisualizerProps {
  venueName: string
  eventType?: 'concert' | 'theater' | 'sports' | 'conference'
  capacity?: number
  className?: string
}

export default function VenueVisualizer({
  venueName,
  eventType = 'concert',
  capacity,
  className = ''
}: VenueVisualizerProps) {
  
  const getVenueLayout = () => {
    switch (eventType) {
      case 'concert':
        return (
          <div className="relative">
            {/* Stage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-12 sm:h-16 bg-gradient-to-r from-purple-600 via-accent to-purple-600 rounded-lg mb-6 sm:mb-8 flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold text-sm sm:text-lg tracking-wider">
                ESCENARIO
              </span>
            </motion.div>
            
            {/* Venue shape - Concert style */}
            <div className="relative">
              {/* VIP Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full h-16 sm:h-20 bg-purple-500/30 border border-purple-400 rounded-lg mb-3 flex items-center justify-center"
              >
                <span className="text-purple-300 font-semibold text-xs sm:text-sm">VIP</span>
              </motion.div>
              
              {/* Preferencial Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full h-20 sm:h-24 bg-yellow-500/30 border border-yellow-400 rounded-lg mb-3 flex items-center justify-center"
              >
                <span className="text-yellow-300 font-semibold text-xs sm:text-sm">PREFERENCIAL</span>
              </motion.div>
              
              {/* General Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full h-24 sm:h-28 bg-green-500/30 border border-green-400 rounded-lg flex items-center justify-center"
              >
                <span className="text-green-300 font-semibold text-xs sm:text-sm">GENERAL</span>
              </motion.div>
            </div>
          </div>
        )
      
      case 'theater':
        return (
          <div className="relative">
            {/* Stage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-3/4 h-8 sm:h-12 bg-gradient-to-r from-red-600 to-red-400 rounded-full mx-auto mb-6 sm:mb-8 flex items-center justify-center"
            >
              <span className="text-white font-bold text-xs sm:text-sm">ESCENARIO</span>
            </motion.div>
            
            {/* Theater seating */}
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={`h-6 sm:h-8 bg-gray-600/30 border border-gray-500 rounded ${
                    i < 2 ? 'w-4/5' : i < 4 ? 'w-full' : 'w-5/6'
                  } mx-auto`}
                />
              ))}
            </div>
          </div>
        )
      
      case 'sports':
        return (
          <div className="relative">
            {/* Playing field */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-20 sm:h-24 bg-gradient-to-r from-green-600 to-green-400 rounded-lg mb-4 flex items-center justify-center"
            >
              <span className="text-white font-bold text-xs sm:text-sm">CAMPO DE JUEGO</span>
            </motion.div>
            
            {/* Stadium sections */}
            <div className="grid grid-cols-2 gap-2">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="h-16 sm:h-20 bg-blue-500/30 border border-blue-400 rounded flex items-center justify-center"
              >
                <span className="text-blue-300 text-xs sm:text-sm">NORTE</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="h-16 sm:h-20 bg-blue-500/30 border border-blue-400 rounded flex items-center justify-center"
              >
                <span className="text-blue-300 text-xs sm:text-sm">SUR</span>
              </motion.div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-12 sm:h-16 bg-gradient-to-r from-accent to-blue-400 rounded-lg mb-6 flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm sm:text-lg">ÁREA PRINCIPAL</span>
            </motion.div>
            
            <div className="grid grid-cols-1 gap-3">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="h-16 sm:h-20 bg-gray-600/30 border border-gray-500 rounded flex items-center justify-center"
              >
                <span className="text-gray-300 text-xs sm:text-sm">ASIENTOS DISPONIBLES</span>
              </motion.div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={`p-4 sm:p-6 bg-gray-900/50 border border-gray-700 rounded-xl ${className}`}>
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
          {venueName}
        </h3>
        {capacity && (
          <p className="text-sm text-gray-400">
            Capacidad: {capacity.toLocaleString()} personas
          </p>
        )}
      </div>
      
      <div className="max-w-md mx-auto">
        {getVenueLayout()}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 sm:mt-6 text-center"
      >
        <p className="text-xs sm:text-sm text-gray-400">
          Vista previa del venue • Selecciona una categoría para ver asientos específicos
        </p>
      </motion.div>
    </div>
  )
}
