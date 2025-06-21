import { Lock, Eye, Shield, Database, UserCheck, AlertCircle } from 'lucide-react'
import { Container } from '@/components/layout'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-body-bg">
      <Container className="py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Política de Privacidad
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Su privacidad es fundamental para nosotros. Esta política explica cómo recopilamos, 
            utilizamos y protegemos su información personal.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Última actualización: 15 de diciembre de 2024
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Privacy Principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 text-center">
              <Lock className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Seguridad</h3>
              <p className="text-gray-300 text-sm">
                Utilizamos encriptación avanzada y medidas de seguridad de nivel bancario
              </p>
            </div>
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 text-center">
              <Eye className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Transparencia</h3>
              <p className="text-gray-300 text-sm">
                Comunicamos claramente qué datos recopilamos y cómo los utilizamos
              </p>
            </div>
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 text-center">
              <UserCheck className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Control</h3>
              <p className="text-gray-300 text-sm">
                Usted tiene control total sobre sus datos y puede modificarlos en cualquier momento
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-body-bg/30 rounded-2xl p-8 border border-gray-700 space-y-10">
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Database className="w-6 h-6 text-blue-400 mr-3" />
                Información que Recopilamos
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-blue-400">Información Personal</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Nombre completo y fecha de nacimiento</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Dirección de correo electrónico</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Número de teléfono móvil</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Dirección física y código postal</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Documento de identidad (DNI/CE)</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-green-400">Información de Uso</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Historial de navegación en la plataforma</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Preferencias de eventos y destinos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Información del dispositivo y ubicación</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Cookies y tecnologías similares</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Interacciones con atención al cliente</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-6 h-6 text-green-400 mr-3" />
                Cómo Utilizamos su Información
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-6">
                  <h3 className="text-green-400 font-semibold mb-4">Servicios Principales</h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Procesar compras de boletos y reservas</li>
                    <li>• Enviar confirmaciones y actualizaciones</li>
                    <li>• Proporcionar atención al cliente</li>
                    <li>• Verificar identidad y prevenir fraudes</li>
                  </ul>
                </div>
                
                <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-6">
                  <h3 className="text-blue-400 font-semibold mb-4">Mejoras y Marketing</h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Personalizar recomendaciones</li>
                    <li>• Enviar ofertas y promociones relevantes</li>
                    <li>• Mejorar la experiencia de usuario</li>
                    <li>• Realizar análisis de uso y tendencias</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Lock className="w-6 h-6 text-purple-400 mr-3" />
                Compartimiento de Información
              </h2>
              
              <div className="space-y-6">
                <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-6">
                  <h3 className="text-purple-400 font-semibold mb-4">Cuándo Compartimos Datos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Con su Consentimiento:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Organizadores de eventos (datos básicos)</li>
                        <li>• Empresas de transporte (información de viaje)</li>
                        <li>• Socios comerciales autorizados</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Por Obligación Legal:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Autoridades gubernamentales</li>
                        <li>• Procesos judiciales</li>
                        <li>• Investigaciones de seguridad</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-red-400 font-semibold mb-2">Nunca Vendemos sus Datos</h4>
                      <p className="text-gray-300 text-sm">
                        No vendemos, alquilamos ni intercambiamos su información personal con terceros 
                        para fines comerciales sin su consentimiento explícito.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <UserCheck className="w-6 h-6 text-yellow-400 mr-3" />
                Sus Derechos
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Acceder", desc: "Ver qué datos tenemos sobre usted", color: "blue" },
                  { title: "Rectificar", desc: "Corregir información incorrecta", color: "green" },
                  { title: "Eliminar", desc: "Solicitar borrado de sus datos", color: "red" },
                  { title: "Portabilidad", desc: "Transferir datos a otra plataforma", color: "purple" }
                ].map((right, index) => (
                  <div key={index} className={`bg-${right.color}-900/20 border border-${right.color}-400/30 rounded-lg p-4 text-center`}>
                    <h3 className={`text-${right.color}-400 font-semibold mb-2`}>{right.title}</h3>
                    <p className="text-gray-300 text-sm">{right.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-4">
                <p className="text-gray-300 text-sm">
                  <strong className="text-yellow-400">Para ejercer sus derechos:</strong> Envíe una solicitud a 
                  <span className="text-white font-medium"> privacidad@boleteria.pe</span> con una copia de su documento de identidad.
                  Responderemos en un plazo máximo de 15 días hábiles.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Seguridad de Datos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-body-bg/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Encriptación</h3>
                  <p className="text-gray-300 text-sm">SSL/TLS para todas las transmisiones de datos</p>
                </div>
                <div className="bg-body-bg/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Almacenamiento</h3>
                  <p className="text-gray-300 text-sm">Servidores seguros con acceso restringido</p>
                </div>
                <div className="bg-body-bg/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Monitoreo</h3>
                  <p className="text-gray-300 text-sm">Supervisión 24/7 contra amenazas</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Contacto</h2>
              <div className="bg-body-bg/50 rounded-lg p-6">
                <p className="text-gray-300 mb-4">
                  Para consultas sobre privacidad o ejercer sus derechos:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white"><strong>Email:</strong> privacidad@boleteria.pe</p>
                    <p className="text-white"><strong>Teléfono:</strong> +51 1 234-5678 ext. 301</p>
                  </div>
                  <div>
                    <p className="text-white"><strong>Dirección:</strong> Av. El Sol 123, Lima, Perú</p>
                    <p className="text-white"><strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </Container>
    </div>
  )
}
