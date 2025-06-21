// Datos reales de transporte en la región Cusco

export interface TransportCompany {
  id: string
  name: string
  logo?: string
  vehicles: VehicleType[]
  routes: string[]
  rating: number
  founded: number
  description: string
}

export interface VehicleType {
  type: 'minivan' | 'bus' | 'boat' | 'train' | 'combi' | 'auto'
  capacity: number
  comfort_level: 'basico' | 'turistico' | 'ejecutivo' | 'premium'
  amenities: string[]
  seat_layout: SeatLayout
}

export interface SeatLayout {
  rows: number
  cols: number
  configuration: 'minivan' | 'bus_2x2' | 'bus_2x1' | 'boat' | 'train' | 'auto'
  blocked_seats?: number[] // Asientos no disponibles (motor, baño, etc.)
}

export interface CuscoRoute {
  id: string
  origin: string
  destination: string
  distance_km: number
  duration_hours: number
  difficulty: 'facil' | 'moderado' | 'dificil'
  road_type: 'asfaltado' | 'afirmado' | 'trocha'
  altitude_max: number
  companies: string[] // IDs of companies
  base_price: number
  scenic_value: number // 1-10
  description: string
  stops: string[]
}

// Empresas reales de transporte en Cusco
export const CUSCO_TRANSPORT_COMPANIES: TransportCompany[] = [
  {
    id: 'apu-bambas',
    name: 'Transportes APU Las Bambas',
    rating: 4.2,
    founded: 2008,
    description: 'Empresa especializada en rutas hacia Santo Tomás y zonas mineras',
    vehicles: [
      {
        type: 'minivan',
        capacity: 12,
        comfort_level: 'basico',
        amenities: ['Asientos reclinables', 'Música'],
        seat_layout: {
          rows: 4,
          cols: 3,
          configuration: 'minivan'
        }
      },
      {
        type: 'auto',
        capacity: 4,
        comfort_level: 'turistico',
        amenities: ['Aire acondicionado', 'Música', 'Cargador USB'],
        seat_layout: {
          rows: 2,
          cols: 2,
          configuration: 'auto'
        }
      }
    ],
    routes: ['cusco-santo-tomas', 'cusco-espinar', 'cusco-yauri']
  },
  {
    id: 'selva-sur',
    name: 'Transportes Selva Sur',
    rating: 4.5,
    founded: 1995,
    description: 'Conexiones hacia la selva cusqueña y Madre de Dios',
    vehicles: [
      {
        type: 'bus',
        capacity: 40,
        comfort_level: 'turistico',
        amenities: ['Aire acondicionado', 'Baño', 'TV', 'Reclinado 140°'],
        seat_layout: {
          rows: 10,
          cols: 4,
          configuration: 'bus_2x2',
          blocked_seats: [39, 40] // Baño al fondo
        }
      }
    ],
    routes: ['cusco-quillabamba', 'cusco-kiteni', 'cusco-ivochote']
  },
  {
    id: 'amazonia-expeditions',
    name: 'Amazonía River Expeditions',
    rating: 4.8,
    founded: 2010,
    description: 'Transporte fluvial especializado hacia Megantoni y reserva comunal',
    vehicles: [
      {
        type: 'boat',
        capacity: 20,
        comfort_level: 'premium',
        amenities: ['Chaleco salvavidas', 'Techo', 'Guía naturalista', 'Snacks'],
        seat_layout: {
          rows: 5,
          cols: 4,
          configuration: 'boat'
        }
      }
    ],
    routes: ['cusco-megantoni', 'quillabamba-megantoni']
  },
  {
    id: 'inca-rail',
    name: 'Inca Rail',
    rating: 4.9,
    founded: 2009,
    description: 'Servicio de tren premium hacia Machu Picchu',
    vehicles: [
      {
        type: 'train',
        capacity: 42,
        comfort_level: 'premium',
        amenities: ['Ventanas panorámicas', 'Servicio de comida', 'Bar', 'Wi-Fi'],
        seat_layout: {
          rows: 21,
          cols: 2,
          configuration: 'train'
        }
      }
    ],
    routes: ['cusco-machupicchu', 'ollantaytambo-aguas-calientes']
  },
  {
    id: 'civa-cusco',
    name: 'CIVA Cusco',
    rating: 4.3,
    founded: 1992,
    description: 'Rutas interprovinciales y conexiones hacia Lima',
    vehicles: [
      {
        type: 'bus',
        capacity: 44,
        comfort_level: 'ejecutivo',
        amenities: ['Cama 160°', 'Baño', 'TV individual', 'Manta', 'Almohada'],
        seat_layout: {
          rows: 11,
          cols: 4,
          configuration: 'bus_2x2',
          blocked_seats: [43, 44] // Baño
        }
      }
    ],
    routes: ['cusco-lima', 'cusco-arequipa', 'cusco-puno']
  },
  {
    id: 'turismo-imperial',
    name: 'Turismo Imperial',
    rating: 4.0,
    founded: 1985,
    description: 'Combis y minivanes hacia pueblos del Valle Sagrado',
    vehicles: [
      {
        type: 'combi',
        capacity: 16,
        comfort_level: 'basico',
        amenities: ['Música', 'Ventanas grandes'],
        seat_layout: {
          rows: 5,
          cols: 3,
          configuration: 'minivan',
          blocked_seats: [1] // Asiento del copiloto
        }
      }
    ],
    routes: ['cusco-pisac', 'cusco-urubamba', 'cusco-ollantaytambo']
  }
];

// Rutas reales en la región Cusco
export const CUSCO_ROUTES: CuscoRoute[] = [
  {
    id: 'cusco-santo-tomas',
    origin: 'Cusco',
    destination: 'Santo Tomás',
    distance_km: 320,
    duration_hours: 6.5,
    difficulty: 'dificil',
    road_type: 'afirmado',
    altitude_max: 4800,
    companies: ['apu-bambas'],
    base_price: 35,
    scenic_value: 8,
    description: 'Ruta hacia la zona minera, paisajes de puna y nevados',
    stops: ['Combapata', 'Yanaoca', 'Pampamarca']
  },
  {
    id: 'cusco-quillabamba',
    origin: 'Cusco',
    destination: 'Quillabamba',
    distance_km: 210,
    duration_hours: 4.5,
    difficulty: 'moderado',
    road_type: 'asfaltado',
    altitude_max: 4200,
    companies: ['selva-sur'],
    base_price: 25,
    scenic_value: 9,
    description: 'Descenso hacia la ceja de selva, clima tropical',
    stops: ['Ollantaytambo', 'Alfamayo', 'Santa María']
  },
  {
    id: 'quillabamba-megantoni',
    origin: 'Quillabamba',
    destination: 'Megantoni',
    distance_km: 45,
    duration_hours: 2.5,
    difficulty: 'dificil',
    road_type: 'trocha',
    altitude_max: 1200,
    companies: ['amazonia-expeditions'],
    base_price: 80,
    scenic_value: 10,
    description: 'Navegación por río Urubamba hacia la reserva comunal',
    stops: ['Puerto Inca', 'Timpia']
  },
  {
    id: 'cusco-machupicchu',
    origin: 'Cusco',
    destination: 'Machu Picchu',
    distance_km: 75,
    duration_hours: 3.5,
    difficulty: 'facil',
    road_type: 'ferrocarril',
    altitude_max: 3400,
    companies: ['inca-rail'],
    base_price: 180,
    scenic_value: 10,
    description: 'Viaje en tren por el Valle Sagrado hasta Aguas Calientes',
    stops: ['Poroy', 'Ollantaytambo', 'Aguas Calientes']
  },
  {
    id: 'cusco-pisac',
    origin: 'Cusco',
    destination: 'Pisac',
    distance_km: 32,
    duration_hours: 1.0,
    difficulty: 'facil',
    road_type: 'asfaltado',
    altitude_max: 3600,
    companies: ['turismo-imperial'],
    base_price: 8,
    scenic_value: 7,
    description: 'Ruta corta hacia el Valle Sagrado y mercado de Pisac',
    stops: ['Tambomachay', 'Puca Pucara']
  },
  {
    id: 'cusco-espinar',
    origin: 'Cusco',
    destination: 'Espinar',
    distance_km: 240,
    duration_hours: 5.0,
    difficulty: 'moderado',
    road_type: 'asfaltado',
    altitude_max: 4200,
    companies: ['apu-bambas'],
    base_price: 30,
    scenic_value: 6,
    description: 'Ruta hacia la provincia de Espinar, zona ganadera',
    stops: ['Checacupe', 'Marangani', 'Sicuani']
  },
  {
    id: 'cusco-puno',
    origin: 'Cusco',
    destination: 'Puno',
    distance_km: 390,
    duration_hours: 7.0,
    difficulty: 'moderado',
    road_type: 'asfaltado',
    altitude_max: 4200,
    companies: ['civa-cusco'],
    base_price: 45,
    scenic_value: 8,
    description: 'Ruta altiplánica hacia el Lago Titicaca',
    stops: ['Sicuani', 'Raya', 'Juliaca']
  }
];

// Función para obtener empresa por ID
export const getCompanyById = (id: string): TransportCompany | undefined => {
  return CUSCO_TRANSPORT_COMPANIES.find(company => company.id === id);
};

// Función para obtener ruta por ID
export const getRouteById = (id: string): CuscoRoute | undefined => {
  return CUSCO_ROUTES.find(route => route.id === id);
};

// Función para obtener rutas por empresa
export const getRoutesByCompany = (companyId: string): CuscoRoute[] => {
  return CUSCO_ROUTES.filter(route => route.companies.includes(companyId));
};

// Función para obtener empresas por ruta
export const getCompaniesByRoute = (routeId: string): TransportCompany[] => {
  const route = getRouteById(routeId);
  if (!route) return [];
  
  return CUSCO_TRANSPORT_COMPANIES.filter(company => 
    route.companies.includes(company.id)
  );
};
