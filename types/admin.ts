/** Types for e-Misión Admin Panel */

export type ConversationStatus = 'bot' | 'waiting_agent' | 'with_agent' | 'closed'

export interface Conversation {
  id: string
  session_id: string
  status: ConversationStatus
  visitor_name: string | null
  visitor_email: string | null
  visitor_phone: string | null
  plan_interest: string | null
  assigned_agent: string | null
  unread_count: number
  closed_at: string | null
  created_at: string
  // joined
  last_message?: string
  last_message_at?: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'agent'
  content: string
  created_at: string
}

export interface Agent {
  id: string
  email: string
  name: string
  role: 'agent' | 'admin'
  is_online: boolean
  last_seen: string
  created_at: string
}

export interface Sale {
  id: string
  order_id: string
  plan_name: string
  plan_price: number
  customer_name: string
  customer_email: string
  customer_phone: string | null
  customer_nit: string | null
  payment_method: string | null
  status: 'completed' | 'pending' | 'failed'
  conversation_id: string | null
  created_at: string
}

export interface DashboardMetrics {
  conversationsToday: number
  leadsToday: number
  waitingCount: number
  conversationsMonth: number
  salesToday: number
  revenueMonth: number
}
