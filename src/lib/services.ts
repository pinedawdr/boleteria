import { supabase, Event, Venue, EventSeat, TransportRoute, TransportCompany, TransportSeat, Booking } from '@/lib/supabase'

// Event Functions
export const eventService = {
  // Get all events with pagination
  async getEvents(page = 1, limit = 10, filters?: {
    category?: string
    city?: string
    status?: string
    search?: string
  }) {
    let query = supabase
      .from('events')
      .select(`
        *,
        venues:venue_id (
          id,
          name,
          address,
          city,
          capacity
        )
      `)
      .order('start_date', { ascending: true })

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters?.city) {
      query = query.eq('venues.city', filters.city)
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)

    return { data, error, count }
  },

  // Get single event with seats
  async getEventById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        venues:venue_id (
          id,
          name,
          address,
          city,
          capacity,
          seating_map
        ),
        event_seats (
          id,
          section,
          row_number,
          seat_number,
          price,
          category,
          status
        )
      `)
      .eq('id', id)
      .single()

    return { data, error }
  },

  // Create new event
  async createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single()

    return { data, error }
  },

  // Update event
  async updateEvent(id: string, updates: Partial<Event>) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  },

  // Delete event
  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    return { error }
  },

  // Get available seats for event
  async getAvailableSeats(eventId: string) {
    const { data, error } = await supabase
      .from('event_seats')
      .select('*')
      .eq('event_id', eventId)
      .eq('status', 'available')
      .order('section')
      .order('row_number')
      .order('seat_number')

    return { data, error }
  }
}

// Transport Functions
export const transportService = {
  // Get all routes with filters
  async getRoutes(filters?: {
    origin?: string
    destination?: string
    date?: string
    vehicleType?: string
  }) {
    let query = supabase
      .from('transport_routes')
      .select(`
        *,
        transport_companies:company_id (
          id,
          name,
          logo_url,
          rating
        )
      `)
      .eq('status', 'active')
      .order('departure_time')

    if (filters?.origin) {
      query = query.ilike('origin', `%${filters.origin}%`)
    }

    if (filters?.destination) {
      query = query.ilike('destination', `%${filters.destination}%`)
    }

    if (filters?.vehicleType) {
      query = query.eq('vehicle_type', filters.vehicleType)
    }

    const { data, error } = await query

    return { data, error }
  },

  // Get route with available seats
  async getRouteById(id: string, travelDate: string) {
    const { data: route, error } = await supabase
      .from('transport_routes')
      .select(`
        *,
        transport_companies:company_id (
          id,
          name,
          logo_url,
          rating,
          phone,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error || !route) {
      return { data: null, error }
    }

    // Get available seats for the travel date
    const { data: seats } = await supabase
      .from('transport_seats')
      .select('*')
      .eq('route_id', id)
      .eq('travel_date', travelDate)
      .order('seat_number')

    return { 
      data: { 
        ...route, 
        seats: seats || [] 
      }, 
      error: null 
    }
  },

  // Get available seats for a route on specific date
  async getAvailableSeats(routeId: string, travelDate: string) {
    const { data, error } = await supabase
      .from('transport_seats')
      .select('*')
      .eq('route_id', routeId)
      .eq('travel_date', travelDate)
      .eq('status', 'available')
      .order('seat_number')

    return { data, error }
  }
}

// Booking Functions
export const bookingService = {
  // Create new booking
  async createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'booking_code'>) {
    // Generate unique booking code
    const bookingCode = `BT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        ...booking,
        booking_code: bookingCode
      })
      .select()
      .single()

    // If booking is successful, update seat statuses
    if (data && !error) {
      if (booking.booking_type === 'event') {
        await supabase
          .from('event_seats')
          .update({ status: 'occupied' })
          .in('id', booking.seat_ids)
      } else {
        await supabase
          .from('transport_seats')
          .update({ status: 'occupied', passenger_id: booking.user_id })
          .in('id', booking.seat_ids)
      }
    }

    return { data, error }
  },

  // Get user bookings
  async getUserBookings(userId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        events:event_id (
          id,
          title,
          start_date,
          venues:venue_id (name, address)
        ),
        transport_routes:route_id (
          id,
          origin,
          destination,
          departure_time,
          transport_companies:company_id (name, logo_url)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // Get booking by code
  async getBookingByCode(bookingCode: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        events:event_id (
          id,
          title,
          start_date,
          venues:venue_id (name, address)
        ),
        transport_routes:route_id (
          id,
          origin,
          destination,
          departure_time,
          arrival_time,
          transport_companies:company_id (name, logo_url)
        )
      `)
      .eq('booking_code', bookingCode)
      .single()

    return { data, error }
  },

  // Cancel booking
  async cancelBooking(bookingId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        booking_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single()

    // Free up the seats
    if (data && !error) {
      const booking = data
      if (booking.booking_type === 'event') {
        await supabase
          .from('event_seats')
          .update({ status: 'available' })
          .in('id', booking.seat_ids)
      } else {
        await supabase
          .from('transport_seats')
          .update({ status: 'available', passenger_id: null })
          .in('id', booking.seat_ids)
      }
    }

    return { data, error }
  }
}

// Admin Functions
export const adminService = {
  // Get dashboard stats
  async getDashboardStats() {
    const [
      { count: totalEvents },
      { count: totalBookings },
      { count: totalUsers },
      { data: revenueData }
    ] = await Promise.all([
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('total_amount').eq('payment_status', 'completed')
    ])

    const totalRevenue = revenueData?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0

    return {
      totalEvents,
      totalBookings,
      totalUsers,
      totalRevenue
    }
  },

  // Get all bookings for admin
  async getAllBookings(page = 1, limit = 10, filters?: {
    status?: string
    type?: string
    search?: string
  }) {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        profiles:user_id (full_name),
        events:event_id (title),
        transport_routes:route_id (origin, destination)
      `)
      .order('created_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('booking_status', filters.status)
    }

    if (filters?.type) {
      query = query.eq('booking_type', filters.type)
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)

    return { data, error, count }
  }
}
