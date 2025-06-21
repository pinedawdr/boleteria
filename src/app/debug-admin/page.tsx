'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminLoginDebug() {
  const { user, loading, signIn } = useAuth()
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loginResult, setLoginResult] = useState<any>(null)

  const handleLogin = async () => {
    try {
      const result = await signIn('wdrpineda@gmail.com', 'Admin123!')
      setLoginResult(result)
      
      // Esperar un momento para que se cargue el usuario
      setTimeout(() => {
        setDebugInfo({
          user: user,
          loading: loading,
          timestamp: new Date().toISOString()
        })
      }, 2000)
    } catch (error) {
      setLoginResult({ error })
    }
  }

  useEffect(() => {
    if (user && user.isAdmin) {
      console.log('Usuario admin detectado, redirigiendo...', user)
      router.push('/admin/dashboard')
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-body-bg text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400">
          🔍 Debug del Dashboard Administrativo
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de Control */}
          <div className="bg-body-bg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Panel de Control</h2>
            
            <button
              onClick={handleLogin}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded mb-4"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Login como Admin'}
            </button>

            <div className="space-y-2">
              <p><strong>Estado de carga:</strong> {loading ? 'Cargando' : 'Completado'}</p>
              <p><strong>Usuario autenticado:</strong> {user ? 'Sí' : 'No'}</p>
              <p><strong>Es admin:</strong> {user?.isAdmin ? 'Sí' : 'No'}</p>
              <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
            </div>
          </div>

          {/* Información del Usuario */}
          <div className="bg-body-bg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">Información del Usuario</h2>
            <pre className="bg-body-bg p-4 rounded text-sm overflow-auto">
              {user ? JSON.stringify(user, null, 2) : 'No hay usuario'}
            </pre>
          </div>

          {/* Resultado del Login */}
          <div className="bg-body-bg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Resultado del Login</h2>
            <pre className="bg-body-bg p-4 rounded text-sm overflow-auto">
              {loginResult ? JSON.stringify(loginResult, null, 2) : 'No hay resultado'}
            </pre>
          </div>

          {/* Debug Info */}
          <div className="bg-body-bg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-400">Debug Info</h2>
            <pre className="bg-body-bg p-4 rounded text-sm overflow-auto">
              {debugInfo ? JSON.stringify(debugInfo, null, 2) : 'No hay info de debug'}
            </pre>
          </div>
        </div>

        {/* Enlaces de Navegación */}
        <div className="mt-8 bg-body-bg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-orange-400">Enlaces de Navegación</h2>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
              onClick={() => router.push('/auth/login')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              /auth/login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
