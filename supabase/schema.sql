-- ======================================================
-- SQL para ejecutar en Supabase — e-Misión Landing Page
-- ======================================================

-- 1. TABLA DE ÓRDENES
CREATE TABLE IF NOT EXISTS orders (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            timestamptz DEFAULT now() NOT NULL,
  customer_name         text NOT NULL,
  customer_email        text NOT NULL,
  customer_phone        text NOT NULL,
  customer_company      text,
  customer_nit          text NOT NULL,
  plan_name             text NOT NULL,
  plan_price            integer NOT NULL,
  wc_product_id         integer,
  payment_status        text DEFAULT 'pending' NOT NULL,
  payzen_transaction_id text,
  notification_sent     boolean DEFAULT false NOT NULL
);

-- 2. TABLA DE CONVERSACIONES DEL CHATBOT
CREATE TABLE IF NOT EXISTS conversations (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id   text UNIQUE NOT NULL,
  created_at   timestamptz DEFAULT now() NOT NULL,
  status       text DEFAULT 'bot' NOT NULL,
  plan_interest text,
  visitor_name  text,
  visitor_email text
);

-- 3. TABLA DE MENSAJES DEL CHATBOT
CREATE TABLE IF NOT EXISTS messages (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  role            text NOT NULL CHECK (role IN ('user', 'assistant', 'agent')),
  content         text NOT NULL,
  created_at      timestamptz DEFAULT now() NOT NULL
);

-- 4. ÍNDICES PARA MEJOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);

-- 5. HABILITAR REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- 6. ROW LEVEL SECURITY (RLS) — Habilitar y configurar
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Las órdenes solo son accesibles mediante service_role (API backend)
CREATE POLICY "orders_service_only" ON orders
  USING (auth.role() = 'service_role');

-- Conversaciones: lectura pública (para el chatbot), escritura con service_role
CREATE POLICY "conversations_read" ON conversations
  FOR SELECT USING (true);

CREATE POLICY "conversations_insert" ON conversations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "messages_read" ON messages
  FOR SELECT USING (true);

CREATE POLICY "messages_insert" ON messages
  FOR INSERT WITH CHECK (true);
