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
