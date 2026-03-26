'use client'

import { motion } from 'framer-motion'

interface ChatMessageProps {
  role: 'assistant' | 'user' | 'agent'
  content: string
  isLoading?: boolean
}

export default function ChatMessage({ role, content, isLoading }: ChatMessageProps) {
  const isUser = role === 'user'
  const isAgent = role === 'agent'

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Avatar for bot/agent */}
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mr-2 mt-auto mb-1"
          style={{ backgroundColor: isAgent ? 'var(--purple)' : 'var(--navy)' }}
        >
          {isAgent ? 'AS' : 'L'}
        </div>
      )}

      <div
        className="max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed"
        style={{
          backgroundColor: isUser
            ? 'var(--navy)'
            : isAgent
            ? '#E0F7FF'
            : 'white',
          color: isUser
            ? 'white'
            : isAgent
            ? 'var(--navy)'
            : '#334155',
          borderRadius: isUser
            ? '16px 4px 16px 16px'
            : '4px 16px 16px 16px',
          border: isUser ? 'none' : isAgent ? '1px solid #BAE6FD' : '1px solid #E2E8F0',
        }}
      >
        {isLoading ? (
          <div className="flex gap-1.5 items-center py-1">
            <span className="w-2 h-2 rounded-full bg-gray-400 dot-1" />
            <span className="w-2 h-2 rounded-full bg-gray-400 dot-2" />
            <span className="w-2 h-2 rounded-full bg-gray-400 dot-3" />
          </div>
        ) : (
          <span>{content}</span>
        )}
      </div>
    </motion.div>
  )
}
