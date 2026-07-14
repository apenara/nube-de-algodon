import { NextResponse } from "next/server";
import { saveClubMember, checkRateLimit } from "@/lib/db";

// Escribe en Neon en cada request: siempre dinámico, runtime Node.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_EMAIL_LEN = 254; // límite práctico de un correo (RFC 5321)
const MAX_NAME_LEN = 80;

// Validación de correo sensata (no exhaustiva, pero suficiente y segura).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "anon";
}

function bad(status: number, error: string, message: string) {
  return NextResponse.json({ error, message }, { status });
}

type ClubBody = { email?: unknown; name?: unknown; source?: unknown };

export async function POST(req: Request) {
  let body: ClubBody;
  try {
    body = (await req.json()) as ClubBody;
  } catch {
    return bad(400, "invalid_json", "No pudimos leer tus datos, intenta de nuevo.");
  }

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const name =
    typeof body?.name === "string" && body.name.trim()
      ? body.name.trim().slice(0, MAX_NAME_LEN)
      : null;
  const source =
    typeof body?.source === "string" && body.source.trim()
      ? body.source.trim().slice(0, 40)
      : "newsletter";

  if (!email || email.length > MAX_EMAIL_LEN || !EMAIL_RE.test(email)) {
    return bad(400, "invalid_email", "Revisa tu correo, parece que tiene un error 🤍");
  }

  // Rate limit por IP (bucket propio del club, separado del chat).
  try {
    const { allowed } = await checkRateLimit(`club:${clientIp(req)}`);
    if (!allowed) {
      return bad(
        429,
        "rate_limited",
        "Recibimos varios registros desde tu conexión. Intenta de nuevo en un rato 🤍",
      );
    }
  } catch {
    // Si el rate limit falla, no bloqueamos el registro.
  }

  try {
    const result = await saveClubMember({ email, name, source });
    const message =
      result === "already_member"
        ? "¡Ya eras parte del club! 🤍 Te avisaremos de las novedades."
        : "¡Listo! Ya eres parte del club 🤍 Revisa tu correo para tu 10%.";
    return NextResponse.json({ ok: true, status: result, message });
  } catch {
    return bad(
      500,
      "db",
      "Tuvimos un problemita al guardar tus datos. Intenta de nuevo en un momento 🤍",
    );
  }
}
