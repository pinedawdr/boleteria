import { NextRequest, NextResponse } from 'next/server'

// GET /api/routes - Endpoint simplificado para rutas de transporte (usado en landing page)
export async function GET(request: NextRequest) {
  try {
    // Redirigir a la API de admin routes con los mismos parámetros
    const { searchParams } = new URL(request.url)
    const params = new URLSearchParams(searchParams)
    
    // Construir la URL interna
    const adminRoutesUrl = new URL('/api/transport/admin-routes', request.url)
    adminRoutesUrl.search = params.toString()
    
    // Hacer la petición interna
    const response = await fetch(adminRoutesUrl.toString())
    
    if (!response.ok) {
      throw new Error('Error fetching routes from transport API')
    }
    
    const data = await response.json()
    
    // Transformar la respuesta para que sea compatible con la landing page
    const transformedRoutes = (data.routes || []).map((route: {
      id: string;
      origin: string;
      destination: string;
      vehicle_type: string;
      departure_time: string;
      arrival_time: string;
      duration?: number;
      distance_km?: number;
      price_from?: number;
      price_to?: number;
      image_url?: string;
      status: string;
      amenities?: string[];
      transport_companies?: {
        name: string;
      };
    }) => ({
      id: route.id,
      origin: route.origin,
      destination: route.destination,
      vehicle_type: route.vehicle_type,
      company: route.transport_companies?.name || 'Compañía de Transporte',
      departure_time: route.departure_time,
      arrival_time: route.arrival_time,
      duration_hours: route.duration || 0,
      distance_km: route.distance_km || 0,
      price_range: { 
        min: route.price_from || 0, 
        max: route.price_to || route.price_from || 0 
      },
      date: new Date().toISOString().split('T')[0],
      image_url: route.image_url,
      status: route.status,
      services: route.amenities || []
    }))

    return NextResponse.json({
      routes: transformedRoutes,
      total: transformedRoutes.length
    })

  } catch (error) {
    console.error('Routes API Error:', error)
    
    // Fallback con datos vacíos
    return NextResponse.json({
      routes: [],
      total: 0
    })
  }
}
