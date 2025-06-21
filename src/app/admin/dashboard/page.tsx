'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function AdminDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // No hay usuario, redirigir al login
        router.push('/auth/login?redirectTo=/admin/dashboard')
        return
      }
      
      // Verificar si el usuario es admin
      if (!user.isAdmin) {
        router.push('/unauthorized')
        return
      }
    }
  }, [user, loading, router])

  // El estado de carga se maneja en el layout, no aquí
  if (loading) {
    return null
  }

  if (!user?.isAdmin) {
    return null // Se redirigirá por el useEffect
  }

  return <AdminDashboard />
}
