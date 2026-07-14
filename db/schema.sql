-- Esquema de datos para "Nube de Algodón" (Neon / Postgres)

CREATE TABLE IF NOT EXISTS knowledge_base (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,      -- ej: 'precios', 'envios', 'politicas'
  fact TEXT NOT NULL,          -- el dato en lenguaje natural
  active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversation_logs (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  assistant_reply TEXT NOT NULL,
  answered BOOLEAN,            -- false si el bot admitió no saber
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Registros del Club de Nube de Algodón (captura real de leads).
-- Una persona deja su correo (y opcionalmente su nombre) desde la landing
-- y se guarda aquí de verdad. UNIQUE(email) evita duplicados.
CREATE TABLE IF NOT EXISTS club_members (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,                    -- opcional
  source TEXT DEFAULT 'newsletter',  -- de qué formulario vino
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Carritos guardados como lead ("guarda tu selección y te asesoramos").
-- items es JSONB: [{ slug, name, qty, price }]. total lo calcula el servidor
-- desde el catálogo (no se confía en el precio que manda el cliente).
CREATE TABLE IF NOT EXISTS saved_carts (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  whatsapp TEXT,               -- opcional
  name TEXT,                   -- opcional
  note TEXT,                   -- mensaje opcional para la asesoría
  items JSONB NOT NULL,        -- productos de la selección
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_carts_email ON saved_carts (email);

-- Leads del "Kit perfecto para tu bebé" (Proyecto 3: herramienta de valor).
-- La persona hace un quiz de 5 preguntas y recibe un kit personalizado; deja
-- su correo para guardarlo/recibirlo. Guardamos tanto las respuestas (answers)
-- como el kit recomendado (kit), ambos JSONB, para saber POR QUÉ es un buen lead.
-- total lo recalcula el servidor con el motor de reglas (no se confía en el cliente).
CREATE TABLE IF NOT EXISTS kit_leads (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  whatsapp TEXT,               -- opcional
  name TEXT,                   -- opcional
  answers JSONB NOT NULL,      -- respuestas del quiz { stage, mobility, budget, priority, has }
  kit JSONB NOT NULL,          -- kit recomendado { included, total, ... }
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kit_leads_email ON kit_leads (email);

-- Rate limiting simple por IP (ventana deslizante de 1 hora).
-- Una fila por request; se cuentan las de la última hora.
CREATE TABLE IF NOT EXISTS chat_requests (
  id SERIAL PRIMARY KEY,
  ip TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_requests_ip_time
  ON chat_requests (ip, created_at);
