'use client'

import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, Users, ShoppingBag, User } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Chat', href: '/admin/conversations', icon: MessageSquare },
  { label: 'Leads', href: '/admin/leads', icon: Users },
  { label: 'Ventas', href: '/admin/sales', icon: ShoppingBag },
  { label: 'Perfil', href: '/admin/settings', icon: User },
]

export default function MobileNav() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{ backgroundColor: '#18224C', borderColor: 'rgba(255,255,255,0.1)' }}
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all"
              style={{ color: active ? '#00D0FF' : 'rgba(255,255,255,0.5)' }}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
