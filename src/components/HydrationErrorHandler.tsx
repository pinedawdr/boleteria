'use client'

import { useEffect } from 'react'

/**
 * Componente que suprime warnings de hidratación específicos en desarrollo
 * y implementa soluciones para problemas comunes de hidratación
 */
export default function HydrationErrorHandler() {
  useEffect(() => {
    // Suprimir warnings específicos de hidratación en desarrollo
    if (process.env.NODE_ENV === 'development') {
      const originalError = console.error
      console.error = (...args) => {
        if (
          typeof args[0] === 'string' &&
          args[0].includes('Hydration failed') ||
          args[0].includes('There was an error while hydrating') ||
          args[0].includes('A tree hydrated but some attributes') ||
          args[0].includes('cz-shortcut-listen')
        ) {
          // No mostrar estos errores específicos en desarrollo
          return
        }
        originalError.apply(console, args)
      }

      return () => {
        console.error = originalError
      }
    }
  }, [])

  useEffect(() => {
    // Manejar atributos problemáticos después de la hidratación
    const handleDOMReady = () => {
      // Remover atributos de extensiones que causan problemas
      const problematicAttributes = [
        'cz-shortcut-listen',
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed'
      ]

      problematicAttributes.forEach(attr => {
        const elements = document.querySelectorAll(`[${attr}]`)
        elements.forEach(el => el.removeAttribute(attr))
      })

      // Asegurar consistencia en el body
      if (document.body) {
        document.body.style.backgroundColor = '#0E0E0F'
        
        // Remover clases problemáticas si existen
        const classList = document.body.classList
        if (classList.contains('cz-shortcut-listen')) {
          classList.remove('cz-shortcut-listen')
        }
      }
    }

    // Ejecutar inmediatamente y después de un delay
    handleDOMReady()
    const timeoutId = setTimeout(handleDOMReady, 500)

    return () => clearTimeout(timeoutId)
  }, [])

  return null
}

/**
 * Wrapper que previene errores de hidratación para componentes específicos
 */
export function HydrationSafeWrapper({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  )
}

/**
 * Hook para detectar si estamos en el cliente después de la hidratación
 */
export function useHydrationSafe() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}
