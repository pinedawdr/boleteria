-- 🎫 BOLETERÍA - BASE DE DATOS COMPLETA
-- Sistema de Venta de Boletos y Reservas de Transporte
-- Creado: 21 de junio de 2025
-- 
-- Este archivo contiene:
-- 1. Schema completo de la base de datos
-- 2. Datos de ejemplo para desarrollo y producción
-- 3. Funciones auxiliares para generar asientos
-- 
-- INSTRUCCIONES:
-- - Ejecutar completo en Supabase SQL Editor
-- - Asegurar que RLS esté habilitado
-- - Configurar las políticas de seguridad según se requiera

-- =====================================================
-- PARTE 1: SCHEMA DE BASE DE DATOS
-- =====================================================

-- Tabla de perfiles de usuario (extiende auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de roles de usuario para control de acceso
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'operator', 'customer')),
    permissions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Tabla de venues/lugares
CREATE TABLE IF NOT EXISTS public.venues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    seating_map JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de eventos
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    venue_id UUID REFERENCES public.venues(id),
    artist TEXT,
    category TEXT NOT NULL CHECK (category IN ('concert', 'theater', 'sports', 'conference', 'club')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    price_from DECIMAL(10,2) NOT NULL,
    price_to DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    duration TEXT,
    age_restriction TEXT,
    rating DECIMAL(2,1) DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de asientos para eventos
CREATE TABLE IF NOT EXISTS public.event_seats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    section TEXT NOT NULL,
    row_number TEXT NOT NULL,
    seat_number TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category TEXT DEFAULT 'general',
    seat_type TEXT DEFAULT 'standard' CHECK (seat_type IN ('standard', 'premium', 'vip')),
    available BOOLEAN DEFAULT true,
    reserved_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, section, row_number, seat_number)
);

-- Tabla de empresas de transporte
CREATE TABLE IF NOT EXISTS public.transport_companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0,
    phone TEXT,
    email TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de rutas de transporte
CREATE TABLE IF NOT EXISTS public.transport_routes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.transport_companies(id),
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('bus', 'train', 'boat')),
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    duration INTEGER, -- en horas
    price_from DECIMAL(10,2) NOT NULL,
    price_to DECIMAL(10,2) NOT NULL,
    total_seats INTEGER NOT NULL,
    amenities TEXT[],
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de asientos de transporte
CREATE TABLE IF NOT EXISTS public.transport_seats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    route_id UUID REFERENCES public.transport_routes(id) ON DELETE CASCADE,
    seat_number TEXT NOT NULL,
    seat_type TEXT DEFAULT 'standard' CHECK (seat_type IN ('standard', 'premium', 'executive')),
    price DECIMAL(10,2) NOT NULL,
    available BOOLEAN DEFAULT true,
    travel_date DATE NOT NULL,
    reserved_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(route_id, seat_number, travel_date)
);

-- Tabla de reservas/bookings
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    booking_type TEXT NOT NULL CHECK (booking_type IN ('event', 'transport')),
    event_id UUID REFERENCES public.events(id),
    transport_route_id UUID REFERENCES public.transport_routes(id),
    seats_booked JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled', 'refunded')),
    payment_method TEXT,
    qr_code TEXT UNIQUE,
    booking_reference TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de blog posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID REFERENCES auth.users(id),
    featured_image TEXT,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PARTE 2: FUNCIONES AUXILIARES
-- =====================================================

-- Función para generar asientos automáticamente para eventos
CREATE OR REPLACE FUNCTION generate_event_seats()
RETURNS void AS $$
DECLARE
    event_record RECORD;
    venue_record RECORD;
    section_info JSONB;
    section_name TEXT;
    rows INTEGER;
    seats_per_row INTEGER;
    base_price NUMERIC;
BEGIN
    -- Iterar sobre todos los eventos activos
    FOR event_record IN 
        SELECT id, venue_id, title, price_from, price_to FROM events 
        WHERE status = 'active'
    LOOP
        -- Obtener información del venue
        SELECT seating_map INTO venue_record FROM venues WHERE id = event_record.venue_id;
        
        -- Iterar sobre cada sección del venue
        FOR section_name, section_info IN 
            SELECT * FROM jsonb_each(venue_record.seating_map->'sections')
        LOOP
            rows := (section_info->>'rows')::INTEGER;
            seats_per_row := (section_info->>'seatsPerRow')::INTEGER;
            base_price := (section_info->>'basePrice')::NUMERIC;
            
            -- Generar asientos para esta sección
            INSERT INTO event_seats (event_id, section, row_number, seat_number, price, seat_type, available)
            SELECT 
                event_record.id,
                section_name,
                r::text,
                s::text,
                base_price,
                CASE 
                    WHEN section_name IN ('vip', 'palco') THEN 'vip'
                    WHEN section_name IN ('premium', 'preferencial') THEN 'premium'
                    ELSE 'standard'
                END,
                true
            FROM generate_series(1, rows) r
            CROSS JOIN generate_series(1, seats_per_row) s;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PARTE 3: DATOS DE EJEMPLO PARA DESARROLLO/PRODUCCIÓN
-- =====================================================

-- Limpiar datos existentes (solo para reinicialización)
-- NOTA: Comentar estas líneas si no se desea eliminar datos existentes
-- DELETE FROM bookings;
-- DELETE FROM transport_seats;
-- DELETE FROM event_seats;
-- DELETE FROM transport_routes;
-- DELETE FROM events;
-- DELETE FROM transport_companies;
-- DELETE FROM venues;

-- ===== VENUES =====
INSERT INTO venues (name, address, city, capacity, seating_map) VALUES
('Teatro Municipal de Lima', 'Jr. Ica 377, Cercado de Lima', 'Lima', 800, 
 '{"sections": {"vip": {"rows": 3, "seatsPerRow": 12, "basePrice": 150}, "preferencial": {"rows": 8, "seatsPerRow": 15, "basePrice": 100}, "general": {"rows": 12, "seatsPerRow": 20, "basePrice": 60}}}'),
('Centro de Convenciones Lima', 'Av. Aviación 2825, San Borja', 'Lima', 1500, 
 '{"sections": {"vip": {"rows": 4, "seatsPerRow": 15, "basePrice": 200}, "preferencial": {"rows": 10, "seatsPerRow": 18, "basePrice": 120}, "general": {"rows": 15, "seatsPerRow": 25, "basePrice": 80}}}'),
('Estadio Nacional', 'Av. José Díaz s/n, Cercado de Lima', 'Lima', 45000, 
 '{"sections": {"palco": {"rows": 2, "seatsPerRow": 50, "basePrice": 250}, "preferencial": {"rows": 20, "seatsPerRow": 60, "basePrice": 100}, "popular": {"rows": 50, "seatsPerRow": 80, "basePrice": 40}}}'),
('Centro Empresarial Real', 'Av. República de Panamá 3531, San Isidro', 'Lima', 400, 
 '{"sections": {"premium": {"rows": 5, "seatsPerRow": 15, "basePrice": 180}, "standard": {"rows": 10, "seatsPerRow": 20, "basePrice": 120}}}'),
('Club La Unión', 'Jr. de la Unión 758, Cercado de Lima', 'Lima', 600, 
 '{"sections": {"vip": {"rows": 4, "seatsPerRow": 20, "basePrice": 200}, "general": {"rows": 12, "seatsPerRow": 25, "basePrice": 100}}}');

-- ===== EMPRESAS DE TRANSPORTE =====
INSERT INTO transport_companies (name, rating, phone, email, logo_url) VALUES
('TransExpress Lima', 4.5, '+51 1 428-5500', 'reservas@transexpress.pe', '/images/logos/transexpress.png'),
('Movil Tours', 4.2, '+51 1 332-2020', 'ventas@moviltours.com.pe', '/images/logos/movil-tours.png'),
('Cruz del Sur', 4.7, '+51 1 311-5050', 'contacto@cruzdelsur.com.pe', '/images/logos/cruz-del-sur.png'),
('Oltursa', 4.3, '+51 1 708-5000', 'info@oltursa.pe', '/images/logos/oltursa.png');

-- ===== EVENTOS DESTACADOS =====

-- Concierto
INSERT INTO events (title, description, venue_id, artist, category, start_date, price_from, price_to, image_url, duration, age_restriction, rating, featured) 
SELECT 
    'Concierto Sinfónico Nacional', 
    'La Orquesta Sinfónica Nacional presenta su repertorio clásico y contemporáneo en una velada inolvidable con las mejores interpretaciones musicales del año.', 
    v.id, 
    'Orquesta Sinfónica Nacional', 
    'concert', 
    '2025-07-15 20:00:00+00', 
    60, 
    150, 
    '/images/events/concierto-sinfonico.jpg', 
    '2h 30min', 
    '12+', 
    4.8, 
    true
FROM venues v WHERE v.name = 'Teatro Municipal de Lima';

-- Teatro
INSERT INTO events (title, description, venue_id, artist, category, start_date, price_from, price_to, image_url, duration, age_restriction, rating, featured) 
SELECT 
    'Romeo y Julieta - Obra Clásica', 
    'La obra maestra de Shakespeare interpretada por el elenco nacional de teatro con una puesta en escena moderna y vestuario de época.', 
    v.id, 
    'Elenco Nacional de Teatro', 
    'theater', 
    '2025-07-20 19:30:00+00', 
    60, 
    150, 
    '/images/events/romeo-julieta.jpg', 
    '2h 15min', 
    '14+', 
    4.6, 
    false
FROM venues v WHERE v.name = 'Teatro Municipal de Lima';

-- Deportes
INSERT INTO events (title, description, venue_id, artist, category, start_date, price_from, price_to, image_url, duration, age_restriction, rating, featured) 
SELECT 
    'Final Copa América Sub-23', 
    'Partido final del torneo sudamericano de fútbol Sub-23. Una experiencia deportiva única con los mejores talentos jóvenes del continente.', 
    v.id, 
    'Selección Peruana', 
    'sports', 
    '2025-08-10 15:00:00+00', 
    40, 
    250, 
    '/images/events/copa-america.jpg', 
    '2h 00min', 
    'Apto para toda la familia', 
    4.8, 
    true
FROM venues v WHERE v.name = 'Estadio Nacional';

-- Conferencia
INSERT INTO events (title, description, venue_id, artist, category, start_date, price_from, price_to, image_url, duration, age_restriction, rating, featured) 
SELECT 
    'Summit Tecnológico 2025', 
    'Conferencia internacional sobre innovación tecnológica, inteligencia artificial y transformación digital. Expertos mundiales compartirán las últimas tendencias.', 
    v.id, 
    'Expertos Internacionales', 
    'conference', 
    '2025-09-05 09:00:00+00', 
    120, 
    300, 
    '/images/events/tech-summit.jpg', 
    '8h 00min', 
    '16+', 
    4.7, 
    true
FROM venues v WHERE v.name = 'Centro de Convenciones Lima';

-- Eventos de Club
INSERT INTO events (title, description, venue_id, artist, category, start_date, price_from, price_to, image_url, duration, age_restriction, rating, featured) 
SELECT 
    'Noche de Salsa Internacional', 
    'Una noche especial con los mejores exponentes de la salsa latinoamericana. Música en vivo, baile y diversión hasta el amanecer.', 
    v.id, 
    'Orquesta Los Grandes', 
    'club', 
    '2025-08-25 22:00:00+00', 
    80, 
    200, 
    '/images/events/noche-salsa.jpg', 
    '5h 00min', 
    '18+', 
    4.5, 
    false
FROM venues v WHERE v.name = 'Club La Unión';

-- ===== RUTAS DE TRANSPORTE =====
INSERT INTO transport_routes (company_id, origin, destination, vehicle_type, departure_time, arrival_time, duration, price_from, price_to, total_seats, amenities)
SELECT 
    tc.id,
    'Lima',
    'Cusco',
    'bus',
    '22:00',
    '16:00',
    18,
    80.00,
    150.00,
    42,
    ARRAY['WiFi', 'Aire acondicionado', 'Asientos reclinables', 'Baño']
FROM transport_companies tc WHERE tc.name = 'Cruz del Sur';

INSERT INTO transport_routes (company_id, origin, destination, vehicle_type, departure_time, arrival_time, duration, price_from, price_to, total_seats, amenities)
SELECT 
    tc.id,
    'Lima',
    'Arequipa',
    'bus',
    '21:30',
    '12:00',
    14,
    70.00,
    120.00,
    40,
    ARRAY['WiFi', 'Entretenimiento', 'Asientos cama']
FROM transport_companies tc WHERE tc.name = 'Movil Tours';

INSERT INTO transport_routes (company_id, origin, destination, vehicle_type, departure_time, arrival_time, duration, price_from, price_to, total_seats, amenities)
SELECT 
    tc.id,
    'Lima',
    'Trujillo',
    'bus',
    '23:00',
    '08:00',
    9,
    50.00,
    90.00,
    45,
    ARRAY['WiFi', 'Aire acondicionado', 'Snacks']
FROM transport_companies tc WHERE tc.name = 'TransExpress Lima';

-- ===== GENERAR ASIENTOS PARA EVENTOS =====
-- Ejecutar la función para generar asientos automáticamente
-- SELECT generate_event_seats();

-- =====================================================
-- PARTE 4: ÍNDICES Y OPTIMIZACIONES
-- =====================================================

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_venue_id ON events(venue_id);
CREATE INDEX IF NOT EXISTS idx_event_seats_event_id ON event_seats(event_id);
CREATE INDEX IF NOT EXISTS idx_event_seats_available ON event_seats(available);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_type ON bookings(booking_type);
CREATE INDEX IF NOT EXISTS idx_transport_routes_origin_destination ON transport_routes(origin, destination);

-- =====================================================
-- PARTE 5: POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar según necesidades específicas)
-- Los perfiles son visibles públicamente pero solo editables por el propietario
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Los eventos y venues son públicos para lectura
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Venues are viewable by everyone" ON venues FOR SELECT USING (true);
CREATE POLICY "Event seats are viewable by everyone" ON event_seats FOR SELECT USING (true);

-- Las empresas de transporte y rutas son públicas
CREATE POLICY "Transport companies are viewable by everyone" ON transport_companies FOR SELECT USING (true);
CREATE POLICY "Transport routes are viewable by everyone" ON transport_routes FOR SELECT USING (true);
CREATE POLICY "Transport seats are viewable by everyone" ON transport_seats FOR SELECT USING (true);

-- Las reservas solo las ve el usuario propietario
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '🎫 Base de datos de Boletería configurada correctamente!';
    RAISE NOTICE '✅ Schema creado';
    RAISE NOTICE '✅ Datos de ejemplo insertados';
    RAISE NOTICE '✅ Índices optimizados';
    RAISE NOTICE '✅ Políticas RLS configuradas';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Próximos pasos:';
    RAISE NOTICE '1. Ejecutar generate_event_seats() para crear asientos';
    RAISE NOTICE '2. Configurar autenticación en el frontend';
    RAISE NOTICE '3. Ajustar políticas RLS según necesidades';
END $$;
