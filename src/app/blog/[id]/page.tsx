'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Eye, 
  Tag, 
  Share2, 
  Heart, 
  MessageCircle,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Facebook,
  Twitter,
  Linkedin,
  Send
} from 'lucide-react'

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

interface Comment {
  id: string
  author: string
  content: string
  date: string
  likes: number
  dislikes: number
  replies?: Comment[]
}

// Mock data para el blog post
const mockPost: BlogPost = {
  id: '1',
  title: 'Los mejores destinos para viajar en bus por Perú en 2025',
  excerpt: 'Descubre las rutas más espectaculares y consejos para disfrutar al máximo tu viaje por carretera.',
  content: `
    <h2>Introducción</h2>
    <p>Viajar en bus por Perú es una experiencia única que te permite descubrir paisajes increíbles, conectar con las culturas locales y vivir aventuras inolvidables. En 2025, las rutas de transporte terrestre han mejorado significativamente, ofreciendo mayor comodidad y seguridad para los viajeros.</p>
    
    <h2>Los Mejores Destinos</h2>
    
    <h3>1. Lima a Cusco - La Ruta del Imperio</h3>
    <p>Esta legendaria ruta de aproximadamente 1,165 kilómetros te lleva desde la capital hasta la antigua capital del Imperio Inca. El viaje puede durar entre 20 a 24 horas, pero las vistas de los Andes peruanos hacen que cada kilómetro valga la pena.</p>
    
    <h4>Puntos destacados:</h4>
    <ul>
      <li>Paisajes andinos espectaculares</li>
      <li>Paradas en pueblos tradicionales</li>
      <li>Vista de nevados y valles</li>
      <li>Llegada a la puerta de entrada a Machu Picchu</li>
    </ul>
    
    <h3>2. Lima a Arequipa - El Camino del Sur</h3>
    <p>Una ruta costera que se adentra hacia los Andes, perfecta para quienes buscan variedad de paisajes. Son aproximadamente 1,010 kilómetros de pura belleza natural.</p>
    
    <h4>Atractivos del recorrido:</h4>
    <ul>
      <li>Desierto costero y oasis</li>
      <li>Vista del Volcán Misti</li>
      <li>Arquitectura colonial en Arequipa</li>
      <li>Gastronomía regional excepcional</li>
    </ul>
    
    <h3>3. Cusco a Puno - Altiplano Mágico</h3>
    <p>Un viaje corto pero impresionante de 390 kilómetros que atraviesa el altiplano peruano, llevándote desde la ciudad imperial hasta las orillas del Lago Titicaca.</p>
    
    <h2>Consejos para un Viaje Perfecto</h2>
    
    <h3>Preparación del Viaje</h3>
    <p>Antes de embarcarte en tu aventura, es importante tener en cuenta algunos aspectos esenciales:</p>
    
    <ul>
      <li><strong>Reserva con anticipación:</strong> Los buses de mejor calidad se agotan rápidamente, especialmente en temporada alta.</li>
      <li><strong>Documentación:</strong> Lleva siempre tu DNI o pasaporte en original.</li>
      <li><strong>Equipaje:</strong> Empaca ligero pero incluye ropa para diferentes climas.</li>
      <li><strong>Medicamentos:</strong> Si eres sensible a la altura, consulta con un médico sobre medicación preventiva.</li>
    </ul>
    
    <h3>Durante el Viaje</h3>
    <p>Para hacer tu experiencia más cómoda y segura:</p>
    
    <ul>
      <li><strong>Hidratación:</strong> Bebe abundante agua, especialmente en rutas de altura.</li>
      <li><strong>Alimentación:</strong> Come ligero antes y durante el viaje.</li>
      <li><strong>Entretenimiento:</strong> Lleva libros, música o películas descargadas.</li>
      <li><strong>Descanso:</strong> Utiliza almohadas de viaje y mantas para mayor comodidad.</li>
    </ul>
    
    <h2>Empresas Recomendadas</h2>
    <p>Las siguientes empresas ofrecen servicios de calidad con diferentes niveles de comodidad:</p>
    
    <ul>
      <li><strong>Cruz del Sur:</strong> Líder en servicios premium y comodidad.</li>
      <li><strong>Oltursa:</strong> Excelente relación calidad-precio con servicios VIP.</li>
      <li><strong>Civa:</strong> Amplia cobertura nacional con servicios confiables.</li>
      <li><strong>Movil Tours:</strong> Especialista en rutas al norte del país.</li>
    </ul>
    
    <h2>Recomendaciones de Seguridad</h2>
    <p>Tu seguridad es primordial durante el viaje:</p>
    
    <ul>
      <li>Mantén tus objetos de valor siempre contigo</li>
      <li>No aceptes alimentos o bebidas de desconocidos</li>
      <li>Informa a familiares sobre tu itinerario</li>
      <li>Lleva un kit básico de primeros auxilios</li>
      <li>Consulta las condiciones climáticas antes de viajar</li>
    </ul>
    
    <h2>Conclusión</h2>
    <p>Viajar en bus por Perú es mucho más que un simple medio de transporte; es una oportunidad de conectar con la esencia del país, sus paisajes y su gente. Con la preparación adecuada y una actitud aventurera, tu viaje por carretera será una experiencia inolvidable que recordarás toda la vida.</p>
    
    <p>¿Estás listo para tu próxima aventura en bus por Perú? ¡Las rutas te esperan!</p>
  `,
  author: 'María García',
  date: '2025-06-01',
  readTime: '5 min',
  views: 1250,
  category: 'Viajes',
  tags: ['Turismo', 'Transporte', 'Perú', 'Aventura', 'Consejos'],
  image: '/images/blog/bus-travel.jpg',
  featured: true
}

const mockComments: Comment[] = [
  {
    id: '1',
    author: 'Carlos Mendoza',
    content: 'Excelente artículo! Justo lo que necesitaba para planificar mi viaje a Cusco. ¿Podrías recomendar alguna empresa específica para la ruta Lima-Cusco?',
    date: '2025-06-02',
    likes: 8,
    dislikes: 0,
    replies: [
      {
        id: '1-1',
        author: 'María García',
        content: 'Gracias Carlos! Te recomiendo Cruz del Sur para esa ruta, tienen muy buen servicio y buses cómodos. También Oltursa es una excelente opción.',
        date: '2025-06-02',
        likes: 5,
        dislikes: 0
      }
    ]
  },
  {
    id: '2',
    author: 'Ana Rodriguez',
    content: 'Muy útil la información sobre el equipaje. No había pensado en llevar ropa para diferentes climas. ¡Gracias por los consejos!',
    date: '2025-06-03',
    likes: 12,
    dislikes: 1
  },
  {
    id: '3',
    author: 'Pedro Vargas',
    content: 'He viajado varias veces por estas rutas y confirmo que los paisajes son espectaculares. Solo agregaría que es importante llevar snacks saludables para el viaje.',
    date: '2025-06-03',
    likes: 6,
    dislikes: 0
  }
]

const relatedPosts = [
  {
    id: '2',
    title: 'Cómo elegir los mejores asientos en conciertos y eventos',
    excerpt: 'Guía completa para seleccionar la ubicación perfecta según el tipo de evento y tu presupuesto.',
    category: 'Eventos',
    readTime: '4 min',
    image: '/images/blog/concert-seats.jpg'
  },
  {
    id: '3',
    title: 'Festivales de música en Lima: Todo lo que necesitas saber',
    excerpt: 'Los próximos festivales que no te puedes perder en la capital peruana.',
    category: 'Música', 
    readTime: '6 min',
    image: '/images/blog/music-festivals.jpg'
  },
  {
    id: '4',
    title: 'Consejos para viajar seguro en transporte público',
    excerpt: 'Medidas de seguridad y recomendaciones para un viaje tranquilo.',
    category: 'Seguridad',
    readTime: '3 min',
    image: '/images/blog/safe-travel.jpg'
  }
]

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)

  useEffect(() => {
    // En una implementación real, aquí harías una llamada a la API
    setPost(mockPost)
    
    // Incrementar vistas
    if (post) {
      setPost(prev => prev ? { ...prev, views: prev.views + 1 } : null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Usuario Anónimo', // En una app real, vendría del usuario autenticado
      content: newComment,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      dislikes: 0
    }

    setComments(prev => [comment, ...prev])
    setNewComment('')
    setShowCommentForm(false)
  }

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ))
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  if (!post) {
    return (
      <div className="min-h-screen bg-body-bg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Cargando artículo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-body-bg">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-body-bg/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-lg transition-colors ${
                  isLiked ? 'text-red-400 bg-red-400/20' : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShareDropdownOpen(!shareDropdownOpen)}
                  className="p-2 text-gray-400 hover:text-blue-400 rounded-lg transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>

                {shareDropdownOpen && (
                  <div className="absolute right-0 top-12 bg-body-bg/90 backdrop-blur-md rounded-lg p-4 min-w-[200px] border border-white/10">
                    <p className="text-white text-sm mb-3">Compartir artículo</p>
                    <div className="flex gap-2">
                      <a
                        href={`https://facebook.com/sharer/sharer.php?u=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${post.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                      <a
                        href={`https://linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 text-white z-10">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-400/30">
                  {post.category}
                </span>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.date).toLocaleDateString('es-PE')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views}</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{post.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{post.excerpt}</p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">{post.author}</div>
                  <div className="text-gray-400 text-sm">Autor</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-3">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8"
            >
              <div 
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{
                  '--tw-prose-body': '#e5e7eb',
                  '--tw-prose-headings': '#ffffff',
                  '--tw-prose-lead': '#d1d5db',
                  '--tw-prose-links': '#60a5fa',
                  '--tw-prose-bold': '#ffffff',
                  '--tw-prose-counters': '#9ca3af',
                  '--tw-prose-bullets': '#6b7280',
                  '--tw-prose-hr': '#374151',
                  '--tw-prose-quotes': '#e5e7eb',
                  '--tw-prose-quote-borders': '#374151',
                  '--tw-prose-captions': '#9ca3af',
                  '--tw-prose-code': '#e5e7eb',
                  '--tw-prose-pre-code': '#e5e7eb',
                  '--tw-prose-pre-bg': 'rgba(0, 0, 0, 0.5)',
                  '--tw-prose-th-borders': '#374151',
                  '--tw-prose-td-borders': '#374151'
                } as React.CSSProperties}
              />
            </motion.article>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
            >
              <h3 className="text-white font-semibold mb-4">Etiquetas</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-400/30 hover:bg-blue-500/30 transition-colors cursor-pointer"
                  >
                    <Tag className="h-3 w-3 inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Comentarios ({comments.length})
                </h3>
                <button
                  onClick={() => setShowCommentForm(!showCommentForm)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Comentar
                </button>
              </div>

              {/* Comment Form */}
              {showCommentForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleSubmitComment}
                  className="mb-8 p-6 bg-white/5 rounded-lg border border-white/10"
                >
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu comentario..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowCommentForm(false)}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Enviar
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-white/10 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-white">{comment.author}</h4>
                          <span className="text-gray-400 text-sm">
                            {new Date(comment.date).toLocaleDateString('es-PE')}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{comment.content}</p>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleLikeComment(comment.id)}
                            className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition-colors"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span className="text-sm">{comment.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                            <ThumbsDown className="h-4 w-4" />
                            <span className="text-sm">{comment.dislikes}</span>
                          </button>
                          <button className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                            Responder
                          </button>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 pl-6 border-l-2 border-white/10 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-semibold text-white text-sm">{reply.author}</h5>
                                    <span className="text-gray-400 text-xs">
                                      {new Date(reply.date).toLocaleDateString('es-PE')}
                                    </span>
                                  </div>
                                  <p className="text-gray-300 text-sm">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Posts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-white mb-6">Artículos relacionados</h3>
              <div className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.id}`}
                    className="block group"
                  >
                    <article className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="aspect-video bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-white text-xs">Imagen</span>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded">
                          {relatedPost.category}
                        </span>
                        <h4 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-blue-300 transition-colors">
                          {relatedPost.title}
                        </h4>
                        <p className="text-gray-300 text-xs line-clamp-2">{relatedPost.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-gray-400 text-xs">
                            <Clock className="h-3 w-3" />
                            <span>{relatedPost.readTime}</span>
                          </div>
                          <ArrowRight className="h-3 w-3 text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Newsletter */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30">
                <h4 className="text-white font-semibold mb-2">Suscríbete</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Recibe los últimos artículos directamente en tu correo
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Tu email"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded text-sm hover:shadow-lg transition-shadow">
                    Suscribirse
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
