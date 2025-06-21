'use client'

import { Container } from '@/components/layout'
import { 
  Building2, 
  Users, 
  Calendar, 
  CreditCard, 
  Shield, 
  Award,
  CheckCircle,
  ArrowRight,
  Bus,
  FileText,
  Headphones,
  Star
} from 'lucide-react'

export default function CorporatePage() {
  const benefits = [
    {
      icon: CreditCard,
      title: "Facturación Empresarial",
      description: "Emitimos facturas con RUC para facilitar tu contabilidad empresarial"
    },
    {
      icon: Users,
      title: "Descuentos por Volumen",
      description: "Ofertas especiales para compras grupales y eventos corporativos"
    },
    {
      icon: Shield,
      title: "Atención Prioritaria",
      description: "Canal exclusivo de soporte para empresas con respuesta inmediata"
    },
    {
      icon: Calendar,
      title: "Planificación Avanzada",
      description: "Reservas anticipadas y calendario de eventos para tu empresa"
    },
    {
      icon: Award,
      title: "Gestor Dedicado",
      description: "Un ejecutivo especializado para gestionar todas tus necesidades"
    },
    {
      icon: FileText,
      title: "Reportes Detallados",
      description: "Informes completos de gastos y actividades para tu empresa"
    }
  ]

  const services = [
    {
      title: "Eventos Corporativos",
      icon: Building2,
      description: "Organización completa de eventos empresariales",
      features: [
        "Conferencias y seminarios",
        "Cenas de gala y celebraciones",
        "Team building y actividades",
        "Lanzamientos de productos"
      ]
    },
    {
      title: "Transporte Empresarial",
      icon: Bus,
      description: "Soluciones de movilidad para tu equipo",
      features: [
        "Transporte ejecutivo",
        "Servicios de shuttles",
        "Viajes corporativos",
        "Transporte para eventos"
      ]
    },
    {
      title: "Gestión de Invitados",
      icon: Users,
      description: "Control total de asistentes y participantes",
      features: [
        "Lista de invitados VIP",
        "Check-in automatizado",
        "Badges personalizados",
        "Control de accesos"
      ]
    }
  ]

  const testimonials = [
    {
      name: "María González",
      position: "Gerente de Eventos",
      company: "Banco Continental",
      content: "Boletería nos ha ayudado a organizar más de 50 eventos corporativos. Su servicio es excepcional.",
      rating: 5
    },
    {
      name: "Carlos Mendoza",
      position: "Director de RR.HH.",
      company: "Grupo Romero",
      content: "La plataforma facilita enormemente la gestión de transporte para nuestros colaboradores.",
      rating: 5
    },
    {
      name: "Ana Lucia Torres",
      position: "Coordinadora de Marketing",
      company: "Saga Falabella",
      content: "Excelente atención al cliente y precios competitivos para eventos masivos.",
      rating: 5
    }
  ]

  return (
    <main className="min-h-screen bg-body-bg">
      <div className="particles-bg"></div>
      
      <Container className="py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-medium">Soluciones Empresariales</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-6">
            Venta <span className="text-accent">Corporativa</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 px-4">
            Soluciones especializadas para empresas que buscan organizar eventos, 
            gestionar transporte corporativo y brindar experiencias únicas a sus colaboradores y clientes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <button className="btn-primary px-8 py-4 rounded-lg font-semibold shadow-lg">
              Solicitar Cotización
            </button>
            <button className="border border-gray-600 text-white hover:bg-body-bg px-8 py-4 rounded-lg font-semibold transition-all duration-300">
              Ver Casos de Éxito
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Beneficios Exclusivos
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto px-4">
              Descubre las ventajas de trabajar con nosotros para tus necesidades corporativas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-body-bg/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-body-bg/50 transition-all duration-300 group">
                <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <benefit.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-300">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto px-4">
              Soluciones integrales adaptadas a las necesidades de tu empresa
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-card backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 lg:p-8 hover:border-accent/50 transition-all duration-300 group">
                <div className="bg-body-bg w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform">
                  <service.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-white font-bold text-xl mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-300 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-6 flex items-center gap-2 text-accent hover:text-accent/80 font-medium group-hover:gap-3 transition-all">
                  Más información
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Cómo Trabajamos
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto px-4">
              Un proceso simple y eficiente para garantizar el éxito de tus eventos corporativos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { step: "01", title: "Consulta Inicial", description: "Analizamos tus necesidades y objetivos", icon: Headphones },
              { step: "02", title: "Propuesta Personalizada", description: "Diseñamos una solución a tu medida", icon: FileText },
              { step: "03", title: "Ejecución", description: "Gestionamos todos los detalles del evento", icon: CheckCircle },
              { step: "04", title: "Seguimiento", description: "Evaluamos resultados y mejoras", icon: Award }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="bg-body-bg w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform">
                  <item.icon className="h-8 w-8 text-accent" />
                </div>
                <div className="text-accent font-bold text-xl mb-2">{item.step}</div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Lo Que Dicen Nuestros Clientes
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto px-4">
              Testimonios reales de empresas que confían en nosotros
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-body-bg/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-body-bg/50 transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-accent text-sm">{testimonial.position}</div>
                  <div className="text-gray-400 text-sm">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-card border border-accent/20 rounded-2xl p-6 md:p-8 lg:p-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
              ¿Listo para Potenciar tu Empresa?
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto px-4">
              Contáctanos hoy y descubre cómo podemos ayudarte a organizar eventos corporativos exitosos 
              y gestionar el transporte de tu empresa de manera eficiente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <button className="btn-primary px-8 py-4 rounded-lg font-semibold shadow-lg">
                Contactar Ejecutivo
              </button>
              <button className="border border-gray-600 text-white hover:bg-body-bg px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Llamar Ahora
              </button>
            </div>
          </div>
        </section>
      </Container>
    </main>
  )
}
