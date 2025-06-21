'use client'

import { 
  Search, 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  CreditCard,
  Bus,
  Calendar,
  Shield,
  Star,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Eye
} from 'lucide-react'
import { useState } from 'react'
import { Container } from '@/components/layout'

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Todas', icon: HelpCircle, count: 45 },
    { id: 'tickets', name: 'Entradas', icon: Calendar, count: 15 },
    { id: 'transport', name: 'Transporte', icon: Bus, count: 12 },
    { id: 'payments', name: 'Pagos', icon: CreditCard, count: 8 },
    { id: 'account', name: 'Cuenta', icon: User, count: 6 },
    { id: 'security', name: 'Seguridad', icon: Shield, count: 4 }
  ]

  const popularArticles = [
    {
      id: 1,
      title: "¿Cómo comprar entradas de manera segura?",
      category: "tickets",
      views: 2340,
      helpful: 89,
      description: "Guía paso a paso para realizar compras seguras en nuestra plataforma"
    },
    {
      id: 2,
      title: "¿Qué hacer si mi pago fue rechazado?",
      category: "payments",
      views: 1890,
      helpful: 76,
      description: "Soluciones para problemas comunes con métodos de pago"
    },
    {
      id: 3,
      title: "¿Cómo cancelar o modificar mi reserva de transporte?",
      category: "transport",
      views: 1560,
      helpful: 82,
      description: "Política de cancelaciones y modificaciones de reservas"
    },
    {
      id: 4,
      title: "¿Cómo crear una cuenta en Boletería?",
      category: "account",
      views: 1230,
      helpful: 94,
      description: "Tutorial completo para registrarse en la plataforma"
    },
    {
      id: 5,
      title: "¿Cómo descargar mis entradas digitales?",
      category: "tickets",
      views: 980,
      helpful: 88,
      description: "Accede y descarga tus entradas desde tu cuenta"
    },
    {
      id: 6,
      title: "¿Es seguro guardar mi información de pago?",
      category: "security",
      views: 890,
      helpful: 91,
      description: "Medidas de seguridad para proteger tu información"
    }
  ]

  const quickHelp = [
    {
      icon: MessageCircle,
      title: "Chat en Vivo",
      description: "Habla con nuestro equipo de soporte",
      action: "Iniciar Chat",
      available: true
    },
    {
      icon: Phone,
      title: "Llamar Ahora",
      description: "+51 1 234-5678",
      action: "Llamar",
      available: true
    },
    {
      icon: Mail,
      title: "Enviar Email",
      description: "soporte@boleteria.pe",
      action: "Enviar",
      available: true
    },
    {
      icon: Book,
      title: "Guías Detalladas",
      description: "Tutoriales paso a paso",
      action: "Ver Guías",
      available: true
    }
  ]

  const recentUpdates = [
    {
      title: "Nueva función: Entradas digitales con QR",
      date: "15 Mar 2024",
      type: "feature"
    },
    {
      title: "Mantenimiento programado del sistema",
      date: "12 Mar 2024",
      type: "maintenance"
    },
    {
      title: "Actualización de políticas de reembolso",
      date: "8 Mar 2024",
      type: "policy"
    }
  ]

  const filteredArticles = popularArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <main className="min-h-screen bg-body-bg">
      <div className="particles-bg"></div>
      
      <Container className="relative z-10 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <HelpCircle className="icon-sm" />
            <span className="text-sm font-medium">Centro de Ayuda</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-text-primary mb-6">
            ¿En qué podemos <span className="text-accent">ayudarte</span>?
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-8 px-4">
            Encuentra respuestas rápidas a tus preguntas más frecuentes o contacta directamente 
            con nuestro equipo de soporte especializado.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8 px-4">
            <Search className="absolute left-4 top-4 icon-md text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en el centro de ayuda..."
              className="input-search w-full pl-12 pr-4 py-3 md:py-4 text-base md:text-lg"
            />
          </div>
        </div>

        {/* Quick Help Section */}
        <section className="mb-16">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-text-primary text-center mb-8">
            Obtén Ayuda Inmediata
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {quickHelp.map((item, index) => (
              <div key={index} className="card-default text-center group">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <item.icon className="icon-lg text-accent" />
                </div>
                <h3 className="text-text-primary font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  {item.description}
                </p>
                <button className="btn-primary px-4 md:px-6 py-2 rounded-lg font-medium text-sm md:text-base">
                  {item.action}
                </button>
                {item.available && (
                  <div className="flex items-center justify-center gap-2 mt-3 text-success text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Disponible ahora
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Categories and Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-body-bg/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 md:p-6 lg:sticky lg:top-32">
              <h3 className="text-white font-semibold text-base md:text-lg mb-4 md:mb-6">Categorías</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-2 md:p-3 rounded-lg transition-all duration-300 text-sm md:text-base ${
                      selectedCategory === category.id
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'hover:bg-body-bg/50 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <category.icon className="h-4 w-4" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm">{category.count}</span>
                  </button>
                ))}
              </div>

              {/* Recent Updates */}
              <div className="mt-6 md:mt-8">
                <h4 className="text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">Actualizaciones Recientes</h4>
                <div className="space-y-3">
                  {recentUpdates.map((update, index) => (
                    <div key={index} className="p-3 bg-body-bg/30 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        {update.type === 'feature' && <Star className="h-4 w-4 text-yellow-400 mt-0.5" />}
                        {update.type === 'maintenance' && <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5" />}
                        {update.type === 'policy' && <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />}
                        <div>
                          <h5 className="text-white text-sm font-medium">{update.title}</h5>
                          <p className="text-gray-400 text-xs">{update.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Articles List */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {selectedCategory === 'all' ? 'Artículos Populares' : 
                 categories.find(cat => cat.id === selectedCategory)?.name + ' - Artículos'}
              </h2>
              <span className="text-gray-400 text-sm md:text-base">
                {filteredArticles.length} artículos encontrados
              </span>
            </div>

            <div className="space-y-4 md:space-y-6">
              {filteredArticles.map((article) => (
                <div key={article.id} className="bg-body-bg/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 md:p-6 hover:bg-body-bg/50 transition-all duration-300 group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                          {categories.find(cat => cat.id === article.category)?.name}
                        </span>
                        <div className="flex items-center gap-4 text-gray-400 text-sm">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{article.views.toLocaleString()} vistas</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{article.helpful}% útil</span>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-300 leading-relaxed">
                        {article.description}
                      </p>
                    </div>
                    
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors ml-4" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 md:mt-6 pt-4 border-t border-gray-700/50 gap-4">
                    <button className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 text-sm md:text-base">
                      Leer artículo completo
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-xs md:text-sm">¿Te fue útil?</span>
                      <button className="p-1.5 md:p-2 hover:bg-gray-600/50 rounded-lg transition-colors">
                        <ThumbsUp className="h-3 w-3 md:h-4 md:w-4 text-gray-400 hover:text-green-400" />
                      </button>
                      <button className="p-1.5 md:p-2 hover:bg-gray-600/50 rounded-lg transition-colors">
                        <ThumbsDown className="h-3 w-3 md:h-4 md:w-4 text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No se encontraron artículos
                </h3>
                <p className="text-gray-300 mb-6">
                  Intenta ajustar tu búsqueda o selecciona una categoría diferente
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Ver todos los artículos
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support CTA */}
        <section className="mt-16 md:mt-20">
          <div className="bg-card border border-accent/20 rounded-2xl p-6 md:p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ¿No encontraste lo que buscabas?
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier pregunta o problema que tengas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <button className="btn-primary px-8 py-4 rounded-lg font-semibold shadow-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Contactar Soporte
              </button>
              <button className="border border-gray-600 text-white hover:bg-body-bg px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horarios de Atención
              </button>
            </div>
          </div>
        </section>
      </Container>
    </main>
  )
}
