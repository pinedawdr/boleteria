'use client'

interface FastLoaderProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function FastLoader({ 
  message = 'Cargando...', 
  size = 'md',
  className = ''
}: FastLoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-accent ${sizeClasses[size]}`}></div>
      {message && <span className="text-gray-400 text-sm">{message}</span>}
    </div>
  )
}

// Simple skeleton para cards
export function SkeletonCard({ className = '', height = 'h-24' }: { className?: string, height?: string }) {
  return (
    <div className={`bg-gray-800/50 ${height} ${className} rounded-lg animate-pulse`}>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-700 rounded w-3/4 animate-pulse"></div>
      </div>
    </div>
  )
}

// Grid de skeletons simple
export function SkeletonGrid({ count = 6, columns = 'md:grid-cols-2' }: { count?: number, columns?: string }) {
  return (
    <div className={`grid grid-cols-1 ${columns} gap-6`}>
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} height="h-32" />
      ))}
    </div>
  )
}
