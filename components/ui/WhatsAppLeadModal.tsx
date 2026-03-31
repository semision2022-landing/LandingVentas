'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, User, Mail, Phone, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { fbEvent, generateEventId, sendCapi } from '@/lib/fbq'

const PLANS = [
  'Plan 25', 'Plan 100', 'Plan 150', 'Plan 500', 'Plan 1000', 'Plan 2500',
  'Plan X', 'Plan XM', 'Plan XL',
  'Plan Estándar (Integral)', 'Plan Plus (Integral)', 'Plan Premium (Integral)',
  'No sé aún',
]

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '573044796885'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function WhatsAppLeadModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', plan: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.name.trim()) e.name = 'Requerido'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 7) e.phone = 'Teléfono inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      // Save lead to Supabase conversations table
      const supabase = createClient()
      const leadId = crypto.randomUUID()
      const { error } = await supabase.from('conversations').insert({
        id: leadId,
        session_id: `wa_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        status: 'closed',
        visitor_name: form.name.trim(),
        visitor_email: form.email.trim().toLowerCase(),
        visitor_phone: form.phone.trim(),
        plan_interest: form.plan || null,
        lead_source: 'whatsapp',
      })

      // Auto-asignar al siguiente asesor en rotación
      if (!error) {
        fetch('/api/leads/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: leadId, source: 'whatsapp' }),
        }).catch(() => {}) // fire-and-forget, no bloqueamos el flujo WA
      }

      // Facebook Contact event
      const eventId = generateEventId()
      fbEvent('Contact', { content_name: 'WhatsApp Lead Form' }, eventId)
      sendCapi({
        eventName: 'Contact',
        eventId,
        contentName: 'WhatsApp Lead Form',
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
      })

      // Build WhatsApp message
      const msg = encodeURIComponent(
        `Hola, soy ${form.name.trim()}.${form.plan && form.plan !== 'No sé aún' ? ` Me interesa el ${form.plan}.` : ''} Quisiera más información sobre e-Misión.`
      )

      // Redirect to WhatsApp
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
      onClose()
      setForm({ name: '', email: '', phone: '', plan: '' })
    } catch {
      // Still open WhatsApp even if Supabase fails
      window.open(`https://wa.me/${WA_NUMBER}`, '_blank')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const field = (
    key: keyof typeof form,
    label: string,
    placeholder: string,
    Icon: React.ElementType,
    type = 'text',
  ) => (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#18224C' }}>{label}</label>
      <div className="relative">
        <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
        <input
          type={type}
          value={form[key]}
          onChange={(e) => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: undefined })) }}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none transition-all"
          style={{
            borderColor: errors[key] ? '#EF4444' : '#E2E8F0',
            color: '#18224C',
          }}
          onFocus={(e) => { e.target.style.borderColor = errors[key] ? '#EF4444' : '#18224C' }}
          onBlur={(e) => { e.target.style.borderColor = errors[key] ? '#EF4444' : '#E2E8F0' }}
        />
      </div>
      {errors[key] && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors[key]}</p>}
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
          >
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 relative" style={{ background: 'linear-gradient(135deg, #18224C 0%, #223870 100%)' }}>
                <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}>
                  <X size={14} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#25D366' }}>
                    <MessageCircle size={20} fill="white" color="white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-base">Hablar por WhatsApp</h2>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>Completa tus datos y te contactamos</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {field('name', 'Nombre completo *', 'Ej: Carlos Ramírez', User)}
                {field('email', 'Correo electrónico *', 'tu@empresa.com', Mail, 'email')}
                {field('phone', 'Teléfono / WhatsApp *', 'Ej: 3001234567', Phone, 'tel')}

                {/* Plan selector */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#18224C' }}>¿Qué plan te interesa?</label>
                  <div className="relative">
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#94A3B8' }} />
                    <select
                      value={form.plan}
                      onChange={(e) => setForm(f => ({ ...f, plan: e.target.value }))}
                      className="w-full pl-4 pr-9 py-2.5 rounded-xl text-sm border outline-none appearance-none transition-all"
                      style={{ borderColor: '#E2E8F0', color: form.plan ? '#18224C' : '#94A3B8', backgroundColor: 'white' }}
                    >
                      <option value="">Seleccionar plan (opcional)</option>
                      {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 mt-2"
                  style={{ backgroundColor: '#25D366' }}
                >
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><MessageCircle size={16} /> Ir a WhatsApp</>
                  }
                </button>

                <p className="text-center text-xs" style={{ color: '#94A3B8' }}>
                  🔒 Tus datos son confidenciales y no se comparten con terceros.
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
