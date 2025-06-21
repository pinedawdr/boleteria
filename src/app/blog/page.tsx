'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, User, ArrowRight, Search, Tag, Clock, Eye } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: string
  views: number
  category: string
  tags: string[]
  image: string
  featured: boolean
}

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Los mejores destinos para viajar en bus por Perú en 2025',
    excerpt: 'Descubre las rutas más espectaculares y consejos para disfrutar al máximo tu viaje por carretera.',
    content: '',
    author: 'María García',
    date: '2025-06-01',
    readTime: '5 min',
    views: 1250,
    category: 'Viajes',
    tags: ['Turismo', 'Transporte', 'Perú'],
    image: '/images/blog/bus-travel.jpg',
    featured: true
  },
  {
    id: '2',
    title: 'Cómo elegir los mejores asientos en conciertos y eventos',
    excerpt: 'Guía completa para seleccionar la ubicación perfecta según el tipo de evento y tu presupuesto.',
    content: '',
    author: 'Carlos Mendoza',
    date: '2025-05-28',
    readTime: '4 min',
    views: 890,
    category: 'Eventos',
    tags: ['Conciertos', 'Teatro', 'Entretenimiento'],
    image: '/images/blog/concert-seats.jpg',
    featured: true
  },
  {
    id: '3',
    title: 'Festivales de música en Lima: Todo lo que necesitas saber',
    excerpt: 'Los próximos festivales que no te puedes perder en la capital peruana.',
    content: '',
    author: 'Ana Rosales',
    date: '2025-05-25',
    readTime: '6 min',
    views: 2100,
    category: 'Música',
    tags: ['Festivales', 'Lima', 'Música'],
    image: '/images/blog/music-festivals.jpg',
    featured: false
  },
  {
    id: '4',
    title: 'Consejos para viajar seguro en transporte público',
    excerpt: 'Medidas de seguridad y recomendaciones para un viaje tranquilo.',
    content: '',
    author: 'Luis Vargas',
    date: '2025-05-20',
    readTime: '3 min',
    views: 645,
    category: 'Seguridad',
    tags: ['Seguridad', 'Transporte', 'Consejos'],
    image: '/images/blog/safe-travel.jpg',
    featured: false
  },
  {
    id: '5',
    title: 'La revolución digital en la boletería peruana',
    excerpt: 'Cómo la tecnología está cambiando la forma de comprar entradas en el Perú.',
    content: '',
    author: 'Ricardo Silva',
    date: '2025-05-15',
    readTime: '7 min',
    views: 1580,
    category: 'Tecnología',
    tags: ['Tecnología', 'Innovación', 'Boletería'],
    image: '/images/blog/digital-tickets.jpg',
    featured: false
  },
  {
    id: '6',
    title: 'Eventos culturales imperdibles en el sur del Perú',
    excerpt: 'Festivales, conciertos y obras de teatro que debes visitar en Cusco, Arequipa y más.',
    content: '',
    author: 'Patricia Lozano',
    date: '2025-05-10',
    readTime: '8 min',
    views: 920,
    category: 'Cultura',
    tags: ['Cultura', 'Sur del Perú', 'Festivales'],
    image: '/images/blog/cultural-events.jpg',
    featured: false
  }
]

const categories = ['Todos', 'Viajes', 'Eventos', 'Música', 'Seguridad', 'Tecnología', 'Cultura']

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [filteredPosts, setFilteredPosts] = useState(mockPosts)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterPosts(term, selectedCategory)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterPosts(searchTerm, category)
  }

  const filterPosts = (term: string, category: string) => {
    let filtered = mockPosts

    if (category !== 'Todos') {
      filtered = filtered.filter(post => post.category === category)
    }

    if (term) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(term.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(term.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
      )
    }

    setFilteredPosts(filtered)
  }

  const featuredPosts = filteredPosts.filter(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-body-bg py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Blog de <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Boletería</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubre consejos de viaje, guías de eventos, y las últimas noticias del mundo del entretenimiento y turismo en Perú
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Artículos destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden hover:bg-white/15 transition-colors group"
                >
                  <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-sm">Imagen del artículo</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                        {post.category}
                      </span>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.date).toLocaleDateString('es-PE')}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-400 text-sm">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.author}</span>
                        <Clock className="h-4 w-4 ml-3 mr-1" />
                        <span>{post.readTime}</span>
                        <Eye className="h-4 w-4 ml-3 mr-1" />
                        <span>{post.views}</span>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-blue-300 hover:text-blue-200 transition-colors flex items-center"
                      >
                        Leer más
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Más artículos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:bg-white/15 transition-colors group"
                >
                  <div className="aspect-video bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-sm">Imagen del artículo</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                        {post.category}
                      </span>
                      <div className="flex items-center text-gray-400 text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.date).toLocaleDateString('es-PE')}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-400 text-xs">
                        <User className="h-3 w-3 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded text-xs">
                            <Tag className="h-3 w-3 inline mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-purple-300 hover:text-purple-200 transition-colors flex items-center text-sm"
                      >
                        Leer
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No se encontraron artículos</h3>
            <p className="text-gray-400 mb-6">
              Intenta con otros términos de búsqueda o explora diferentes categorías
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('Todos')
                setFilteredPosts(mockPosts)
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow"
            >
              Ver todos los artículos
            </button>
          </motion.div>
        )}

        {/* Newsletter Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-8 mt-12 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Suscríbete a nuestro newsletter
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Recibe las últimas noticias, consejos de viaje y ofertas especiales directamente en tu correo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow whitespace-nowrap">
              Suscribirse
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
