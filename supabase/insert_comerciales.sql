-- ============================================================
-- PASO 1: Obtener UUIDs de los comerciales (ejecutar primero)
-- ============================================================
SELECT id, email FROM auth.users WHERE email IN (
  'camilamoreno@emision.co',
  'fannyguzman@emision.co',
  'isabelgonzalez@emision.co',
  'juanjosejaramillo@emision.co',
  'julianatolosa@emision.co',
  'mairaurango@emision.co',
  'patriciaoliveros@emision.co',
  'rossylondono@emision.co',
  'carolinayara@emision.co'
);

-- ============================================================
-- PASO 2: Insertar comerciales en tabla agents automáticamente
-- (Este INSERT usa una subconsulta para no tener que copiar UUIDs a mano)
-- ============================================================

INSERT INTO agents (id, email, name, role)
SELECT id, email, name, 'agent' FROM (
  VALUES
    ('camilamoreno@emision.co',     'Camila Moreno'),
    ('fannyguzman@emision.co',      'Fanny Guzmán'),
    ('isabelgonzalez@emision.co',   'Isabel González'),
    ('juanjosejaramillo@emision.co','Juan José Jaramillo'),
    ('julianatolosa@emision.co',    'Juliana Tolosa'),
    ('mairaurango@emision.co',      'Maira Urango'),
    ('patriciaoliveros@emision.co', 'Patricia Oliveros'),
    ('rossylondono@emision.co',     'Rossy Londoño'),
    ('carolinayara@emision.co',     'Yody Yara')
) AS comerciales(email, name)
JOIN auth.users u ON u.email = comerciales.email
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- VERIFICACIÓN FINAL: ver todos los agentes y su rol
-- ============================================================
SELECT id, email, name, role, created_at
FROM agents
ORDER BY role DESC, name;
