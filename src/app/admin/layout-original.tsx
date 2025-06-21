'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { 
  LayoutDashboard,
  Users,
  Calendar,
  MapPin,
  Ticket,
  BarChart,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  Shield
} from 'lucide-react'

const adminRoutes = [
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    path: '/admin/users',
    name: 'Usuarios',
    icon: Users
  },
  {
    path: '/admin/events',
    name: 'Eventos',
    icon: Calendar
  },
  {
    path: '/admin/routes',
    name: 'Transporte',
    icon: MapPin
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
    path: '/admin/reports',
    name: 'Reportes',
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
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/unauthorized')
    }
  }, [user, loading, router])

  const getCurrentPageName = () => {
    const route = adminRoutes.find(route => route.path === pathname)
    return route?.name || 'Administración'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-body-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user?.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-body-bg">
      {/* Top Navigation */}
      <nav className="nav-gametime sticky top-0 z-50">
        <div className="max-w-7xl mx-auto responsive-padding">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Breadcrumb */}
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-xl font-bold text-accent hover:text-accent/80 transition-colors">
                Boletería Admin
              </Link>
              <ChevronRight className="w-4 h-4 text-text-secondary" />
              <span className="text-text-primary font-medium">{getCurrentPageName()}</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-body-bg border border-border-color">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-black" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-text-primary">{user.profile?.full_name}</p>
                  <p className="text-xs text-text-secondary">Administrador</p>
                </div>
              </div>

              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-body-bg border-r border-border-color h-[calc(100vh-4rem)] sticky top-16 hidden lg:block">
          <div className="p-4">
            <nav className="space-y-2">
              {adminRoutes.map((route) => {
                const Icon = route.icon
                const isActive = pathname === route.path
                
                return (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-accent text-black font-medium'
                        : 'text-text-secondary hover:text-text-primary hover:bg-hover-bg'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {route.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-body-bg border-t border-border-color">
        <div className="flex justify-around py-2">
          {adminRoutes.slice(0, 5).map((route) => {
            const Icon = route.icon
            const isActive = pathname === route.path
            
            return (
              <Link
                key={route.path}
                href={route.path}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-accent'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{route.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
