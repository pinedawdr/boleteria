// Servicios para las operaciones administrativas
import { supabase } from './supabase'

export interface DashboardStats {
  totalRevenue: number
  totalTicketsSold: number
  totalEvents: number
  totalRoutes: number
  totalBookings: number
  totalUsers: number
  monthlyGrowth: number
  popularEvent: string
  popularRoute: string
  recentBookings: number
}

export interface AdminEvent {
  id: string
  title: string
  description?: string
  venue_id: string
  venue_name?: string
  artist?: string
  category: string
  start_date: string
  end_date?: string
  price_from: number
  price_to: number
  image_url?: string
  duration?: string
  age_restriction?: string
  rating: number
  status: 'active' | 'sold_out' | 'cancelled'
  total_seats?: number
  sold_seats?: number
  revenue?: number
  created_at: string
}

export interface AdminRoute {
  id: string
  company_id: string
  company_name?: string
  origin: string
  destination: string
  vehicle_type: 'bus' | 'train' | 'boat' | 'plane'
  vehicle_class: string
  departure_time: string
  arrival_time: string
  duration: number
  price_from: number
  price_to: number
  total_seats: number
  available_seats: number
  amenities: string[]
  status: 'active' | 'suspended' | 'maintenance'
  rating: number
  total_bookings?: number
  revenue?: number
  created_at: string
}

export interface AdminBooking {
  id: string
  user_id: string
  user_name?: string
  user_email?: string
  booking_type: 'event' | 'transport'
  event_id?: string
  event_title?: string
  route_id?: string
  route_info?: string
  seat_ids: string[]
  total_amount: number
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  booking_status: 'confirmed' | 'cancelled' | 'used'
  booking_code: string
  qr_code?: string
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  full_name?: string
  phone?: string
  avatar_url?: string
  role: string
  total_bookings: number
  total_spent: number
  last_booking: string
  created_at: string
}

export interface AdminVenue {
  id: string
  name: string
  address: string
  city: string
  capacity: number
  seating_map?: any
  total_events?: number
  created_at: string
}

export interface AdminCompany {
  id: string
  name: string
  description?: string
  rating: number
  phone?: string
  email?: string
  website?: string
  logo_url?: string
  total_routes?: number
  total_bookings?: number
  created_at: string
}

// Servicios del Dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Obtener estadísticas básicas en paralelo
    const [
      { count: totalEvents },
      { count: totalRoutes },
      { count: totalBookings },
      { count: totalUsers },
      { data: bookingsData },
      { count: recentCount }
    ] = await Promise.all([
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('transport_routes').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase
        .from('bookings')
        .select('total_amount, created_at, booking_type')
        .in('status', ['confirmed', 'completed'])
        .not('total_amount', 'is', null),
      supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .in('status', ['confirmed', 'completed'])
    ])

    // Calcular ingresos totales y tickets vendidos
    const totalRevenue = bookingsData?.reduce((sum, booking) => sum + Number(booking.total_amount || 0), 0) || 0
    const totalTicketsSold = bookingsData?.length || 0

    // Calcular crecimiento mensual comparando con el mes anterior
    const lastMonthStart = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    const thisMonthStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    
    const [{ count: lastMonthBookings }, { count: thisMonthBookings }] = await Promise.all([
      supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonthStart)
        .lt('created_at', thisMonthStart)
        .in('status', ['confirmed', 'completed']),
      supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisMonthStart)
        .in('status', ['confirmed', 'completed'])
    ])

    const monthlyGrowth = lastMonthBookings && lastMonthBookings > 0 
      ? Math.round(((thisMonthBookings || 0) - lastMonthBookings) / lastMonthBookings * 100 * 10) / 10
      : thisMonthBookings && thisMonthBookings > 0 ? 100 : 0

    // Obtener evento más popular (por número de reservas)
    const { data: eventBookings } = await supabase
      .from('bookings')
      .select(`
        event_id,
        events!inner(title)
      `)
      .eq('booking_type', 'event')
      .in('status', ['confirmed', 'completed'])
      .not('event_id', 'is', null)

    const eventCounts = eventBookings?.reduce((acc, booking) => {
      const eventId = booking.event_id
      if (eventId) {
        acc[eventId] = (acc[eventId] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

    const popularEventId = Object.keys(eventCounts).sort((a, b) => eventCounts[b] - eventCounts[a])[0]
    const popularEventTitle = eventBookings?.find(b => b.event_id === popularEventId)?.events?.title || 'Sin eventos'

    // Obtener ruta más popular - simplificado para evitar problemas de tipos
    const { data: popularRouteResult } = await supabase
      .from('transport_routes')
      .select('origin, destination')
      .limit(1)

    const popularRoute = popularRouteResult?.[0] 
      ? `${popularRouteResult[0].origin} - ${popularRouteResult[0].destination}`
      : 'Sin rutas'

    return {
      totalRevenue,
      totalTicketsSold,
      totalEvents: totalEvents || 0,
      totalRoutes: totalRoutes || 0,
      totalBookings: totalBookings || 0,
      totalUsers: totalUsers || 0,
      monthlyGrowth,
      popularEvent: popularEventTitle,
      popularRoute,
      recentBookings: recentCount || 0
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw error
  }
}

// Servicios de Eventos
export async function getAdminEvents(
  page = 1, 
  limit = 10, 
  search = '', 
  category = '', 
  status = ''
): Promise<{ events: AdminEvent[], total: number }> {
  try {
    let query = supabase
      .from('events')
      .select(`
        *,
        venues(name),
        event_seats(count),
        bookings(count, total_amount)
      `, { count: 'exact' })

    // Aplicar filtros
    if (search) {
      query = query.or(`title.ilike.%${search}%, artist.ilike.%${search}%`)
    }
    if (category) {
      query = query.eq('category', category)
    }
    if (status) {
      query = query.eq('status', status)
    }

    // Paginación
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) throw error

    const events: AdminEvent[] = data?.map(event => ({
      ...event,
      venue_name: event.venues?.name,
      total_seats: event.event_seats?.length || 0,
      sold_seats: event.bookings?.length || 0,
      revenue: event.bookings?.reduce((sum: number, b: any) => sum + Number(b.total_amount), 0) || 0
    })) || []

    return {
      events,
      total: count || 0
    }
  } catch (error) {
    console.error('Error fetching admin events:', error)
    throw error
  }
}

export async function createEvent(eventData: Partial<AdminEvent>) {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating event:', error)
    throw error
  }
}

export async function updateEvent(id: string, eventData: Partial<AdminEvent>) {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating event:', error)
    throw error
  }
}

export async function deleteEvent(id: string) {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting event:', error)
    throw error
  }
}

// Servicios de Rutas
export async function getAdminRoutes(
  page = 1, 
  limit = 10, 
  search = '', 
  vehicleType = '', 
  status = ''
): Promise<{ routes: AdminRoute[], total: number }> {
  try {
    let query = supabase
      .from('transport_routes')
      .select(`
        *,
        transport_companies(name),
        bookings(count, total_amount)
      `, { count: 'exact' })

    // Aplicar filtros
    if (search) {
      query = query.or(`origin.ilike.%${search}%, destination.ilike.%${search}%`)
    }
    if (vehicleType) {
      query = query.eq('vehicle_type', vehicleType)
    }
    if (status) {
      query = query.eq('status', status)
    }

    // Paginación
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) throw error

    const routes: AdminRoute[] = data?.map(route => ({
      ...route,
      company_name: route.transport_companies?.name,
      total_bookings: route.bookings?.length || 0,
      revenue: route.bookings?.reduce((sum: number, b: any) => sum + Number(b.total_amount), 0) || 0
    })) || []

    return {
      routes,
      total: count || 0
    }
  } catch (error) {
    console.error('Error fetching admin routes:', error)
    throw error
  }
}

export async function createRoute(routeData: Partial<AdminRoute>) {
  try {
    const { data, error } = await supabase
      .from('transport_routes')
      .insert([routeData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating route:', error)
    throw error
  }
}

export async function updateRoute(id: string, routeData: Partial<AdminRoute>) {
  try {
    const { data, error } = await supabase
      .from('transport_routes')
      .update(routeData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating route:', error)
    throw error
  }
}

export async function deleteRoute(id: string) {
  try {
    const { error } = await supabase
      .from('transport_routes')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting route:', error)
    throw error
  }
}

// Servicios de Reservas
export async function getAdminBookings(
  page = 1, 
  limit = 10, 
  search = '', 
  type = '', 
  status = ''
): Promise<{ bookings: AdminBooking[], total: number }> {
  try {
    let query = supabase
      .from('bookings')
      .select(`
        id,
        user_id,
        booking_type,
        event_id,
        route_id,
        seat_ids,
        total_amount,
        payment_status,
        booking_status,
        booking_code,
        qr_code,
        created_at,
        updated_at,
        profiles!user_id(
          full_name,
          email
        ),
        events(
          title
        ),
        transport_routes(
          origin,
          destination
        )
      `, { count: 'exact' })

    // Aplicar filtros
    if (search) {
      query = query.or(`booking_code.ilike.%${search}%`)
    }
    if (type) {
      query = query.eq('booking_type', type)
    }
    if (status) {
      query = query.eq('booking_status', status)
    }

    // Paginación
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) throw error

    const bookings: AdminBooking[] = data?.map(booking => {
      // Manejar relaciones que pueden ser arrays o objetos únicos
      const profile = Array.isArray(booking.profiles) ? booking.profiles[0] : booking.profiles
      const event = Array.isArray(booking.events) ? booking.events[0] : booking.events
      const route = Array.isArray(booking.transport_routes) ? booking.transport_routes[0] : booking.transport_routes

      return {
        ...booking,
        user_name: profile?.full_name || 'Usuario no encontrado',
        user_email: profile?.email || 'Email no disponible',
        event_title: event?.title || 'N/A',
        route_info: route 
          ? `${route.origin} - ${route.destination}`
          : 'N/A'
      }
    }) || []

    return {
      bookings,
      total: count || 0
    }
  } catch (error) {
    console.error('Error fetching admin bookings:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      })
    }
    throw error
  }
}

// Servicios de Usuarios
export async function getAdminUsers(
  page = 1, 
  limit = 10, 
  search = ''
): Promise<{ users: AdminUser[], total: number }> {
  try {
    let query = supabase
      .from('profiles')
      .select(`
        *,
        user_roles(role),
        bookings(count, total_amount, created_at)
      `, { count: 'exact' })

    // Aplicar filtros
    if (search) {
      query = query.or(`full_name.ilike.%${search}%, email.ilike.%${search}%`)
    }

    // Paginación
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) throw error

    const users: AdminUser[] = data?.map(user => ({
      ...user,
      email: user.email || '',
      role: user.user_roles?.[0]?.role || 'customer',
      total_bookings: user.bookings?.length || 0,
      total_spent: user.bookings?.reduce((sum: number, b: { total_amount?: number }) => sum + Number(b.total_amount || 0), 0) || 0,
      last_booking: user.bookings?.[0]?.created_at || ''
    })) || []

    return {
      users,
      total: count || 0
    }
  } catch (error) {
    console.error('Error fetching admin users:', error)
    throw error
  }
}

// Servicios de Venues
export async function getAdminVenues(): Promise<AdminVenue[]> {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select(`
        *,
        events(count)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data?.map(venue => ({
      ...venue,
      total_events: venue.events?.length || 0
    })) || []
  } catch (error) {
    console.error('Error fetching admin venues:', error)
    throw error
  }
}

export async function createVenue(venueData: Partial<AdminVenue>) {
  try {
    const { data, error } = await supabase
      .from('venues')
      .insert([venueData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating venue:', error)
    throw error
  }
}

export async function updateVenue(id: string, venueData: Partial<AdminVenue>) {
  try {
    const { data, error } = await supabase
      .from('venues')
      .update(venueData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating venue:', error)
    throw error
  }
}

export async function deleteVenue(id: string) {
  try {
    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting venue:', error)
    throw error
  }
}

// Servicios de Empresas de Transporte
export async function getAdminCompanies(): Promise<AdminCompany[]> {
  try {
    const { data, error } = await supabase
      .from('transport_companies')
      .select(`
        *,
        transport_routes(count),
        bookings:transport_routes(bookings(count))
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data?.map(company => ({
      ...company,
      total_routes: company.transport_routes?.length || 0,
      total_bookings: 0 // Calcular desde las rutas
    })) || []
  } catch (error) {
    console.error('Error fetching admin companies:', error)
    throw error
  }
}

export async function createCompany(companyData: Partial<AdminCompany>) {
  try {
    const { data, error } = await supabase
      .from('transport_companies')
      .insert([companyData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating company:', error)
    throw error
  }
}

export async function updateCompany(id: string, companyData: Partial<AdminCompany>) {
  try {
    const { data, error } = await supabase
      .from('transport_companies')
      .update(companyData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating company:', error)
    throw error
  }
}

export async function deleteCompany(id: string) {
  try {
    const { error } = await supabase
      .from('transport_companies')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting company:', error)
    throw error
  }
}
