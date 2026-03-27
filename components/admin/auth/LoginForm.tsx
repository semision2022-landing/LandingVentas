'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createAuthClient } from '@/lib/supabase-auth'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createAuthClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Correo o contraseña incorrectos.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #18224C 0%, #223870 100%)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="e-Misión" className="h-16 w-auto" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-xl font-bold text-center mb-1" style={{ color: '#18224C', fontFamily: 'Poppins, sans-serif' }}>
            Panel Administrativo
          </h1>
          <p className="text-sm text-center mb-6" style={{ color: '#64748B' }}>
            Ingresa con tu cuenta de e-Misión
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium text-center" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: '#18224C' }}>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@emision.co"
                className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none transition-all"
                style={{ borderColor: '#E2E8F0', color: '#18224C' }}
                onFocus={(e) => (e.target.style.borderColor = '#18224C')}
                onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: '#18224C' }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg text-sm border outline-none transition-all"
                  style={{ borderColor: '#E2E8F0', color: '#18224C' }}
                  onFocus={(e) => (e.target.style.borderColor = '#18224C')}
                  onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-60 hover:-translate-y-0.5 mt-2"
              style={{ backgroundColor: '#18224C' }}
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  Ingresar
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Acceso restringido · e-Misión © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
