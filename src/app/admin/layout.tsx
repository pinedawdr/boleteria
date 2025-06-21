'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard,
  Users,
  Calendar,
  MapPin,
  Ticket,
  BarChart,
  Settings,
  ChevronRight,
  Building,
  Truck,
  Menu,
  X
} from 'lucide-react'

const adminRoutes = [
  {
    path: '/admin',
    name: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    path: '/admin/events',
    name: 'Eventos',
    icon: Calendar
  },
  {
    path: '/admin/routes',
    name: 'Rutas',
    icon: MapPin
  },
  {
    path: '/admin/venues',
    name: 'Venues',
    icon: Building
  },
  {
    path: '/admin/companies',
    name: 'Empresas',
    icon: Truck
  },
  {
    path: '/admin/users',
    name: 'Usuarios',
    icon: Users
  },
  {
    path: '/admin/bookings',
    name: 'Reservas',
    icon: Ticket
  },
  {
    path: '/admin/analytics',
    name: 'Analytics',
    icon: BarChart
  },
  {
    path: '/admin/settings',
    name: 'Configuración',
    icon: Settings
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading) {
      console.log('Admin Layout Check:', {
        user: user?.email || 'No user',
        isAdmin: user?.isAdmin,
        isOperator: user?.isOperator,
        roles: user?.roles?.map(r => r.role) || []
      })
      
      if (!user) {
        console.log('No user found, redirecting to login')
        router.push('/auth/login?redirectTo=/admin')
        return
      }
      
      // Dar más tiempo para que se carguen los roles antes de verificar permisos
      const checkPermissions = () => {
        if (!user.isAdmin && !user.isOperator) {
          console.log('User is not admin or operator, redirecting to unauthorized')
          router.push('/unauthorized')
        }
      }
      
      // Verificar inmediatamente si ya tiene permisos
      if (user.isAdmin || user.isOperator) {
        console.log('User has admin/operator permissions')
        return
      }
      
      // Si no tiene permisos, esperar un poco más antes de redirigir
      const timeout = setTimeout(checkPermissions, 2000)
      
      return () => clearTimeout(timeout)
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user?.isAdmin && !user?.isOperator) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-end h-16 px-6 border-b border-gray-700 lg:hidden">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-6 flex-1">
          {adminRoutes.map((route) => {
            const Icon = route.icon
            const isActive = pathname === route.path
            
            return (
              <Link
                key={route.path}
                href={route.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/20 text-accent border-r-2 border-accent'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:border-r-2 hover:border-accent/50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {route.name}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:pl-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-gray-800 border-b border-gray-700">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Panel Administrativo</h1>
          <div className="w-6"></div> {/* Spacer */}
        </div>

        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
