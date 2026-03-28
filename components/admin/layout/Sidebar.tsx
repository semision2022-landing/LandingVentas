'use client'

import { useRouter, usePathname } from 'next/navigation'
import { createAuthClient } from '@/lib/supabase-auth'
import {
  LayoutDashboard, MessageSquare, Users, Settings, LogOut, ShoppingBag, BarChart2,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Chat Center', href: '/admin/conversations', icon: MessageSquare },
  { label: 'Leads', href: '/admin/leads', icon: Users },
  { label: 'Ventas', href: '/admin/sales', icon: ShoppingBag },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { label: 'Configuración', href: '/admin/settings', icon: Settings },
]

interface SidebarProps {
  agentName?: string
  agentEmail?: string
}

export default function Sidebar({ agentName, agentEmail }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    const supabase = createAuthClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const initials = agentName
    ? agentName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <aside
      className="hidden lg:flex flex-col h-screen w-60 shrink-0 fixed left-0 top-0 z-40"
      style={{ backgroundColor: '#18224C', borderRight: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="e-Misión" className="h-12 w-auto" />
        <p className="text-xs mt-1.5 font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Panel Administrativo
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                backgroundColor: active ? '#00D0FF' : 'transparent',
                color: active ? '#18224C' : 'rgba(255,255,255,0.7)',
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <Icon size={18} />
              {item.label}
            </a>
          )
        })}
      </nav>

      {/* Agent */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3 px-2 mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: '#00D0FF', color: '#18224C' }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{agentName ?? 'Agente'}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {agentEmail ?? ''}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium transition-all"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
          }}
        >
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
