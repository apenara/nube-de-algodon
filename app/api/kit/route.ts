import { NextResponse } from "next/server";
import { saveKitLead, checkRateLimit } from "@/lib/db";
import { recommend } from "@/lib/kit/recommend";
import type { Budget, KitAnswers, Mobility, Priority, Stage } from "@/lib/kit/types";
import {
  VALID_BUDGET,
  VALID_CATEGORIES,
  VALID_MOBILITY,
  VALID_PRIORITY,
  VALID_STAGES,
} from "@/lib/kit/questions";

// Escribe en Neon en cada request: siempre dinámico, runtime Node.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 254;

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "anon";
}

function bad(status: number, error: string, message: string) {
  return NextResponse.json({ error, message }, { status });
}

// Valida y normaliza las respuestas del quiz. Devuelve null si algo no cuadra.
function parseAnswers(raw: unknown): KitAnswers | null {
  if (!raw || typeof raw !== "object") return null;
  const a = raw as Record<string, unknown>;

  const stage = a.stage as Stage;
  const mobility = a.mobility as Mobility;
  const budget = a.budget as Budget;
  const priority = a.priority as Priority;

  if (!VALID_STAGES.includes(stage)) return null;
  if (!VALID_MOBILITY.includes(mobility)) return null;
  if (!VALID_BUDGET.includes(budget)) return null;
  if (!VALID_PRIORITY.includes(priority)) return null;

  // has: subconjunto de categorías válidas, sin duplicados.
  const hasRaw = Array.isArray(a.has) ? a.has : [];
  const has = [...new Set(hasRaw)].filter(
    (v): v is (typeof VALID_CATEGORIES)[number] =>
      typeof v === "string" && (VALID_CATEGORIES as readonly string[]).includes(v),
  );

  return { stage, mobility, budget, priority, has };
}

type KitBody = {
  email?: unknown;
  whatsapp?: unknown;
  name?: unknown;
  answers?: unknown;
};

export async function POST(req: Request) {
  let body: KitBody;
  try {
    body = (await req.json()) as KitBody;
  } catch {
    return bad(400, "invalid_json", "No pudimos leer tus respuestas, intenta de nuevo.");
  }

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > MAX_EMAIL_LEN || !EMAIL_RE.test(email)) {
    return bad(400, "invalid_email", "Revisa tu correo, parece que tiene un error 🤍");
  }

  const answers = parseAnswers(body?.answers);
  if (!answers) {
    return bad(400, "invalid_answers", "Faltan respuestas del test. Vuelve a intentarlo 🤍");
  }

  const whatsapp =
    typeof body?.whatsapp === "string" && body.whatsapp.trim()
      ? body.whatsapp.trim().slice(0, 40)
      : null;
  const name =
    typeof body?.name === "string" && body.name.trim()
      ? body.name.trim().slice(0, 80)
      : null;

  // El kit y el total se recalculan aquí con el motor de reglas (no se confía
  // en lo que muestre el cliente).
  const kit = recommend(answers);
  const total = kit.total;

  // Rate limit por IP (bucket propio del kit).
  try {
    const { allowed } = await checkRateLimit(`kit:${clientIp(req)}`);
    if (!allowed) {
      return bad(
        429,
        "rate_limited",
        "Recibimos varias solicitudes desde tu conexión. Intenta de nuevo en un rato 🤍",
      );
    }
  } catch {
    // Si el rate limit falla, no bloqueamos el guardado.
  }

  try {
    const id = await saveKitLead({ email, whatsapp, name, answers, kit, total });
    return NextResponse.json({
      ok: true,
      id,
      message: "¡Listo! Guardamos tu kit 🤍 Nube te lo enviará con tu 10% de bienvenida.",
    });
  } catch {
    return bad(
      500,
      "db",
      "Tuvimos un problemita al guardar tu kit. Intenta de nuevo en un momento 🤍",
    );
  }
}
