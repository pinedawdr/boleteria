'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Calendar, MapPin, Users, BarChart, LogOut, Plus } from 'lucide-react'

export default function OperatorDashboard() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-body-bg text-white">
      {/* Header */}
      <header className="bg-body-bg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold">Dashboard Operador</h1>
              <p className="text-gray-400 text-sm">Bienvenido, {user?.profile?.full_name}</p>
            </div>
            <Button
              onClick={signOut}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Gestionar Eventos */}
          <div className="bg-body-bg rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-purple-500" />
              <h2 className="text-lg font-semibold">Eventos</h2>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Crear y gestionar eventos
            </p>
            <Button className="w-full mb-2">
              <Plus className="w-4 h-4 mr-2" />
              Crear Evento
            </Button>
            <Button variant="outline" className="w-full">
              Ver Eventos
            </Button>
          </div>

          {/* Gestionar Transporte */}
          <div className="bg-body-bg rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-blue-500" />
              <h2 className="text-lg font-semibold">Transporte</h2>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Gestionar rutas y horarios
            </p>
            <Button className="w-full mb-2">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Ruta
            </Button>
            <Button variant="outline" className="w-full">
              Ver Rutas
            </Button>
          </div>

          {/* Reservas */}
          <div className="bg-body-bg rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-green-500" />
              <h2 className="text-lg font-semibold">Reservas</h2>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Gestionar reservas de clientes
            </p>
            <Button className="w-full">
              Ver Reservas
            </Button>
          </div>

          {/* Reportes */}
          <div className="bg-body-bg rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <BarChart className="w-6 h-6 text-yellow-500" />
              <h2 className="text-lg font-semibold">Reportes</h2>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Ver estadísticas y reportes
            </p>
            <Button className="w-full">
              Ver Reportes
            </Button>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-body-bg rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Eventos Activos</h3>
            <p className="text-3xl font-bold text-purple-500">15</p>
            <p className="text-gray-400 text-sm">+3 esta semana</p>
          </div>

          <div className="bg-body-bg rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Rutas Activas</h3>
            <p className="text-3xl font-bold text-blue-500">8</p>
            <p className="text-gray-400 text-sm">+1 esta semana</p>
          </div>

          <div className="bg-body-bg rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Reservas Totales</h3>
            <p className="text-3xl font-bold text-green-500">142</p>
            <p className="text-gray-400 text-sm">+25 esta semana</p>
          </div>
        </div>
      </main>
    </div>
  )
}
