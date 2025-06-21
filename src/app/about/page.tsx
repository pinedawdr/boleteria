import { Users, Target, Award, Heart } from 'lucide-react'
import { Container } from '@/components/layout'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-body-bg">
      <Container className="py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Acerca de <span className="text-accent">Boletería</span>
          </h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            Somos la plataforma líder en Perú que conecta a las personas con experiencias únicas 
            y viajes increíbles a través de eventos y transportes de calidad.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">Nuestra Historia</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Fundada en 2020, Boletería nació con la visión de democratizar el acceso a eventos 
              culturales y facilitar los viajes por todo el Perú. Comenzamos como un pequeño equipo 
              de entusiastas de la tecnología y la cultura.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Hoy, somos la plataforma de confianza para miles de peruanos que buscan vivir 
              experiencias memorables, desde conciertos íntimos hasta festivales masivos, 
              y viajes cómodos a destinos únicos.
            </p>
          </div>
          <div className="bg-body-bg/50 rounded-2xl p-8 border border-gray-700 hover:bg-body-bg/70 transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-6">En Números</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">500K+</div>
                <div className="text-gray-300">Usuarios Activos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">10K+</div>
                <div className="text-gray-300">Eventos Realizados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">50+</div>
                <div className="text-gray-300">Ciudades</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">1M+</div>
                <div className="text-gray-300">Boletos Vendidos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Comunidad",
                description: "Creemos en el poder de conectar personas a través de experiencias compartidas.",
                color: "text-accent"
              },
              {
                icon: Target,
                title: "Excelencia",
                description: "Nos comprometemos a ofrecer el mejor servicio y experiencia de usuario.",
                color: "text-accent"
              },
              {
                icon: Award,
                title: "Confianza",
                description: "Construimos relaciones duraderas basadas en transparencia y seguridad.",
                color: "text-accent"
              },
              {
                icon: Heart,
                title: "Pasión",
                description: "Amamos lo que hacemos y se refleja en cada detalle de nuestro servicio.",
                color: "text-accent"
              }
            ].map((value, index) => (
              <div key={index} className="bg-body-bg/50 rounded-xl p-6 border border-gray-700 text-center hover:bg-body-bg/70 hover:border-accent/50 transition-all duration-300 group">
                <value.icon className={`w-12 h-12 ${value.color} mx-auto mb-4 transition-colors duration-300`} />
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Nuestro Equipo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Carlos Mendoza",
                role: "CEO & Fundador",
                description: "Visionario emprendedor con más de 10 años en tecnología y eventos."
              },
              {
                name: "Ana Torres",
                role: "CTO",
                description: "Experta en desarrollo de plataformas escalables y experiencia de usuario."
              },
              {
                name: "Luis Rivera",
                role: "Director de Operaciones",
                description: "Especialista en logística de eventos y gestión de transportes."
              }
            ].map((member, index) => (
              <div key={index} className="bg-body-bg/50 rounded-xl p-6 border border-gray-700">
                <div className="w-24 h-24 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-text-primary text-2xl font-bold">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
