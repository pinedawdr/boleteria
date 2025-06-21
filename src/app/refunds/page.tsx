import { RefreshCw, Clock, CreditCard, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { Container } from '@/components/layout'

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-body-bg">
      <Container className="py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Política de Reembolsos
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Entendemos que a veces los planes cambian. Aquí encontrará toda la información 
            sobre nuestras políticas de cancelación y reembolso.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Quick Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-green-900/20 border border-green-400/30 rounded-xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Reembolso Rápido</h3>
              <p className="text-gray-300 text-sm">Procesamos reembolsos en 3-5 días hábiles</p>
            </div>
            <div className="bg-blue-900/20 border border-blue-400/30 rounded-xl p-6 text-center">
              <CreditCard className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Mismo Método</h3>
              <p className="text-gray-300 text-sm">Devolvemos el dinero por el mismo medio de pago</p>
            </div>
            <div className="bg-purple-900/20 border border-purple-400/30 rounded-xl p-6 text-center">
              <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Tiempo Límite</h3>
              <p className="text-gray-300 text-sm">Políticas varían según tipo de servicio</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-xl p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Condiciones</h3>
              <p className="text-gray-300 text-sm">Aplican términos específicos por categoría</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            
            {/* Events Refund Policy */}
            <div className="bg-body-bg/30 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <RefreshCw className="w-6 h-6 text-blue-400 mr-3" />
                Reembolsos para Eventos
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-green-400 mb-2">90%</div>
                    <div className="text-white font-semibold">Más de 72 horas</div>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Reembolso automático disponible</li>
                    <li>• Sin preguntas adicionales</li>
                    <li>• Procesamiento inmediato</li>
                    <li>• Comisión de servicio: 10%</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">50%</div>
                    <div className="text-white font-semibold">24-72 horas antes</div>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Requiere solicitud manual</li>
                    <li>• Revisión de caso individual</li>
                    <li>• Respuesta en 24 horas</li>
                    <li>• Comisión de servicio: 50%</li>
                  </ul>
                </div>
                
                <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-red-400 mb-2">0%</div>
                    <div className="text-white font-semibold">Menos de 24 horas</div>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Sin reembolso disponible</li>
                    <li>• Excepciones por emergencia</li>
                    <li>• Transferencia a otro evento</li>
                    <li>• Crédito para compras futuras</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
                <h4 className="text-blue-400 font-semibold mb-2">Excepciones para Eventos:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• <strong>Cancelación del evento:</strong> Reembolso completo (100%)</li>
                  <li>• <strong>Cambio de fecha/lugar:</strong> Opción de reembolso completo o transferencia</li>
                  <li>• <strong>Emergencias médicas:</strong> Reembolso del 80% con documentación</li>
                  <li>• <strong>Fuerza mayor:</strong> Aplican términos especiales según el caso</li>
                </ul>
              </div>
            </div>

            {/* Transport Refund Policy */}
            <div className="bg-body-bg/30 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <RefreshCw className="w-6 h-6 text-green-400 mr-3" />
                Reembolsos para Transportes
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-green-400 mb-2">85%</div>
                    <div className="text-white font-semibold">Más de 48 horas</div>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Reembolso automático</li>
                    <li>• Cambio de fecha gratuito</li>
                    <li>• Sin penalizaciones</li>
                    <li>• Comisión de servicio: 15%</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">60%</div>
                    <div className="text-white font-semibold">12-48 horas antes</div>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Sujeto a disponibilidad</li>
                    <li>• Cambio con costo adicional</li>
                    <li>• Aprobación requerida</li>
                    <li>• Comisión de servicio: 40%</li>
                  </ul>
                </div>
                
                <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-red-400 mb-2">0%</div>
                    <div className="text-white font-semibold">Menos de 12 horas</div>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• No hay reembolso</li>
                    <li>• Posible reprogramación</li>
                    <li>• Costo adicional aplicable</li>
                    <li>• Válido por 6 meses</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-4">
                  <h4 className="text-purple-400 font-semibold mb-3">Tipos de Transporte:</h4>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li><strong>Buses:</strong> Política estándar aplica</li>
                    <li><strong>Trenes:</strong> +24h adicionales requeridas</li>
                    <li><strong>Barcos:</strong> Sujeto a condiciones climáticas</li>
                    <li><strong>Vuelos:</strong> Aplican términos de aerolínea</li>
                  </ul>
                </div>
                
                <div className="bg-orange-900/20 border border-orange-400/30 rounded-lg p-4">
                  <h4 className="text-orange-400 font-semibold mb-3">Condiciones Especiales:</h4>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li><strong>No-show:</strong> Sin reembolso disponible</li>
                    <li><strong>Retrasos de empresa:</strong> Reembolso completo</li>
                    <li><strong>Cambio de temporada:</strong> Tarifas diferentes pueden aplicar</li>
                    <li><strong>Grupos (10+):</strong> Términos especiales negociables</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Refund Process */}
            <div className="bg-body-bg/30 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Proceso de Reembolso</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { step: "1", title: "Solicitud", desc: "Inicie el proceso desde su cuenta o contactando soporte", color: "blue" },
                  { step: "2", title: "Revisión", desc: "Verificamos la solicitud y aplicamos políticas correspondientes", color: "yellow" },
                  { step: "3", title: "Aprobación", desc: "Confirmamos el monto y método de reembolso", color: "green" },
                  { step: "4", title: "Procesamiento", desc: "El dinero regresa a su cuenta en 3-5 días hábiles", color: "purple" }
                ].map((step, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 bg-${step.color}-400 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-white font-bold text-xl">{step.step}</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-300 text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-body-bg/50 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Información Importante:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Los reembolsos se procesan en la moneda original de la compra</li>
                    <li>• Los costos de transferencia bancaria pueden aplicar</li>
                    <li>• Mantenga su comprobante de compra como respaldo</li>
                  </ul>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Los reembolsos parciales excluyen comisiones de procesamiento</li>
                    <li>• Casos especiales requieren documentación adicional</li>
                    <li>• El tiempo de procesamiento puede variar según el banco</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-body-bg/30 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">¿Necesita Ayuda con un Reembolso?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Centro de Ayuda</h3>
                  <p className="text-gray-300 text-sm mb-4">Encuentre respuestas rápidas en nuestro centro de ayuda</p>
                  <button className="text-blue-400 hover:text-blue-300 font-medium">Visitar Centro de Ayuda</button>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Chat en Vivo</h3>
                  <p className="text-gray-300 text-sm mb-4">Hable con nuestro equipo de soporte en tiempo real</p>
                  <button className="text-green-400 hover:text-green-300 font-medium">Iniciar Chat</button>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Email de Soporte</h3>
                  <p className="text-gray-300 text-sm mb-4">Envíe su consulta detallada por correo electrónico</p>
                  <button className="text-purple-400 hover:text-purple-300 font-medium">reembolsos@boleteria.pe</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </div>
  )
}
