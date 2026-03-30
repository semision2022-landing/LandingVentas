'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createAuthClient } from '@/lib/supabase-auth'
import Sidebar from '@/components/admin/layout/Sidebar'
import Header from '@/components/admin/layout/Header'
import MobileNav from '@/components/admin/layout/MobileNav'
import { Toaster } from 'react-hot-toast'
import type { Agent } from '@/types/admin'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [pendingCount, setPendingCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createAuthClient()

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      // Load agent profile
      const { data } = await supabase
        .from('agents')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (data) setAgent(data as Agent)

      // Mark agent online
      await supabase.from('agents').update({ is_online: true, last_seen: new Date().toISOString() }).eq('id', session.user.id)
      setLoading(false)
    }

    init()

    // Subscribe to waiting_agent changes for badge
    const channel = supabase
      .channel('admin-pending')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'conversations',
      }, async () => {
        const { count } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'waiting_agent')
        setPendingCount(count ?? 0)
      })
      .subscribe()

    // Initial pending count
    supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'waiting_agent')
      .then(({ count }) => setPendingCount(count ?? 0))

    return () => { supabase.removeChannel(channel) }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00D0FF', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F8FAFC', fontFamily: 'Poppins, sans-serif' }}>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Poppins, sans-serif', fontSize: '13px' } }} />

      {/* Sidebar desktop */}
      <Sidebar agentName={agent?.name} agentEmail={agent?.email} agentRole={agent?.role} />

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-60">
        <Header pathname={pathname} pendingCount={pendingCount} agentName={agent?.name} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile nav */}
      <MobileNav />
    </div>
  )
}
