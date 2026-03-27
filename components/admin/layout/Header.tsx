'use client'

import { Bell, Wifi } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/conversations': 'Chat Center',
  '/admin/leads': 'Leads',
  '/admin/sales': 'Ventas',
  '/admin/settings': 'Configuración',
}

interface HeaderProps {
  pathname: string
  pendingCount?: number
  agentName?: string
}

export default function Header({ pathname, pendingCount = 0, agentName }: HeaderProps) {
  const title = Object.entries(pageTitles)
    .find(([key]) => key === pathname || (key !== '/admin' && pathname.startsWith(key)))?.[1]
    ?? 'Admin'

  const initials = agentName
    ? agentName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 border-b"
      style={{ backgroundColor: 'white', borderColor: '#E2E8F0' }}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold" style={{ color: '#18224C' }}>{title}</h1>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: '#F0FDF4' }}>
          <Wifi size={11} style={{ color: '#579601' }} />
          <span className="text-xs font-medium" style={{ color: '#579601' }}>En línea</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative">
          <button className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-50" style={{ color: '#64748B' }}>
            <Bell size={18} />
          </button>
          {pendingCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
              style={{ backgroundColor: '#F97316' }}
            >
              {pendingCount > 9 ? '9+' : pendingCount}
            </span>
          )}
        </div>

        {/* Agent avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
          style={{ backgroundColor: '#00D0FF', color: '#18224C' }}
          title={agentName}
        >
          {initials}
        </div>
      </div>
    </header>
  )
}
