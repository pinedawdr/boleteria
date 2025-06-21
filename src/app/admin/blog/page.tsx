'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  TrendingUp,
  Clock,
  MoreVertical,
  Download,
  Save,
  X
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
  status: 'draft' | 'published' | 'archived'
  featured: boolean
}

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Los mejores destinos para viajar en bus por Perú en 2025',
    excerpt: 'Descubre las rutas más espectaculares y consejos para disfrutar al máximo tu viaje por carretera.',
    content: '...',
    author: 'María García',
    date: '2025-06-01',
    readTime: '5 min',
    views: 1250,
    category: 'Viajes',
    tags: ['Turismo', 'Transporte', 'Perú'],
    status: 'published',
    featured: true
  },
  {
    id: '2',
    title: 'Cómo elegir los mejores asientos en conciertos y eventos',
    excerpt: 'Guía completa para seleccionar la ubicación perfecta según el tipo de evento y tu presupuesto.',
    content: '...',
    author: 'Carlos Mendoza',
    date: '2025-05-28',
    readTime: '4 min',
    views: 890,
    category: 'Eventos',
    tags: ['Conciertos', 'Teatro', 'Entretenimiento'],
    status: 'published',
    featured: true
  },
  {
    id: '3',
    title: 'Festivales de música en Lima: Todo lo que necesitas saber',
    excerpt: 'Los próximos festivales que no te puedes perder en la capital peruana.',
    content: '...',
    author: 'Ana Rosales',
    date: '2025-05-25',
    readTime: '6 min',
    views: 2100,
    category: 'Música',
    tags: ['Festivales', 'Lima', 'Música'],
    status: 'published',
    featured: false
  },
  {
    id: '4',
    title: 'Consejos para viajar seguro en transporte público',
    excerpt: 'Medidas de seguridad y recomendaciones para un viaje tranquilo.',
    content: '...',
    author: 'Luis Vargas',
    date: '2025-05-20',
    readTime: '3 min',
    views: 645,
    category: 'Seguridad',
    tags: ['Seguridad', 'Transporte', 'Consejos'],
    status: 'draft',
    featured: false
  }
]

const categories = ['Todos', 'Viajes', 'Eventos', 'Música', 'Seguridad', 'Tecnología', 'Cultura']

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedStatus, setSelectedStatus] = useState('Todos')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    category: 'Viajes',
    tags: [],
    status: 'draft',
    featured: false
  })

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory
    const matchesStatus = selectedStatus === 'Todos' || post.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-success/20 text-success border-success/30'
      case 'draft': return 'bg-warning/20 text-warning border-warning/30'
      case 'archived': return 'bg-text-muted/20 text-text-muted border-text-muted/30'
      default: return 'bg-text-muted/20 text-text-muted border-text-muted/30'
    }
  }

  const handleCreatePost = () => {
    const post: BlogPost = {
      id: Date.now().toString(),
      title: newPost.title || '',
      excerpt: newPost.excerpt || '',
      content: newPost.content || '',
      author: 'Admin User',
      date: new Date().toISOString().split('T')[0],
      readTime: Math.ceil((newPost.content?.length || 0) / 200) + ' min',
      views: 0,
      category: newPost.category || 'Viajes',
      tags: newPost.tags || [],
      status: newPost.status as 'draft' | 'published' | 'archived' || 'draft',
      featured: newPost.featured || false
    }

    setPosts(prev => [post, ...prev])
    setNewPost({
      title: '',
      excerpt: '',
      content: '',
      category: 'Viajes',
      tags: [],
      status: 'draft',
      featured: false
    })
    setShowCreateModal(false)
  }

  const handleDeletePost = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      setPosts(prev => prev.filter(post => post.id !== id))
    }
  }

  const handleToggleFeatured = (id: string) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, featured: !post.featured } : post
    ))
  }

  const handleStatusChange = (id: string, status: 'draft' | 'published' | 'archived') => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, status } : post
    ))
  }

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((sum, post) => sum + post.views, 0)
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3 mb-2">
            <Edit className="w-8 h-8 text-accent" />
            Gestión de Blog
          </h1>
          <p className="text-text-secondary">
            Administra contenido, artículos y métricas del blog
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card-default p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <Edit className="w-6 h-6 text-accent" />
              <span className="text-success text-sm">+12%</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">{stats.total}</div>
            <div className="text-text-secondary text-sm">Total Artículos</div>
          </div>

          <div className="card-default p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-6 h-6 text-success" />
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{stats.published}</div>
            <div className="text-text-secondary text-sm">Publicados</div>
          </div>

          <div className="card-default p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-6 h-6 text-warning" />
              <span className="text-warning text-sm">{stats.drafts}</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">{stats.drafts}</div>
            <div className="text-text-secondary text-sm">Borradores</div>
          </div>

          <div className="card-default p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-accent" />
              <span className="text-accent text-sm">+18%</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">{stats.totalViews.toLocaleString()}</div>
            <div className="text-text-secondary text-sm">Total Vistas</div>
          </div>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row gap-4 mb-6"
        >
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            >
              <option value="Todos">Todos los estados</option>
              <option value="published">Publicados</option>
              <option value="draft">Borradores</option>
              <option value="archived">Archivados</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exportar
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nuevo Artículo
            </button>
          </div>
        </motion.div>

        {/* Posts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-default overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-body-bg/20">
                <tr>
                  <th className="text-left p-4 text-text-secondary font-semibold">Título</th>
                  <th className="text-left p-4 text-text-secondary font-semibold">Autor</th>
                  <th className="text-left p-4 text-text-secondary font-semibold">Categoría</th>
                  <th className="text-left p-4 text-text-secondary font-semibold">Estado</th>
                  <th className="text-left p-4 text-text-secondary font-semibold">Fecha</th>
                  <th className="text-left p-4 text-text-secondary font-semibold">Vistas</th>
                  <th className="text-left p-4 text-text-secondary font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-hover-bg transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-text-primary font-semibold">{post.title}</div>
                          <div className="text-text-muted text-sm line-clamp-1">{post.excerpt}</div>
                          {post.featured && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 bg-warning/20 text-warning text-xs rounded-full">
                              ⭐ Destacado
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-text-muted" />
                        <span className="text-text-secondary">{post.author}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-accent/20 text-accent text-sm rounded">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={post.status}
                        onChange={(e) => handleStatusChange(post.id, e.target.value as BlogPost['status'])}
                        className={`px-2 py-1 text-xs rounded border ${getStatusColor(post.status)} bg-transparent`}
                      >
                        <option value="draft">Borrador</option>
                        <option value="published">Publicado</option>
                        <option value="archived">Archivado</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-text-secondary text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('es-PE')}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-accent font-semibold">
                        <Eye className="w-4 h-4" />
                        {post.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleFeatured(post.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            post.featured ? 'bg-warning/20 text-warning' : 'bg-body-bg/20 text-text-muted hover:bg-hover-bg'
                          }`}
                          title={post.featured ? 'Quitar de destacados' : 'Marcar como destacado'}
                        >
                          ⭐
                        </button>
                        <button className="p-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setEditingPost(post)}
                          className="p-2 bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 bg-error/20 text-error rounded-lg hover:bg-error/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-body-bg/20 text-text-muted rounded-lg hover:bg-hover-bg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Create/Edit Modal */}
        {(showCreateModal || editingPost) && (
          <div className="fixed inset-0 bg-body-bg/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-bg-dark border border-white/20 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingPost ? 'Editar Artículo' : 'Nuevo Artículo'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingPost(null)
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-gray-300 mb-2">Título</label>
                  <input
                    type="text"
                    value={editingPost ? editingPost.title : newPost.title}
                    onChange={(e) => editingPost 
                      ? setEditingPost({...editingPost, title: e.target.value})
                      : setNewPost({...newPost, title: e.target.value})
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Título del artículo"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-gray-300 mb-2">Extracto</label>
                  <textarea
                    value={editingPost ? editingPost.excerpt : newPost.excerpt}
                    onChange={(e) => editingPost 
                      ? setEditingPost({...editingPost, excerpt: e.target.value})
                      : setNewPost({...newPost, excerpt: e.target.value})
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Breve descripción del artículo"
                  />
                </div>

                {/* Category and Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Categoría</label>
                    <select
                      value={editingPost ? editingPost.category : newPost.category}
                      onChange={(e) => editingPost 
                        ? setEditingPost({...editingPost, category: e.target.value})
                        : setNewPost({...newPost, category: e.target.value})
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {categories.filter(c => c !== 'Todos').map(category => (
                        <option key={category} value={category} className="bg-body-bg">
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Estado</label>
                    <select
                      value={editingPost ? editingPost.status : newPost.status}
                      onChange={(e) => editingPost 
                        ? setEditingPost({...editingPost, status: e.target.value as BlogPost['status']})
                        : setNewPost({...newPost, status: e.target.value as BlogPost['status']})
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="draft" className="bg-body-bg">Borrador</option>
                      <option value="published" className="bg-body-bg">Publicado</option>
                      <option value="archived" className="bg-body-bg">Archivado</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-gray-300">
                      <input
                        type="checkbox"
                        checked={editingPost ? editingPost.featured : newPost.featured}
                        onChange={(e) => editingPost 
                          ? setEditingPost({...editingPost, featured: e.target.checked})
                          : setNewPost({...newPost, featured: e.target.checked})
                        }
                        className="w-4 h-4 rounded bg-white/10 border border-white/20 text-primary focus:ring-primary"
                      />
                      Artículo destacado
                    </label>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-gray-300 mb-2">Etiquetas (separadas por coma)</label>
                  <input
                    type="text"
                    value={editingPost ? editingPost.tags.join(', ') : newPost.tags?.join(', ') || ''}
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                      if (editingPost) {
                        setEditingPost({...editingPost, tags});
                      } else {
                        setNewPost({...newPost, tags});
                      }
                    }}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="turismo, viajes, perú"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-gray-300 mb-2">Contenido</label>
                  <textarea
                    value={editingPost ? editingPost.content : newPost.content}
                    onChange={(e) => editingPost 
                      ? setEditingPost({...editingPost, content: e.target.value})
                      : setNewPost({...newPost, content: e.target.value})
                    }
                    rows={15}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
                    placeholder="Contenido del artículo en HTML..."
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      setEditingPost(null)
                    }}
                    className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (editingPost) {
                        setPosts(prev => prev.map(p => p.id === editingPost.id ? editingPost : p))
                        setEditingPost(null)
                      } else {
                        handleCreatePost()
                      }
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-accent-purple hover:from-accent-purple hover:to-primary text-white rounded-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {editingPost ? 'Actualizar' : 'Crear'} Artículo
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
    </div>
  )
}
