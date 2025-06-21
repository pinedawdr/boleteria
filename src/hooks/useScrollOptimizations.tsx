"use client"

// Hook ultra-optimizado para scroll performance
import { useEffect, useCallback, useRef, useState } from 'react'

// Hook para scroll ultra-optimizado
export const useOptimizedScroll = (callback: (scrollY: number) => void, delay: number = 16) => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    let ticking = false
    let lastScrollY = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (Math.abs(currentScrollY - lastScrollY) < 1) return
      
      if (!ticking) {
        requestAnimationFrame(() => {
          callbackRef.current(currentScrollY)
          lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [delay])
}

// Hook para intersection observer optimizado
export const useOptimizedIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const targetRef = useRef<HTMLElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const callbackRef = useRef<((isVisible: boolean) => void) | null>(null)

  const observe = useCallback((callback: (isVisible: boolean) => void) => {
    callbackRef.current = callback

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    }

    observerRef.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (callbackRef.current) {
            callbackRef.current(entry.isIntersecting)
          }
        })
      },
      defaultOptions
    )

    if (targetRef.current) {
      observerRef.current.observe(targetRef.current)
    }
  }, [options])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return { targetRef, observe }
}

// Hook para lazy loading ultra-optimizado
export const useUltraLazyLoading = (threshold: number = 0.1) => {
  const { targetRef, observe } = useOptimizedIntersectionObserver({
    threshold,
    rootMargin: '100px'
  })
  
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    observe((visible) => {
      if (visible && !hasLoaded) {
        setIsVisible(true)
        setHasLoaded(true)
      }
    })
  }, [observe, hasLoaded])

  return { targetRef, isVisible, hasLoaded }
}
