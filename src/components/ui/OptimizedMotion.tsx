// Componente optimizado para reemplazar framer-motion
import React from 'react'

interface OptimizedMotionProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  delay?: number
}

// Componente div optimizado con animaciones CSS puras
export const OptimizedDiv: React.FC<OptimizedMotionProps> = ({ 
  children, 
  className = '', 
  style,
  delay = 0
}) => {
  const animationStyle: React.CSSProperties = {
    ...style,
    animationDelay: delay ? `${delay}s` : undefined,
  }

  return (
    <div 
      className={`animate-fadeIn ${className}`}
      style={animationStyle}
    >
      {children}
    </div>
  )
}

// Componente h1 optimizado
export const OptimizedH1: React.FC<OptimizedMotionProps> = ({ 
  children, 
  className = '', 
  style,
  delay = 0
}) => {
  const animationStyle: React.CSSProperties = {
    ...style,
    animationDelay: delay ? `${delay}s` : undefined,
  }

  return (
    <h1 
      className={`animate-slideUp ${className}`}
      style={animationStyle}
    >
      {children}
    </h1>
  )
}

// Componente p optimizado  
export const OptimizedP: React.FC<OptimizedMotionProps> = ({ 
  children, 
  className = '', 
  style,
  delay = 0
}) => {
  const animationStyle: React.CSSProperties = {
    ...style,
    animationDelay: delay ? `${delay}s` : undefined,
  }

  return (
    <p 
      className={`animate-slideUp ${className}`}
      style={animationStyle}
    >
      {children}
    </p>
  )
}
