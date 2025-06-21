'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Container } from '@/components/layout'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)
  
  const { signIn, user, loading: authLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        setError(error.message)
      } else {
        setLoginSuccess(true)
        // No redirigir inmediatamente, esperar a que se cargue el usuario
      }
    } catch {
      setError('Error inesperado. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  // Efecto para manejar la redirección después del login exitoso
  useEffect(() => {
    if (loginSuccess && !authLoading && user) {
      console.log('🚀 Login Success - Ready to redirect:', { 
        email: user.email, 
        isAdmin: user.isAdmin, 
        isOperator: user.isOperator,
        roles: user.roles?.map(r => r.role),
        timestamp: new Date().toISOString()
      })
      
      const urlParams = new URLSearchParams(window.location.search)
      const redirectTo = urlParams.get('redirectTo')
      
      console.log('🎯 Redirect parameters:', { redirectTo, currentUrl: window.location.href })
      
      // Agregar un delay más largo para asegurar sincronización
      setTimeout(() => {
        if (redirectTo) {
          console.log('📍 Redirecting to specified URL:', redirectTo)
          router.push(redirectTo)
        } else {
          // Redirigir según el rol del usuario
          if (user.isAdmin) {
            console.log('👑 Redirecting admin to dashboard')
            router.push('/admin/dashboard')
          } else if (user.isOperator) {
            console.log('🔧 Redirecting operator to dashboard')
            router.push('/operator/dashboard')
          } else {
            console.log('👤 Redirecting customer to dashboard')
            router.push('/dashboard')
          }
        }
      }, 500) // Delay de 500ms para asegurar sincronización
    }
  }, [loginSuccess, authLoading, user, router])

  return (
    <div className="min-h-screen bg-body-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="particles-bg"></div>
      
      <Container className="relative z-10">
        <div className="max-w-md w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-text-secondary">
              Accede a tu cuenta de Boletería
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-default p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-error/20 border border-error/30 text-error px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted icon-sm" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-default pl-10"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted icon-sm" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-default pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-secondary"
                  >
                    {showPassword ? <EyeOff className="icon-sm" /> : <Eye className="icon-sm" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-border-default text-accent focus:ring-accent"
                  />
                  <span className="ml-2 text-sm text-text-secondary">
                    Recordarme
                  </span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-accent hover:text-accent-light"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || (loginSuccess && authLoading)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Iniciando sesión...
                  </>
                ) : loginSuccess && authLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Cargando perfil...
                  </>
                ) : (
                  <>
                    Ingresar
                    <ArrowRight className="icon-sm" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-text-secondary text-sm">
                ¿No tienes una cuenta?{' '}
                <Link href="/auth/register" className="text-accent hover:text-accent-light font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}
