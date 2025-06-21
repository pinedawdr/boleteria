'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Heart
} from 'lucide-react'
import { Container } from '@/components/layout'
import { PaymentMethods } from '@/components/PaymentMethods'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    empresa: [
      { name: 'Acerca de Nosotros', href: '/about' },
      { name: 'Términos y Condiciones', href: '/terms' },
      { name: 'Política de Privacidad', href: '/privacy' },
      { name: 'Política de Reembolsos', href: '/refunds' },
    ],
    servicios: [
      { name: 'Eventos', href: '/events' },
      { name: 'Transportes', href: '/transport' },
      { name: 'Venta Corporativa', href: '/corporate' },
      { name: 'Blog', href: '/blog' },
    ],
    soporte: [
      { name: 'Centro de Ayuda', href: '/help' },
      { name: 'Contáctanos', href: '/contact' },
      { name: 'Preguntas Frecuentes', href: '/faq' },
      { name: 'Estado del Servicio', href: '/status' },
    ]
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-500' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-500' },
  ]

  return (
    <footer className="footer-gametime border-default">
      <Container size="xl" padding="xl" className="py-6 sm:py-8 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 mb-6 sm:mb-8 md:mb-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex justify-center lg:justify-start mb-4 sm:mb-6">
              <Image 
                src="/logo-optimized.svg" 
                alt="Boletería Logo" 
                width={80} 
                height={24}
                className="h-6 w-auto sm:h-7 md:h-8 lg:h-9 transition-opacity duration-300 drop-shadow-lg"
                priority
              />
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm leading-relaxed text-center lg:text-left">
              La plataforma líder en venta de entradas para eventos y reserva de transportes en Perú.
            </p>
          </div>

          {/* Links Sections */}
          <div className="text-center lg:text-left">
            <h3 className="text-primary font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-secondary hover:text-accent text-sm transition-colors duration-200 inline-block h-auto p-0 justify-center lg:justify-start"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center lg:text-left">
            <h3 className="text-primary font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              {footerLinks.servicios.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-secondary hover:text-accent text-sm transition-colors duration-200 inline-block h-auto p-0 justify-center lg:justify-start"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center lg:text-left">
            <h3 className="text-primary font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2">
              {footerLinks.soporte.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-secondary hover:text-accent text-sm transition-colors duration-200 inline-block h-auto p-0 justify-center lg:justify-start"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between py-6 sm:py-8 border-t border-default">
          {/* Social Media */}
          <div className="flex items-center gap-3 sm:gap-4 mb-4 md:mb-0">
            <span className="text-text-secondary text-xs sm:text-sm font-medium">
              Síguenos:
            </span>
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  title={social.name}
                  className="p-1.5 sm:p-2 text-text-secondary hover:text-accent hover:bg-card-hover transition-all duration-200 rounded-lg inline-flex items-center justify-center"
                >
                  <Icon className="icon-sm" />
                </a>
              )
            })}
          </div>

          {/* Copyright */}
          <div className="text-text-secondary text-xs sm:text-sm text-center md:text-right">
            <p className="mb-1">© {currentYear} Boletería. Todos los derechos reservados.</p>
            <p className="text-xs flex items-center justify-center md:justify-end gap-1">
              Desarrollado con 
              <Heart className="icon-xs text-accent fill-current" />
              en Perú
            </p>
          </div>
        </div>

        {/* Payment Methods */}
        <PaymentMethods />
      </Container>
    </footer>
  )
}
