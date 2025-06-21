'use client'

import { Download, RefreshCw, Plus, Eye, Edit, Trash2 } from 'lucide-react'

export default function ButtonTestPage() {
  return (
    <div className="min-h-screen bg-body-bg p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">Test de Botones - Alineación</h1>
        
        {/* Test básico de botones */}
        <div className="bg-card-bg p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Botones Básicos</h2>
          <div className="flex items-center gap-4 flex-wrap">
            <button className="btn-primary">
              <Download className="w-4 h-4" />
              Descargar
            </button>
            <button className="btn-secondary">
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
            <button className="btn-outline">
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
        </div>

        {/* Test con texto largo */}
        <div className="bg-card-bg p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Botones con Texto Largo</h2>
          <div className="flex items-center gap-4 flex-wrap">
            <button className="btn-primary">
              <Download className="w-4 h-4" />
              Descargar Archivo PDF
            </button>
            <button className="btn-secondary">
              <RefreshCw className="w-4 h-4" />
              Actualizar Información Completa
            </button>
            <button className="btn-outline">
              <Plus className="w-4 h-4" />
              Agregar Nuevo Elemento
            </button>
          </div>
        </div>

        {/* Test sin iconos */}
        <div className="bg-card-bg p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Botones Sin Iconos</h2>
          <div className="flex items-center gap-4 flex-wrap">
            <button className="btn-primary">
              Solo Texto
            </button>
            <button className="btn-secondary">
              Botón Secundario
            </button>
            <button className="btn-outline">
              Botón Outline
            </button>
          </div>
        </div>

        {/* Test solo iconos */}
        <div className="bg-card-bg p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Botones Solo Iconos</h2>
          <div className="flex items-center gap-4 flex-wrap">
            <button className="btn-primary">
              <Download className="w-4 h-4" />
            </button>
            <button className="btn-secondary">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="btn-outline">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Test con diferentes tamaños de iconos */}
        <div className="bg-card-bg p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Diferentes Tamaños de Iconos</h2>
          <div className="flex items-center gap-4 flex-wrap">
            <button className="btn-primary">
              <Download className="w-3 h-3" />
              Pequeño
            </button>
            <button className="btn-secondary">
              <RefreshCw className="w-4 h-4" />
              Normal
            </button>
            <button className="btn-outline">
              <Plus className="w-5 h-5" />
              Grande
            </button>
            <button className="btn-primary">
              <Download className="w-6 h-6" />
              Muy Grande
            </button>
          </div>
        </div>

        {/* Test en grid como admin */}
        <div className="bg-card-bg p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Simulación Panel Admin</h2>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Acciones Rápidas</h3>
            <div className="flex items-center gap-3">
              <button className="btn-secondary">
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button className="btn-primary">
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </button>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4 border-t border-border-color">
            <button className="btn-outline flex-1">
              <Eye className="w-4 h-4" />
              Ver
            </button>
            <button className="btn-outline flex-1">
              <Edit className="w-4 h-4" />
              Editar
            </button>
            <button className="btn-outline text-red-400">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
