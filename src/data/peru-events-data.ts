// Datos reales de eventos inspirados en escenarios del Perú

export interface EventVenue {
  id: string
  name: string
  city: string
  address: string
  capacity: number
  venue_type: 'teatro' | 'estadio' | 'coliseo' | 'auditorio' | 'plaza' | 'centro_cultural'
  seat_layout: EventSeatLayout
  established: number
  description: string
  amenities: string[]
}

export interface EventSeatLayout {
  type: 'teatro_tradicional' | 'estadio_futbol' | 'coliseo_circular' | 'auditorio_universitario' | 'plaza_concierto'
  sections: SeatSection[]
  total_capacity: number
}

export interface SeatSection {
  id: string
  name: string
  type: 'platea' | 'mezzanine' | 'balcon' | 'palco' | 'tribuna' | 'campo' | 'preferencia' | 'popular'
  rows: number
  seats_per_row: number
  base_price: number
  color: string
  position: 'front' | 'middle' | 'back' | 'side' | 'center'
  view_quality: 'excelente' | 'buena' | 'regular'
}

export interface PeruEvent {
  id: string
  title: string
  artist: string
  category: 'concierto' | 'teatro' | 'danza' | 'opera' | 'musical' | 'festival' | 'standup' | 'deportes'
  venue_id: string
  date: string
  duration_minutes: number
  description: string
  image_url?: string
  ticket_sales_start: string
  ticket_sales_end: string
  age_restriction?: string
  dress_code?: string
  special_notes?: string
}

// Venues reales inspirados en escenarios del Perú
export const PERU_VENUES: EventVenue[] = [
  {
    id: 'teatro-municipal-lima',
    name: 'Teatro Municipal de Lima',
    city: 'Lima',
    address: 'Jr. Ica 377, Cercado de Lima',
    capacity: 1100,
    venue_type: 'teatro',
    established: 1909,
    description: 'Teatro histórico de Lima, joya arquitectural del siglo XX',
    amenities: ['Aire acondicionado', 'Guardarropa', 'Cafetería', 'Estacionamiento'],
    seat_layout: {
      type: 'teatro_tradicional',
      total_capacity: 1100,
      sections: [
        {
          id: 'platea',
          name: 'Platea',
          type: 'platea',
          rows: 25,
          seats_per_row: 28,
          base_price: 120,
          color: '#ff6b6b',
          position: 'front',
          view_quality: 'excelente'
        },
        {
          id: 'mezzanine',
          name: 'Mezzanine',
          type: 'mezzanine',
          rows: 8,
          seats_per_row: 32,
          base_price: 90,
          color: '#4ecdc4',
          position: 'middle',
          view_quality: 'excelente'
        },
        {
          id: 'balcon',
          name: 'Balcón',
          type: 'balcon',
          rows: 12,
          seats_per_row: 30,
          base_price: 65,
          color: '#45b7d1',
          position: 'back',
          view_quality: 'buena'
        }
      ]
    }
  },
  {
    id: 'estadio-nacional',
    name: 'Estadio Nacional del Perú',
    city: 'Lima',
    address: 'Jr. José Díaz 1420, Cercado de Lima',
    capacity: 50000,
    venue_type: 'estadio',
    established: 2011,
    description: 'Estadio principal del Perú, sede de la selección nacional',
    amenities: ['Pantallas gigantes', 'Seguridad 24h', 'Múltiples ingresos', 'Zona comercial'],
    seat_layout: {
      type: 'estadio_futbol',
      total_capacity: 50000,
      sections: [
        {
          id: 'campo',
          name: 'Campo General',
          type: 'campo',
          rows: 0,
          seats_per_row: 0,
          base_price: 80,
          color: '#ff6b6b',
          position: 'center',
          view_quality: 'excelente'
        },
        {
          id: 'preferencia',
          name: 'Preferencia',
          type: 'preferencia',
          rows: 30,
          seats_per_row: 400,
          base_price: 150,
          color: '#4ecdc4',
          position: 'middle',
          view_quality: 'excelente'
        },
        {
          id: 'popular-norte',
          name: 'Popular Norte',
          type: 'popular',
          rows: 45,
          seats_per_row: 350,
          base_price: 45,
          color: '#45b7d1',
          position: 'back',
          view_quality: 'buena'
        },
        {
          id: 'popular-sur',
          name: 'Popular Sur',
          type: 'popular',
          rows: 45,
          seats_per_row: 350,
          base_price: 45,
          color: '#96ceb4',
          position: 'back',
          view_quality: 'buena'
        }
      ]
    }
  },
  {
    id: 'gran-teatro-nacional',
    name: 'Gran Teatro Nacional',
    city: 'Lima',
    address: 'Av. Javier Prado Este 2225, San Borja',
    capacity: 1498,
    venue_type: 'teatro',
    established: 2011,
    description: 'Teatro moderno más importante del Perú',
    amenities: ['Acústica de clase mundial', 'Traducción simultánea', 'Restaurante', 'Tienda'],
    seat_layout: {
      type: 'teatro_tradicional',
      total_capacity: 1498,
      sections: [
        {
          id: 'platea-vip',
          name: 'Platea VIP',
          type: 'platea',
          rows: 12,
          seats_per_row: 32,
          base_price: 180,
          color: '#gold',
          position: 'front',
          view_quality: 'excelente'
        },
        {
          id: 'platea-general',
          name: 'Platea General',
          type: 'platea',
          rows: 20,
          seats_per_row: 30,
          base_price: 120,
          color: '#ff6b6b',
          position: 'middle',
          view_quality: 'excelente'
        },
        {
          id: 'balcon-1',
          name: 'Balcón Primer Nivel',
          type: 'balcon',
          rows: 15,
          seats_per_row: 35,
          base_price: 90,
          color: '#4ecdc4',
          position: 'middle',
          view_quality: 'buena'
        },
        {
          id: 'balcon-2',
          name: 'Balcón Segundo Nivel',
          type: 'balcon',
          rows: 12,
          seats_per_row: 30,
          base_price: 65,
          color: '#45b7d1',
          position: 'back',
          view_quality: 'buena'
        }
      ]
    }
  },
  {
    id: 'coliseo-amauta',
    name: 'Coliseo Amauta',
    city: 'Lima',
    address: 'Av. Aviación 2045, San Borja',
    capacity: 18000,
    venue_type: 'coliseo',
    established: 1982,
    description: 'Coliseo polideportivo para grandes conciertos',
    amenities: ['Sonido profesional', 'Luces LED', 'Múltiples barras', 'Estacionamiento amplio'],
    seat_layout: {
      type: 'coliseo_circular',
      total_capacity: 18000,
      sections: [
        {
          id: 'campo-vip',
          name: 'Campo VIP',
          type: 'campo',
          rows: 0,
          seats_per_row: 0,
          base_price: 220,
          color: '#gold',
          position: 'center',
          view_quality: 'excelente'
        },
        {
          id: 'campo-general',
          name: 'Campo General',
          type: 'campo',
          rows: 0,
          seats_per_row: 0,
          base_price: 120,
          color: '#ff6b6b',
          position: 'center',
          view_quality: 'excelente'
        },
        {
          id: 'tribuna-preferencia',
          name: 'Tribuna Preferencia',
          type: 'tribuna',
          rows: 25,
          seats_per_row: 200,
          base_price: 180,
          color: '#4ecdc4',
          position: 'middle',
          view_quality: 'excelente'
        },
        {
          id: 'tribuna-popular',
          name: 'Tribuna Popular',
          type: 'tribuna',
          rows: 35,
          seats_per_row: 180,
          base_price: 80,
          color: '#45b7d1',
          position: 'back',
          view_quality: 'buena'
        }
      ]
    }
  },
  {
    id: 'centro-cultural-ccpucp',
    name: 'Centro Cultural PUCP',
    city: 'Lima',
    address: 'Av. Camino Real 1075, San Isidro',
    capacity: 450,
    venue_type: 'centro_cultural',
    established: 2001,
    description: 'Espacio cultural universitario para artes escénicas',
    amenities: ['Acústica especializada', 'Iluminación teatral', 'Sala de exposiciones', 'Librería'],
    seat_layout: {
      type: 'auditorio_universitario',
      total_capacity: 450,
      sections: [
        {
          id: 'platea-premium',
          name: 'Platea Premium',
          type: 'platea',
          rows: 12,
          seats_per_row: 22,
          base_price: 85,
          color: '#ff6b6b',
          position: 'front',
          view_quality: 'excelente'
        },
        {
          id: 'platea-general',
          name: 'Platea General',
          type: 'platea',
          rows: 8,
          seats_per_row: 20,
          base_price: 60,
          color: '#4ecdc4',
          position: 'middle',
          view_quality: 'buena'
        },
        {
          id: 'balcon-estudiantes',
          name: 'Balcón Estudiantes',
          type: 'balcon',
          rows: 6,
          seats_per_row: 18,
          base_price: 35,
          color: '#45b7d1',
          position: 'back',
          view_quality: 'buena'
        }
      ]
    }
  }
];

// Eventos reales inspirados en la escena cultural peruana
export const PERU_EVENTS: PeruEvent[] = [
  {
    id: 'eva-ayllon-concierto',
    title: 'Eva Ayllón - Criolla y Flamenca',
    artist: 'Eva Ayllón',
    category: 'concierto',
    venue_id: 'gran-teatro-nacional',
    date: '2025-07-15T20:00:00',
    duration_minutes: 120,
    description: 'La Reina de la música criolla presenta su nuevo espectáculo fusionando música peruana con flamenco español',
    ticket_sales_start: '2025-04-01T10:00:00',
    ticket_sales_end: '2025-07-15T18:00:00',
    age_restriction: 'Apto para toda la familia',
    dress_code: 'Elegante casual'
  },
  {
    id: 'gian-marco-sinfonica',
    title: 'Gian Marco Sinfónico',
    artist: 'Gian Marco',
    category: 'concierto',
    venue_id: 'coliseo-amauta',
    date: '2025-08-20T19:00:00',
    duration_minutes: 150,
    description: 'Gian Marco junto a la Orquesta Sinfónica Nacional en un concierto único',
    ticket_sales_start: '2025-05-01T10:00:00',
    ticket_sales_end: '2025-08-20T17:00:00',
    age_restriction: 'Apto para toda la familia'
  },
  {
    id: 'magaly-solier-teatro',
    title: 'Antigona - Magaly Solier',
    artist: 'Magaly Solier',
    category: 'teatro',
    venue_id: 'teatro-municipal-lima',
    date: '2025-09-10T20:30:00',
    duration_minutes: 90,
    description: 'Adaptación contemporánea de la tragedia griega con Magaly Solier en el papel protagónico',
    ticket_sales_start: '2025-06-01T10:00:00',
    ticket_sales_end: '2025-09-10T19:00:00',
    age_restriction: '+12 años',
    dress_code: 'Formal',
    special_notes: 'Obra en español con subtítulos en quechua'
  },
  {
    id: 'peru-vs-brasil',
    title: 'Perú vs Brasil - Eliminatorias 2026',
    artist: 'FPF',
    category: 'deportes',
    venue_id: 'estadio-nacional',
    date: '2025-10-15T20:00:00',
    duration_minutes: 120,
    description: 'Partido crucial de eliminatorias al Mundial 2026',
    ticket_sales_start: '2025-08-01T10:00:00',
    ticket_sales_end: '2025-10-15T16:00:00',
    age_restriction: 'Menores acompañados',
    special_notes: 'Prohibido ingreso con objetos contundentes'
  },
  {
    id: 'danza-folklorica-nacional',
    title: 'Festival Nacional de Danza Folklórica',
    artist: 'Elenco Nacional de Folclore',
    category: 'danza',
    venue_id: 'centro-cultural-ccpucp',
    date: '2025-07-28T19:00:00',
    duration_minutes: 100,
    description: 'Celebración de las danzas tradicionales del Perú por Fiestas Patrias',
    ticket_sales_start: '2025-05-01T10:00:00',
    ticket_sales_end: '2025-07-28T17:00:00',
    age_restriction: 'Apto para toda la familia',
    special_notes: 'Incluye danzas de las 3 regiones del Perú'
  }
];

// Funciones utilitarias
export const getVenueById = (id: string): EventVenue | undefined => {
  return PERU_VENUES.find(venue => venue.id === id);
};

export const getEventById = (id: string): PeruEvent | undefined => {
  return PERU_EVENTS.find(event => event.id === id);
};

export const getEventsByVenue = (venueId: string): PeruEvent[] => {
  return PERU_EVENTS.filter(event => event.venue_id === venueId);
};

export const getEventsByCategory = (category: string): PeruEvent[] => {
  return PERU_EVENTS.filter(event => event.category === category);
};
