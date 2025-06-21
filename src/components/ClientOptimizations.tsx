'use client'

import { useEffect } from 'react'
import { useIntelligentPreload } from '@/hooks/usePerformanceOptimizations'

interface ClientOptimizationsProps {
  children: React.ReactNode
}

export const ClientOptimizations: React.FC<ClientOptimizationsProps> = ({ children }) => {
  const { handleMouseEnter } = useIntelligentPreload()

  useEffect(() => {
    // Prevenir FOUC
    document.documentElement.classList.add('loaded')
    
    // Optimizar scroll
    if ('scrollBehavior' in document.documentElement.style) {
      document.documentElement.style.scrollBehavior = 'smooth'
    }

    // Optimizar iOS
    if (typeof window !== 'undefined') {
      // Mejorar scroll en iOS
      // @ts-expect-error - webkit prefix para compatibility
      document.body.style.webkitOverflowScrolling = 'touch'
      
      // Prevenir zoom en iOS
      const viewport = document.querySelector('meta[name=viewport]')
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
      }
    }

    // OPTIMIZACIONES ULTRA AVANZADAS
    
    // 1. Activar hardware acceleration
    document.body.style.transform = 'translate3d(0,0,0)'
    document.body.style.backfaceVisibility = 'hidden'
    
    // 2. Optimizar painting y compositing
    const main = document.querySelector('main')
    if (main) {
      main.style.contain = 'layout style paint'
      main.style.willChange = 'transform'
    }
    
    // 3. Reducir reflows críticos
    const cards = document.querySelectorAll('.card-modern')
    cards.forEach(card => {
      const element = card as HTMLElement
      element.style.contain = 'layout style'
      element.style.willChange = 'transform'
    })
    
    // 4. Optimizar fuentes críticas
    if (document.fonts) {
      document.fonts.ready.then(() => {
        document.body.classList.add('fonts-optimized')
      })
    }
    
    // 5. Prevenir layout thrashing en scroll
    let ticking = false
    const optimizeScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Aquí se pueden hacer optimizaciones en scroll
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', optimizeScroll, { passive: true })
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', optimizeScroll)
    }
  }, [])

  return (
    <div 
      className="min-h-screen"
      onMouseEnter={() => handleMouseEnter('/events')}
      style={{ contain: 'layout style paint' }}
    >
      {children}
    </div>
  )
}
