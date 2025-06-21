'use client'

interface AdminLoadingStateProps {
  message?: string
  type?: string
}

export default function AdminLoadingState({ 
  message = 'Cargando...',
  type // Este parámetro se acepta pero no se usa actualmente
}: AdminLoadingStateProps) {
  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-3 py-12">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
          <span className="text-gray-400 text-sm">{message}</span>
        </div>
      </div>
    </div>
  )
}
