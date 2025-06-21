'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Redirigir según el rol del usuario
      if (user.isAdmin) {
        router.push('/admin/dashboard')
      } else if (user.isOperator) {
        router.push('/operator/dashboard')
      } else {
        router.push('/customer/dashboard')
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen bg-body-bg text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p>Redirigiendo al dashboard...</p>
      </div>
    </div>
  )
}
