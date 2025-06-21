'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Search, 
  Calendar, 
  MapPin, 
  Music, 
  Bus, 
  Train, 
  Ship,
  Star,
  Clock,
  Users,
  X,
  ChevronDown,
  Sliders,
  ArrowRight
} from 'lucide-react'

interface SearchFilters {
  query: string
  type: 'all' | 'events' | 'transport'
  category: string
  location: string
  dateRange: {
    start: string
    end: string
  }
  priceRange: {
    min: number
    max: number
  }
  rating: number
  vehicleType: string[]
  amenities: string[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface SearchResult {
  id: string
  type: 'event' | 'transport'
  title: string
  description: string
  image: string
  location: string
  date: string
  time: string
  price_from: number
  price_to?: number
  rating: number
  reviews: number
  category?: string
  venue?: string
  artist?: string
  origin?: string
  destination?: string
  company?: string
  vehicle_type?: string
  duration?: number
  amenities?: string[]
  featured: boolean
  available_seats?: number
}

// Mock data
const mockResults: SearchResult[] = [
  {
    id: '1',
    type: 'event',
    title: 'Concierto de Marc Anthony',
    description: 'El Rey de la Salsa regresa a Lima con su espectacular show',
    image: '/images/marc-anthony.jpg',
    location: 'Arena Lima, Lima',
    date: '2024-12-20',
    time: '20:00',
    price_from: 80,
    price_to: 350,
    rating: 4.8,
    reviews: 1250,
    category: 'Conciertos',
    venue: 'Arena Lima',
    artist: 'Marc Anthony',
    featured: true,
    available_seats: 1200
  },
  {
    id: '2',
    type: 'transport',
    title: 'Lima - Cusco',
    description: 'Viaje cómodo y seguro hacia la ciudad imperial',
    image: '/images/bus-cusco.jpg',
    location: 'Terminal Javier Prado',
    date: '2024-12-15',
    time: '21:00',
    price_from: 50,
    price_to: 120,
    rating: 4.6,
    reviews: 890,
    company: 'Cruz del Sur',
    vehicle_type: 'bus',
    duration: 22,
    amenities: ['Wi-Fi', 'Aire Acondicionado', 'Asientos Reclinables', 'Baño'],
    featured: false,
    available_seats: 45
  },
  {
    id: '3',
    type: 'event',
    title: 'Festival de Rock Nacional',
    description: 'Los mejores exponentes del rock peruano en una sola noche',
    image: '/images/rock-festival.jpg',
    location: 'Estadio Nacional, Lima',
    date: '2024-12-25',
    time: '18:00',
    price_from: 60,
    price_to: 200,
    rating: 4.5,
    reviews: 650,
    category: 'Festivales',
    venue: 'Estadio Nacional',
    featured: true,
    available_seats: 5000
  },
  {
    id: '4',
    type: 'transport',
    title: 'Lima - Arequipa',
    description: 'Ruta hacia la ciudad blanca con el mejor servicio',
    image: '/images/bus-arequipa.jpg',
    location: 'Terminal Plaza Norte',
    date: '2024-12-18',
    time: '22:30',
    price_from: 70,
    price_to: 150,
    rating: 4.7,
    reviews: 430,
    company: 'Oltursa',
    vehicle_type: 'bus',
    duration: 16,
    amenities: ['Wi-Fi', 'Aire Acondicionado', 'Entretenimiento', 'Comida'],
    featured: false,
    available_seats: 23
  },
  {
    id: '5',
    type: 'transport',
    title: 'Lima - Iquitos',
    description: 'Vuelo directo a la puerta de entrada de la Amazonía',
    image: '/images/flight-iquitos.jpg',
    location: 'Aeropuerto Jorge Chávez',
    date: '2024-12-22',
    time: '08:15',
    price_from: 250,
    price_to: 450,
    rating: 4.4,
    reviews: 320,
    company: 'LATAM',
    vehicle_type: 'plane',
    duration: 2,
    amenities: ['Wi-Fi', 'Entretenimiento', 'Comida', 'Asientos Cómodos'],
    featured: true,
    available_seats: 78
  },
  {
    id: '6',
    type: 'event',
    title: 'Obra de Teatro: Romeo y Julieta',
    description: 'Clásica obra de Shakespeare en una nueva puesta en escena',
    image: '/images/romeo-julieta.jpg',
    location: 'Teatro Británico, Lima',
    date: '2024-12-30',
    time: '19:30',
    price_from: 40,
    price_to: 120,
    rating: 4.3,
    reviews: 180,
    category: 'Teatro',
    venue: 'Teatro Británico',
    featured: false,
    available_seats: 85
  }
]

const categories = [
  'Todos',
  'Conciertos',
  'Festivales',
  'Teatro',
  'Deportes',
  'Conferencias',
  'Gastronómicos'
]

const locations = [
  'Todas las ubicaciones',
  'Lima',
  'Cusco',
  'Arequipa',
  'Trujillo',
  'Piura',
  'Iquitos',
  'Huancayo',
  'Chiclayo'
]

const vehicleTypes = [
  { id: 'bus', name: 'Bus', icon: Bus },
  { id: 'train', name: 'Tren', icon: Train },
  { id: 'boat', name: 'Barco', icon: Ship },
  { id: 'plane', name: 'Avión', icon: Bus }
]

const amenitiesList = [
  'Wi-Fi',
  'Aire Acondicionado',
  'Asientos Reclinables',
  'Baño',
  'Entretenimiento',
  'Comida',
  'Asientos Cómodos'
]

const sortOptions = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price_low', label: 'Precio: Menor a Mayor' },
  { value: 'price_high', label: 'Precio: Mayor a Menor' },
  { value: 'rating', label: 'Mejor Calificación' },
  { value: 'date', label: 'Fecha' },
  { value: 'name', label: 'Nombre A-Z' }
]

export default function UniversalSearch() {
  const [results, setResults] = useState<SearchResult[]>(mockResults)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    category: '',
    location: '',
    dateRange: {
      start: '',
      end: ''
    },
    priceRange: {
      min: 0,
      max: 1000
    },
    rating: 0,
    vehicleType: [],
    amenities: [],
    sortBy: 'relevance',
    sortOrder: 'desc'
  })

  const searchInputRef = useRef<HTMLInputElement>(null)

  // Aplicar filtros
  useEffect(() => {
    let filtered = mockResults

    // Filtro por texto
    if (filters.query) {
      filtered = filtered.filter(result => 
        result.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        result.description.toLowerCase().includes(filters.query.toLowerCase()) ||
        result.location.toLowerCase().includes(filters.query.toLowerCase()) ||
        (result.artist && result.artist.toLowerCase().includes(filters.query.toLowerCase())) ||
        (result.company && result.company.toLowerCase().includes(filters.query.toLowerCase()))
      )
    }

    // Filtro por tipo
    if (filters.type !== 'all') {
      filtered = filtered.filter(result => result.type === filters.type)
    }

    // Filtro por categoría
    if (filters.category && filters.category !== 'Todos') {
      filtered = filtered.filter(result => result.category === filters.category)
    }

    // Filtro por ubicación
    if (filters.location && filters.location !== 'Todas las ubicaciones') {
      filtered = filtered.filter(result => 
        result.location.includes(filters.location) ||
        result.origin === filters.location ||
        result.destination === filters.location
      )
    }

    // Filtro por rango de fechas
    if (filters.dateRange.start) {
      filtered = filtered.filter(result => 
        new Date(result.date) >= new Date(filters.dateRange.start)
      )
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(result => 
        new Date(result.date) <= new Date(filters.dateRange.end)
      )
    }

    // Filtro por precio
    filtered = filtered.filter(result => 
      result.price_from >= filters.priceRange.min && 
      result.price_from <= filters.priceRange.max
    )

    // Filtro por calificación
    if (filters.rating > 0) {
      filtered = filtered.filter(result => result.rating >= filters.rating)
    }

    // Filtro por tipo de vehículo
    if (filters.vehicleType.length > 0) {
      filtered = filtered.filter(result => 
        result.vehicle_type && filters.vehicleType.includes(result.vehicle_type)
      )
    }

    // Filtro por amenidades
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(result => 
        result.amenities && filters.amenities.every(amenity => 
          result.amenities!.includes(amenity)
        )
      )
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (filters.sortBy) {
        case 'price_low':
          comparison = a.price_from - b.price_from
          break
        case 'price_high':
          comparison = b.price_from - a.price_from
          break
        case 'rating':
          comparison = b.rating - a.rating
          break
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'name':
          comparison = a.title.localeCompare(b.title)
          break
        default: // relevance
          comparison = (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

    setResults(filtered)
  }, [filters])

  const handleSearch = (query: string) => {
    setLoading(true)
    setFilters(prev => ({ ...prev, query }))
    
    // Simular delay de búsqueda
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      type: 'all',
      category: '',
      location: '',
      dateRange: { start: '', end: '' },
      priceRange: { min: 0, max: 1000 },
      rating: 0,
      vehicleType: [],
      amenities: [],
      sortBy: 'relevance',
      sortOrder: 'desc'
    })
  }

  const toggleVehicleType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      vehicleType: prev.vehicleType.includes(type)
        ? prev.vehicleType.filter(t => t !== type)
        : [...prev.vehicleType, type]
    }))
  }

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  return (
    <div className="min-h-screen bg-body-bg">
      <div className="max-w-7xl mx-auto py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-secondary text-sm mb-6 px-6">
          <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
          <ArrowRight className="w-4 h-4 mx-2" />
          <span className="text-primary">Búsqueda</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header de búsqueda */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">
            Buscar Eventos y Viajes
          </h1>
          
          {/* Barra de búsqueda principal */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-6 h-6" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar eventos, destinos, artistas, empresas..."
              value={filters.query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-lg placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
          </div>

          {/* Filtros rápidos */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))}
              className={`px-4 py-2 rounded-lg transition-all ${
                filters.type === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-purple-200 hover:bg-white/15'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, type: 'events' }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                filters.type === 'events'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-purple-200 hover:bg-white/15'
              }`}
            >
              <Music className="w-4 h-4" />
              Eventos
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, type: 'transport' }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                filters.type === 'transport'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-purple-200 hover:bg-white/15'
              }`}
            >
              <Bus className="w-4 h-4" />
              Transporte
            </button>
          </div>

          {/* Botón filtros avanzados */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white/10 text-purple-200 px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
            >
              <Sliders className="w-5 h-5" />
              Filtros Avanzados
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex items-center gap-4">
              <span className="text-purple-200 text-sm">
                {results.length} resultado{results.length !== 1 ? 's' : ''}
              </span>
              <select
                value={`${filters.sortBy}_${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('_')
                  setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'asc' | 'desc' }))
                }}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={`${option.value}_desc`}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filtros avanzados expandibles */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 mb-8 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Filtros Avanzados</h3>
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Limpiar filtros
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Categoría */}
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">Categoría</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat === 'Todos' ? '' : cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ubicación */}
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">Ubicación</label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    >
                      {locations.map(loc => (
                        <option key={loc} value={loc === 'Todas las ubicaciones' ? '' : loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fecha inicio */}
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">Fecha desde</label>
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Fecha fin */}
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">Fecha hasta</label>
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Rango de precio */}
                <div className="mt-6">
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Rango de precio: S/ {filters.priceRange.min} - S/ {filters.priceRange.max}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.priceRange.min}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: { ...prev.priceRange, min: parseInt(e.target.value) }
                      }))}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.priceRange.max}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: { ...prev.priceRange, max: parseInt(e.target.value) }
                      }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Calificación mínima */}
                <div className="mt-6">
                  <label className="block text-purple-200 text-sm font-medium mb-2">Calificación mínima</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setFilters(prev => ({ ...prev, rating: rating === prev.rating ? 0 : rating }))}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                          filters.rating >= rating
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-white/10 text-purple-200 hover:bg-white/20'
                        }`}
                      >
                        <Star className="w-4 h-4" />
                        {rating}+
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tipo de vehículo */}
                {filters.type === 'transport' || filters.type === 'all' ? (
                  <div className="mt-6">
                    <label className="block text-purple-200 text-sm font-medium mb-2">Tipo de vehículo</label>
                    <div className="flex flex-wrap gap-2">
                      {vehicleTypes.map(vehicle => {
                        const Icon = vehicle.icon
                        return (
                          <button
                            key={vehicle.id}
                            onClick={() => toggleVehicleType(vehicle.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                              filters.vehicleType.includes(vehicle.id)
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-white/10 text-purple-200 hover:bg-white/20'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {vehicle.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}

                {/* Amenidades */}
                {filters.type === 'transport' || filters.type === 'all' ? (
                  <div className="mt-6">
                    <label className="block text-purple-200 text-sm font-medium mb-2">Amenidades</label>
                    <div className="flex flex-wrap gap-2">
                      {amenitiesList.map(amenity => (
                        <button
                          key={amenity}
                          onClick={() => toggleAmenity(amenity)}
                          className={`px-3 py-2 rounded-lg transition-all ${
                            filters.amenities.includes(amenity)
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-white/10 text-purple-200 hover:bg-white/20'
                          }`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resultados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden hover:scale-105 transition-transform cursor-pointer"
            >
              {/* Imagen */}
              <div className="relative h-48 bg-gradient-to-br from-purple-600 to-pink-600">
                {result.featured && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    Destacado
                  </div>
                )}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-body-bg/50 text-white px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">{result.rating}</span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {result.type === 'event' ? (
                    <Music className="w-5 h-5 text-pink-400" />
                  ) : (
                    <Bus className="w-5 h-5 text-blue-400" />
                  )}
                  <span className="text-purple-200 text-sm capitalize">{result.type === 'event' ? 'Evento' : 'Transporte'}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{result.title}</h3>
                <p className="text-purple-200 text-sm mb-4 line-clamp-2">{result.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <MapPin className="w-4 h-4" />
                    {result.location}
                  </div>
                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(result.date).toLocaleDateString('es-PE')}
                  </div>
                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <Clock className="w-4 h-4" />
                    {result.time}
                  </div>
                  {result.available_seats && (
                    <div className="flex items-center gap-2 text-purple-200 text-sm">
                      <Users className="w-4 h-4" />
                      {result.available_seats} asientos disponibles
                    </div>
                  )}
                </div>

                {/* Amenidades para transporte */}
                {result.type === 'transport' && result.amenities && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {result.amenities.slice(0, 3).map(amenity => (
                      <span key={amenity} className="bg-white/10 text-purple-200 px-2 py-1 rounded text-xs">
                        {amenity}
                      </span>
                    ))}
                    {result.amenities.length > 3 && (
                      <span className="text-purple-300 text-xs">+{result.amenities.length - 3} más</span>
                    )}
                  </div>
                )}

                {/* Precio y acción */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-white">S/ {result.price_from}</span>
                    {result.price_to && result.price_to > result.price_from && (
                      <span className="text-purple-200 text-sm"> - S/ {result.price_to}</span>
                    )}
                  </div>
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                    Ver más
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sin resultados */}
        {results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No se encontraron resultados</h3>
            <p className="text-purple-200 mb-6">Intenta ajustar tus filtros de búsqueda</p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Limpiar filtros
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
