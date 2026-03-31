-- ============================================================
-- e-Misión — Lead Enhancements Migration
-- Ejecutar en: Supabase → SQL Editor
-- ============================================================

-- 1. Nuevas columnas en conversations
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS lead_source_type text DEFAULT 'landing',
  ADD COLUMN IF NOT EXISTS added_by uuid REFERENCES agents(id) ON DELETE SET NULL;

-- 2. Tabla de Etiquetas (lead_labels)
CREATE TABLE IF NOT EXISTS lead_labels (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id    uuid REFERENCES conversations(id) ON DELETE CASCADE,
  label      text NOT NULL,
  color      text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. Tabla de Notas (lead_notes)
CREATE TABLE IF NOT EXISTS lead_notes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id    uuid REFERENCES conversations(id) ON DELETE CASCADE,
  agent_id   uuid REFERENCES agents(id) ON DELETE CASCADE,
  content    text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 4. Tabla de Tareas (lead_tasks)
CREATE TABLE IF NOT EXISTS lead_tasks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     uuid REFERENCES conversations(id) ON DELETE CASCADE,
  agent_id    uuid REFERENCES agents(id) ON DELETE CASCADE,
  title       text NOT NULL,
  due_date    date,
  completed   boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- 5. Habilitar RLS
ALTER TABLE lead_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_tasks ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de acceso (Todo agente autenticado puede ver/editar)
-- (La visibilidad del lead en sí ya está controlada por conversations)

DROP POLICY IF EXISTS "lead_labels_access" ON lead_labels;
CREATE POLICY "lead_labels_access" ON lead_labels
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "lead_notes_access" ON lead_notes;
CREATE POLICY "lead_notes_access" ON lead_notes
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "lead_tasks_access" ON lead_tasks;
CREATE POLICY "lead_tasks_access" ON lead_tasks
  FOR ALL USING (auth.role() = 'authenticated');

-- Permitir Realtime (opcional pero bueno para la UI admin)
ALTER PUBLICATION supabase_realtime ADD TABLE lead_labels;
ALTER PUBLICATION supabase_realtime ADD TABLE lead_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE lead_tasks;
