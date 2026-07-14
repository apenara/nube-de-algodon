import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getKnowledgeBase, logConversation, checkRateLimit } from "@/lib/db";
import { buildSystemPrompt, RESPONDER_TOOL } from "@/lib/assistant/prompt";
import { products } from "@/data/products";
import type {
  ChatRequest,
  ChatResponse,
  ChatProduct,
  AssistantOutput,
} from "@/lib/assistant/types";

// Usa fs indirectamente y llama a APIs externas: siempre dinámico, runtime Node.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 500;
const MAX_MESSAGE_LEN = 500; // caracteres por mensaje de usuario
const MAX_TURNS = 20; // turnos de usuario por conversación

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Índice slug -> producto para validar/enriquecer lo que devuelve el modelo.
const bySlug = new Map(products.map((p) => [p.slug, p]));

// Convierte slugs (validados contra el catálogo) en tarjetas con imagen.
function toChatProducts(slugs: string[]): ChatProduct[] {
  const seen = new Set<string>();
  const out: ChatProduct[] = [];
  for (const slug of slugs) {
    const p = bySlug.get(slug);
    if (!p || seen.has(slug)) continue; // ignora slugs inventados o repetidos
    seen.add(slug);
    out.push({ ...p, src: `/products/${slug}.webp` });
    if (out.length >= 3) break;
  }
  return out;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "anon";
}

function bad(status: number, error: string, message: string) {
  return NextResponse.json({ error, message }, { status });
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return bad(
      500,
      "config",
      "El asistente no está configurado todavía. Escríbenos por WhatsApp de lunes a sábado, 9:00 a 19:00 🤍",
    );
  }

  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return bad(400, "invalid_json", "No pude leer tu mensaje, intenta de nuevo.");
  }

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const sessionId =
    typeof body?.sessionId === "string" && body.sessionId
      ? body.sessionId.slice(0, 100)
      : "anon";

  const userTurns = messages.filter((m) => m.role === "user");
  const lastUser = userTurns.at(-1);

  if (!lastUser || !lastUser.content.trim()) {
    return bad(400, "empty", "¿Me cuentas en qué te ayudo? 🤍");
  }
  if (lastUser.content.length > MAX_MESSAGE_LEN) {
    return bad(
      400,
      "too_long",
      "Ese mensaje es un poquito largo. ¿Me lo resumes en menos de 500 caracteres?",
    );
  }
  if (userTurns.length > MAX_TURNS) {
    return bad(
      429,
      "max_turns",
      "¡Hemos conversado bastante! Para seguir con calma, escríbenos por WhatsApp de lunes a sábado, 9:00 a 19:00 🤍",
    );
  }

  // Rate limit por IP.
  try {
    const { allowed } = await checkRateLimit(clientIp(req));
    if (!allowed) {
      return bad(
        429,
        "rate_limited",
        "Has escrito bastante en la última hora. Descansa un momento y vuelve a intentarlo, o escríbenos por WhatsApp 🤍",
      );
    }
  } catch {
    // Si el rate limit falla, no bloqueamos la conversación.
  }

  // Base de conocimiento fresca desde Neon.
  let systemPrompt: string;
  try {
    const facts = await getKnowledgeBase();
    systemPrompt = buildSystemPrompt(facts);
  } catch {
    return bad(
      500,
      "kb",
      "Tuvimos un problemita al consultar la información. Intenta de nuevo en un momento 🤍",
    );
  }

  // Solo enviamos rol + texto (recorta largos y limita el historial).
  const apiMessages = messages
    .slice(-2 * MAX_TURNS)
    .filter((m) => (m.role === "user" || m.role === "assistant") && m.content?.trim())
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_MESSAGE_LEN * 3),
    }));

  let output: AssistantOutput;
  try {
    const res = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      tools: [RESPONDER_TOOL],
      tool_choice: { type: "tool", name: "responder" },
      messages: apiMessages,
    });

    const toolUse = res.content.find((b) => b.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      throw new Error("sin tool_use");
    }
    const input = toolUse.input as Partial<AssistantOutput>;
    output = {
      reply:
        typeof input.reply === "string" && input.reply.trim()
          ? input.reply.trim()
          : "Perdona, ¿me lo dices de otra forma? 🤍",
      quickReplies: Array.isArray(input.quickReplies)
        ? input.quickReplies.filter((q) => typeof q === "string").slice(0, 4)
        : [],
      products: Array.isArray(input.products)
        ? input.products.filter((s) => typeof s === "string")
        : [],
      answered: input.answered !== false,
    };
  } catch {
    return bad(
      502,
      "llm",
      "No pude responder en este momento. Intenta de nuevo, o escríbenos por WhatsApp de lunes a sábado, 9:00 a 19:00 🤍",
    );
  }

  const chatProducts = toChatProducts(output.products);

  // Log en Neon (sin bloquear la respuesta si falla).
  logConversation({
    sessionId,
    userMessage: lastUser.content,
    assistantReply: output.reply,
    answered: output.answered,
  }).catch(() => {});

  const payload: ChatResponse = {
    reply: output.reply,
    quickReplies: output.quickReplies,
    products: chatProducts,
    answered: output.answered,
  };
  return NextResponse.json(payload);
}
