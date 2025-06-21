'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, Profile, UserRole } from '@/lib/supabase'

export interface AuthUser extends User {
  profile?: Profile
  roles?: UserRole[]
  isAdmin?: boolean
  isOperator?: boolean
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await loadUserWithProfile(session.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email || 'no user')
        
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            setLoading(true)
            await loadUserWithProfile(session.user)
          } else if (event === 'SIGNED_OUT') {
            setUser(null)
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            await loadUserWithProfile(session.user)
          } else if (session?.user) {
            await loadUserWithProfile(session.user)
          } else {
            setUser(null)
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
          setUser(null)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserWithProfile = async (authUser: User) => {
    try {
      console.log('Loading user profile for:', authUser.email)
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      // Get user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', authUser.id)

      if (rolesError) {
        console.error('Error fetching roles:', rolesError)
      }

      console.log('User roles loaded:', roles)

      const enhancedUser: AuthUser = {
        ...authUser,
        profile: profile || undefined,
        roles: roles || [],
        isAdmin: roles?.some(role => role.role === 'admin') || false,
        isOperator: roles?.some(role => ['admin', 'operator'].includes(role.role)) || false
      }

      console.log('Enhanced user:', {
        email: enhancedUser.email,
        isAdmin: enhancedUser.isAdmin,
        isOperator: enhancedUser.isOperator,
        rolesCount: enhancedUser.roles?.length || 0
      })

      setUser(enhancedUser)
    } catch (error) {
      console.error('Error loading user profile:', error)
      setUser(authUser as AuthUser)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      // Si el login es exitoso, esperar un momento para que se procese la sesión
      if (!error && data.session) {
        console.log('Login successful, waiting for session to be established...')
        // Dar tiempo para que se establezca la sesión
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      return { data, error }
    } catch (error) {
      console.error('Error in signIn:', error)
      return { data: null, error }
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    // Create profile after signup
    if (data.user && !error) {
      await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: fullName
        })

      // Assign default customer role
      await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: 'customer',
          permissions: ['read:events', 'read:transport', 'create:bookings']
        })
    }

    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    setUser(null)
    return { error }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      setUser(prev => prev ? { ...prev, profile: data } : null)
    }

    return { data, error }
  }

  const hasPermission = (permission: string) => {
    if (!user?.roles) return false
    return user.roles.some(role => 
      role.permissions.includes(permission) || 
      role.role === 'admin' // Admin has all permissions
    )
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    hasPermission
  }
}

// Hook for checking if user has specific role
export function useRole(requiredRole: 'admin' | 'operator' | 'customer') {
  const { user, loading } = useAuth()
  
  const hasRole = user?.roles?.some(role => role.role === requiredRole) || false
  const isAuthorized = requiredRole === 'customer' ? true : hasRole

  return { hasRole, isAuthorized, loading }
}

// Hook for admin-only access
export function useAdminAuth() {
  const { user, loading } = useAuth()
  const isAdmin = user?.isAdmin || false
  
  return { user, isAdmin, loading }
}
