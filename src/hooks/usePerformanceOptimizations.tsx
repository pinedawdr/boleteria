// Hook para preloading inteligente de rutas
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const PRELOAD_ROUTES = [
  '/events',
  '/transport', 
  '/dashboard'
]

export const useIntelligentPreload = () => {
  const router = useRouter()

  useEffect(() => {
    // Preload crítico inmediato
    router.prefetch('/events')
    
    // Preload diferido para otras rutas
    const timer = setTimeout(() => {
      PRELOAD_ROUTES.forEach(route => {
        router.prefetch(route)
      })
    }, 2000) // Esperar 2s después de la carga inicial

    return () => clearTimeout(timer)
  }, [router])

  // Preload en hover
  const handleMouseEnter = (route: string) => {
    router.prefetch(route)
  }

  return { handleMouseEnter }
}

// Hook para optimizar imágenes críticas  
export const useCriticalImages = () => {
  useEffect(() => {
    // Preload de imágenes críticas
    const criticalImages = [
      '/images/hero-bg.jpg',
      '/images/events-preview.jpg'
    ]

    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }, [])
}

// Hook ultra-optimizado para mejor rendimiento
export const useAdvancedPerformanceOptimizations = () => {
  useEffect(() => {
    // 1. Optimizar fonts loading
    if (document.fonts) {
      document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded')
      })
    }

    // 2. Activar GPU acceleration en todo el documento
    const optimizeGPU = () => {
      document.body.style.transform = 'translate3d(0,0,0)'
      document.body.style.backfaceVisibility = 'hidden'
      document.body.style.perspective = '1000px'
    }

    // 3. Optimizar scroll performance
    const optimizeScroll = () => {
      document.documentElement.style.scrollBehavior = 'smooth'
      // Mejorar scroll en móviles
      if ('ontouchstart' in window) {
        // @ts-expect-error - webkit prefix para compatibility
        document.body.style.webkitOverflowScrolling = 'touch'
      }
    }

    // 4. Reducir layout thrashing
    const reduceLayoutShifts = () => {
      // Forzar layout containment
      const main = document.querySelector('main')
      if (main) {
        main.style.contain = 'layout style'
        main.style.isolation = 'isolate'
      }
    }

    // Ejecutar optimizaciones de forma no bloqueante
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        optimizeGPU()
        optimizeScroll()
        reduceLayoutShifts()
      })
    } else {
      setTimeout(() => {
        optimizeGPU()
        optimizeScroll() 
        reduceLayoutShifts()
      }, 1)
    }

    // 5. Cleanup para prevenir memory leaks
    return () => {
      document.body.style.transform = ''
      document.body.style.backfaceVisibility = ''
      document.body.style.perspective = ''
    }
  }, [])
}

// Hook para lazy loading de componentes pesados
export const useLazyComponentLoading = (delay: number = 100) => {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return shouldLoad
}
