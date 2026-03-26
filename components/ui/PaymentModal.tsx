'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, CheckCircle, AlertCircle, ArrowLeft, CreditCard, Smartphone, Building2 } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  planPrice: number
  productId?: number | null
}

function formatCOP(amount: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount)
}

type ModalStep = 'form' | 'methods' | 'card' | 'external' | 'success' | 'error'
type PayMethod = 'card' | 'nequi' | 'pse' | 'bancolombia' | null

// PayZen method codes for Colombia
const PAYZEN_METHOD: Record<string, string> = {
  nequi: 'NEQUI',
  pse: 'BCHAT',
  bancolombia: 'BANCOLOMBIA_QR',
}

declare global {
  interface Window {
    KR?: {
      setFormToken: (token: string) => Promise<void>
      onSubmit: (callback: (data: unknown) => void) => void
      onError: (callback: (err: unknown) => void) => void
    }
  }
}

const PAYMENT_METHODS = [
  {
    id: 'card' as PayMethod,
    label: 'Tarjeta de crédito o débito',
    brands: [],
    icon: CreditCard,
    logos: ['/logos/visa.svg', '/logos/mastercard.svg'],
    logoSrc: null,
  },
  {
    id: 'nequi' as PayMethod,
    label: 'Nequi',
    brands: [],
    icon: Smartphone,
    logos: [],
    logoSrc: '/logos/nequi.svg',
  },
  {
    id: 'pse' as PayMethod,
    label: 'PSE — Débito bancario',
    brands: [],
    icon: Building2,
    logos: [],
    logoSrc: '/logos/pse.svg',
  },
  {
    id: 'bancolombia' as PayMethod,
    label: 'Botón Bancolombia',
    brands: [],
    icon: Building2,
    logos: [],
    logoSrc: '/logos/bancolombia.svg',
  },
]

export default function PaymentModal({ isOpen, onClose, planName, planPrice, productId = null }: PaymentModalProps) {
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerCompany: '',
    customerNit: '',
  })
  const [step, setStep] = useState<ModalStep>('form')
  const [payMethod, setPayMethod] = useState<PayMethod>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [formToken, setFormToken] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const krScriptRef = useRef<HTMLScriptElement | null>(null)
  const krDivRef = useRef<HTMLDivElement>(null)

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('form')
        setPayMethod(null)
        setIsLoading(false)
        setErrorMsg('')
        setFormToken(null)
        setOrderId(null)
      }, 300)
    }
  }, [isOpen])

  // Load Krypton (card form) when step is 'card' and we have a token
  useEffect(() => {
    if (step !== 'card' || !formToken) return

    const publicKey = process.env.NEXT_PUBLIC_PAYZEN_PUBLIC_KEY ?? ''
    document.querySelectorAll('script[data-krypton]').forEach(s => s.remove())

    const timer = setTimeout(() => {
      const div = krDivRef.current
      if (!div) return

      div.setAttribute('kr-form-token', formToken)

      const script = document.createElement('script')
      script.src = 'https://static.payzen.lat/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js'
      script.setAttribute('kr-public-key', publicKey)
      script.setAttribute('kr-language', 'es-CO')
      script.setAttribute('data-krypton', 'true')

      script.onload = () => {
        if (!window.KR) return
        window.KR.onSubmit(async () => {
          try {
            await fetch('/api/payments/payzen/complete-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId }),
            })
          } catch (err) {
            console.error('[WC Sync] Error completing order:', err)
          }
          setStep('success')
        })
        window.KR.onError((err: unknown) => {
          const msg = (err as { clientMessage?: string })?.clientMessage ?? 'Error en el pago.'
          setErrorMsg(msg)
          setStep('error')
        })
      }

      document.head.appendChild(script)
      krScriptRef.current = script
    }, 150)

    return () => {
      clearTimeout(timer)
      document.querySelectorAll('script[data-krypton]').forEach(s => s.remove())
      krScriptRef.current = null
    }
  }, [step, formToken])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Step 1 — submit personal data → go to method selection
  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/payments/payzen/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, planName, planPrice, productId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al procesar')

      setOrderId(data.orderId)
      setFormToken(data.formToken)
      setStep('methods')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error inesperado')
      setStep('error')
    } finally {
      setIsLoading(false)
    }
  }

  // Load Krypton smart form for Nequi / PSE / Bancolombia (method-filtered)
  useEffect(() => {
    if (step !== 'external' || !formToken || !payMethod || payMethod === 'card') return

    const publicKey = process.env.NEXT_PUBLIC_PAYZEN_PUBLIC_KEY ?? ''
    const krMethod = PAYZEN_METHOD[payMethod] ?? ''
    document.querySelectorAll('script[data-krypton-ext]').forEach(s => s.remove())

    const timer = setTimeout(() => {
      const div = krDivRef.current
      if (!div) return

      div.setAttribute('kr-form-token', formToken)
      if (krMethod) div.setAttribute('kr-payment-method', krMethod)

      const script = document.createElement('script')
      script.src = 'https://static.payzen.lat/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js'
      script.setAttribute('kr-public-key', publicKey)
      script.setAttribute('kr-language', 'es-CO')
      script.setAttribute('data-krypton-ext', 'true')

      script.onload = () => {
        if (!window.KR) return
        window.KR.onSubmit(async () => {
          try {
            await fetch('/api/payments/payzen/complete-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId }),
            })
          } catch (e) { console.error(e) }
          setStep('success')
        })
        window.KR.onError((err: unknown) => {
          const msg = (err as { clientMessage?: string })?.clientMessage ?? 'Error en el pago.'
          setErrorMsg(msg)
          setStep('error')
        })
      }

      document.head.appendChild(script)
    }, 150)

    return () => {
      clearTimeout(timer)
      document.querySelectorAll('script[data-krypton-ext]').forEach(s => s.remove())
    }
  }, [step, formToken, payMethod])
  const handleMethodSelect = (method: PayMethod) => {
    setPayMethod(method)
    if (method === 'card') {
      setStep('card')
    } else {
      // Nequi, PSE, Bancolombia — show PayZen's form filtered to this specific method
      setStep('external')
    }
  }

  const inputClass = 'w-full px-3.5 py-2.5 rounded-lg text-sm border transition-all duration-200 outline-none'
  const inputStyle = { borderColor: 'var(--gray-border)', color: 'var(--navy)' }

  const stepIndex = step === 'form' ? 0 : step === 'methods' ? 1 : step === 'card' ? 2 : -1
  const totalSteps = 3

  const goBack = () => {
    if (step === 'card' || step === 'external') {
      setFormToken(null)
      setStep('methods')
    } else if (step === 'methods') {
      setFormToken(null)
      setOrderId(null)
      setStep('form')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(24, 34, 76, 0.6)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--gray-border)' }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {(step === 'card' || step === 'methods') && (
                    <button onClick={goBack} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <ArrowLeft size={18} />
                    </button>
                  )}
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--navy)' }}>
                      {step === 'card' ? 'Pagar con tarjeta' : step === 'methods' ? 'Elige cómo pagar' : `Comprar ${planName}`}
                    </h2>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--gray)' }}>
                      {formatCOP(planPrice)}/año — Pago seguro con PayZen
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1">
                  <X size={20} />
                </button>
              </div>

              {/* Progress bar */}
              {stepIndex >= 0 && (
                <div className="flex gap-1 mt-3">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-500"
                      style={{ backgroundColor: i <= stepIndex ? 'var(--navy)' : 'var(--gray-border)' }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="px-6 py-6">

              {/* Step 1 — Personal data */}
              {step === 'form' && (
                <form onSubmit={handlePersonalSubmit} className="space-y-4">
                  {[
                    { name: 'customerName', label: 'Nombre completo', type: 'text', required: true, placeholder: 'Tu nombre completo' },
                    { name: 'customerEmail', label: 'Email', type: 'email', required: true, placeholder: 'email@empresa.co' },
                    { name: 'customerPhone', label: 'Teléfono', type: 'tel', required: true, placeholder: '300 000 0000' },
                    { name: 'customerCompany', label: 'Empresa', type: 'text', required: false, placeholder: 'Nombre de tu empresa (opcional)' },
                    { name: 'customerNit', label: 'NIT / Cédula', type: 'text', required: true, placeholder: '900.000.000-0' },
                  ].map(field => (
                    <div key={field.name}>
                      <label htmlFor={field.name} className="block text-sm font-medium mb-1.5" style={{ color: 'var(--navy)' }}>
                        {field.label}
                        {!field.required && <span className="text-xs ml-1" style={{ color: 'var(--gray)' }}>(opcional)</span>}
                      </label>
                      <input
                        id={field.name} name={field.name} type={field.type}
                        required={field.required} placeholder={field.placeholder}
                        value={form[field.name as keyof typeof form]} onChange={handleChange}
                        className={inputClass} style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = 'var(--navy)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--gray-border)')}
                      />
                    </div>
                  ))}

                  <button
                    type="submit" disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-60 hover:-translate-y-0.5"
                    style={{ backgroundColor: 'var(--navy)', color: 'white' }}
                  >
                    {isLoading ? <><Loader2 size={16} className="animate-spin" /> Procesando...</> : <>Continuar — {formatCOP(planPrice)}/año</>}
                  </button>
                  <p className="text-center text-xs" style={{ color: 'var(--gray)' }}>
                    Pago 100% seguro procesado por PayZen. Tus datos están protegidos.
                  </p>
                </form>
              )}

              {/* Step 2 — Payment method selection */}
              {step === 'methods' && (
                <div className="space-y-3">
                  <p className="text-sm mb-5" style={{ color: 'var(--gray)' }}>
                    Selecciona tu medio de pago preferido:
                  </p>
                  {PAYMENT_METHODS.map(method => {
                    const Icon = method.icon
                    return (
                      <button
                        key={method.id}
                        onClick={() => handleMethodSelect(method.id)}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-left"
                        style={{ borderColor: 'var(--gray-border)', color: 'var(--navy)' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--navy)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--gray-border)')}
                      >
                        {method.logos && method.logos.length > 0 ? (
                          // Multiple logos side by side (e.g. Visa + Mastercard for card)
                          <div className="flex items-center gap-1">
                            {method.logos.map((logo, i) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img key={i} src={logo} alt="" className="h-7 w-auto object-contain" style={{ maxWidth: '52px' }} />
                            ))}
                          </div>
                        ) : method.logoSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={method.logoSrc} alt={method.label} className="h-8 w-auto object-contain" style={{ maxWidth: '100px' }} />
                        ) : (
                          <div className="w-10 h-8 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--gray-light)' }}>
                            <Icon size={18} style={{ color: 'var(--navy)' }} />
                          </div>
                        )}
                        <div className="flex-1">
                          <span className="text-sm font-semibold block">{method.label}</span>
                          {method.brands.length > 0 && (
                            <span className="text-xs" style={{ color: 'var(--gray)' }}>{method.brands.join(', ')}</span>
                          )}
                        </div>
                        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )
                  })}
                  <p className="text-center text-xs pt-2" style={{ color: 'var(--gray)' }}>
                    🔒 Todos los pagos son procesados por PayZen de forma segura.
                  </p>
                </div>
              )}

              {/* Step 3a — Card form (kr-embedded, fully styled) */}
              {step === 'card' && (
                <div>
                  <div ref={krDivRef} className="kr-embedded" style={{ minHeight: '280px' }} />
                  <p className="text-center text-xs mt-3" style={{ color: 'var(--gray)' }}>
                    🔒 Conexión cifrada SSL · PayZen no almacena los datos de tu tarjeta.
                  </p>
                </div>
              )}

              {/* Step 3b — Nequi / PSE / Bancolombia (kr-smart-form filtered to method) */}
              {step === 'external' && (
                <div>
                  <div ref={krDivRef} className="kr-smart-form" style={{ minHeight: '280px' }} />
                  <p className="text-center text-xs mt-3" style={{ color: 'var(--gray)' }}>
                    🔒 Conexión cifrada SSL · Pago procesado de forma segura por PayZen.
                  </p>
                </div>
              )}

              {/* Success */}
              {step === 'success' && (
                <div className="text-center py-8">
                  <CheckCircle size={56} className="mx-auto mb-4" style={{ color: 'var(--green)' }} />
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--navy)' }}>¡Pago completado!</h3>
                  <p className="text-sm" style={{ color: 'var(--gray)' }}>
                    Tu pago fue procesado exitosamente. Recibirás un email con tus accesos y datos de facturación en breve.
                  </p>
                  <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-xl text-sm font-bold" style={{ backgroundColor: 'var(--navy)', color: 'white' }}>
                    Aceptar
                  </button>
                </div>
              )}

              {/* Error */}
              {step === 'error' && (
                <div className="text-center py-8">
                  <AlertCircle size={56} className="mx-auto mb-4" style={{ color: '#DC2626' }} />
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--navy)' }}>Error en el pago</h3>
                  <p className="text-sm mb-6" style={{ color: '#DC2626' }}>{errorMsg}</p>
                  <button
                    onClick={() => { setStep('methods'); setErrorMsg('') }}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold"
                    style={{ backgroundColor: 'var(--navy)', color: 'white' }}
                  >
                    Intentar de nuevo
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
