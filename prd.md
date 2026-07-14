# PRD: Asistente de IA para "Nube de Algodón"

## Proyecto 1 - The Vibecoders League

### 1. Resumen

Asistente conversacional de IA para "Nube de Algodón", una tienda online de artículos
para bebés. El asistente responde preguntas de clientes usando una base de conocimiento
real del negocio almacenada en Neon (Postgres), mantiene un tono cálido y confiable, y
admite cuando no sabe algo en lugar de inventar respuestas.

### 2. Objetivo

Permitir que cualquier persona (padres, familiares, compradores de regalos) pueda hacerle
preguntas al asistente sobre productos, precios, políticas y servicios de la tienda, y
recibir respuestas útiles y correctas en segundos, sin necesidad de contactar a un humano.

### 3. Descripción del negocio

- **Nombre**: Nube de Algodón
- **Rubro**: Tienda de artículos para bebés (0 a 3 años aprox.)
- **Modalidad**: Tienda online con envíos a domicilio
- **Propuesta de valor**: Productos seguros, de calidad, con asesoría cercana para
  padres primerizos

### 4. Stack técnico

| Capa                      | Tecnología                                   | Rol                                                   |
| ------------------------- | -------------------------------------------- | ----------------------------------------------------- |
| Frontend + Backend        | Next.js (App Router)                         | Landing page con chat embebido + endpoint `/api/chat` |
| Hosting                   | Vercel                                       | Despliegue, dominio público, variables de entorno     |
| Base de datos             | Neon (Postgres serverless)                   | Base de conocimiento + logs de conversación           |
| LLM                       | API de Anthropic — modelo `claude-haiku-4-5` | Genera las respuestas del chat                        |
| Herramienta de desarrollo | Claude Code                                  | Construcción del proyecto (no es parte del runtime)   |

**Nota**: Neon es solo Postgres (no incluye auth, storage ni edge functions). Para este
proyecto es suficiente. La conexión se hace con el driver serverless de Neon
(`@neondatabase/serverless`) desde las API routes de Next.js.

### 5. Arquitectura

```
Usuario → Landing (Next.js en Vercel)
        → POST /api/chat  { mensajes de la conversación }
            1. Lee la base de conocimiento desde Neon (tabla knowledge_base)
            2. Construye el system prompt: tono + reglas + datos de la KB
            3. Llama a la API de Anthropic (claude-haiku-4-5, respuesta streaming)
            4. Guarda la interacción en Neon (tabla conversation_logs)
        → Respuesta en streaming al chat
```

**Decisión de diseño — sin RAG**: con ~11 datos, toda la base de conocimiento se inyecta
directamente en el system prompt en cada request. No se usan embeddings ni búsqueda
vectorial: es más simple, más barato y más confiable a esta escala.

**Esquema de datos (Neon)**:

```sql
CREATE TABLE knowledge_base (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,      -- ej: 'precios', 'envios', 'politicas'
  fact TEXT NOT NULL,          -- el dato en lenguaje natural
  active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE conversation_logs (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  assistant_reply TEXT NOT NULL,
  answered BOOLEAN,            -- false si el bot admitió no saber
  created_at TIMESTAMPTZ DEFAULT now()
);
```

Ventaja: los datos se editan en Neon sin redesplegar, y `answered = false` revela qué
preguntas frecuentes faltan en la KB (insumo para mejorar el asistente).

### 6. Base de conocimiento (mínimo 10 datos concretos)

1. Categorías de producto: ropa (0-24 meses), cochecitos, cunas, sillas para auto,
   pañales, juguetes didácticos, artículos de lactancia
2. Rango de precios: ropa desde $8, cochecitos desde $120, cunas desde $150, sillas
   para auto desde $90, pañales por paquete desde $12
3. Horario de atención al cliente (chat/WhatsApp): lunes a sábado, 9:00 a 19:00
4. Canal de venta: 100% online, sin tienda física
5. Envíos: 2 a 4 días hábiles a nivel nacional; costo fijo de $5, gratis en compras
   mayores a $60
6. Política de cambios y devoluciones: 30 días desde la compra, producto sin uso y
   con etiqueta/empaque original
7. Certificaciones de seguridad: cochecitos cumplen ASTM F833, cunas ASTM F1169 y
   sillas para auto FMVSS 213
8. Medios de pago aceptados: tarjeta de crédito/débito y pagos contra entrega en
   ciudades seleccionadas
9. Lista de bebé / registro de regalos: disponible, permite a familiares comprar de
   una lista creada por los padres
10. Garantía: 6 meses en cochecitos, cunas y sillas para auto por defectos de fábrica
11. Atención post-venta: soporte por chat para dudas de armado o uso de productos

Estos datos son los definitivos del negocio (ficticio pero coherente) y se cargan en
Neon mediante un script de seed.

### 7. Tono y personalidad del asistente

- Cálido, cercano y tranquilizador
- Lenguaje simple, sin tecnicismos
- Empático con las dudas típicas de padres primerizos
- Nunca alarmista; siempre orientado a dar tranquilidad y claridad

### 8. Comportamiento requerido

- Responde correctamente preguntas cuya respuesta esté en la base de conocimiento
- Si la pregunta no tiene respuesta en la base, lo admite explícitamente y no inventa
  información (ej. "No tengo ese dato, pero puedes escribir a nuestro equipo por
  WhatsApp de lunes a sábado, 9:00 a 19:00")
- Ante preguntas fuera de tema (ej. "escríbeme un poema"), redirige amablemente:
  "Estoy aquí para ayudarte con todo lo de Nube de Algodón, ¿tienes alguna duda sobre
  nuestros productos o servicios?"
- No da consejos médicos ni de salud; ante esas preguntas recomienda consultar al pediatra
- Mantiene el tono definido en todas las respuestas
- Maneja preguntas de seguimiento dentro de la misma conversación (se envía el
  historial completo en cada request)

### 9. Protección contra abuso (link público)

- **Rate limiting por IP**: máximo 20 mensajes por hora (middleware en Vercel o
  `@upstash/ratelimit`; alternativa simple: contador en Neon por IP + ventana de tiempo)
- **Límite de tokens por respuesta**: `max_tokens: 500`
- **Límite por conversación**: máximo 20 turnos; después invita a contactar por WhatsApp
- **Límite de longitud del mensaje**: 500 caracteres por mensaje de usuario
- **Presupuesto**: configurar límite de gasto mensual en la consola de Anthropic

### 10. Criterios de éxito / entregables

- Link público funcional en Vercel donde cualquier persona pueda probar el asistente
- Responde correctamente ≥ 9 de 10 preguntas de prueba cuya respuesta está en la KB
- Admite no saber (sin inventar) en preguntas de prueba fuera de la KB
- Base de conocimiento con mínimo 10 datos cargados en Neon
- Breve descripción del negocio, qué sabe el asistente y qué lo hace único
- Publicación del proyecto en los comentarios de la clase y en redes sociales

### 11. Fuera de alcance (para esta primera versión)

- Procesamiento de pagos reales
- Integración con inventario en tiempo real
- Soporte multilenguaje
- RAG / búsqueda vectorial (innecesario a esta escala)
- Panel de administración para editar la KB (se edita directo en Neon)
