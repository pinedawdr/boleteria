'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout'
import { RouteCard } from '@/components/transport/RouteCard'
import { 
  Bus, 
  Ship, 
  Train, 
  Filter,
  Search,
  ArrowRight
} from 'lucide-react'

interface TransportRoute {
  id: string
  origin: string
  destination: string
  vehicle_type: 'bus' | 'boat' | 'train'
  duration: number
  price_from: number
  price_to: number
  departure_times: string[]
  company: string
  rating: number
  image_url: string
  amenities: string[]
}

// Mock data - esto será reemplazado con datos de Supabase
const mockRoutes: TransportRoute[] = [
  {
    id: '1',
    origin: 'Lima',
    destination: 'Cusco',
    vehicle_type: 'bus',
    duration: 22,
    price_from: 50,
    price_to: 120,
    departure_times: ['07:00', '14:00', '21:00'],
    company: 'Cruz del Sur',
    rating: 4.8,
    image_url: '/images/bus-cusco.jpg',
    amenities: ['WiFi', 'A/C', 'Baño', 'Comida']
  },
  {
    id: '2',
    origin: 'Lima',
    destination: 'Arequipa',
    vehicle_type: 'bus',
    duration: 16,
    price_from: 35,
    price_to: 80,
    departure_times: ['08:00', '15:00', '22:00'],
    company: 'Oltursa',
    rating: 4.6,
    image_url: '/images/bus-arequipa.jpg',
    amenities: ['WiFi', 'A/C', 'Baño']
  },
  {
    id: '3',
    origin: 'Paracas',
    destination: 'Islas Ballestas',
    vehicle_type: 'boat',
    duration: 2,
    price_from: 25,
    price_to: 45,
    departure_times: ['08:00', '10:00', '14:00'],
    company: 'Ballesta Tours',
    rating: 4.7,
    image_url: '/images/boat-ballestas.jpg',
    amenities: ['Guía', 'Chaleco salvavidas']
  },
  {
    id: '4',
    origin: 'Cusco',
    destination: 'Machu Picchu',
    vehicle_type: 'train',
    duration: 4,
    price_from: 120,
    price_to: 300,
    departure_times: ['06:30', '07:45', '13:30'],
    company: 'PeruRail',
    rating: 4.9,
    image_url: '/images/train-machupicchu.jpg',
    amenities: ['WiFi', 'Comida', 'Vistas panorámicas']
  },
  {
    id: '5',
    origin: 'Lima',
    destination: 'Iquitos',
    vehicle_type: 'boat',
    duration: 72,
    price_from: 150,
    price_to: 400,
    departure_times: ['18:00'],
    company: 'Amazonia Express',
    rating: 4.4,
    image_url: '/images/boat-amazonia.jpg',
    amenities: ['Camarote', 'Comidas', 'Deck']
  },
  {
    id: '6',
    origin: 'Lima',
    destination: 'Trujillo',
    vehicle_type: 'bus',
    duration: 8,
    price_from: 25,
    price_to: 60,
    departure_times: ['09:00', '14:00', '20:00', '23:00'],
    company: 'Línea',
    rating: 4.3,
    image_url: '/images/bus-trujillo.jpg',
    amenities: ['WiFi', 'A/C', 'Baño']
  }
]

const vehicleIcons = {
  bus: Bus,
  boat: Ship,
  train: Train
}

function TransportPageContent() {
  const searchParams = useSearchParams()
  const [routes] = useState<TransportRoute[]>(mockRoutes)
  const [filteredRoutes, setFilteredRoutes] = useState<TransportRoute[]>(mockRoutes)
  const [searchTerm, setSearchTerm] = useState('')
  const [originFilter, setOriginFilter] = useState('')
  const [destinationFilter, setDestinationFilter] = useState('')
  const [vehicleFilter, setVehicleFilter] = useState('')
  const [priceFilter, setPriceFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Initialize from URL parameters
  useEffect(() => {
    const vehicle = searchParams.get('vehicle')
    if (vehicle) {
      setVehicleFilter(vehicle)
    }
  }, [searchParams])

  useEffect(() => {
    let filtered = routes

    if (searchTerm) {
      filtered = filtered.filter(route => 
        route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.company.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (originFilter) {
      filtered = filtered.filter(route => route.origin === originFilter)
    }

    if (destinationFilter) {
      filtered = filtered.filter(route => route.destination === destinationFilter)
    }

    if (vehicleFilter) {
      filtered = filtered.filter(route => route.vehicle_type === vehicleFilter)
    }

    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number)
      filtered = filtered.filter(route => route.price_from >= min && route.price_to <= max)
    }

    setFilteredRoutes(filtered)
  }, [searchTerm, originFilter, destinationFilter, vehicleFilter, priceFilter, routes])

  return (
    <main className="min-h-screen bg-body-bg">
      <Container className="py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-secondary text-sm mb-6">
          <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
          <ArrowRight className="w-4 h-4 mx-2" />
          <span className="text-primary">Transporte</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 animate-fadeIn">
            Encuentra tu <span className="text-accent">Transporte</span>
          </h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto animate-fadeIn">
            Buses, trenes y barcos para llegar a tu destino favorito en todo el Perú
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card-default mb-6 md:mb-8 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-sm text-text-muted" />
              <input
                type="text"
                placeholder="Buscar por origen, destino o empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-search w-full"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<Filter className="icon-sm" />}
              size="sm"
            >
              Filtros
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border-color animate-fadeIn">
              <select
                value={originFilter}
                onChange={(e) => setOriginFilter(e.target.value)}
                className="input-default"
              >
                <option value="">Origen</option>
                <option value="Lima">Lima</option>
                <option value="Cusco">Cusco</option>
                <option value="Paracas">Paracas</option>
              </select>

              <select
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
                className="input-default"
              >
                <option value="">Destino</option>
                <option value="Cusco">Cusco</option>
                <option value="Arequipa">Arequipa</option>
                <option value="Machu Picchu">Machu Picchu</option>
                <option value="Islas Ballestas">Islas Ballestas</option>
                <option value="Iquitos">Iquitos</option>
                <option value="Trujillo">Trujillo</option>
              </select>

              <select
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                className="input-default"
              >
                <option value="">Tipo de transporte</option>
                <option value="bus">Bus</option>
                <option value="train">Tren</option>
                <option value="boat">Barco</option>
              </select>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="input-default"
              >
                <option value="">Precio</option>
                <option value="0-50">S/ 0 - S/ 50</option>
                <option value="50-100">S/ 50 - S/ 100</option>
                <option value="100-200">S/ 100 - S/ 200</option>
                <option value="200-500">S/ 200+</option>
              </select>
            </div>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-3 mb-8 animate-fadeIn">
          <Button
            onClick={() => setVehicleFilter(vehicleFilter === 'bus' ? '' : 'bus')}
            size="sm"
            variant={vehicleFilter === 'bus' ? 'primary' : 'secondary'}
            leftIcon={<Bus className="icon-sm" />}
          >
            Buses
          </Button>
          <Button
            onClick={() => setVehicleFilter(vehicleFilter === 'train' ? '' : 'train')}
            size="sm"
            variant={vehicleFilter === 'train' ? 'primary' : 'secondary'}
            leftIcon={<Train className="icon-sm" />}
          >
            Trenes
          </Button>
          <Button
            onClick={() => setVehicleFilter(vehicleFilter === 'boat' ? '' : 'boat')}
            size="sm"
            variant={vehicleFilter === 'boat' ? 'primary' : 'secondary'}
            leftIcon={<Ship className="icon-sm" />}
          >
            Barcos
          </Button>
        </div>

        {/* Results - Grid actualizado */}
        <div className="grid-transport gap-4 md:gap-6 cards-grid">
          {filteredRoutes.map((route, index) => {
            const VehicleIcon = vehicleIcons[route.vehicle_type]
            
            return (
              <div 
                key={route.id}
                className="animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <RouteCard
                  route={route}
                  index={index}
                  VehicleIcon={VehicleIcon}
                />
              </div>
            )
          })}
        </div>

        {/* No Results */}
        {filteredRoutes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-text-muted mb-4">No se encontraron rutas de transporte</div>
            <Button
              onClick={() => {
                setSearchTerm('')
                setOriginFilter('')
                setDestinationFilter('')
                setVehicleFilter('')
                setPriceFilter('')
              }}
              variant="secondary"
              size="sm"
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </Container>
    </main>
  )
}

export default function TransportPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TransportPageContent />
    </Suspense>
  )
}
