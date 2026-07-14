# ☁️ Nube de Algodón — Asistente de IA para una tienda de bebés

> **Proyecto 1 · The Vibecoders League (reto de Platzi).**
> Tienda online ficticia de artículos para bebés con un **asistente conversacional de IA**
> que responde dudas de clientes usando una base de conocimiento real del negocio.

**🔗 Demo:** https://nube-de-algodon.vercel.app/

---

## 🎯 El reto

Construir un asistente de IA para un negocio real (o ficticio pero coherente), publicado en
un link público, que:

- Responda preguntas de clientes usando una **base de conocimiento del negocio** almacenada
  en una base de datos.
- Mantenga un **tono y personalidad** consistentes.
- **Admita cuando no sabe algo** en lugar de inventar respuestas.
- Esté **protegido contra abuso** (es un link público).

El brief completo y las decisiones de producto están en [`prd.md`](./prd.md).

## 🧸 El negocio

**Nube de Algodón** es una tienda 100 % online de artículos para bebés (0 a 3 años): ropa,
cochecitos, cunas, sillas para auto, pañales, juguetes didácticos y artículos de lactancia.
Su propuesta de valor es dar **asesoría cercana a padres primerizos**, y esa misma calidez
es la personalidad del asistente.

## 🤖 Qué se construyó

### 1. El asistente "Nube"

La mascota de la marca —una nube con carita— **es** el asistente (no un "bot" genérico).

- **Responde con datos reales del negocio**: precios, envíos, políticas de cambio,
  certificaciones de seguridad, garantías, medios de pago, horarios, lista de regalos, etc.
  La base de conocimiento (~11 datos) vive en **Neon** y se puede editar sin redesplegar.
- **No inventa**: si la respuesta no está en la base de conocimiento, lo admite y ofrece el
  canal de contacto humano. Ante preguntas fuera de tema redirige con amabilidad, y ante
  dudas de salud recomienda consultar al pediatra.
- **Interactivo**: burbujas de chat con _quick-reply chips_, **tarjetas de producto en línea**
  (con foto real) y **4 mini-flujos guiados** —canastilla del primer mes, buscador de
  cochecito/silla, buscador de regalo y dudas de pedido— que el modelo conduce
  conversacionalmente.
- **Salida estructurada** vía _tool use_ de Anthropic (no texto libre): la herramienta
  `responder` devuelve `{ reply, quickReplies[], products[], answered }`, forzada con
  `tool_choice`. Esto hace la UI interactiva y confiable.
- Se abre desde un _launcher_ flotante y desde varios botones de la landing.

### 2. La landing e-commerce

Una tienda completa que le da contexto al asistente, con dirección de diseño propia
(**"Suave nube / táctil pastel"**, deliberadamente lejos del look "AI genérico"):

`AnnouncementBar · SiteHeader · Hero · BenefitsStrip · FeaturedProducts · Categories ·
TrustSection · AssistantPreview · GiftRegistry · ClubNewsletter · SiteFooter`

Las fotos de producto son generadas y optimizadas a WebP. El carrito, buscador y formularios
son **visuales por ahora** (una demo del reto, sin procesar compras reales); al interactuar
con ellos aparece un aviso amable (`components/DemoToast.tsx`).

## 🧱 Stack técnico

| Capa                 | Tecnología                                                  |
| -------------------- | ----------------------------------------------------------- |
| Frontend + Backend   | **Next.js 16** (App Router, TypeScript)                     |
| Estilos              | **Tailwind CSS v4** (CSS-first, tokens `@theme`)            |
| Hosting              | **Vercel**                                                  |
| Base de datos        | **Neon** — Postgres serverless (`@neondatabase/serverless`) |
| LLM                  | **API de Anthropic** — `claude-haiku-4-5`                   |
| Herramienta de build | **Claude Code** (no forma parte del runtime)                |

**Decisión de arquitectura — sin RAG:** con ~11 datos, toda la base de conocimiento se
inyecta directamente en el _system prompt_ en cada request. Es más simple, más barato y más
confiable a esta escala. Sin embeddings ni búsqueda vectorial.

## 🔀 Arquitectura

```
Usuario → Landing (Next.js en Vercel)
        → POST /api/chat  { historial de la conversación }
            1. Valida: ≤500 chars/mensaje, ≤20 turnos, rate limit por IP (20/hora)
            2. Lee la base de conocimiento fresca desde Neon
            3. Construye el system prompt: persona + tono + reglas + catálogo + KB + flujos
            4. Llama a Anthropic con tool use forzado (claude-haiku-4-5, max_tokens: 500)
            5. Valida los slugs de producto contra el catálogo y adjunta la foto WebP
            6. Loguea la interacción en Neon (answered = true/false)
        → Respuesta estructurada al chat
```

### Esquema de datos (Neon)

- **`knowledge_base`** — los datos del negocio (`category`, `fact`, `active`). Editables sin redeploy.
- **`conversation_logs`** — cada interacción (`answered = false` revela qué preguntas frecuentes faltan en la KB).
- **`chat_requests`** — una fila por request para el rate limit por IP (ventana deslizante de 1 h).

Ver [`db/schema.sql`](./db/schema.sql) y [`db/seed.sql`](./db/seed.sql).

### 🛡️ Protección contra abuso

- **Rate limit por IP**: 20 mensajes/hora (contador en Neon, ventana deslizante).
- **`max_tokens: 500`** por respuesta.
- **≤ 20 turnos** por conversación.
- **≤ 500 caracteres** por mensaje del usuario.

## 📁 Estructura del repo

```
app/
  api/chat/route.ts      Endpoint del asistente (validación, rate limit, Anthropic, logging)
  page.tsx               Landing (composición de componentes)
  layout.tsx             Layout raíz + montaje del ChatWidget
  globals.css            Design system: tokens de color, tipografía, sombras
components/               Componentes de la landing (Hero, FeaturedProducts, …)
  chat/ChatWidget.tsx    UI del chat (launcher flotante + panel)
  DemoToast.tsx          Aviso "esto es una demo" en controles decorativos
lib/
  db.ts                  Cliente Neon + helpers (KB, logs, checkRateLimit)
  assistant/
    prompt.ts            buildSystemPrompt(), RESPONDER_TOOL, WELCOME
    types.ts             Tipos del asistente
  productImages.ts       Mapea slug → ruta de imagen real (extensión detectada)
data/products.ts         Catálogo de productos
db/                       schema.sql · seed.sql · setup.mjs
scripts/                  Generación de imágenes de producto e ícono de marca
public/products/          Fotos de producto en WebP
```

## 🚀 Puesta en marcha local

### 1. Requisitos

- Node.js 18+
- Una base de datos **Neon** (o cualquier Postgres) → `DATABASE_URL`
- Una **API key de Anthropic** → `ANTHROPIC_API_KEY`

### 2. Instalar y configurar

```bash
npm install
```

Crea `.env.local` (está en `.gitignore` — nunca subas secretos, el repo es público):

```bash
DATABASE_URL="postgres://…"        # cadena de conexión de Neon
ANTHROPIC_API_KEY="sk-ant-…"       # API key de Anthropic
RATE_LIMIT_PER_HOUR=20             # opcional (default 20)
```

### 3. Preparar la base de datos

```bash
npm run db:setup      # crea las tablas y carga los ~11 datos de la KB (schema + seed)
```

### 4. Correr

```bash
npm run dev           # http://localhost:3000
```

## 📜 Scripts

| Script                    | Qué hace                                                 |
| ------------------------- | -------------------------------------------------------- |
| `npm run dev`             | Servidor de desarrollo                                   |
| `npm run build` / `start` | Build y arranque de producción                           |
| `npm run lint`            | ESLint                                                   |
| `npm run db:setup`        | Crea tablas y carga la base de conocimiento en Neon      |
| `npm run images:generate` | Genera las fotos de producto (requiere `OPENAI_API_KEY`) |
| `npm run images:optimize` | Convierte/optimiza las imágenes a WebP                   |
| `npm run brand:icon`      | Genera el ícono de la marca                              |

## ☁️ Despliegue en Vercel

1. Importa el repo en Vercel.
2. Añade la integración **Neon** (inyecta `DATABASE_URL` automáticamente).
3. Configura la variable `ANTHROPIC_API_KEY` en el proyecto de Vercel.
4. (Recomendado) Define un **límite de gasto mensual** en la consola de Anthropic.
5. Deploy. Actualiza la URL de la demo al inicio de este README.

## 📄 Documentos del proyecto

- [`prd.md`](./prd.md) — PRD completo: objetivo, KB, tono, comportamiento, criterios de éxito.
- [`AGENTS.md`](./AGENTS.md) / [`CLAUDE.md`](./CLAUDE.md) — notas para agentes de IA que trabajen en el repo.

---

_Proyecto ficticio con fines educativos para el reto de Platzi · The Vibecoders League._
