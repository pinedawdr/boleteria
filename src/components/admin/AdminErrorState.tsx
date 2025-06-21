'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface AdminErrorStateProps {
  message?: string
  type?: string
  onRetry?: () => void
}

export default function AdminErrorState({ 
  message = 'Ha ocurrido un error',
  type, // Aceptar pero no usar
  onRetry
}: AdminErrorStateProps) {
  
  const getErrorIcon = () => {
    switch (type) {
      case 'connection':
        return <WifiOff className="w-12 h-12 text-red-400" />
      case 'server':
        return <AlertCircle className="w-12 h-12 text-orange-400" />
      case 'permission':
        return <AlertCircle className="w-12 h-12 text-yellow-400" />
      default:
        return <AlertCircle className="w-12 h-12 text-red-400" />
    }
  }

  const getErrorTitle = () => {
    switch (type) {
      case 'connection':
        return 'Error de Conexión'
      case 'server':
        return 'Error del Servidor'
      case 'permission':
        return 'Sin Permisos'
      default:
        return 'Error'
    }
  }

  const getErrorMessage = () => {
    switch (type) {
      case 'connection':
        return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
      case 'server':
        return 'El servidor no está respondiendo correctamente. Inténtalo más tarde.'
      case 'permission':
        return 'No tienes permisos para acceder a esta información.'
      default:
        return error
    }
  }

  const getRetryButtonText = () => {
    switch (type) {
      case 'connection':
        return 'Reintentar Conexión'
      case 'server':
        return 'Recargar Datos'
      default:
        return 'Intentar de Nuevo'
    }
  }

  return (
    <motion.div 
      className="p-4 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Error Alert Banner */}
        <motion.div 
          className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-medium">{getErrorTitle()}: </span>
              <span>{getErrorMessage()}</span>
            </div>
            {onRetry && (
              <Button
                onClick={onRetry}
                className="bg-red-700 hover:bg-red-600 text-white border-red-600 text-sm px-3 py-1 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reintentar
              </Button>
            )}
          </div>
        </motion.div>

        {/* Fallback Data Notice */}
        {showFallbackData && (
          <motion.div 
            className="bg-yellow-900/30 border border-yellow-500/50 text-yellow-200 px-4 py-3 rounded-lg mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 flex-shrink-0" />
              <span>Mostrando datos de respaldo. Algunos datos pueden no estar actualizados.</span>
            </div>
          </motion.div>
        )}

        {/* Detailed Error Card */}
        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4">
            {getErrorIcon()}
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            {getErrorTitle()}
          </h3>
          
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            {getErrorMessage()}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button
                variant="primary"
                onClick={onRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {getRetryButtonText()}
              </Button>
            )}
            
            <Button
              onClick={() => window.location.reload()}
              className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Recargar Página
            </Button>
          </div>

          {/* Technical details for development */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400">
                Detalles técnicos (desarrollo)
              </summary>
              <pre className="mt-2 p-3 bg-gray-900 rounded text-xs text-gray-400 overflow-auto">
                {error}
              </pre>
            </details>
          )}
        </motion.div>

        {/* Connection Tips */}
        {type === 'connection' && (
          <motion.div 
            className="mt-6 bg-gray-800/30 border border-gray-700/50 rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-sm font-medium text-white mb-2">Consejos para resolver problemas de conexión:</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Verifica tu conexión a internet</li>
              <li>• Comprueba si el servidor está funcionando</li>
              <li>• Intenta recargar la página</li>
              <li>• Si el problema persiste, contacta al administrador</li>
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Hook para manejo unificado de errores
export const useAdminError = () => {
  const [error, setError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<'connection' | 'server' | 'permission' | 'generic'>('generic')

  const setConnectionError = (message: string) => {
    setError(message)
    setErrorType('connection')
  }

  const setServerError = (message: string) => {
    setError(message)
    setErrorType('server')
  }

  const setPermissionError = (message: string) => {
    setError(message)
    setErrorType('permission')
  }

  const setGenericError = (message: string) => {
    setError(message)
    setErrorType('generic')
  }

  const clearError = () => {
    setError(null)
  }

  const handleApiError = (err: unknown) => {
    console.error('API Error:', err)
    
    if (err instanceof TypeError && err.message.includes('fetch')) {
      setConnectionError('Error de conexión con el servidor')
    } else if (err && typeof err === 'object' && 'status' in err) {
      const statusError = err as { status: number; message?: string }
      if (statusError.status === 403 || statusError.status === 401) {
        setPermissionError('No tienes permisos para realizar esta acción')
      } else if (statusError.status >= 500) {
        setServerError('Error interno del servidor')
      } else {
        setGenericError(statusError.message || 'Error inesperado')
      }
    } else if (err instanceof Error) {
      setGenericError(err.message)
    } else {
      setGenericError('Error inesperado')
    }
  }

  return {
    error,
    errorType,
    setConnectionError,
    setServerError,
    setPermissionError,
    setGenericError,
    clearError,
    handleApiError
  }
}
