'use client'

import { useEffect, useState } from 'react'
import { createAuthClient } from '@/lib/supabase-auth'
import { Save, Eye, EyeOff } from 'lucide-react'
import type { Agent } from '@/types/admin'

export default function SettingsPage() {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const supabase = createAuthClient()
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase.from('agents').select('*').eq('id', session.user.id).single()
      if (data) { setAgent(data as Agent); setName(data.name) }
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agent) return
    setSaving(true); setMsg(null)

    const supabase = createAuthClient()

    try {
      // Update display name
      await supabase.from('agents').update({ name }).eq('id', agent.id)

      // Update password if provided
      if (password) {
        if (password !== passwordConfirm) {
          setMsg({ type: 'error', text: 'Las contraseñas no coinciden.' })
          setSaving(false); return
        }
        const { error } = await supabase.auth.updateUser({ password })
        if (error) throw error
        setPassword(''); setPasswordConfirm('')
      }

      setMsg({ type: 'success', text: 'Cambios guardados correctamente.' })
      setAgent(prev => prev ? { ...prev, name } : prev)
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Error al guardar.' })
    }
    setSaving(false)
  }

  return (
    <div className="p-6 max-w-xl">
      <div className="bg-white rounded-2xl p-7" style={{ border: '1px solid #E2E8F0' }}>
        <h2 className="text-base font-bold mb-6" style={{ color: '#18224C' }}>Mi cuenta</h2>

        {msg && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium`}
            style={{
              backgroundColor: msg.type === 'success' ? '#F0FDF4' : '#FEF2F2',
              color: msg.type === 'success' ? '#579601' : '#DC2626',
              border: `1px solid ${msg.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
            }}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Read-only email */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Correo electrónico</label>
            <input
              type="text"
              value={agent?.email ?? ''}
              disabled
              className="w-full px-4 py-2.5 rounded-lg text-sm border"
              style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', color: '#94A3B8' }}
            />
            <p className="text-[11px] mt-1" style={{ color: '#94A3B8' }}>El email no se puede cambiar</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#18224C' }}>Nombre visible</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none transition-all"
              style={{ borderColor: '#E2E8F0', color: '#18224C' }}
              onFocus={(e) => (e.target.style.borderColor = '#18224C')}
              onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Rol</label>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize"
              style={{ backgroundColor: agent?.role === 'admin' ? '#EEF2FF' : '#F0FDF4', color: agent?.role === 'admin' ? '#18224C' : '#579601' }}>
              {agent?.role ?? '—'}
            </span>
          </div>

          <hr style={{ borderColor: '#F1F5F9' }} />
          <p className="text-xs font-semibold" style={{ color: '#18224C' }}>Cambiar contraseña</p>
          <p className="text-xs -mt-3" style={{ color: '#94A3B8' }}>Deja en blanco si no deseas cambiarla</p>

          {/* New password */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#18224C' }}>Nueva contraseña</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-10 rounded-lg text-sm border outline-none transition-all"
                style={{ borderColor: '#E2E8F0', color: '#18224C' }}
                onFocus={(e) => (e.target.style.borderColor = '#18224C')}
                onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#18224C' }}>Confirmar contraseña</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none transition-all"
              style={{ borderColor: '#E2E8F0', color: '#18224C' }}
              onFocus={(e) => (e.target.style.borderColor = '#18224C')}
              onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60 hover:-translate-y-0.5 transition-all"
            style={{ backgroundColor: '#18224C' }}
          >
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  )
}
