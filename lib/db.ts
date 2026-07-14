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

export type ClubSignupResult = "created" | "already_member";

// Guarda un registro del Club en Neon (captura real de leads).
// Si el correo ya existe, no falla ni duplica: devuelve "already_member".
export async function saveClubMember(params: {
  email: string;
  name?: string | null;
  source?: string;
}): Promise<ClubSignupResult> {
  const { email, name = null, source = "newsletter" } = params;
  const rows = (await sql`
    INSERT INTO club_members (email, name, source)
    VALUES (${email}, ${name}, ${source})
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `) as { id: number }[];
  return rows.length > 0 ? "created" : "already_member";
}

// Máximo de mensajes por IP en la ventana (protección contra abuso del link público).
export const RATE_LIMIT_PER_HOUR = 20;

// Rate limiting por IP con ventana deslizante de 1 hora, usando Neon.
// Registra el request y devuelve si se permite y cuántos quedan.
export async function checkRateLimit(
  ip: string,
): Promise<{ allowed: boolean; remaining: number }> {
  // Limpieza oportunista de filas viejas (barato con el índice).
  await sql`DELETE FROM chat_requests WHERE created_at < now() - interval '2 hours'`;

  const rows = (await sql`
    SELECT count(*)::int AS count
    FROM chat_requests
    WHERE ip = ${ip} AND created_at > now() - interval '1 hour'
  `) as { count: number }[];

  const used = rows[0]?.count ?? 0;
  if (used >= RATE_LIMIT_PER_HOUR) {
    return { allowed: false, remaining: 0 };
  }

  await sql`INSERT INTO chat_requests (ip) VALUES (${ip})`;
  return { allowed: true, remaining: RATE_LIMIT_PER_HOUR - used - 1 };
}
