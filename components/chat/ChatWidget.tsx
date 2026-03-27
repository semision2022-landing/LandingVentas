'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle } from 'lucide-react'
import ChatMessage from './ChatMessage'
import QuickReplies from './QuickReplies'
import { createClient } from '@/lib/supabase'
import { fbEvent, generateEventId } from '@/lib/fbq'

interface Message {
  role: 'assistant' | 'user' | 'agent'
  content: string
  id: string
}

const GREETING = '¡Hola! 👋 Soy Laura, asesora de e-Misión. ¿En qué te puedo ayudar hoy? Cuéntame sobre tu empresa y con gusto te asesoro.'

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: GREETING, id: 'greeting' },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [unread, setUnread] = useState(1)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [sessionId] = useState(() => generateSessionId())
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isTransferred, setIsTransferred] = useState(false)
  const [hasTrackedContact, setHasTrackedContact] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input when open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
      setUnread(0)
    }
  }, [isOpen])

  // Initialize conversation in Supabase
  const initConversation = useCallback(async () => {
    if (conversationId) return
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('conversations')
        .insert({ session_id: sessionId, status: 'bot' })
        .select('id')
        .single()
      if (data) setConversationId(data.id)
    } catch { /* silent */ }
  }, [sessionId, conversationId])

  // Save message to Supabase
  const saveMessage = useCallback(async (role: string, content: string) => {
    if (!conversationId) return
    try {
      const supabase = createClient()
      await supabase.from('messages').insert({ conversation_id: conversationId, role, content })
    } catch { /* silent */ }
  }, [conversationId])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return
    setShowQuickReplies(false)
    setInput('')

    const userMsg: Message = { role: 'user', content: text, id: generateId() }
    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    // Contact event on first user message (once per session)
    if (!hasTrackedContact) {
      fbEvent('Contact', { content_name: 'Chatbot Laura' }, generateEventId())
      setHasTrackedContact(true)
    }

    // Init conversation on first user message
    await initConversation()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
          sessionId,
        }),
      })

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ error: 'Sin cuerpo de respuesta' }))
        console.error('[ChatWidget] Error API /api/chat:', res.status, errorBody)
        throw new Error(errorBody.error || 'Error en el servidor')
      }
      const { reply } = await res.json()

      const isTransfer = reply.includes('[TRANSFER]')
      const cleanReply = reply.replace('[TRANSFER]', '').trim()

      const botRole: 'assistant' | 'agent' = isTransfer ? 'agent' : 'assistant'
      const botMsg: Message = { role: botRole, content: cleanReply, id: generateId() }
      setMessages((prev) => [...prev, botMsg])

      if (isTransfer) setIsTransferred(true)

      // Save to Supabase
      await saveMessage('user', text)
      await saveMessage('assistant', cleanReply)

      if (!isOpen) setUnread((n) => n + 1)
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '¡Ups! Ocurrió un error. Por favor intenta de nuevo o llámanos al 604 590 3572.', id: generateId() },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, messages, isOpen, sessionId, initConversation, saveMessage])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[90]" id="chatbot">
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute bottom-16 right-0 flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: 380,
              height: 560,
              border: '1px solid var(--gray-border)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 shrink-0"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                LC
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">Laura · Asesora e-Misión</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 block" />
                  <span className="text-xs text-white/70">En línea</span>
                  {isTransferred && (
                    <span
                      className="ml-1 text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: 'var(--purple)', color: 'white' }}
                    >
                      Asesor humano
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label="Cerrar chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pt-4 pb-2">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
              ))}
              {isLoading && <ChatMessage role="assistant" content="" isLoading />}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            <QuickReplies onSelect={sendMessage} visible={showQuickReplies && messages.length <= 2} />

            {/* Input */}
            <div
              className="px-3 py-3 border-t shrink-0 flex gap-2 items-center"
              style={{ borderColor: 'var(--gray-border)' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-all"
                style={{ borderColor: 'var(--gray-border)', color: 'var(--navy)' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--navy)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--gray-border)')}
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-40 hover:-translate-y-0.5 active:translate-y-0"
                style={{ backgroundColor: '#F97316', color: 'white' }}
                aria-label="Enviar mensaje"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <div className="relative flex flex-col items-end gap-2">
        {/* Speech bubble CTA */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.4, ease: 'easeOut' }}
            className="relative mr-1 px-4 py-2.5 rounded-2xl rounded-br-none shadow-lg max-w-[220px] text-right"
            style={{ backgroundColor: 'white', border: '1px solid var(--gray-border)' }}
          >
            <p className="text-xs font-semibold leading-snug" style={{ color: 'var(--navy)' }}>
              💬 ¿Preguntas sobre planes?
            </p>
            <p className="text-xs leading-snug mt-0.5" style={{ color: 'var(--gray)' }}>
              ¡Laura te asesora ahora!
            </p>
            {/* Triangle pointer */}
            <span
              className="absolute -bottom-2 right-4 w-0 h-0"
              style={{
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid white',
              }}
            />
          </motion.div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ backgroundColor: 'var(--navy)' }}
          aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat con Laura'}
        >
        {/* Pulse ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: 'var(--navy)' }} />
        )}

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={22} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        {!isOpen && unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
            style={{ backgroundColor: '#EF4444' }}
          >
            {unread}
          </motion.span>
        )}
        </button>
      </div>
    </div>
  )
}
