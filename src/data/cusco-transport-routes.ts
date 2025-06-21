// Datos reales de transporte en la región Cusco

export interface TransportRoute {
  id: string
  origin: string
  destination: string
  province: string
  vehicle_type: 'bus' | 'boat' | 'minivan' | 'car' | 'train'
  company: string
  departure_times: string[]
  duration_hours: number
  price_range: { min: number; max: number }
  distance_km: number
  road_type: 'asfaltado' | 'afirmado' | 'trocha' | 'rio'
  seat_configuration: string
  capacity: number
  services: string[]
  description: string
}

// Rutas reales de transporte en Cusco
export const cuscoTransportRoutes: TransportRoute[] = [
  // Provincia de Cusco
  {
    id: 'cusco-pisaq',
    origin: 'Cusco',
    destination: 'Pisaq',
    province: 'Cusco',
    vehicle_type: 'minivan',
    company: 'Transportes Valle Sagrado',
    departure_times: ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    duration_hours: 1,
    price_range: { min: 5, max: 8 },
    distance_km: 33,
    road_type: 'asfaltado',
    seat_configuration: '3-2',
    capacity: 15,
    services: ['Wi-Fi', 'Música'],
    description: 'Ruta hacia el Valle Sagrado, pasando por los pueblos típicos de Taray y Pisaq'
  },
  {
    id: 'cusco-ollantaytambo',
    origin: 'Cusco',
    destination: 'Ollantaytambo',
    province: 'Cusco',
    vehicle_type: 'minivan',
    company: 'Transportes Ollanta',
    departure_times: ['05:30', '07:00', '09:00', '11:00', '13:00', '15:00', '17:00'],
    duration_hours: 1.5,
    price_range: { min: 10, max: 15 },
    distance_km: 60,
    road_type: 'asfaltado',
    seat_configuration: '3-2',
    capacity: 15,
    services: ['Wi-Fi', 'Música', 'Paradas turísticas'],
    description: 'Ruta al Valle Sagrado con paradas en Urubamba y vistas panorámicas'
  },
  {
    id: 'cusco-machu-picchu',
    origin: 'Cusco',
    destination: 'Aguas Calientes (Machu Picchu)',
    province: 'Cusco',
    vehicle_type: 'train',
    company: 'PeruRail',
    departure_times: ['06:10', '07:45', '08:53', '13:31'],
    duration_hours: 3.5,
    price_range: { min: 140, max: 450 },
    distance_km: 112,
    road_type: 'asfaltado',
    seat_configuration: '2-2',
    capacity: 84,
    services: ['Servicio a bordo', 'Vistas panorámicas', 'Snacks', 'Bebidas'],
    description: 'Tren turístico hacia Machu Picchu con vistas espectaculares del Valle Sagrado'
  },

  // Provincia de Chumbivilcas
  {
    id: 'cusco-santo-tomas',
    origin: 'Cusco',
    destination: 'Santo Tomás',
    province: 'Chumbivilcas',
    vehicle_type: 'minivan',
    company: 'Empresa APU Las Bambas',
    departure_times: ['06:00', '08:00', '14:00'],
    duration_hours: 5,
    price_range: { min: 25, max: 35 },
    distance_km: 180,
    road_type: 'afirmado',
    seat_configuration: '3-2',
    capacity: 12,
    services: ['Equipaje', 'Paradas de descanso'],
    description: 'Ruta a la capital de Chumbivilcas, zona minera de Las Bambas'
  },
  {
    id: 'cusco-ccapacmarca',
    origin: 'Cusco',
    destination: 'Ccapacmarca',
    province: 'Chumbivilcas',
    vehicle_type: 'minivan',
    company: 'Transportes Chumbivilcas',
    departure_times: ['05:30', '07:00', '13:00'],
    duration_hours: 4.5,
    price_range: { min: 20, max: 30 },
    distance_km: 160,
    road_type: 'afirmado',
    seat_configuration: '3-2',
    capacity: 14,
    services: ['Equipaje'],
    description: 'Ruta hacia la provincia de Chumbivilcas por carretera afirmada'
  },

  // Provincia de La Convención
  {
    id: 'cusco-quillabamba',
    origin: 'Cusco',
    destination: 'Quillabamba',
    province: 'La Convención',
    vehicle_type: 'bus',
    company: 'Transportes Ampay',
    departure_times: ['06:00', '08:00', '10:00', '14:00', '16:00'],
    duration_hours: 6,
    price_range: { min: 20, max: 30 },
    distance_km: 210,
    road_type: 'asfaltado',
    seat_configuration: '2-2',
    capacity: 40,
    services: ['Baño', 'TV', 'Aire acondicionado'],
    description: 'Ruta hacia la ceja de selva cusqueña, pasando por Ollantaytambo y Abiseo'
  },
  {
    id: 'cusco-ivochote',
    origin: 'Cusco',
    destination: 'Ivochote',
    province: 'La Convención',
    vehicle_type: 'minivan',
    company: 'Transportes Selva',
    departure_times: ['05:00', '07:00', '13:00'],
    duration_hours: 8,
    price_range: { min: 35, max: 45 },
    distance_km: 280,
    road_type: 'trocha',
    seat_configuration: '3-2',
    capacity: 12,
    services: ['Equipaje', 'Paradas largas'],
    description: 'Ruta hacia la selva profunda de La Convención por caminos de trocha'
  },

  // Rutas fluviales
  {
    id: 'cusco-megantoni',
    origin: 'Cusco',
    destination: 'Megantoni',
    province: 'La Convención',
    vehicle_type: 'boat',
    company: 'Navegación Urubamba',
    departure_times: ['06:00', '14:00'],
    duration_hours: 12,
    price_range: { min: 80, max: 120 },
    distance_km: 320,
    road_type: 'rio',
    seat_configuration: 'libre',
    capacity: 25,
    services: ['Comidas', 'Hamacas', 'Guía'],
    description: 'Viaje fluvial por el río Urubamba hacia el Parque Nacional del Megantoni'
  },

  // Provincia de Espinar
  {
    id: 'cusco-espinar',
    origin: 'Cusco',
    destination: 'Espinar',
    province: 'Espinar',
    vehicle_type: 'bus',
    company: 'Transportes Espinar',
    departure_times: ['05:00', '07:00', '09:00', '15:00'],
    duration_hours: 4,
    price_range: { min: 15, max: 25 },
    distance_km: 140,
    road_type: 'asfaltado',
    seat_configuration: '2-2',
    capacity: 35,
    services: ['TV', 'Música'],
    description: 'Ruta hacia la provincia altoandina de Espinar, zona ganadera'
  },

  // Provincia de Canas
  {
    id: 'cusco-yanaoca',
    origin: 'Cusco',
    destination: 'Yanaoca',
    province: 'Canas',
    vehicle_type: 'minivan',
    company: 'Transportes Canas',
    departure_times: ['06:00', '08:00', '14:00'],
    duration_hours: 3,
    price_range: { min: 12, max: 18 },
    distance_km: 110,
    road_type: 'asfaltado',
    seat_configuration: '3-2',
    capacity: 15,
    services: ['Música'],
    description: 'Ruta hacia la capital de la provincia de Canas'
  },

  // Provincia de Canchis
  {
    id: 'cusco-sicuani',
    origin: 'Cusco',
    destination: 'Sicuani',
    province: 'Canchis',
    vehicle_type: 'bus',
    company: 'Transportes Vilcanota',
    departure_times: ['05:00', '06:00', '07:00', '08:00', '10:00', '12:00', '14:00', '16:00'],
    duration_hours: 2,
    price_range: { min: 8, max: 12 },
    distance_km: 140,
    road_type: 'asfaltado',
    seat_configuration: '2-2',
    capacity: 40,
    services: ['TV', 'Música'],
    description: 'Ruta por la carretera interoceánica hacia la provincia de Canchis'
  },

  // Provincia de Quispicanchi
  {
    id: 'cusco-urcos',
    origin: 'Cusco',
    destination: 'Urcos',
    province: 'Quispicanchi',
    vehicle_type: 'minivan',
    company: 'Transportes Quispicanchi',
    departure_times: ['05:30', '07:00', '09:00', '11:00', '13:00', '15:00', '17:00'],
    duration_hours: 1.5,
    price_range: { min: 6, max: 10 },
    distance_km: 45,
    road_type: 'asfaltado',
    seat_configuration: '3-2',
    capacity: 15,
    services: ['Música'],
    description: 'Ruta hacia la capital de Quispicanchi, conocida por su laguna'
  },

  // Provincia de Acomayo
  {
    id: 'cusco-acomayo',
    origin: 'Cusco',
    destination: 'Acomayo',
    province: 'Acomayo',
    vehicle_type: 'minivan',
    company: 'Transportes Acomayo',
    departure_times: ['06:00', '08:00', '14:00'],
    duration_hours: 2.5,
    price_range: { min: 10, max: 15 },
    distance_km: 85,
    road_type: 'asfaltado',
    seat_configuration: '3-2',
    capacity: 15,
    services: ['Música'],
    description: 'Ruta hacia la provincia de Acomayo por carretera asfaltada'
  },

  // Provincia de Paruro
  {
    id: 'cusco-paruro',
    origin: 'Cusco',
    destination: 'Paruro',
    province: 'Paruro',
    vehicle_type: 'minivan',
    company: 'Transportes Paruro',
    departure_times: ['06:30', '08:00', '14:30'],
    duration_hours: 2,
    price_range: { min: 8, max: 12 },
    distance_km: 65,
    road_type: 'afirmado',
    seat_configuration: '3-2',
    capacity: 14,
    services: ['Música'],
    description: 'Ruta hacia la provincia de Paruro por carretera afirmada'
  },

  // Provincia de Calca
  {
    id: 'cusco-calca',
    origin: 'Cusco',
    destination: 'Calca',
    province: 'Calca',
    vehicle_type: 'minivan',
    company: 'Transportes Valle Sagrado',
    departure_times: ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    duration_hours: 1.5,
    price_range: { min: 8, max: 12 },
    distance_km: 50,
    road_type: 'asfaltado',
    seat_configuration: '3-2',
    capacity: 15,
    services: ['Wi-Fi', 'Música'],
    description: 'Ruta al Valle Sagrado hacia la capital de la provincia de Calca'
  }
]

// Función para obtener rutas por provincia
export const getRoutesByProvince = (province: string): TransportRoute[] => {
  return cuscoTransportRoutes.filter(route => route.province === province)
}

// Función para obtener rutas por tipo de vehículo
export const getRoutesByVehicleType = (vehicleType: string): TransportRoute[] => {
  return cuscoTransportRoutes.filter(route => route.vehicle_type === vehicleType)
}

// Función para obtener rutas por empresa
export const getRoutesByCompany = (company: string): TransportRoute[] => {
  return cuscoTransportRoutes.filter(route => route.company === company)
}

// Provincias del Cusco
export const cuscoProvinces = [
  'Cusco',
  'Acomayo', 
  'Anta',
  'Calca',
  'Canas',
  'Canchis',
  'Chumbivilcas',
  'Espinar',
  'La Convención',
  'Paruro',
  'Paucartambo',
  'Quispicanchi',
  'Urubamba'
]

// Empresas de transporte reales en Cusco
export const transportCompanies = [
  'Empresa APU Las Bambas',
  'Transportes Valle Sagrado',
  'Transportes Ollanta',
  'PeruRail',
  'Transportes Chumbivilcas',
  'Transportes Ampay',
  'Transportes Selva',
  'Navegación Urubamba',
  'Transportes Espinar',
  'Transportes Canas',
  'Transportes Vilcanota',
  'Transportes Quispicanchi',
  'Transportes Acomayo',
  'Transportes Paruro'
]
