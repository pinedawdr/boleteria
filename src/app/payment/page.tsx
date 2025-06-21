'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CreditCard, Smartphone, DollarSign, Lock, ArrowLeft, Check, QrCode, Copy, Timer, RefreshCw, Heart } from 'lucide-react'
import Link from 'next/link'

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  processingTime: string
  logo?: React.ReactNode
}

interface YapePaymentData {
  qrCode: string
  phoneNumber: string
  amount: string
  reference: string
  expiresAt: Date
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'yape',
    name: 'Yape',
    icon: <Smartphone className="h-6 w-6" />,
    description: 'Pago instantáneo con tu app Yape',
    processingTime: 'Inmediato',
    logo: <Heart className="w-5 h-5 text-purple-400" />
  },
  {
    id: 'mercado_pago',
    name: 'Mercado Pago',
    icon: <CreditCard className="h-6 w-6" />,
    description: 'Tarjetas de crédito y débito',
    processingTime: '2-3 minutos'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: <DollarSign className="h-6 w-6" />,
    description: 'Pago seguro internacional',
    processingTime: '1-2 minutos'
  },
  {
    id: 'card',
    name: 'Tarjeta',
    icon: <CreditCard className="h-6 w-6" />,
    description: 'Visa, Mastercard, American Express',
    processingTime: '2-3 minutos'
  }
]

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-body-bg flex items-center justify-center">
        <div className="particles-bg"></div>
        <div className="text-text-primary text-lg relative z-10">Cargando página de pago...</div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}

function PaymentContent() {
  const searchParams = useSearchParams()
  
  // Get booking details from URL params
  const amount = searchParams.get('amount') || '0'
  const type = searchParams.get('type') || 'event'
  const seats = searchParams.get('seats')?.split(',') || []
  const eventTitle = searchParams.get('title') || 'Reserva'
  
  const [selectedMethod, setSelectedMethod] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: method selection, 2: payment details, 3: processing, 4: success
  const [timeLeft, setTimeLeft] = useState(0)
  const [yapeData, setYapeData] = useState<YapePaymentData | null>(null)
  const [paymentStatus, setPaymentStatus] = useState('pending') // pending, success, failed, expired
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    phone: ''
  })

  // Timer para YAPE (15 minutos)
  useEffect(() => {
    if (selectedMethod === 'yape' && step === 2 && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      
      if (timeLeft === 0) {
        setPaymentStatus('expired')
      }
      
      return () => clearTimeout(timer)
    }
  }, [selectedMethod, step, timeLeft])

  // Simular verificación de pago YAPE cada 5 segundos
  useEffect(() => {
    if (selectedMethod === 'yape' && step === 2 && paymentStatus === 'pending') {
      const checkPayment = setInterval(() => {
        // Simular verificación de pago (en producción sería una llamada a API)
        if (Math.random() > 0.9) { // 10% de probabilidad de éxito en cada verificación
          setPaymentStatus('success')
          setStep(4)
          clearInterval(checkPayment)
        }
      }, 5000)

      return () => clearInterval(checkPayment)
    }
  }, [selectedMethod, step, paymentStatus])

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    
    if (methodId === 'yape') {
      // Generar datos de YAPE
      const reference = `BOL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
      
      setYapeData({
        qrCode: `yape://pay?amount=${amount}&reference=${reference}&description=${encodeURIComponent(eventTitle)}`,
        phoneNumber: '+51 999 888 777',
        amount: amount,
        reference: reference,
        expiresAt: expiresAt
      })
      
      setTimeLeft(15 * 60) // 15 minutos en segundos
      setPaymentStatus('pending')
    }
    
    setStep(2)
  }

  const generateNewYapeCode = () => {
    if (selectedMethod === 'yape') {
      const reference = `BOL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
      
      setYapeData({
        qrCode: `yape://pay?amount=${amount}&reference=${reference}&description=${encodeURIComponent(eventTitle)}`,
        phoneNumber: '+51 999 888 777',
        amount: amount,
        reference: reference,
        expiresAt: expiresAt
      })
      
      setTimeLeft(15 * 60)
      setPaymentStatus('pending')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Aquí podrías agregar una notificación de "copiado"
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStep(3)

    // Simulate payment processing
    setTimeout(() => {
      setStep(4)
      setLoading(false)
    }, 3000)
  }

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod)

  if (step === 4) {
    return (
      <div className="min-h-screen bg-body-bg flex items-center justify-center py-12 px-4">
        <div className="particles-bg"></div>
        <div className="max-w-md w-full relative z-10">
          <div className="card-default p-8 text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="icon-lg text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-text-primary mb-4">¡Pago exitoso!</h1>
            <p className="text-text-secondary mb-6">
              Tu reserva ha sido confirmada. Recibirás un email con los detalles.
            </p>
            
            <div className="card-info p-4 mb-6 text-left">
              <h3 className="text-text-primary font-semibold mb-2">Detalles de la compra</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Evento/Ruta:</span>
                  <span className="text-text-primary">{eventTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Asientos:</span>
                  <span className="text-text-primary">{seats.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Método de pago:</span>
                  <span className="text-text-primary">{selectedMethodData?.name}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-border-default pt-2">
                  <span className="text-text-secondary">Total:</span>
                  <span className="text-text-primary">S/ {amount}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link
                href="/profile"
                className="btn-primary w-full block text-center"
              >
                Ver mis reservas
              </Link>
              <Link
                href="/"
                className="btn-secondary w-full block text-center"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-body-bg flex items-center justify-center py-12 px-4">
        <div className="particles-bg"></div>
        <div className="max-w-md w-full relative z-10">
          <div className="card-default p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-text-primary mb-4">Procesando pago...</h1>
            <p className="text-text-secondary mb-4">
              Estamos verificando tu pago con {selectedMethodData?.name}
            </p>
            <p className="text-sm text-text-muted">
              Por favor, no cierres esta ventana
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-body-bg py-8">
      <div className="particles-bg"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/transport/seat-selection"
            className="inline-flex items-center text-accent hover:text-accent/80 mb-4"
          >
            <ArrowLeft className="icon-sm mr-2" />
            Volver a selección de asientos
          </Link>
          <h1 className="text-3xl font-bold text-text-primary">Completar pago</h1>
          <p className="text-text-secondary mt-2">Elige tu método de pago preferido</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods / Form */}
          <div className="lg:col-span-2">
            {step === 1 ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-text-primary mb-6">Métodos de pago</h2>
                
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    className="w-full card-default p-6 hover:bg-card-hover transition-colors text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-white">
                          {method.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary">{method.name}</h3>
                          <p className="text-text-secondary text-sm">{method.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-text-muted text-sm">Procesamiento</p>
                        <p className="text-text-primary text-sm font-medium">{method.processingTime}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="card-default p-6">
                <div className="flex items-center mb-6">
                  <button 
                    onClick={() => setStep(1)}
                    className="text-accent hover:text-accent/80 mr-4"
                  >
                    <ArrowLeft className="icon-sm" />
                  </button>
                  <h2 className="text-xl font-semibold text-text-primary">
                    Pagar con {selectedMethodData?.name}
                  </h2>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  {selectedMethod === 'yape' && (
                    <div className="space-y-6">
                      {/* Header de YAPE */}
                      <div className="text-center">
                        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                          <Heart className="icon-lg text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">Pagar con Yape</h3>
                        <p className="text-text-secondary">Escanea el QR o transfiere al número</p>
                      </div>

                      {/* Timer */}
                      {paymentStatus === 'pending' && (
                        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 text-center">
                          <div className="flex items-center justify-center space-x-2 text-yellow-300">
                            <Timer className="icon-sm" />
                            <span className="font-semibold">Tiempo restante: {formatTime(timeLeft)}</span>
                          </div>
                          <p className="text-yellow-200 text-sm mt-1">
                            El código expira en {formatTime(timeLeft)}
                          </p>
                        </div>
                      )}

                      {/* Estado expirado */}
                      {paymentStatus === 'expired' && (
                        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                          <p className="text-red-300 font-semibold">Código QR expirado</p>
                          <button
                            onClick={generateNewYapeCode}
                            className="mt-2 btn-primary"
                          >
                            <RefreshCw className="icon-sm inline-block mr-2" />
                            Generar nuevo código
                          </button>
                        </div>
                      )}

                      {/* QR Code */}
                      {paymentStatus === 'pending' && yapeData && (
                        <div className="bg-white p-6 rounded-xl text-center mx-auto max-w-xs">
                          <div className="w-48 h-48 bg-gradient-to-br from-accent/20 to-accent/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <QrCode className="h-24 w-24 text-accent" />
                          </div>
                          <p className="text-gray-700 text-sm font-medium">
                            Código de referencia
                          </p>
                          <p className="text-accent font-mono text-xs">
                            {yapeData.reference}
                          </p>
                        </div>
                      )}

                      {/* Información de transferencia */}
                      {paymentStatus === 'pending' && yapeData && (
                        <div className="space-y-4">
                          <div className="card-info p-4">
                            <h4 className="text-text-primary font-semibold mb-3">O transfiere al número:</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between bg-body-bg/50 rounded-lg p-3">
                                <div>
                                  <span className="text-text-secondary text-sm">Número Yape:</span>
                                  <p className="text-text-primary font-mono text-lg">{yapeData.phoneNumber}</p>
                                </div>
                                <button
                                  onClick={() => copyToClipboard(yapeData.phoneNumber)}
                                  className="text-accent hover:text-accent/80 p-2"
                                >
                                  <Copy className="icon-sm" />
                                </button>
                              </div>
                              
                              <div className="flex items-center justify-between bg-body-bg/50 rounded-lg p-3">
                                <div>
                                  <span className="text-text-secondary text-sm">Monto exacto:</span>
                                  <p className="text-text-primary font-bold text-lg">S/ {yapeData.amount}</p>
                                </div>
                                <button
                                  onClick={() => copyToClipboard(yapeData.amount)}
                                  className="text-accent hover:text-accent/80 p-2"
                                >
                                  <Copy className="icon-sm" />
                                </button>
                              </div>
                              
                              <div className="flex items-center justify-between bg-body-bg/50 rounded-lg p-3">
                                <div>
                                  <span className="text-text-secondary text-sm">Referencia:</span>
                                  <p className="text-text-primary font-mono text-sm">{yapeData.reference}</p>
                                </div>
                                <button
                                  onClick={() => copyToClipboard(yapeData.reference)}
                                  className="text-accent hover:text-accent/80 p-2"
                                >
                                  <Copy className="icon-sm" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Instrucciones */}
                          <div className="bg-accent/20 border border-accent/30 rounded-lg p-4">
                            <h5 className="text-accent font-semibold mb-2">Instrucciones:</h5>
                            <ol className="text-text-secondary text-sm space-y-1 list-decimal list-inside">
                              <li>Abre tu app Yape</li>
                              <li>Escanea el código QR o transfiere al número</li>
                              <li>Usa la referencia exacta mostrada arriba</li>
                              <li>Confirma el pago por el monto exacto</li>
                              <li>Espera la confirmación automática</li>
                            </ol>
                          </div>

                          {/* Estado de verificación */}
                          <div className="card-info p-4 text-center">
                            <div className="flex items-center justify-center space-x-2 text-yellow-400 mb-2">
                              <RefreshCw className="icon-sm animate-spin" />
                              <span>Verificando pago...</span>
                            </div>
                            <p className="text-text-secondary text-sm">
                              El pago se detectará automáticamente cuando se complete
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {(selectedMethod === 'card' || selectedMethod === 'mercado_pago') && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-text-secondary text-sm font-medium mb-2">
                            Número de tarjeta
                          </label>
                          <input
                            type="text"
                            value={paymentData.cardNumber}
                            onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                            className="input-default"
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-text-secondary text-sm font-medium mb-2">
                            Fecha de vencimiento
                          </label>
                          <input
                            type="text"
                            value={paymentData.expiryDate}
                            onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                            className="input-default"
                            placeholder="MM/AA"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-text-secondary text-sm font-medium mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={paymentData.cvv}
                            onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                            className="input-default"
                            placeholder="123"
                            required
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-text-secondary text-sm font-medium mb-2">
                            Nombre en la tarjeta
                          </label>
                          <input
                            type="text"
                            value={paymentData.cardName}
                            onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
                            className="input-default"
                            placeholder="JUAN PEREZ"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {selectedMethod === 'paypal' && (
                    <div className="text-center">
                      <div className="bg-accent text-white p-6 rounded-lg mb-6">
                        <h3 className="text-lg font-semibold mb-2">Redirigiendo a PayPal</h3>
                        <p>Serás redirigido a PayPal para completar el pago</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-text-secondary text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={paymentData.email}
                        onChange={(e) => setPaymentData({...paymentData, email: e.target.value})}
                        className="input-default"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-text-secondary text-sm font-medium mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={paymentData.phone}
                        onChange={(e) => setPaymentData({...paymentData, phone: e.target.value})}
                        className="input-default"
                        placeholder="+51 999 999 999"
                        required
                      />
                    </div>
                  </div>

                  {/* Botón de pago - Solo para métodos que no sean YAPE */}
                  {selectedMethod !== 'yape' && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Lock className="icon-sm mr-2" />
                      )}
                      Pagar S/ {amount}
                    </button>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-default p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Resumen de compra</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Evento/Ruta:</span>
                  <span className="text-text-primary text-sm">{eventTitle}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-text-secondary">Tipo:</span>
                  <span className="text-text-primary">{type === 'event' ? 'Evento' : 'Transporte'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-text-secondary">Asientos:</span>
                  <span className="text-text-primary">{seats.join(', ')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-text-secondary">Cantidad:</span>
                  <span className="text-text-primary">{seats.length} {seats.length === 1 ? 'asiento' : 'asientos'}</span>
                </div>
                
                <div className="border-t border-border-default pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-text-primary">Total:</span>
                    <span className="text-2xl font-bold text-accent">S/ {amount}</span>
                  </div>
                </div>
              </div>
              
              <div className="card-info p-4">
                <div className="flex items-center mb-2">
                  <Lock className="icon-sm text-accent mr-2" />
                  <span className="text-accent font-medium text-sm">Pago seguro</span>
                </div>
                <p className="text-text-secondary text-xs">
                  Tus datos están protegidos con encriptación SSL de 256 bits
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
