'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import OperatorDashboard from '@/components/operator/OperatorDashboard'

export default function OperatorDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      // Verificar si el usuario es operador o admin
      if (!user.isOperator && !user.isAdmin) {
        router.push('/unauthorized')
        return
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-body-bg text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Cargando dashboard de operador...</p>
        </div>
      </div>
    )
  }

  if (!user?.isOperator && !user?.isAdmin) {
    return null // Se redirigirá por el useEffect
  }

  return <OperatorDashboard />
}
