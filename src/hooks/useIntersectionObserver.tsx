// Hook para lazy loading optimizado
import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverProps {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true
}: UseIntersectionObserverProps = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting
        setIsIntersecting(isVisible)
        
        if (isVisible && triggerOnce && !hasTriggered) {
          setHasTriggered(true)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce, hasTriggered])

  return { 
    elementRef, 
    isIntersecting: triggerOnce ? (hasTriggered || isIntersecting) : isIntersecting
  }
}

// Componente para lazy loading de contenido
interface LazyLoadProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
  threshold?: number
}

export const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  fallback = <div className="animate-pulse bg-body-bg/20 rounded h-48" />,
  className = '',
  threshold = 0.1
}) => {
  const { elementRef, isIntersecting } = useIntersectionObserver({ threshold })

  return (
    <div ref={elementRef as React.RefObject<HTMLDivElement>} className={className}>
      {isIntersecting ? children : fallback}
    </div>
  )
}
