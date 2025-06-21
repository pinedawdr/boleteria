'use client'

import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Calendar, 
  Bus, 
  CreditCard, 
  User, 
  Shield, 
  MessageCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Clock,
  CheckCircle
} from 'lucide-react'
import { useState } from 'react'
import { Container } from '@/components/layout'

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const categories = [
    { id: 'all', name: 'Todas', icon: HelpCircle, count: 24 },
    { id: 'tickets', name: 'Entradas', icon: Calendar, count: 8 },
    { id: 'transport', name: 'Transporte', icon: Bus, count: 6 },
    { id: 'payments', name: 'Pagos', icon: CreditCard, count: 5 },
    { id: 'account', name: 'Cuenta', icon: User, count: 3 },
    { id: 'security', name: 'Seguridad', icon: Shield, count: 2 }
  ]

  const faqs = [
    {
      id: 1,
      category: 'tickets',
      question: '¿Cómo compro entradas para un evento?',
      answer: 'Para comprar entradas, navega al evento de tu interés, selecciona la cantidad de entradas, elige tu método de pago y completa la compra. Recibirás un email de confirmación con tus entradas digitales.',
      helpful: 156,
      notHelpful: 3,
      lastUpdated: '2024-03-15'
    },
    {
      id: 2,
      category: 'tickets',
      question: '¿Puedo cancelar o cambiar mis entradas?',
      answer: 'Las políticas de cancelación varían según el evento. Puedes solicitar cancelaciones hasta 24 horas antes del evento para eventos generales, y hasta 48 horas para conciertos. Las tarifas de procesamiento pueden aplicar.',
      helpful: 142,
      notHelpful: 8,
      lastUpdated: '2024-03-12'
    },
    {
      id: 3,
      category: 'tickets',
      question: '¿Cómo accedo a mis entradas digitales?',
      answer: 'Tus entradas digitales están disponibles en tu cuenta de Boletería inmediatamente después de la compra. También puedes encontrarlas en el email de confirmación. Asegúrate de tener el código QR listo en tu móvil para el acceso.',
      helpful: 189,
      notHelpful: 2,
      lastUpdated: '2024-03-10'
    },
    {
      id: 4,
      category: 'transport',
      question: '¿Cómo reservo transporte?',
      answer: 'En la sección de transporte, selecciona tu origen y destino, elige la fecha y hora, selecciona el tipo de servicio y completa tu reserva. Recibirás un código de confirmación por email.',
      helpful: 134,
      notHelpful: 5,
      lastUpdated: '2024-03-08'
    },
    {
      id: 5,
      category: 'transport',
      question: '¿Puedo cambiar mi reserva de transporte?',
      answer: 'Sí, puedes modificar tu reserva hasta 2 horas antes de la salida programada sin costo adicional. Cambios realizados con menos tiempo pueden incurrir en tarifas adicionales.',
      helpful: 98,
      notHelpful: 12,
      lastUpdated: '2024-03-05'
    },
    {
      id: 6,
      category: 'transport',
      question: '¿Qué debo llevar para abordar el transporte?',
      answer: 'Necesitas presentar tu DNI o pasaporte junto con el código de confirmación de tu reserva. Para menores de edad, se requiere autorización notarial si viajan sin padres.',
      helpful: 167,
      notHelpful: 4,
      lastUpdated: '2024-03-03'
    },
    {
      id: 7,
      category: 'payments',
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard), billeteras digitales (Yape, Plin), transferencias bancarias, y pagos en efectivo en puntos autorizados.',
      helpful: 203,
      notHelpful: 1,
      lastUpdated: '2024-03-01'
    },
    {
      id: 8,
      category: 'payments',
      question: '¿Por qué fue rechazado mi pago?',
      answer: 'Los pagos pueden ser rechazados por fondos insuficientes, información incorrecta de la tarjeta, o restricciones del banco. Verifica los datos e intenta nuevamente. Si persiste, contacta a tu banco.',
      helpful: 127,
      notHelpful: 18,
      lastUpdated: '2024-02-28'
    },
    {
      id: 9,
      category: 'payments',
      question: '¿Es seguro guardar mi información de pago?',
      answer: 'Sí, utilizamos encriptación de nivel bancario y cumplimos con los estándares PCI DSS para proteger tu información financiera. Nunca almacenamos tu CVV completo.',
      helpful: 245,
      notHelpful: 2,
      lastUpdated: '2024-02-25'
    },
    {
      id: 10,
      category: 'account',
      question: '¿Cómo creo una cuenta?',
      answer: 'Haz clic en "Registrarse", completa tus datos básicos, verifica tu email y listo. También puedes registrarte usando tu cuenta de Google o Facebook para mayor comodidad.',
      helpful: 178,
      notHelpful: 3,
      lastUpdated: '2024-02-22'
    },
    {
      id: 11,
      category: 'account',
      question: '¿Cómo recupero mi contraseña?',
      answer: 'En la página de login, haz clic en "¿Olvidaste tu contraseña?", ingresa tu email y te enviaremos un enlace para crear una nueva contraseña.',
      helpful: 156,
      notHelpful: 5,
      lastUpdated: '2024-02-20'
    },
    {
      id: 12,
      category: 'security',
      question: '¿Cómo protegen mi información personal?',
      answer: 'Implementamos múltiples capas de seguridad incluyendo encriptación SSL, autenticación de dos factores opcional, y auditorías de seguridad regulares. Tu privacidad es nuestra prioridad.',
      helpful: 198,
      notHelpful: 1,
      lastUpdated: '2024-02-18'
    }
  ]

  const popularTopics = [
    { title: 'Proceso de compra de entradas', searches: 2340 },
    { title: 'Cancelaciones y reembolsos', searches: 1890 },
    { title: 'Problemas con pagos', searches: 1560 },
    { title: 'Entradas digitales y QR', searches: 1230 },
    { title: 'Reservas de transporte', searches: 980 }
  ]

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleHelpful = (faqId: number, helpful: boolean) => {
    // Aquí iría la lógica para registrar si la respuesta fue útil
    console.log(`FAQ ${faqId} marked as ${helpful ? 'helpful' : 'not helpful'}`)
  }

  return (
    <main className="min-h-screen bg-body-bg">
      <div className="particles-bg"></div>
      
      <Container className="relative z-10 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <HelpCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Preguntas Frecuentes</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-6">
            Encuentra <span className="text-accent">respuestas</span> rápidas
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 px-4">
            Resuelve tus dudas al instante con nuestra base de conocimientos. 
            Si no encuentras lo que buscas, nuestro equipo estará encantado de ayudarte.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8 px-4">
            <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="¿Qué necesitas saber?"
              className="w-full pl-12 pr-4 py-3 md:py-4 bg-body-bg/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none text-white placeholder-gray-400 text-base md:text-lg"
            />
          </div>
          
          {/* Popular Topics */}
          <div className="flex flex-wrap justify-center gap-3">
            {popularTopics.slice(0, 3).map((topic, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(topic.title)}
                className="bg-body-bg/50 hover:bg-body-bg/50 text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm transition-all duration-300 border border-gray-600/30 hover:border-accent/50"
              >
                {topic.title}
              </button>
            ))}
          </div>
        </div>

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
                        ? 'bg-accent/20 text-accent border border-accent/30'
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

              {/* Popular Topics */}
              <div className="mt-8">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Temas Populares
                </h4>
                <div className="space-y-3">
                  {popularTopics.map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(topic.title)}
                      className="w-full text-left p-3 bg-body-bg/30 hover:bg-gray-600/50 rounded-lg transition-colors group"
                    >
                      <div className="text-gray-300 group-hover:text-white text-sm font-medium mb-1">
                        {topic.title}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {topic.searches.toLocaleString()} búsquedas
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Help CTA */}
              <div className="mt-8 p-4 bg-card border border-accent/20 rounded-lg text-center">
                <MessageCircle className="h-8 w-8 text-accent mx-auto mb-3" />
                <h4 className="text-white font-semibold mb-2">¿Necesitas más ayuda?</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Contacta con nuestro equipo de soporte
                </p>
                <button className="bg-accent hover:bg-accent/90 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Contactar Soporte
                </button>
              </div>
            </div>
          </div>

          {/* FAQ List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                {selectedCategory === 'all' ? 'Todas las Preguntas' : 
                 categories.find(cat => cat.id === selectedCategory)?.name + ' - Preguntas'}
              </h2>
              <span className="text-gray-400">
                {filteredFAQs.length} resultados encontrados
              </span>
            </div>

            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="bg-body-bg/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:bg-body-bg/30 transition-all duration-300">
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-body-bg/20 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-accent/10 text-accent px-2 py-1 rounded text-xs font-medium">
                          {categories.find(cat => cat.id === faq.category)?.name}
                        </span>
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>Actualizado {faq.lastUpdated}</span>
                        </div>
                      </div>
                      <h3 className="text-white font-semibold text-lg">
                        {faq.question}
                      </h3>
                    </div>
                    {expandedItems.includes(faq.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  {expandedItems.includes(faq.id) && (
                    <div className="px-6 pb-6">
                      <div className="bg-body-bg/30 rounded-lg p-4 mb-4">
                        <p className="text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                      
                      {/* Helpful Section */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                        <div className="flex items-center gap-4">
                          <span className="text-gray-400 text-sm">¿Te fue útil esta respuesta?</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleHelpful(faq.id, true)}
                              className="flex items-center gap-1 px-3 py-1 hover:bg-green-500/10 rounded-lg transition-colors group"
                            >
                              <ThumbsUp className="h-4 w-4 text-gray-400 group-hover:text-green-400" />
                              <span className="text-sm text-gray-400 group-hover:text-green-400">
                                Sí ({faq.helpful})
                              </span>
                            </button>
                            <button
                              onClick={() => handleHelpful(faq.id, false)}
                              className="flex items-center gap-1 px-3 py-1 hover:bg-red-500/10 rounded-lg transition-colors group"
                            >
                              <ThumbsDown className="h-4 w-4 text-gray-400 group-hover:text-red-400" />
                              <span className="text-sm text-gray-400 group-hover:text-red-400">
                                No ({faq.notHelpful})
                              </span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <CheckCircle className="h-4 w-4" />
                          <span>{Math.round((faq.helpful / (faq.helpful + faq.notHelpful)) * 100)}% útil</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No se encontraron preguntas
                </h3>
                <p className="text-gray-300 mb-6">
                  Intenta ajustar tu búsqueda o selecciona una categoría diferente
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                    className="bg-accent hover:bg-accent/90 text-black px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Ver todas las preguntas
                  </button>
                  <button className="border border-gray-600 text-white hover:bg-body-bg px-6 py-3 rounded-lg font-medium transition-colors">
                    Contactar Soporte
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support CTA */}
        <section className="mt-20">
          <div className="bg-card border border-accent/20 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Sigues teniendo dudas?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Nuestro equipo de soporte especializado está listo para ayudarte 
              con cualquier pregunta que no esté cubierta aquí.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary px-8 py-4 rounded-lg font-semibold shadow-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Contactar Soporte
              </button>
              <button className="border border-gray-600 text-white hover:bg-body-bg px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Ver Guías Detalladas
              </button>
            </div>
          </div>
        </section>
      </Container>
    </main>
  )
}
