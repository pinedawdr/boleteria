'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout/Container'
import { 
  User, 
  Mail, 
  Save, 
  ArrowLeft,
  ArrowRight,
  Shield,
  Calendar,
  MapPin
} from 'lucide-react'

export default function CustomerProfilePage() {
  const { user, loading, updateProfile } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    country: 'Colombia'
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user?.profile) {
      setFormData({
        full_name: user.profile.full_name || '',
        phone: user.profile.phone || '',
        address: user.profile.address || '',
        city: user.profile.city || '',
        country: user.profile.country || 'Colombia'
      })
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const { error } = await updateProfile(formData)
      if (error) {
        console.error('Error updating profile:', error)
        // TODO: Add toast notification
      } else {
        setIsEditing(false)
        // TODO: Add success toast
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (user?.profile) {
      setFormData({
        full_name: user.profile.full_name || '',
        phone: user.profile.phone || '',
        address: user.profile.address || '',
        city: user.profile.city || '',
        country: user.profile.country || 'Colombia'
      })
    }
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-body-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-secondary">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-body-bg">
      <Container className="py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-secondary text-sm mb-6">
          <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
          <ArrowRight className="w-4 h-4 mx-2" />
          <Link href="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link>
          <ArrowRight className="w-4 h-4 mx-2" />
          <span className="text-primary">Mi Perfil</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="shrink-0"
          >
            Volver
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Mi Perfil
            </h1>
            <p className="text-secondary mt-1">
              Gestiona tu información personal y configuración de cuenta
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Profile Card */}
            <div className="card-default p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-4 border-2 border-accent/20">
                  <User className="w-12 h-12 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary">
                  {user.profile?.full_name || 'Usuario'}
                </h3>
                <p className="text-secondary flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
                {user.isAdmin && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning/20 text-warning mt-3">
                    <Shield className="w-4 h-4 mr-2" />
                    Administrador
                  </span>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="card-default p-6">
              <h4 className="text-lg font-semibold text-primary mb-4">Información</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg">
                  <span className="text-secondary flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Miembro desde
                  </span>
                  <span className="text-primary font-medium text-sm">
                    {new Date(user.created_at).toLocaleDateString('es-ES', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg">
                  <span className="text-secondary flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Ubicación
                  </span>
                  <span className="text-primary font-medium text-sm">
                    {formData.city || 'No especificada'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="card-default p-6">
              <h4 className="text-lg font-semibold text-primary mb-4">Acciones</h4>
              <div className="space-y-3">
                <Button
                  variant={isEditing ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full justify-center"
                >
                  {isEditing ? 'Cancelar Edición' : 'Editar Perfil'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/customer/bookings')}
                  className="w-full justify-center"
                >
                  Ver Reservas
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="card-default p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    Información Personal
                  </h2>
                  <p className="text-secondary text-sm mt-1">
                    Actualiza tus datos personales
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Nombre Completo */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      disabled={!isEditing}
                      className="input-default w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="input-default w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Tu número de teléfono"
                    />
                  </div>
                </div>

                {/* Email (readonly) */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="input-default w-full opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-secondary mt-1">
                    El email no se puede modificar
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Ciudad */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      disabled={!isEditing}
                      className="input-default w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Tu ciudad"
                    />
                  </div>

                  {/* País */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      País
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      disabled={!isEditing}
                      className="input-default w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="Perú">Perú</option>
                      <option value="Colombia">Colombia</option>
                      <option value="México">México</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Chile">Chile</option>
                      <option value="Ecuador">Ecuador</option>
                    </select>
                  </div>
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                    className="input-default w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Tu dirección completa"
                  />
                </div>

                {/* Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-6 border-t border-border-color">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={saving}
                      leftIcon={saving ? undefined : <Save className="w-4 h-4" />}
                      className="flex-1 sm:flex-none"
                    >
                      {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 sm:flex-none"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </form>
            </div>

            {/* Security Card */}
            <div className="card-default p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-primary">
                    Seguridad
                  </h3>
                  <p className="text-secondary text-sm mt-1">
                    Administra la seguridad de tu cuenta
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-lg border border-border-color">
                  <div>
                    <h4 className="font-medium text-primary">Cambiar Contraseña</h4>
                    <p className="text-sm text-secondary">Actualiza tu contraseña de acceso</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Cambiar
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-lg border border-border-color">
                  <div>
                    <h4 className="font-medium text-primary">Autenticación de Dos Factores</h4>
                    <p className="text-sm text-secondary">Protege tu cuenta con 2FA</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
              </div>
            </div>

            {/* Activity Card */}
            <div className="card-default p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-primary">
                    Actividad Reciente
                  </h3>
                  <p className="text-secondary text-sm mt-1">
                    Últimas acciones en tu cuenta
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-primary">Perfil actualizado</p>
                    <p className="text-xs text-secondary">Hace 2 horas</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-primary">Sesión iniciada</p>
                    <p className="text-xs text-secondary">Hace 1 día</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-primary">Reserva creada</p>
                    <p className="text-xs text-secondary">Hace 3 días</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
