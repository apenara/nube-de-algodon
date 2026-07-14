import type { Product } from "@/data/products";

// Un turno de la conversación tal como se envía/almacena (solo texto plano).
export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

// Cuerpo del POST a /api/chat.
export type ChatRequest = {
  sessionId: string;
  messages: ChatTurn[];
};

// Lo que el modelo devuelve vía la herramienta `responder` (salida estructurada).
export type AssistantOutput = {
  reply: string;
  // Sugerencias tocables para guiar el siguiente paso (chips). Máx 4, cortas.
  quickReplies: string[];
  // Slugs de productos reales del catálogo para mostrar como tarjetas. Máx 3.
  products: string[];
  // false cuando Nube admitió no tener el dato (para analítica en Neon).
  answered: boolean;
};

// Producto enriquecido con su imagen, listo para renderizar en el chat.
export type ChatProduct = Product & { src?: string };

// Respuesta que el front recibe de /api/chat.
export type ChatResponse = {
  reply: string;
  quickReplies: string[];
  products: ChatProduct[];
  answered: boolean;
};

// Respuesta de error controlada (límites, rate limit, etc.).
export type ChatError = {
  error: string;
  // Mensaje amable ya listo para mostrarle a la persona.
  message: string;
};
