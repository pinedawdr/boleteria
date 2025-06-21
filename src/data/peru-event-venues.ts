// Datos de eventos inspirados en escenarios reales del Perú

export interface EventVenue {
  id: string
  name: string
  type: 'theater' | 'stadium' | 'arena' | 'auditorium' | 'open_space' | 'club' | 'plaza'
  city: string
  capacity: number
  seat_layout: string
  sections: VenueSection[]
  description: string
  address: string
  amenities: string[]
}

export interface VenueSection {
  id: string
  name: string
  type: 'vip' | 'premium' | 'general' | 'palco' | 'platea' | 'galeria'
  rows: number
  seats_per_row: number
  price_multiplier: number
  color: string
  description?: string
}

// Venues reales del Perú adaptados
export const peruEventVenues: EventVenue[] = [
  // Lima
  {
    id: 'teatro-municipal-lima',
    name: 'Teatro Municipal de Lima',
    type: 'theater',
    city: 'Lima',
    capacity: 1100,
    seat_layout: 'traditional_theater',
    address: 'Jr. Ica 377, Cercado de Lima',
    amenities: ['Aire acondicionado', 'Cafetería', 'Estacionamiento', 'Acceso discapacitados'],
    description: 'Teatro histórico de 1909, escenario principal de ópera y ballet en Lima',
    sections: [
      {
        id: 'palcos',
        name: 'Palcos',
        type: 'vip',
        rows: 3,
        seats_per_row: 8,
        price_multiplier: 3.0,
        color: '#8B5CF6',
        description: 'Palcos laterales con vista privilegiada'
      },
      {
        id: 'platea',
        name: 'Platea',
        type: 'premium',
        rows: 12,
        seats_per_row: 24,
        price_multiplier: 2.0,
        color: '#3B82F6',
        description: 'Nivel principal del teatro'
      },
      {
        id: 'galeria-baja',
        name: 'Galería Baja',
        type: 'general',
        rows: 8,
        seats_per_row: 28,
        price_multiplier: 1.5,
        color: '#10B981',
        description: 'Primer piso con buena visibilidad'
      },
      {
        id: 'galeria-alta',
        name: 'Galería Alta',
        type: 'general',
        rows: 6,
        seats_per_row: 30,
        price_multiplier: 1.0,
        color: '#6B7280',
        description: 'Segundo piso, vista panorámica'
      }
    ]
  },

  // Estadio Nacional del Perú
  {
    id: 'estadio-nacional-lima',
    name: 'Estadio Nacional del Perú',
    type: 'stadium',
    city: 'Lima',
    capacity: 45000,
    seat_layout: 'stadium',
    address: 'Jr. José Díaz 1420, Cercado de Lima',
    amenities: ['Tiendas', 'Restaurantes', 'Estacionamiento', 'Transporte público'],
    description: 'Estadio principal del fútbol peruano, renovado para Copa América 2004',
    sections: [
      {
        id: 'palco-presidencial',
        name: 'Palco Presidencial',
        type: 'vip',
        rows: 3,
        seats_per_row: 50,
        price_multiplier: 5.0,
        color: '#8B5CF6',
        description: 'Área VIP con servicios exclusivos'
      },
      {
        id: 'tribuna-occidente',
        name: 'Tribuna Occidente',
        type: 'premium',
        rows: 25,
        seats_per_row: 180,
        price_multiplier: 2.5,
        color: '#3B82F6',
        description: 'Tribuna techada con asientos numerados'
      },
      {
        id: 'tribuna-oriente',
        name: 'Tribuna Oriente',
        type: 'premium',
        rows: 25,
        seats_per_row: 180,
        price_multiplier: 2.0,
        color: '#06B6D4',
        description: 'Tribuna lateral con buena vista'
      },
      {
        id: 'norte-popular',
        name: 'Norte Popular',
        type: 'general',
        rows: 30,
        seats_per_row: 150,
        price_multiplier: 1.0,
        color: '#10B981',
        description: 'Zona popular de hinchas'
      },
      {
        id: 'sur-popular',
        name: 'Sur Popular',
        type: 'general',
        rows: 30,
        seats_per_row: 150,
        price_multiplier: 1.0,
        color: '#84CC16',
        description: 'Zona tradicional de las barras'
      }
    ]
  },

  // Teatro Segura (Lima)
  {
    id: 'teatro-segura',
    name: 'Teatro Segura',
    type: 'theater',
    city: 'Lima',
    capacity: 800,
    seat_layout: 'intimate_theater',
    address: 'Jr. Huancavelica 265, Cercado de Lima',
    amenities: ['Bar', 'Galería de arte', 'Librería'],
    description: 'Teatro íntimo dedicado al teatro nacional e independiente',
    sections: [
      {
        id: 'platea-segura',
        name: 'Platea',
        type: 'premium',
        rows: 15,
        seats_per_row: 20,
        price_multiplier: 2.0,
        color: '#3B82F6',
        description: 'Butacas cómodas en nivel principal'
      },
      {
        id: 'galeria-segura',
        name: 'Galería',
        type: 'general',
        rows: 12,
        seats_per_row: 25,
        price_multiplier: 1.0,
        color: '#10B981',
        description: 'Ubicación elevada con vista completa'
      }
    ]
  },

  // Arena Nacional (Lima)
  {
    id: 'arena-nacional',
    name: 'Arena Nacional',
    type: 'arena',
    city: 'Lima',
    capacity: 18500,
    seat_layout: 'arena',
    address: 'Av. Petit Thouars 4555, San Isidro',
    amenities: ['Estacionamiento', 'Food court', 'Tiendas', 'Wi-Fi'],
    description: 'Moderno recinto para conciertos y eventos deportivos',
    sections: [
      {
        id: 'pista-vip',
        name: 'Pista VIP',
        type: 'vip',
        rows: 10,
        seats_per_row: 50,
        price_multiplier: 4.0,
        color: '#8B5CF6',
        description: 'Área cercana al escenario con servicios premium'
      },
      {
        id: 'pista-general',
        name: 'Pista General',
        type: 'general',
        rows: 25,
        seats_per_row: 80,
        price_multiplier: 2.0,
        color: '#10B981',
        description: 'Área principal frente al escenario'
      },
      {
        id: 'tribuna-baja',
        name: 'Tribuna Baja',
        type: 'premium',
        rows: 15,
        seats_per_row: 120,
        price_multiplier: 2.5,
        color: '#3B82F6',
        description: 'Asientos numerados en primer nivel'
      },
      {
        id: 'tribuna-alta',
        name: 'Tribuna Alta',
        type: 'general',
        rows: 20,
        seats_per_row: 150,
        price_multiplier: 1.5,
        color: '#6B7280',
        description: 'Vista panorámica del evento'
      }
    ]
  },

  // Centro de Convenciones Lima
  {
    id: 'centro-convenciones-lima',
    name: 'Centro de Convenciones de Lima',
    type: 'auditorium',
    city: 'Lima',
    capacity: 2500,
    seat_layout: 'auditorium',
    address: 'Av. Andrés Reyes 434, San Isidro',
    amenities: ['Traducción simultánea', 'Proyección', 'Wi-Fi', 'Cafetería'],
    description: 'Principal centro de convenciones y eventos corporativos',
    sections: [
      {
        id: 'platea-premium',
        name: 'Platea Premium',
        type: 'premium',
        rows: 20,
        seats_per_row: 40,
        price_multiplier: 2.0,
        color: '#3B82F6',
        description: 'Asientos ergonómicos con mesa'
      },
      {
        id: 'anfiteatro',
        name: 'Anfiteatro',
        type: 'general',
        rows: 25,
        seats_per_row: 50,
        price_multiplier: 1.0,
        color: '#10B981',
        description: 'Asientos con vista escalonada'
      }
    ]
  },

  // Cusco - Centro Qosqo de Arte Nativo
  {
    id: 'qosqo-arte-nativo',
    name: 'Centro Qosqo de Arte Nativo',
    type: 'theater',
    city: 'Cusco',
    capacity: 400,
    seat_layout: 'cultural_center',
    address: 'Av. El Sol 604, Cusco',
    amenities: ['Museo', 'Cafetería típica', 'Tienda de artesanías'],
    description: 'Centro cultural dedicado a las artes andinas y folclore cusqueño',
    sections: [
      {
        id: 'platea-qosqo',
        name: 'Platea',
        type: 'premium',
        rows: 12,
        seats_per_row: 20,
        price_multiplier: 1.5,
        color: '#3B82F6',
        description: 'Vista directa al escenario'
      },
      {
        id: 'galeria-qosqo',
        name: 'Galería',
        type: 'general',
        rows: 8,
        seats_per_row: 25,
        price_multiplier: 1.0,
        color: '#10B981',
        description: 'Nivel superior con vista panorámica'
      }
    ]
  },

  // Estadio Garcilaso (Cusco)
  {
    id: 'estadio-garcilaso',
    name: 'Estadio Garcilaso de la Vega',
    type: 'stadium',
    city: 'Cusco',
    capacity: 42056,
    seat_layout: 'high_altitude_stadium',
    address: 'Av. Mariscal Gamarra s/n, Santiago, Cusco',
    amenities: ['Museo del deporte', 'Tiendas', 'Estacionamiento'],
    description: 'Estadio más alto del mundo donde juega la selección peruana',
    sections: [
      {
        id: 'tribuna-sur-garcilaso',
        name: 'Tribuna Sur',
        type: 'premium',
        rows: 20,
        seats_per_row: 200,
        price_multiplier: 2.0,
        color: '#3B82F6',
        description: 'Tribuna techada principal'
      },
      {
        id: 'popular-norte',
        name: 'Popular Norte',
        type: 'general',
        rows: 35,
        seats_per_row: 180,
        price_multiplier: 1.0,
        color: '#10B981',
        description: 'Zona de las barras cusqueñas'
      },
      {
        id: 'oriente-garcilaso',
        name: 'Tribuna Oriente',
        type: 'general',
        rows: 30,
        seats_per_row: 150,
        price_multiplier: 1.2,
        color: '#84CC16',
        description: 'Lateral con vista de las montañas'
      },
      {
        id: 'occidente-garcilaso',
        name: 'Tribuna Occidente',
        type: 'general',
        rows: 30,
        seats_per_row: 150,
        price_multiplier: 1.2,
        color: '#6B7280',
        description: 'Lateral opuesto'
      }
    ]
  },

  // Plaza de Armas del Cusco (eventos al aire libre)
  {
    id: 'plaza-armas-cusco',
    name: 'Plaza de Armas del Cusco',
    type: 'open_space',
    city: 'Cusco',
    capacity: 5000,
    seat_layout: 'open_plaza',
    address: 'Plaza de Armas, Centro Histórico, Cusco',
    amenities: ['Patrimonio UNESCO', 'Balcones históricos', 'Comercios'],
    description: 'Plaza principal del Cusco, escenario de festivales como Inti Raymi',
    sections: [
      {
        id: 'balcones-coloniales',
        name: 'Balcones Coloniales',
        type: 'vip',
        rows: 3,
        seats_per_row: 30,
        price_multiplier: 5.0,
        color: '#8B5CF6',
        description: 'Balcones históricos con vista privilegiada'
      },
      {
        id: 'gradas-temporales',
        name: 'Gradas Temporales',
        type: 'premium',
        rows: 15,
        seats_per_row: 80,
        price_multiplier: 3.0,
        color: '#3B82F6',
        description: 'Gradas instaladas para eventos especiales'
      },
      {
        id: 'zona-general',
        name: 'Zona General',
        type: 'general',
        rows: 1,
        seats_per_row: 3800,
        price_multiplier: 1.0,
        color: '#10B981',
        description: 'Acceso general a la plaza'
      }
    ]
  },

  // Arequipa - Teatro Municipal
  {
    id: 'teatro-municipal-arequipa',
    name: 'Teatro Municipal de Arequipa',
    type: 'theater',
    city: 'Arequipa',
    capacity: 700,
    seat_layout: 'colonial_theater',
    address: 'Calle Mercaderes 113, Cercado de Arequipa',
    amenities: ['Arquitectura colonial', 'Cafetería', 'Museo'],
    description: 'Teatro histórico de sillar blanco, patrimonio arquitectónico',
    sections: [
      {
        id: 'platea-arequipa',
        name: 'Platea',
        type: 'premium',
        rows: 15,
        seats_per_row: 24,
        price_multiplier: 2.0,
        color: '#3B82F6',
        description: 'Butacas principales de época'
      },
      {
        id: 'galeria-arequipa',
        name: 'Galería',
        type: 'general',
        rows: 10,
        seats_per_row: 28,
        price_multiplier: 1.0,
        color: '#10B981',
        description: 'Segundo nivel con vista completa'
      }
    ]
  }
]

// Función para obtener venue por ciudad
export const getVenuesByCity = (city: string): EventVenue[] => {
  return peruEventVenues.filter(venue => venue.city === city)
}

// Función para obtener venue por tipo
export const getVenuesByType = (type: string): EventVenue[] => {
  return peruEventVenues.filter(venue => venue.type === type)
}

// Función para obtener venue por ID
export const getVenueById = (id: string): EventVenue | undefined => {
  return peruEventVenues.find(venue => venue.id === id)
}
