'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createAuthClient } from '@/lib/supabase-auth'
import { toast } from 'react-hot-toast'
import type { Conversation, Message, Agent } from '@/types/admin'
import { Send, UserCheck, Bot, XCircle, Download, Phone, Mail, MessageSquare } from 'lucide-react'

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}
function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString('es-CO', { weekday: 'long', day: '2-digit', month: 'long' })
}
function relativeTime(ts: string) {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000
  if (diff < 60) return 'ahora'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return new Date(ts).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' })
}
function durationStr(startTs: string) {
  const min = Math.floor((Date.now() - new Date(startTs).getTime()) / 60000)
  if (min < 1) return 'menos de 1 min'
  if (min < 60) return `${min} min`
  return `${Math.floor(min / 60)}h ${min % 60}min`
}

type StatusFilter = 'all' | 'bot' | 'waiting_agent' | 'with_agent' | 'closed'

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  bot:           { label: '🤖 Bot', color: '#18224C', bg: '#EEF2FF' },
  waiting_agent: { label: '⏳ Esperando', color: '#EA580C', bg: '#FFF7ED' },
  with_agent:    { label: '🟢 Con agente', color: '#579601', bg: '#F0FDF4' },
  closed:        { label: '⚫ Cerrada', color: '#64748B', bg: '#F8FAFC' },
}

// ─── Conversation Item ─────────────────────────────────────────────────────────
function ConvItem({ conv, active, onClick }: { conv: Conversation; active: boolean; onClick: () => void }) {
  const cfg = STATUS_CFG[conv.status] ?? STATUS_CFG.bot
  const name = conv.visitor_name ?? 'Visitante'
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-l-4"
      style={{
        backgroundColor: active ? '#EEF2FF' : 'transparent',
        borderLeftColor: active ? '#18224C' : 'transparent',
      }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
        style={{ backgroundColor: cfg.bg, color: cfg.color }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold truncate" style={{ color: '#18224C' }}>{name}</p>
          <span className="text-[10px] shrink-0" style={{ color: '#94A3B8' }}>{relativeTime(conv.created_at)}</span>
        </div>
        <p className="text-xs truncate mb-1" style={{ color: '#64748B' }}>
          {conv.last_message ?? 'Sin mensajes'}
        </p>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
          {cfg.label}
        </span>
      </div>
      {(conv.unread_count ?? 0) > 0 && (
        <span className="ml-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white shrink-0"
          style={{ backgroundColor: '#EF4444' }}>
          {conv.unread_count}
        </span>
      )}
    </button>
  )
}

// ─── Agent Reply Box ───────────────────────────────────────────────────────────
function AgentReplyBox({ conversationId, agentName, onSent }: {
  conversationId: string; agentName: string; onSent: () => void
}) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  const send = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    const supabase = createAuthClient()
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'agent',
      content: text.trim(),
    })
    setText('')
    setSending(false)
    onSent()
  }

  return (
    <div className="flex gap-2 p-4 border-t" style={{ borderColor: '#E2E8F0' }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
        placeholder={`Responder como ${agentName}...`}
        className="flex-1 px-4 py-2.5 rounded-xl text-sm border outline-none transition-all"
        style={{ borderColor: '#E2E8F0', color: '#18224C' }}
        onFocus={(e) => (e.target.style.borderColor = '#18224C')}
        onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
      />
      <button
        onClick={send}
        disabled={!text.trim() || sending}
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 transition-all hover:-translate-y-0.5"
        style={{ backgroundColor: '#18224C', color: 'white' }}
      >
        {sending ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={15} />}
      </button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [msgLoading, setMsgLoading] = useState(false)
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')
  const bottomRef = useRef<HTMLDivElement>(null)
  const notifySound = useRef<HTMLAudioElement | null>(null)

  const activeConv = conversations.find((c) => c.id === activeId) ?? null

  const loadConversations = useCallback(async () => {
    const supabase = createAuthClient()
    // Con RLS activo, Supabase ya filtra automáticamente:
    // - admins reciben todas las conversaciones
    // - comerciales solo reciben las assigned_to = su UUID
    let q = supabase
      .from('conversations')
      .select('*, agents!assigned_to(name)')
      .order('created_at', { ascending: false })
    if (filter !== 'all') q = q.eq('status', filter)
    const { data } = await q
    // Mapear el join del nombre del agente
    const mapped = (data ?? []).map((row: Record<string, unknown> & { agents?: { name: string } | null }) => ({
      ...row,
      agent_name: row.agents?.name ?? row.assigned_agent ?? null,
    }))
    setConversations(mapped as Conversation[])
    setLoading(false)
  }, [filter])

  const loadMessages = useCallback(async (convId: string) => {
    setMsgLoading(true)
    const supabase = createAuthClient()
    const { data } = await supabase.from('messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: true })
    setMessages((data ?? []) as Message[])
    setMsgLoading(false)
  }, [])

  useEffect(() => {
    const supabase = createAuthClient()
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data } = await supabase.from('agents').select('*').eq('id', session.user.id).single()
        setAgent(data as Agent)
      }
    }
    init()
  }, [])

  useEffect(() => { loadConversations() }, [loadConversations])

  useEffect(() => {
    if (activeId) loadMessages(activeId)
  }, [activeId, loadMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Real-time subscriptions
  useEffect(() => {
    const supabase = createAuthClient()
    const channel = supabase.channel('conv-list-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, (payload) => {
        const row = payload.new as Conversation
        // Alert when waiting
        if (row.status === 'waiting_agent') {
          toast('⚡ Cliente esperando atención humana', {
            icon: '🔔',
            style: { backgroundColor: '#FFF7ED', color: '#EA580C', border: '1px solid #FED7AA' },
          })
          notifySound.current?.play().catch(() => {})
          if (Notification.permission === 'granted') {
            new Notification('e-Misión Chat', { body: 'Cliente esperando atención humana' })
          }
        }
        loadConversations()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [loadConversations])

  useEffect(() => {
    if (!activeId) return
    const supabase = createAuthClient()
    const channel = supabase.channel(`msgs-${activeId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${activeId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [activeId])

  const updateStatus = async (status: string) => {
    if (!activeId) return
    const supabase = createAuthClient()
    const update: Record<string, unknown> = { status }
    if (status === 'with_agent' && agent) update.assigned_agent = agent.name
    if (status === 'closed') update.closed_at = new Date().toISOString()
    await supabase.from('conversations').update(update).eq('id', activeId)
    loadConversations()
  }

  const downloadConversation = () => {
    if (!activeConv) return
    const lines = [
      `Conversación e-Misión — ${activeConv.id}`,
      `Cliente: ${activeConv.visitor_name ?? 'Visitante'}`,
      `Email: ${activeConv.visitor_email ?? '—'}`,
      `Teléfono: ${activeConv.visitor_phone ?? '—'}`,
      `Plan: ${activeConv.plan_interest ?? '—'}`,
      `Fecha: ${new Date(activeConv.created_at).toLocaleString('es-CO')}`,
      '─'.repeat(50),
      ...messages.map((m) => `[${formatTime(m.created_at)}] ${m.role === 'user' ? 'Cliente' : m.role === 'agent' ? 'Agente' : 'Laura'}: ${m.content}`),
    ].join('\n')
    const blob = new Blob([lines], { type: 'text/plain; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversacion-${activeConv.id.slice(0, 8)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = conversations.filter((c) =>
    [c.visitor_name, c.visitor_email].some((f) => f?.toLowerCase().includes(search.toLowerCase()))
  )

  const filterTabs: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'bot', label: 'Bot' },
    { id: 'waiting_agent', label: '⏳ Esperando' },
    { id: 'with_agent', label: '🟢 Agente' },
    { id: 'closed', label: 'Cerradas' },
  ]

  // Group messages by date
  const groupedMessages: { date: string; msgs: Message[] }[] = []
  messages.forEach((m) => {
    const d = m.created_at.split('T')[0]
    const last = groupedMessages[groupedMessages.length - 1]
    if (!last || last.date !== d) groupedMessages.push({ date: d, msgs: [m] })
    else last.msgs.push(m)
  })

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Hidden audio for notification sound */}
      <audio ref={notifySound} src="/notification.mp3" preload="auto" />

      {/* LEFT: Conversation list */}
      <div
        className={`${mobileView === 'chat' ? 'hidden' : 'flex'} lg:flex flex-col w-full lg:w-72 shrink-0 border-r overflow-hidden`}
        style={{ borderColor: '#E2E8F0', backgroundColor: 'white' }}
      >
        {/* Search */}
        <div className="p-3 border-b" style={{ borderColor: '#E2E8F0' }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full px-3 py-2 rounded-lg text-xs border outline-none"
            style={{ borderColor: '#E2E8F0', color: '#18224C' }}
          />
        </div>

        {/* Filter tabs */}
        <div className="flex overflow-x-auto gap-1 px-2 py-2 border-b" style={{ borderColor: '#E2E8F0' }}>
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className="text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap shrink-0 transition-colors"
              style={{
                backgroundColor: filter === tab.id ? '#18224C' : '#F8FAFC',
                color: filter === tab.id ? 'white' : '#64748B',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-2 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <p className="px-4 py-8 text-sm text-center" style={{ color: '#94A3B8' }}>Sin conversaciones</p>
          )}
          {!loading && filtered.map((conv) => (
            <ConvItem
              key={conv.id}
              conv={conv}
              active={conv.id === activeId}
              onClick={() => { setActiveId(conv.id); setMobileView('chat') }}
            />
          ))}
        </div>
      </div>

      {/* CENTER: Chat panel */}
      <div className={`${mobileView === 'list' ? 'hidden' : 'flex'} lg:flex flex-1 flex-col overflow-hidden`}
        style={{ backgroundColor: '#F8FAFC' }}>
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-3">
            <MessageSquare size={48} style={{ color: '#CBD5E1' }} />
            <p className="text-sm" style={{ color: '#94A3B8' }}>Selecciona una conversación</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="px-4 py-3 border-b bg-white flex items-center gap-3" style={{ borderColor: '#E2E8F0' }}>
              <button
                onClick={() => setMobileView('list')}
                className="lg:hidden text-gray-400 mr-1"
              >←</button>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ backgroundColor: '#EEF2FF', color: '#18224C' }}
              >
                {(activeConv.visitor_name ?? 'V').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: '#18224C' }}>
                  {activeConv.visitor_name ?? 'Visitante'}
                </p>
                {activeConv.plan_interest && (
                  <p className="text-xs" style={{ color: '#64748B' }}>Plan: {activeConv.plan_interest}</p>
                )}
              </div>
              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                {activeConv.status !== 'with_agent' && (
                  <button onClick={() => updateStatus('with_agent')} title="Tomar conversación"
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: '#18224C', color: 'white' }}>
                    <UserCheck size={13} /> Tomar
                  </button>
                )}
                {activeConv.status === 'with_agent' && (
                  <button onClick={() => updateStatus('bot')} title="Devolver al bot"
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{ backgroundColor: '#EEF2FF', color: '#18224C' }}>
                    <Bot size={13} /> Al bot
                  </button>
                )}
                {activeConv.status !== 'closed' && (
                  <button onClick={() => updateStatus('closed')} title="Cerrar chat"
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                    <XCircle size={13} /> Cerrar
                  </button>
                )}
                <button onClick={downloadConversation} title="Descargar"
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#F8FAFC', color: '#64748B' }}>
                  <Download size={14} />
                </button>
              </div>
            </div>

            {/* Status banners */}
            {activeConv.status === 'bot' && (
              <div className="mx-4 mt-3 px-4 py-2.5 rounded-xl text-xs font-medium text-center"
                style={{ backgroundColor: '#EEF2FF', color: '#18224C', border: '1px solid #C7D2FE' }}>
                🤖 El bot Laura está atendiendo esta conversación
              </div>
            )}
            {activeConv.status === 'waiting_agent' && (
              <div className="mx-4 mt-3 px-4 py-2.5 rounded-xl text-xs font-medium text-center animate-pulse"
                style={{ backgroundColor: '#FFF7ED', color: '#EA580C', border: '1px solid #FED7AA' }}>
                ⚡ Cliente esperando atención humana — ¡Toma la conversación!
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {msgLoading && (
                <div className="flex justify-center py-8">
                  <span className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#CBD5E1', borderTopColor: 'transparent' }} />
                </div>
              )}
              {!msgLoading && groupedMessages.map((group) => (
                <div key={group.date}>
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
                    <span className="text-[10px] font-medium px-2" style={{ color: '#94A3B8' }}>
                      {formatDate(group.date)}
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
                  </div>
                  {group.msgs.map((msg) => {
                    const isUser = msg.role === 'user'
                    return (
                      <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
                        <div className={`max-w-[75%]`}>
                          <p className="text-[10px] mb-1 font-medium" style={{ color: '#94A3B8', textAlign: isUser ? 'right' : 'left' }}>
                            {msg.role === 'user' ? '👤 Cliente' : msg.role === 'agent' ? `🧑 ${activeConv.assigned_agent ?? 'Agente'}` : '🤖 Laura'}
                          </p>
                          <div
                            className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                            style={{
                              backgroundColor: isUser ? '#18224C' : 'white',
                              color: isUser ? 'white' : '#18224C',
                              border: isUser ? 'none' : '1px solid #E2E8F0',
                              borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                            }}
                          >
                            {msg.content}
                          </div>
                          <p className="text-[10px] mt-1" style={{ color: '#CBD5E1', textAlign: isUser ? 'right' : 'left' }}>
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Reply box */}
            {activeConv.status === 'with_agent' && agent && (
              <AgentReplyBox
                conversationId={activeId!}
                agentName={agent.name}
                onSent={() => loadMessages(activeId!)}
              />
            )}
          </>
        )}
      </div>

      {/* RIGHT: Lead info panel */}
      {activeConv && (
        <div
          className="hidden xl:flex flex-col w-72 shrink-0 border-l overflow-y-auto"
          style={{ borderColor: '#E2E8F0', backgroundColor: 'white' }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="text-sm font-bold" style={{ color: '#18224C' }}>Información del lead</h3>
          </div>

          <div className="p-5 space-y-4">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2 py-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold"
                style={{ backgroundColor: '#EEF2FF', color: '#18224C' }}>
                {(activeConv.visitor_name ?? 'V').charAt(0).toUpperCase()}
              </div>
              <p className="font-semibold text-sm" style={{ color: '#18224C' }}>
                {activeConv.visitor_name ?? 'Visitante'}
              </p>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: STATUS_CFG[activeConv.status]?.bg, color: STATUS_CFG[activeConv.status]?.color }}>
                {STATUS_CFG[activeConv.status]?.label}
              </span>
            </div>

            {/* Data */}
            {[
              { label: 'Email', value: activeConv.visitor_email, icon: <Mail size={13} />, href: activeConv.visitor_email ? `mailto:${activeConv.visitor_email}` : undefined },
              { label: 'Teléfono', value: activeConv.visitor_phone, icon: <Phone size={13} />, href: activeConv.visitor_phone ? `https://wa.me/57${activeConv.visitor_phone.replace(/\D/g, '')}` : undefined },
              { label: 'Plan de interés', value: activeConv.plan_interest },
              { label: 'Fuente', value: activeConv.lead_source === 'chatbot' ? '🤖 Chatbot' : activeConv.lead_source === 'whatsapp' ? '💬 WhatsApp' : '—' },
              { label: 'Asesor asignado', value: (activeConv as Conversation).agent_name ?? activeConv.assigned_agent ?? '—' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] font-medium uppercase tracking-wide mb-1" style={{ color: '#94A3B8' }}>{item.label}</p>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium hover:underline"
                    style={{ color: '#18224C' }}>
                    {item.icon}{item.value ?? '—'}
                  </a>
                ) : (
                  <p className="text-xs font-medium" style={{ color: item.value ? '#18224C' : '#CBD5E1' }}>
                    {item.value ?? '—'}
                  </p>
                )}
              </div>
            ))}

            <hr style={{ borderColor: '#F1F5F9' }} />

            {/* Stats */}
            {[
              { label: 'Inicio', value: new Date(activeConv.created_at).toLocaleString('es-CO') },
              { label: 'Duración', value: durationStr(activeConv.created_at) },
              { label: 'Mensajes', value: String(messages.length) },
              { label: 'Fuente', value: 'Landing Page' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] font-medium uppercase tracking-wide mb-0.5" style={{ color: '#94A3B8' }}>{item.label}</p>
                <p className="text-xs font-medium" style={{ color: '#18224C' }}>{item.value}</p>
              </div>
            ))}

            <button
              onClick={downloadConversation}
              className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 mt-2 transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: '#F8FAFC', color: '#18224C', border: '1px solid #E2E8F0' }}
            >
              <Download size={13} /> Exportar conversación
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
