'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function AuthDebugPage() {
  const { user, loading, signIn, signOut } = useAuth()
  const router = useRouter()
  const [authLogs, setAuthLogs] = useState<string[]>([])
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setAuthLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  useEffect(() => {
    addLog(`Auth state: loading=${loading}, user=${user?.email || 'null'}`)
  }, [loading, user])

  const handleTestLogin = async () => {
    setIsLoggingIn(true)
    addLog('Iniciando test de login...')
    
    try {
      const result = await signIn('wdrpineda@gmail.com', 'Admin123!')
      addLog(`Login result: ${result.error ? `Error - ${result.error.message}` : 'Success'}`)
      
      if (!result.error) {
        addLog('Esperando 3 segundos para verificar carga del usuario...')
        setTimeout(() => {
          addLog(`Usuario después de 3s: ${user?.email || 'null'}, isAdmin: ${user?.isAdmin}`)
        }, 3000)
      }
    } catch (error: any) {
      addLog(`Error en login: ${error.message}`)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleTestLogout = async () => {
    addLog('Cerrando sesión...')
    await signOut()
    addLog('Sesión cerrada')
  }

  const handleGoToDashboard = () => {
    addLog('Navegando a /admin/dashboard...')
    router.push('/admin/dashboard')
  }

  const clearLogs = () => {
    setAuthLogs([])
  }

  return (
    <div className="min-h-screen bg-body-bg text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400">
          🔍 Debug de Autenticación
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de Control */}
          <div className="bg-body-bg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Panel de Control</h2>
            
            <div className="space-y-4">
              <button
                onClick={handleTestLogin}
                disabled={isLoggingIn || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {isLoggingIn ? 'Iniciando sesión...' : 'Test Login (Admin)'}
              </button>

              <button
                onClick={handleTestLogout}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                Test Logout
              </button>

              <button
                onClick={handleGoToDashboard}
                disabled={!user}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                Ir a Dashboard Admin
              </button>

              <button
                onClick={clearLogs}
                className="w-full bg-gray-600 hover:bg-body-bg text-white font-bold py-2 px-4 rounded"
              >
                Limpiar Logs
              </button>
            </div>
          </div>

          {/* Estado Actual */}
          <div className="bg-body-bg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">Estado Actual</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Loading:</span>
                <span className={loading ? 'text-yellow-400' : 'text-green-400'}>
                  {loading ? 'Sí' : 'No'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Usuario:</span>
                <span className={user ? 'text-green-400' : 'text-red-400'}>
                  {user ? user.email : 'No autenticado'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Es Admin:</span>
                <span className={user?.isAdmin ? 'text-green-400' : 'text-red-400'}>
                  {user?.isAdmin ? 'Sí' : 'No'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Roles:</span>
                <span className="text-blue-400">
                  {user?.roles?.map(r => r.role).join(', ') || 'Ninguno'}
                </span>
              </div>
            </div>

            {user && (
              <div className="mt-4 p-3 bg-body-bg rounded">
                <h3 className="text-sm font-semibold mb-2">Datos del Usuario:</h3>
                <pre className="text-xs text-gray-300 overflow-auto">
                  {JSON.stringify({
                    id: user.id,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    isOperator: user.isOperator,
                    profile: user.profile,
                    roles: user.roles
                  }, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Logs de Autenticación */}
          <div className="lg:col-span-2 bg-body-bg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Logs de Autenticación</h2>
            
            <div className="bg-body-bg rounded p-4 h-64 overflow-y-auto">
              {authLogs.length === 0 ? (
                <p className="text-gray-500">No hay logs todavía...</p>
              ) : (
                authLogs.map((log, index) => (
                  <div key={index} className="text-sm font-mono text-green-400 mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Enlaces de Navegación */}
        <div className="mt-8 bg-body-bg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-orange-400">Navegación de Prueba</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/auth/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              /auth/login
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              /dashboard
            </button>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              /admin/dashboard
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-600 hover:bg-body-bg text-white font-bold py-2 px-4 rounded"
            >
              Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
