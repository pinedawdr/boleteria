import Image from 'next/image'

interface PaymentIconProps {
  method: string
  className?: string
}

const paymentMethods = {
  'Visa': '/payment-icons/visa.svg',
  'Mastercard': '/payment-icons/mastercard.svg', 
  'Yape': '/payment-icons/yape.svg',
  'Plin': '/payment-icons/plin.svg',
  'Mercado Pago': '/payment-icons/mercado-pago.svg',
  'PayPal': '/payment-icons/paypal.svg'
}

export function PaymentIcon({ method, className = '' }: PaymentIconProps) {
  const iconPath = paymentMethods[method as keyof typeof paymentMethods]
  
  if (!iconPath) {
    return (
      <span className={`text-secondary text-xs sm:text-sm font-medium hover:text-accent transition-colors duration-200 cursor-pointer px-1 ${className}`}>
        {method}
      </span>
    )
  }

  return (
    <div className={`inline-flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer ${className}`}>
      <Image
        src={iconPath}
        alt={`${method} logo`}
        width={40}
        height={25}
        className="h-5 w-auto sm:h-6 md:h-7 drop-shadow-sm hover:drop-shadow-md transition-all duration-200"
        title={method}
      />
    </div>
  )
}

export function PaymentMethods() {
  const methods = ['Visa', 'Mastercard', 'Yape', 'Plin', 'Mercado Pago', 'PayPal']
  
  return (
    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-default">
      <div className="text-center">
        <p className="text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4">
          Métodos de pago seguros
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 max-w-2xl mx-auto">
          {methods.map((method) => (
            <PaymentIcon key={method} method={method} />
          ))}
        </div>
        <p className="text-muted text-xs sm:text-sm mt-3 sm:mt-4">
          Transacciones protegidas con SSL
        </p>
      </div>
    </div>
  )
}
