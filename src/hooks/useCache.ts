'use client'

import { useState, useEffect, useCallback } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiry: number
}

const cache = new Map<string, CacheEntry<unknown>>()

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number // Time to live in milliseconds
    retryOnError?: boolean
  } = {}
) {
  const { ttl = 5 * 60 * 1000, retryOnError = true } = options // Default 5 minutes
  
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (useCache = true) => {
    try {
      setLoading(true)
      setError(null)

      // Check cache first
      if (useCache) {
        const cached = cache.get(key)
        if (cached && Date.now() < cached.timestamp + cached.expiry) {
          setData(cached.data as T)
          setLoading(false)
          return cached.data as T
        }
      }

      // Fetch fresh data
      const result = await fetcher()
      
      // Update cache
      cache.set(key, {
        data: result,
        timestamp: Date.now(),
        expiry: ttl
      })

      setData(result)
      return result

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos'
      setError(errorMessage)
      
      // Try to use stale cache data if available and retryOnError is false
      if (!retryOnError) {
        const cached = cache.get(key)
        if (cached) {
          setData(cached.data as T)
          return cached.data as T
        }
      }
    } finally {
      setLoading(false)
    }
  }, [key, fetcher, ttl, retryOnError])

  const refetch = useCallback(() => fetchData(false), [fetchData])

  const clearCache = useCallback(() => {
    cache.delete(key)
  }, [key])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  }
}

// Utility to clear all cache
export const clearAllCache = () => {
  cache.clear()
}

// Utility to get cache stats
export const getCacheStats = () => {
  const now = Date.now()
  const entries = Array.from(cache.entries())
  
  return {
    totalEntries: entries.length,
    activeEntries: entries.filter(([, entry]) => now < entry.timestamp + entry.expiry).length,
    expiredEntries: entries.filter(([, entry]) => now >= entry.timestamp + entry.expiry).length
  }
}
