'use client'

import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send,
  User,
  HelpCircle,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
    priority: 'medium'
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactMethods = [
    {
      icon: Phone,
      title: "Teléfono",
      description: "Llámanos directamente",
      value: "+51 1 234-5678",
      available: "24/7",
      color: "text-accent"
    },
    {
      icon: Mail,
      title: "Email",
      description: "Escríbenos un correo",
      value: "soporte@boleteria.pe",
      available: "Respuesta en 2-4 horas",
      color: "text-accent"
    },
    {
      icon: MessageCircle,
      title: "Chat en Vivo",
      description: "Habla con un agente",
      value: "Disponible ahora",
      available: "Lun-Dom 8:00-22:00",
      color: "text-accent"
    },
    {
      icon: MapPin,
      title: "Oficina Principal",
      description: "Visítanos en persona",
      value: "Av. Javier Prado Este 123, San Isidro",
      available: "Lun-Vie 9:00-18:00",
      color: "text-accent"
    }
  ]

  const categories = [
    { value: 'tickets', label: 'Problemas con entradas' },
    { value: 'transport', label: 'Consultas de transporte' },
    { value: 'payments', label: 'Problemas de pago' },
    { value: 'refunds', label: 'Solicitud de reembolso' },
    { value: 'technical', label: 'Problemas técnicos' },
    { value: 'corporate', label: 'Ventas corporativas' },
    { value: 'suggestions', label: 'Sugerencias' },
    { value: 'other', label: 'Otros' }
  ]

  const officeHours = [
    { day: 'Lunes - Viernes', hours: '8:00 AM - 10:00 PM' },
    { day: 'Sábados', hours: '9:00 AM - 8:00 PM' },
    { day: 'Domingos', hours: '10:00 AM - 6:00 PM' },
    { day: 'Feriados', hours: '10:00 AM - 4:00 PM' }
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-500' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-500' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de envío del formulario
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <main className="min-h-screen bg-body-bg">
      <div className="particles-bg"></div>
      
      <Container className="relative z-10 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-secondary text-sm mb-6">
          <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
          <ArrowRight className="w-4 h-4 mx-2" />
          <span className="text-primary">Contacto</span>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <MessageCircle className="icon-sm" />
            <span className="text-sm font-medium">Contacto</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-text-primary mb-6">
            ¡Estamos aquí para <span className="text-accent">ayudarte</span>!
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-8 px-4">
            Nuestro equipo de soporte está disponible 24/7 para resolver todas tus dudas 
            y brindarte la mejor experiencia en Boletería.
          </p>
        </div>

        {/* Contact Methods */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-12">
            Canales de Contacto
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="card-default text-center group">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${method.color} bg-body-bg group-hover:bg-card-hover transition-colors`}>
                  <method.icon className="icon-lg" />
                </div>
                <h3 className="text-text-primary font-semibold text-lg mb-2">
                  {method.title}
                </h3>
                <p className="text-text-secondary text-sm mb-3">
                  {method.description}
                </p>
                <p className="text-text-primary font-medium mb-2">
                  {method.value}
                </p>
                <p className="text-text-muted text-xs">
                  {method.available}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card-default">
              <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
                <Send className="icon-md text-accent" />
                Envíanos un Mensaje
              </h2>
              
              {isSubmitted && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6 flex items-center gap-3">
                  <CheckCircle className="icon-sm text-success" />
                  <div>
                    <p className="text-success font-medium">¡Mensaje enviado exitosamente!</p>
                    <p className="text-success/80 text-sm">Te responderemos en las próximas 2-4 horas.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-text-primary font-medium mb-2">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-sm text-text-muted" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="input-default pl-12"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-text-primary font-medium mb-2">
                      Correo Electrónico *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-sm text-text-muted" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="input-default pl-12"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-text-primary font-medium mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-sm text-text-muted" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input-default pl-12"
                        placeholder="+51 999 999 999"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-text-primary font-medium mb-2">
                      Categoría *
                    </label>
                    <div className="relative">
                      <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-sm text-text-muted" />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="input-default pl-12"
                      >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-text-primary font-medium mb-2">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="input-default"
                    placeholder="Resumen de tu consulta"
                  />
                </div>

                <div>
                  <label className="block text-text-primary font-medium mb-2">
                    Prioridad
                  </label>
                  <div className="flex gap-4">
                    {[
                      { value: 'low', label: 'Baja', color: 'text-success' },
                      { value: 'medium', label: 'Media', color: 'text-warning' },
                      { value: 'high', label: 'Alta', color: 'text-error' }
                    ].map((priority) => (
                      <label key={priority.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value={priority.value}
                          checked={formData.priority === priority.value}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-accent"
                        />
                        <span className={`${priority.color} font-medium`}>
                          {priority.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-text-primary font-medium mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="textarea-default resize-vertical"
                    placeholder="Describe tu consulta o problema en detalle..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-4 rounded-lg font-semibold shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="icon-sm" />
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Office Hours */}
            <div className="card-info p-6">
              <h3 className="text-text-primary font-semibold text-lg mb-6 flex items-center gap-2">
                <Clock className="icon-sm text-accent" />
                Horarios de Atención
              </h3>
              <div className="space-y-3">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                    <span className="text-text-secondary">{schedule.day}</span>
                    <span className="text-text-primary font-medium">{schedule.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2 text-success text-sm">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  Estamos disponibles ahora
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="card-info border-error/20 p-6">
              <h3 className="text-text-primary font-semibold text-lg mb-4 flex items-center gap-2">
                <Phone className="icon-sm text-error" />
                Contacto de Emergencia
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                Para problemas urgentes durante eventos en curso:
              </p>
              <a
                href="tel:+51987654321"
                className="bg-error hover:bg-error/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors block text-center"
              >
                +51 987 654 321
              </a>
              <p className="text-text-muted text-xs mt-2 text-center">
                Disponible 24/7 solo para emergencias
              </p>
            </div>

            {/* Social Media */}
            <div className="card-info p-6">
              <h3 className="text-text-primary font-semibold text-lg mb-6">
                Síguenos en Redes Sociales
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`flex items-center gap-3 p-3 bg-body-bg hover:bg-card-hover rounded-lg transition-all duration-300 group ${social.color}`}
                    >
                      <Icon className="icon-sm text-text-muted group-hover:text-current" />
                      <span className="text-text-secondary group-hover:text-text-primary text-sm">
                        {social.name}
                      </span>
                    </a>
                  )
                })}
              </div>
              <p className="text-text-muted text-xs mt-4 text-center">
                Síguenos para ofertas exclusivas y novedades
              </p>
            </div>

            {/* FAQ Link */}
            <div className="card-info border-accent/20 p-6 text-center">
              <HelpCircle className="icon-xl text-accent mx-auto mb-4" />
              <h3 className="text-text-primary font-semibold text-lg mb-2">
                ¿Preguntas Frecuentes?
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                Encuentra respuestas rápidas a las consultas más comunes
              </p>
              <a
                href="/faq"
                className="btn-primary inline-block"
              >
                Ver FAQ
              </a>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}
