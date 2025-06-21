'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldX, ArrowLeft, Home, Terminal, User } from 'lucide-react'
import { Container } from '@/components/layout'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'

export default function UnauthorizedPage() {
  const { user } = useAuth()
  const [showDebugInfo, setShowDebugInfo] = useState(false)

  useEffect(() => {
    if (user) {
      console.log('Unauthorized page - User info:', {
        email: user.email,
        isAdmin: user.isAdmin,
        isOperator: user.isOperator,
        roles: user.roles?.map(r => r.role) || [],
        profile: user.profile
      })
    }
  }, [user])

  return (
    <div className="min-h-screen bg-body-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="particles-bg"></div>
      
      <Container className="relative z-10">
        <div className="max-w-md w-full mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-default p-8"
          >
            <div className="w-20 h-20 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldX className="icon-xl text-error" />
            </div>
            
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Acceso Denegado
            </h1>
            
            <p className="text-text-secondary mb-6">
              No tienes permisos para acceder a esta página. 
              Esta área está restringida para administradores y operadores.
            </p>

            {user && (
              <div className="mb-6 p-4 bg-info/10 border border-info/20 rounded-lg text-left">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-info" />
                  <span className="text-sm font-medium text-text-primary">Usuario actual:</span>
                </div>
                <p className="text-sm text-text-secondary">{user.email}</p>
                <p className="text-xs text-text-secondary mt-1">
                  Roles: {user.roles?.map(r => r.role).join(', ') || 'Sin roles asignados'}
                </p>
                
                {(!user.roles || user.roles.length === 0) && (
                  <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded">
                    <p className="text-xs text-warning">
                      ⚠️ No tienes roles asignados. Necesitas que un administrador te asigne el rol correspondiente.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <Link
                href="/"
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Home className="icon-sm" />
                Ir al Inicio
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <ArrowLeft className="icon-sm" />
                Volver
              </button>
            </div>

            <button
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1 mx-auto"
            >
              <Terminal className="w-3 h-3" />
              {showDebugInfo ? 'Ocultar' : 'Mostrar'} información técnica
            </button>

            {showDebugInfo && (
              <div className="mt-4 p-3 bg-gray-900 border border-border-color rounded text-left">
                <p className="text-xs text-gray-300 font-mono">
                  Para asignar rol de admin, ejecuta en terminal:
                </p>
                <code className="text-xs text-accent block mt-1">
                  node assign-admin-role.js
                </code>
                <p className="text-xs text-gray-400 mt-2">
                  O consulta la consola del navegador para más detalles.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </Container>
    </div>
  )
}
