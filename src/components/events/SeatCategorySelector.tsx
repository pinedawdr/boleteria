'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Category {
  id: string
  name: string
  price: number
  available: number
  color: string
  description?: string
}

interface SeatCategorySelectorProps {
  categories: Category[]
  selectedCategory?: string
  onCategorySelect: (categoryId: string) => void
  disabled?: boolean
}

export default function SeatCategorySelector({
  categories,
  selectedCategory,
  onCategorySelect,
  disabled = false
}: SeatCategorySelectorProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
        Selecciona tu categoría
      </h3>
      
      <div className="grid gap-3 sm:gap-4">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => !disabled && onCategorySelect(category.id)}
            disabled={disabled || category.available === 0}
            className={`
              relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 text-left
              ${selectedCategory === category.id 
                ? 'border-accent bg-accent/10' 
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800/70'
              }
              ${disabled || category.available === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer transform hover:scale-105'
              }
            `}
          >
            {/* Category Indicator */}
            <div className="flex items-start gap-4">
              <div 
                className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full ${category.color}`}
                style={{ backgroundColor: category.color }}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-white">
                      {category.name}
                    </h4>
                    {category.description && (
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-bold text-accent">
                      S/ {category.price}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">
                      {category.available > 0 
                        ? `${category.available} disponibles`
                        : 'Agotado'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Indicator */}
            {selectedCategory === category.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center"
              >
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
      
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-accent/10 border border-accent/30 rounded-lg"
        >
          <div className="flex items-center gap-2 text-accent text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              Categoría seleccionada. Ahora puedes elegir tus asientos específicos.
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
