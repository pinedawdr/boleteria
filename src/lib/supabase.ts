import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Admin client (for server-side operations only)
export const getSupabaseAdmin = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      events: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>
      }
      venues: {
        Row: Venue
        Insert: Omit<Venue, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Venue, 'id' | 'created_at' | 'updated_at'>>
      }
      event_seats: {
        Row: EventSeat
        Insert: Omit<EventSeat, 'id' | 'created_at'>
        Update: Partial<Omit<EventSeat, 'id' | 'created_at'>>
      }
      transport_companies: {
        Row: TransportCompany
        Insert: Omit<TransportCompany, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TransportCompany, 'id' | 'created_at' | 'updated_at'>>
      }
      transport_routes: {
        Row: TransportRoute
        Insert: Omit<TransportRoute, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TransportRoute, 'id' | 'created_at' | 'updated_at'>>
      }
      transport_seats: {
        Row: TransportSeat
        Insert: Omit<TransportSeat, 'id' | 'created_at'>
        Update: Partial<Omit<TransportSeat, 'id' | 'created_at'>>
      }
      bookings: {
        Row: Booking
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at'>>
      }
      user_roles: {
        Row: UserRole
        Insert: Omit<UserRole, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserRole, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}

// Enhanced User Profile with roles
export interface Profile {
  id: string
  full_name?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

// User Roles System
export interface UserRole {
  id: string
  user_id: string
  role: 'admin' | 'operator' | 'customer'
  permissions: string[]
  created_at: string
  updated_at: string
}

// Events Types
export interface Event {
  id: string
  title: string
  description?: string
  venue_id: string
  artist?: string
  category: 'concert' | 'theater' | 'sports' | 'conference' | 'club'
  start_date: string
  end_date?: string
  price_from: number
  price_to: number
  image_url?: string
  duration?: string
  age_restriction?: string
  rating: number
  status: 'active' | 'sold_out' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Venue {
  id: string
  name: string
  address: string
  city: string
  capacity: number
  seating_map?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface EventSeat {
  id: string
  event_id: string
  section: string
  row_number: string
  seat_number: string
  price: number
  category: 'general' | 'preferencial' | 'vip' | 'platea'
  status: 'available' | 'occupied' | 'reserved'
  created_at: string
}

// Transport Types
export interface TransportCompany {
  id: string
  name: string
  logo_url?: string
  rating: number
  phone?: string
  email?: string
  created_at: string
  updated_at: string
}

export interface TransportRoute {
  id: string
  company_id: string
  origin: string
  destination: string
  vehicle_type: 'bus' | 'boat' | 'train'
  departure_time: string
  arrival_time: string
  duration: number
  price_from: number
  price_to: number
  total_seats: number
  amenities: string[]
  status: 'active' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface TransportSeat {
  id: string
  route_id: string
  seat_number: string
  seat_type: 'standard' | 'premium' | 'vip'
  price: number
  travel_date: string
  passenger_id?: string
  status: 'available' | 'occupied' | 'reserved'
  created_at: string
}

// Booking Types
export interface Booking {
  id: string
  user_id: string
  booking_type: 'event' | 'transport'
  event_id?: string
  route_id?: string
  booking_date: string
  travel_date?: string
  departure_time?: string
  seat_numbers: string[]
  passenger_info?: Record<string, unknown>
  total_amount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded'
  created_at: string
  updated_at: string
}

export interface TransportRoute {
  id: string
  origin: string
  destination: string
  vehicle_type: 'bus' | 'boat' | 'train'
  duration: number
  price_from: number
  price_to: number
  departure_times: string[]
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'booking' | 'payment' | 'reminder' | 'general'
  read: boolean
  created_at: string
}

export interface Payment {
  id: string
  booking_id: string
  user_id: string
  amount: number
  method: 'mercado_pago' | 'yape' | 'paypal' | 'card'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transaction_id?: string
  created_at: string
  updated_at: string
}

// Auth helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password })
}

export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  })
  return { data, error }
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

// Database helper functions
export const getUserBookings = async (userId: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      events (*),
      transport_routes (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const getUserNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)
  
  return { data, error }
}

export const markNotificationAsRead = async (notificationId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
  
  return { data, error }
}
