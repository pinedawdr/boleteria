'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseAsyncOptions {
  immediate?: boolean
  retryCount?: number
  retryDelay?: number
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { immediate = true, retryCount = 0, retryDelay = 1000 } = options
  
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null
  })

  const retryCountRef = useRef(0)
  const mountedRef = useRef(true)

  const execute = useCallback(async () => {
    if (!mountedRef.current) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const result = await asyncFunction()
      
      if (mountedRef.current) {
        setState({ data: result, loading: false, error: null })
        retryCountRef.current = 0
      }
      
      return result
    } catch (error) {
      if (!mountedRef.current) return

      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      
      // Retry logic
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++
        setTimeout(() => {
          if (mountedRef.current) {
            execute()
          }
        }, retryDelay)
      } else {
        setState({ data: null, loading: false, error: errorMessage })
      }
    }
  }, [asyncFunction, retryCount, retryDelay])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
    retryCountRef.current = 0
  }, [])

  const retry = useCallback(() => {
    retryCountRef.current = 0
    execute()
  }, [execute])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return {
    ...state,
    execute,
    reset,
    retry,
    isRetrying: retryCountRef.current > 0 && state.loading
  }
}

// Hook especializado para consultas de Supabase
export function useSupabaseQuery<T>(
  queryFunction: () => Promise<T>,
  options: UseAsyncOptions & { 
    cacheKey?: string 
    cacheTTL?: number 
  } = {}
) {
  const { cacheKey, cacheTTL = 5 * 60 * 1000, ...asyncOptions } = options
  
  const asyncState = useAsync(queryFunction, {
    ...asyncOptions,
    retryCount: asyncOptions.retryCount ?? 2,
    retryDelay: asyncOptions.retryDelay ?? 2000
  })

  // Agregar lógica de cache si se proporciona cacheKey
  // (esto se puede expandir para integrarse con el hook useCache)

  return asyncState
}

// Hook para manejar múltiples queries en paralelo
export function useParallelQueries<T extends Record<string, () => Promise<unknown>>>(
  queries: T,
  options: UseAsyncOptions = {}
) {
  type QueryResults = {
    [K in keyof T]: T[K] extends () => Promise<infer R> ? AsyncState<R> : never
  }

  const [results, setResults] = useState<QueryResults>(() => {
    const initial = {} as QueryResults
    Object.keys(queries).forEach(key => {
      initial[key as keyof T] = {
        data: null,
        loading: options.immediate !== false,
        error: null
      } as QueryResults[keyof T]
    })
    return initial
  })

  const execute = useCallback(async () => {
    const queryPromises = Object.entries(queries).map(async ([key, queryFn]) => {
      try {
        setResults(prev => ({
          ...prev,
          [key]: { ...prev[key as keyof T], loading: true, error: null }
        }))

        const result = await (queryFn as () => Promise<unknown>)()
        
        setResults(prev => ({
          ...prev,
          [key]: { data: result, loading: false, error: null }
        }))

        return { key, result, error: null }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        
        setResults(prev => ({
          ...prev,
          [key]: { data: null, loading: false, error: errorMessage }
        }))

        return { key, result: null, error: errorMessage }
      }
    })

    return Promise.allSettled(queryPromises)
  }, [queries])

  const retry = useCallback(() => {
    execute()
  }, [execute])

  const retryQuery = useCallback((queryKey: keyof T) => {
    const queryFn = queries[queryKey]
    if (queryFn) {
      setResults(prev => ({
        ...prev,
        [queryKey]: { ...prev[queryKey], loading: true, error: null }
      }))

      queryFn().then(result => {
        setResults(prev => ({
          ...prev,
          [queryKey]: { data: result, loading: false, error: null }
        }))
      }).catch(error => {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        setResults(prev => ({
          ...prev,
          [queryKey]: { data: null, loading: false, error: errorMessage }
        }))
      })
    }
  }, [queries])

  useEffect(() => {
    if (options.immediate !== false) {
      execute()
    }
  }, [execute, options.immediate])

  const loading = Object.values(results).some(result => result.loading)
  const hasError = Object.values(results).some(result => result.error)
  const allLoaded = Object.values(results).every(result => !result.loading)

  return {
    results,
    loading,
    hasError,
    allLoaded,
    execute,
    retry,
    retryQuery
  }
}
