'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout/Container'
import { 
  User, 
  Mail, 
  ArrowLeft,
  Shield,
  Calendar,
  LogOut
} from 'lucide-react'

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-body-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-body-bg pt-20">
      <Container size="lg" className="py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            leftIcon={<ArrowLeft className="icon-sm" />}
          >
            Volver
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
              Mi Perfil
            </h1>
            <p className="text-text-secondary">
              Información de tu cuenta
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-body-bg rounded-lg border border-border p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {user.profile?.full_name || 'Usuario'}
                </h3>
                <p className="text-text-secondary flex items-center gap-2">
                  <Mail className="icon-xs" />
                  {user.email}
                </p>
                {user.isAdmin && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/20 text-warning mt-2">
                    <Shield className="w-3 h-3 mr-1" />
                    Administrador
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-body-bg/50 rounded-lg">
                  <span className="text-text-secondary flex items-center gap-2">
                    <Calendar className="icon-xs" />
                    Miembro desde
                  </span>
                  <span className="text-text-primary font-medium">
                    {new Date(user.created_at).toLocaleDateString('es-ES', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <Button
                  variant="danger"
                  className="w-full"
                  leftIcon={<LogOut className="icon-sm" />}
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-body-bg rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                Información Personal
              </h2>

              <div className="space-y-6">
                {/* Email (readonly) */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg opacity-50 cursor-not-allowed text-text-primary"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    El email no se puede modificar
                  </p>
                </div>

                {/* Nombre Completo */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={user.profile?.full_name || ''}
                    disabled
                    className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg opacity-50 cursor-not-allowed text-text-primary"
                    placeholder="No especificado"
                  />
                </div>

                {/* Rol */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Tipo de Usuario
                  </label>
                  <input
                    type="text"
                    value={user.isAdmin ? 'Administrador' : 'Cliente'}
                    disabled
                    className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg opacity-50 cursor-not-allowed text-text-primary"
                  />
                </div>

                {/* Info adicional */}
                <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                  <p className="text-sm text-info">
                    Para modificar tu información de perfil, contacta al soporte o usa la página de perfil del cliente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
