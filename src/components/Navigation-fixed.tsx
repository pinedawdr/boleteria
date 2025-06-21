'use client'

import { useState, memo, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Bus, 
  Calendar, 
  User, 
  Menu, 
  X, 
  LogIn,
  UserPlus,
  LogOut,
  Settings,
  Shield,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Container } from '@/components/layout/Container'
import NotificationDropdown from './NotificationDropdown'
import { useAuth } from '@/hooks/useAuth'

// Memoizar el componente de navegación para evitar re-renders innecesarios
const Navigation = memo(() => {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useAuth()

  const userMenuRef = useRef<HTMLDivElement>(null)

  // Cerrar menú de usuario cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  const navigation = useMemo(() => {
    const baseNavigation = [
      { name: 'Eventos', href: '/events', icon: Calendar, color: 'text-accent' },
      { name: 'Transportes', href: '/transport', icon: Bus, color: 'text-info' },
    ]

    if (user) {
      if (user.isAdmin) {
        baseNavigation.push(
          { name: 'Admin', href: '/admin/dashboard', icon: Shield, color: 'text-warning' }
        )
      } else {
        baseNavigation.push(
          { name: 'Dashboard', href: '/customer/dashboard', icon: User, color: 'text-accent' }
        )
      }
    }

    return baseNavigation
  }, [user])

  const handleLogout = async () => {
    try {
      await signOut()
      setIsUserMenuOpen(false)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav className="nav-gametime fixed top-0 left-0 right-0 z-50">
        <Container size="full" className="px-4">
          <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 lg:h-18 py-2">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo-optimized.svg" 
                alt="Boletería Logo" 
                width={72} 
                height={22}
                className="h-4 w-auto sm:h-5 md:h-6 lg:h-7 transition-opacity duration-300 drop-shadow-lg filter brightness-150"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-8">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2 rounded-lg transition-all duration-300 hover:bg-card-hover hover:shadow-lg group ${
                      isActive(item.href)
                        ? 'bg-body-bg text-accent shadow-lg border border-border'
                        : 'text-text-secondary hover:text-accent'
                    }`}
                  >
                    <Icon className={`icon-sm ${isActive(item.href) ? 'text-accent' : 'text-text-secondary group-hover:text-accent'} transition-colors duration-300`} />
                    <span className="font-bold text-sm lg:text-base">{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center mx-4 lg:mx-8">
              <SearchInput 
                placeholder="Buscar eventos, destinos..." 
                variant="default"
              />
            </div>

            {/* Auth Buttons / User Menu */}
            <div className="hidden lg:flex items-center gap-3">
              <NotificationDropdown />
              
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent border-t-transparent"></div>
              ) : user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-card-hover text-text-primary"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <User className="icon-xs text-accent" />
                    </div>
                    <span className="font-medium">
                      {user.profile?.full_name || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className={`icon-xs transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-body-bg border border-border rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="font-medium text-text-primary">{user.profile?.full_name || 'Usuario'}</p>
                        <p className="text-sm text-text-secondary">{user.email}</p>
                        {user.isAdmin && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/20 text-warning mt-1">
                            <Shield className="w-3 h-3 mr-1" />
                            Administrador
                          </span>
                        )}
                      </div>
                      
                      <Link
                        href={user.isAdmin ? "/admin/dashboard" : "/customer/dashboard"}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-card-hover transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="icon-xs" />
                        Dashboard
                      </Link>
                      
                      <Link
                        href="/customer/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-card-hover transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="icon-xs" />
                        Perfil
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-card-hover transition-colors w-full text-left text-danger"
                      >
                        <LogOut className="icon-xs" />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button 
                      className="btn-secondary"
                      leftIcon={<LogIn className="icon-xs" />}
                    >
                      Ingresar
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button 
                      className="btn-primary"
                      leftIcon={<UserPlus className="icon-xs" />}
                    >
                      Registro
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden text-text-primary hover:bg-card-hover hover:text-accent h-8 w-8 sm:h-10 sm:w-10 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <Menu className="icon-sm" />
            </button>
          </div>
        </Container>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-body-bg/50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-72 sm:w-80 max-w-[90vw] bg-body-bg border-l border-border">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8 p-4 sm:p-6">
              <div className="flex items-center">
                <Image 
                  src="/logo-optimized.svg" 
                  alt="Boletería Logo" 
                  width={72} 
                  height={22}
                  className="h-7 w-auto sm:h-8"
                />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-text-primary h-8 w-8 sm:h-10 sm:w-10 rounded-lg transition-all duration-200 flex items-center justify-center hover:bg-card-hover"
              >
                <X className="icon-sm" />
              </button>
            </div>

            <div className="px-4 sm:px-6">
              {/* Search */}
              <div className="mb-6 sm:mb-8">
                <SearchInput 
                  placeholder="Buscar eventos, destinos..." 
                  variant="mobile"
                />
              </div>

              {/* Navigation Links */}
              <div className="space-y-2 mb-6 sm:mb-8">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-all duration-300 hover:bg-card-hover group ${
                        isActive(item.href)
                          ? 'bg-body-bg text-accent shadow-lg border border-border'
                          : 'text-text-secondary hover:text-accent'
                      }`}
                    >
                      <Icon className={`icon-sm ${item.color} transition-colors duration-300`} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Auth Buttons */}
              <div className="space-y-3">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent border-t-transparent"></div>
                  </div>
                ) : user ? (
                  <>
                    <div className="px-3 py-2 border border-border rounded-lg bg-body-bg/50">
                      <p className="font-medium text-text-primary">{user.profile?.full_name || 'Usuario'}</p>
                      <p className="text-sm text-text-secondary">{user.email}</p>
                      {user.isAdmin && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/20 text-warning mt-1">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </span>
                      )}
                    </div>
                    
                    <Link href="/customer/profile" onClick={() => setIsOpen(false)}>
                      <Button 
                        className="btn-secondary w-full"
                        leftIcon={<Settings className="icon-sm" />}
                      >
                        Perfil
                      </Button>
                    </Link>
                    
                    <Button 
                      className="btn-danger w-full"
                      leftIcon={<LogOut className="icon-sm" />}
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <Button 
                        className="btn-secondary w-full"
                        leftIcon={<LogIn className="icon-sm" />}
                      >
                        Ingresar
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                      <Button 
                        className="btn-primary w-full"
                        leftIcon={<UserPlus className="icon-sm" />}
                      >
                        Registro
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

// Agregar display name para debugging
Navigation.displayName = 'Navigation'

export default Navigation
