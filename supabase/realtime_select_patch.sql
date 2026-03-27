-- ============================================
-- PATCH: Permitir SELECT a anon para Realtime
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Permite que el chatbot (anon key) reciba mensajes del agente via Realtime
DROP POLICY IF EXISTS "public_select_messages" ON messages;
CREATE POLICY "public_select_messages" ON messages
  FOR SELECT USING (true);

-- Permite que el chatbot detecte el cambio de status (bot → with_agent) via Realtime
DROP POLICY IF EXISTS "public_select_conversations" ON conversations;
CREATE POLICY "public_select_conversations" ON conversations
  FOR SELECT USING (true);
