-- ============================================================
-- e-Misión — Lead Assignment Migration
-- Ejecutar en: Supabase → SQL Editor
-- ============================================================

-- 1. Columnas en conversations
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES agents(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS attended boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS lead_source text DEFAULT 'chatbot'; -- 'chatbot' | 'whatsapp'

CREATE INDEX IF NOT EXISTS idx_conversations_assigned ON conversations(assigned_to);

-- 2. Tabla de turno para round-robin
CREATE TABLE IF NOT EXISTS assignment_counter (
  id int PRIMARY KEY DEFAULT 1,
  last_index int DEFAULT 0
);
INSERT INTO assignment_counter (id, last_index) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS: Admins ven todo, Comerciales solo sus leads
--    Primero eliminamos la política genérica existente
DROP POLICY IF EXISTS "agents_all" ON conversations;

-- Admins ven todo; comerciales ven solo sus asignados
CREATE POLICY "conversations_role_access" ON conversations
  FOR ALL USING (
    (SELECT role FROM agents WHERE id = auth.uid()) = 'admin'
    OR assigned_to = auth.uid()
    OR auth.uid() IS NULL  -- permite lectura pública para el chatbot (anon con INSERT policy)
  );

-- La policy de INSERT público sigue vigente y no se toca:
-- "public_insert_conversations" FOR INSERT WITH CHECK (true)

-- 4. Policy para assignment_counter — solo agentes autenticados
ALTER TABLE assignment_counter ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "agents_counter" ON assignment_counter;
CREATE POLICY "agents_counter" ON assignment_counter
  FOR ALL USING (auth.role() = 'authenticated');

-- 5. Insertar los 9 comerciales en agents
--    IMPORTANTE: Primero crea los usuarios en Supabase Auth → Authentication → Users
--    con los emails abajo, copia sus UUIDs y reemplaza los <uuid-X> aquí.
--    Usa contraseña temporal: Emision2026*
--
-- INSERT INTO agents (id, email, name, role) VALUES
--   ('<uuid-1>', 'camilamoreno@emision.co',      'Camila Moreno',         'agent'),
--   ('<uuid-2>', 'fannyguzman@emision.co',        'Fanny Guzmán',          'agent'),
--   ('<uuid-3>', 'isabelgonzalez@emision.co',     'Isabel González',       'agent'),
--   ('<uuid-4>', 'juanjosejaramillo@emision.co',  'Juan José Jaramillo',   'agent'),
--   ('<uuid-5>', 'julianatolosa@emision.co',       'Juliana Tolosa',        'agent'),
--   ('<uuid-6>', 'mairaurango@emision.co',         'Maira Urango',          'agent'),
--   ('<uuid-7>', 'patriciaoliveros@emision.co',    'Patricia Oliveros',     'agent'),
--   ('<uuid-8>', 'rossylondono@emision.co',        'Rossy Londoño',         'agent'),
--   ('<uuid-9>', 'carolinayara@emision.co',        'Yody Yara',             'agent');

-- ============================================================
-- VERIFICACIÓN FINAL (ejecutar después de los INSERTs):
-- SELECT id, email, name, role FROM agents ORDER BY role, name;
-- SELECT last_index FROM assignment_counter WHERE id = 1;
-- ============================================================
