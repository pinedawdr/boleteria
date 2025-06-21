import { Shield, FileText, Clock, AlertTriangle } from 'lucide-react'
import { Container } from '@/components/layout'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-body-bg">
      <Container className="py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Términos y Condiciones
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Última actualización: 15 de diciembre de 2024
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-body-bg/50 rounded-lg p-4 border border-gray-700 text-center">
              <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300">Protección de Datos</p>
            </div>
            <div className="bg-body-bg/50 rounded-lg p-4 border border-gray-700 text-center">
              <FileText className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300">Términos Claros</p>
            </div>
            <div className="bg-body-bg/50 rounded-lg p-4 border border-gray-700 text-center">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300">Vigencia Permanente</p>
            </div>
            <div className="bg-body-bg/50 rounded-lg p-4 border border-gray-700 text-center">
              <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300">Política de Cambios</p>
            </div>
          </div>

          {/* Terms Content */}
          <div className="bg-body-bg/30 rounded-2xl p-8 border border-gray-700 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Aceptación de Términos</h2>
              <p className="text-gray-300 leading-relaxed">
                Al acceder y utilizar Boletería, usted acepta estar sujeto a estos términos y condiciones de uso. 
                Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Descripción del Servicio</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Boletería es una plataforma digital que facilita:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>La compra de entradas para eventos culturales, deportivos y de entretenimiento</li>
                <li>La reserva de servicios de transporte terrestre, marítimo y ferroviario</li>
                <li>La gestión de pagos seguros entre usuarios y proveedores de servicios</li>
                <li>Servicios de atención al cliente y soporte técnico</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Registro de Usuario</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Para utilizar nuestros servicios, debe registrarse proporcionando información veraz y actualizada.
                </p>
                <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-2">Requisitos de Registro:</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Ser mayor de 18 años o contar con autorización de un tutor legal</li>
                    <li>• Proporcionar información personal veraz y completa</li>
                    <li>• Mantener la seguridad de su contraseña</li>
                    <li>• Notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Compras y Pagos</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Todas las transacciones están sujetas a las siguientes condiciones:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">Precios y Disponibilidad</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Los precios pueden cambiar sin previo aviso</li>
                      <li>• La disponibilidad está sujeta a confirmación</li>
                      <li>• Incluyen todos los impuestos aplicables</li>
                    </ul>
                  </div>
                  <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-4">
                    <h4 className="text-purple-400 font-semibold mb-2">Métodos de Pago</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Tarjetas de crédito y débito</li>
                      <li>• Transferencias bancarias</li>
                      <li>• Billeteras digitales autorizadas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Política de Cancelaciones</h2>
              <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-3">Eventos</h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• +72 horas: Reembolso del 90%</li>
                      <li>• 24-72 horas: Reembolso del 50%</li>
                      <li>• -24 horas: Sin reembolso</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-3">Transportes</h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• +48 horas: Reembolso del 85%</li>
                      <li>• 12-48 horas: Reembolso del 60%</li>
                      <li>• -12 horas: Sin reembolso</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Responsabilidades</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Boletería actúa como intermediario entre usuarios y proveedores de servicios. 
                  Nuestra responsabilidad se limita a facilitar la transacción y el proceso de pago.
                </p>
                <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2">Limitaciones de Responsabilidad:</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• No somos responsables por la calidad de eventos o servicios de terceros</li>
                    <li>• No garantizamos la disponibilidad continua de la plataforma</li>
                    <li>• Los usuarios son responsables de verificar detalles de eventos y viajes</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Modificaciones</h2>
              <p className="text-gray-300 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                Los cambios entrarán en vigor inmediatamente después de su publicación en nuestro sitio web. 
                Es responsabilidad del usuario revisar periódicamente estos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Contacto</h2>
              <p className="text-gray-300 leading-relaxed">
                Para consultas sobre estos términos, puede contactarnos en:
              </p>
              <div className="mt-4 p-4 bg-body-bg/50 rounded-lg">
                <p className="text-white"><strong>Email:</strong> legal@boleteria.pe</p>
                <p className="text-white"><strong>Teléfono:</strong> +51 1 234-5678</p>
                <p className="text-white"><strong>Dirección:</strong> Av. El Sol 123, Lima, Perú</p>
              </div>
            </section>

          </div>
        </div>
      </Container>
    </div>
  )
}
