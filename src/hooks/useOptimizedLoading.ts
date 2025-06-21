'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseOptimizedLoadingOptions {
  initialLoading?: boolean
  timeout?: number
  fallbackData?: any
}

export function useOptimizedLoading({
  initialLoading = true,
  timeout = 3000,
  fallbackData = null
}: UseOptimizedLoadingOptions = {}) {
  const [loading, setLoading] = useState(initialLoading)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState(fallbackData)

  const startLoading = useCallback(() => {
    setLoading(true)
    setError(null)
  }, [])

  const stopLoading = useCallback(() => {
    setLoading(false)
  }, [])

  const setErrorWithTimeout = useCallback((errorMessage: string) => {
    setLoading(false)
    setError(errorMessage)
    
    // Auto-clear error después de 5 segundos
    setTimeout(() => {
      setError(null)
    }, 5000)
  }, [])

  // Auto timeout para evitar loading infinito
  useEffect(() => {
    if (loading && timeout > 0) {
      const timer = setTimeout(() => {
        console.warn(`Loading timeout después de ${timeout}ms - usando datos de fallback`)
        setLoading(false)
        if (fallbackData) {
          setData(fallbackData)
        }
      }, timeout)
      
      return () => clearTimeout(timer)
    }
  }, [loading, timeout, fallbackData])

  return {
    loading,
    error,
    data,
    setData,
    startLoading,
    stopLoading,
    setError: setErrorWithTimeout,
    clearError: () => setError(null)
  }
}
