-- ============================================
-- e-Misión Admin Panel — SQL Migration
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Columnas adicionales en conversations
ALTER TABLE conversations 
  ADD COLUMN IF NOT EXISTS visitor_email text,
  ADD COLUMN IF NOT EXISTS visitor_phone text,
  ADD COLUMN IF NOT EXISTS assigned_agent text,
  ADD COLUMN IF NOT EXISTS closed_at timestamptz,
  ADD COLUMN IF NOT EXISTS unread_count integer DEFAULT 0;

-- 2. Tabla de agentes
CREATE TABLE IF NOT EXISTS agents (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'agent' CHECK (role IN ('agent', 'admin')),
  is_online boolean DEFAULT false,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- 3. Tabla de ventas
CREATE TABLE IF NOT EXISTS sales (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id text UNIQUE NOT NULL,
  plan_name text NOT NULL,
  plan_price numeric NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  customer_nit text,
  payment_method text,
  status text DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- 4. Habilitar RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- 5. Eliminar policies antiguas si existen para recrearlas
DROP POLICY IF EXISTS "agents_all" ON conversations;
DROP POLICY IF EXISTS "agents_all" ON messages;
DROP POLICY IF EXISTS "agents_all" ON agents;
DROP POLICY IF EXISTS "agents_all" ON sales;

-- 6. Policies: solo agentes autenticados ven todo
CREATE POLICY "agents_all" ON conversations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "agents_all" ON messages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "agents_all" ON agents
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "agents_all" ON sales
  FOR ALL USING (auth.role() = 'authenticated');

-- 7. Policy pública para que la landing pueda insertar conversaciones y mensajes
-- (La landing usa la anon key, así que necesita INSERT en conversations y messages)
DROP POLICY IF EXISTS "public_insert_conversations" ON conversations;
DROP POLICY IF EXISTS "public_insert_messages" ON messages;

CREATE POLICY "public_insert_conversations" ON conversations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_insert_messages" ON messages
  FOR INSERT WITH CHECK (true);

-- 8. Habilitar Realtime (ignora si la tabla ya está en la publicación)
DO $$
DECLARE
  tablas text[] := ARRAY['conversations', 'messages', 'agents', 'sales'];
  t text;
BEGIN
  FOREACH t IN ARRAY tablas LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', t);
    EXCEPTION WHEN duplicate_object THEN
      RAISE NOTICE 'Tabla % ya está en supabase_realtime, se omite.', t;
    END;
  END LOOP;
END $$;

-- ============================================
-- INSTRUCCIONES POST-MIGRACIÓN:
-- 
-- 1. Crear usuarios en Supabase Auth → Authentication → Users:
--    - valentinahurtado@emision.co
--    - direccioncomercial@emision.co  
--    - martingonzalez@emision.co
--
-- 2. Copiar los UUIDs de cada usuario creado y ejecutar:
-- INSERT INTO agents (id, email, name, role) VALUES
--   ('<uid-valentina>', 'valentinahurtado@emision.co', 'Valentina Hurtado', 'agent'),
--   ('<uid-direccion>', 'direccioncomercial@emision.co', 'Dirección Comercial', 'admin'),
--   ('<uid-martin>', 'martingonzalez@emision.co', 'Martin Gonzalez', 'admin');
-- ============================================
