import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("Falta la variable de entorno DATABASE_URL");
}

// Cliente serverless de Neon. Uso: await sql`SELECT ...`
export const sql = neon(process.env.DATABASE_URL);

export type KnowledgeFact = {
  id: number;
  category: string;
  fact: string;
};

// Lee todos los datos activos de la base de conocimiento.
export async function getKnowledgeBase(): Promise<KnowledgeFact[]> {
  const rows = await sql`
    SELECT id, category, fact
    FROM knowledge_base
    WHERE active = true
    ORDER BY category, id
  `;
  return rows as KnowledgeFact[];
}

// Registra una interacción en conversation_logs.
export async function logConversation(params: {
  sessionId: string;
  userMessage: string;
  assistantReply: string;
  answered: boolean;
}): Promise<void> {
  const { sessionId, userMessage, assistantReply, answered } = params;
  await sql`
    INSERT INTO conversation_logs (session_id, user_message, assistant_reply, answered)
    VALUES (${sessionId}, ${userMessage}, ${assistantReply}, ${answered})
  `;
}
