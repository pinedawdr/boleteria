'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TestAdminLogin() {
  const { user, loading, signIn } = useAuth()
  const router = useRouter()
  const [loginStatus, setLoginStatus] = useState<string>('idle')
  const [error, setError] = useState<string>('')

  const handleLogin = async () => {
    setLoginStatus('logging-in')
    setError('')
    
    try {
      const result = await signIn('wdrpineda@gmail.com', 'Admin123!')
      
      if (result.error) {
        setError(result.error.message)
        setLoginStatus('error')
      } else {
        setLoginStatus('success')
      }
    } catch (err) {
      setError('Error inesperado')
      setLoginStatus('error')
    }
  }

  useEffect(() => {
    console.log('User state changed:', { user, loading })
    
    if (user && user.isAdmin) {
      console.log('Admin user detected, redirecting to dashboard...')
      setLoginStatus('redirecting')
      router.push('/admin/dashboard')
    }
  }, [user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-body-bg text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Cargando autenticación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-body-bg text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400">
          🧪 Test de Login Administrativo
        </h1>
        
        <div className="bg-body-bg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Estado Actual</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Estado de login:</span>
              <span className={`font-bold ${
                loginStatus === 'success' ? 'text-green-400' :
                loginStatus === 'error' ? 'text-red-400' :
                loginStatus === 'logging-in' ? 'text-yellow-400' :
                loginStatus === 'redirecting' ? 'text-blue-400' :
                'text-gray-400'
              }`}>
                {loginStatus}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Loading:</span>
              <span className={loading ? 'text-yellow-400' : 'text-green-400'}>
                {loading ? 'Sí' : 'No'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Usuario autenticado:</span>
              <span className={user ? 'text-green-400' : 'text-red-400'}>
                {user ? 'Sí' : 'No'}
              </span>
            </div>
            
            {user && (
              <>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="text-white">{user.email}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Es Admin:</span>
                  <span className={user.isAdmin ? 'text-green-400' : 'text-red-400'}>
                    {user.isAdmin ? 'Sí' : 'No'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Roles:</span>
                  <span className="text-white">
                    {user.roles?.map(r => r.role).join(', ') || 'Ninguno'}
                  </span>
                </div>
              </>
            )}
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400">
              Error: {error}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={loading || loginStatus === 'logging-in'}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {loginStatus === 'logging-in' ? 'Iniciando sesión...' : 'Login como Admin'}
          </button>

          {user && user.isAdmin && (
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Ir al Dashboard Manualmente
            </button>
          )}

          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-600 hover:bg-body-bg text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Volver al Inicio
          </button>
        </div>

        {user && (
          <div className="mt-8 bg-body-bg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Debug Info</h3>
            <pre className="bg-body-bg p-4 rounded text-sm overflow-auto text-green-400">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
