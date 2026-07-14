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

-- Rate limiting simple por IP (ventana deslizante de 1 hora).
-- Una fila por request; se cuentan las de la última hora.
CREATE TABLE IF NOT EXISTS chat_requests (
  id SERIAL PRIMARY KEY,
  ip TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_requests_ip_time
  ON chat_requests (ip, created_at);
