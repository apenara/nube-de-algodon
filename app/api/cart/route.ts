import { NextResponse } from "next/server";
import { saveCart, checkRateLimit, type SavedCartItem } from "@/lib/db";
import { products } from "@/data/products";

// Escribe en Neon en cada request: siempre dinámico, runtime Node.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 254;
const MAX_QTY = 99; // por línea
const MAX_LINES = 50; // productos distintos por carrito
const MAX_NOTE_LEN = 500;

// Índice slug -> producto: la fuente de verdad de precios y nombres.
const bySlug = new Map(products.map((p) => [p.slug, p]));

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "anon";
}

function bad(status: number, error: string, message: string) {
  return NextResponse.json({ error, message }, { status });
}

type CartBody = {
  email?: unknown;
  whatsapp?: unknown;
  name?: unknown;
  note?: unknown;
  items?: unknown;
};

// Resuelve los items del cliente ({slug, qty}) contra el catálogo real,
// tomando de ahí el nombre y el precio. Ignora slugs inventados y limita qty.
function resolveItems(raw: unknown): SavedCartItem[] {
  if (!Array.isArray(raw)) return [];
  const out: SavedCartItem[] = [];
  const seen = new Set<string>();
  for (const it of raw) {
    const slug = typeof it?.slug === "string" ? it.slug : "";
    const product = bySlug.get(slug);
    if (!product || seen.has(slug)) continue;
    const qtyRaw = Number(it?.qty);
    const qty = Number.isFinite(qtyRaw) ? Math.min(Math.max(Math.trunc(qtyRaw), 1), MAX_QTY) : 1;
    seen.add(slug);
    out.push({ slug, name: product.name, qty, price: product.price });
    if (out.length >= MAX_LINES) break;
  }
  return out;
}

export async function POST(req: Request) {
  let body: CartBody;
  try {
    body = (await req.json()) as CartBody;
  } catch {
    return bad(400, "invalid_json", "No pudimos leer tu selección, intenta de nuevo.");
  }

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > MAX_EMAIL_LEN || !EMAIL_RE.test(email)) {
    return bad(400, "invalid_email", "Revisa tu correo, parece que tiene un error 🤍");
  }

  const items = resolveItems(body?.items);
  if (items.length === 0) {
    return bad(400, "empty_cart", "Agrega al menos un producto antes de guardar tu selección 🤍");
  }

  const whatsapp =
    typeof body?.whatsapp === "string" && body.whatsapp.trim()
      ? body.whatsapp.trim().slice(0, 40)
      : null;
  const name =
    typeof body?.name === "string" && body.name.trim()
      ? body.name.trim().slice(0, 80)
      : null;
  const note =
    typeof body?.note === "string" && body.note.trim()
      ? body.note.trim().slice(0, MAX_NOTE_LEN)
      : null;

  // total real, calculado desde el catálogo (nunca desde el cliente).
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  // Rate limit por IP (bucket propio del carrito).
  try {
    const { allowed } = await checkRateLimit(`cart:${clientIp(req)}`);
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
    const id = await saveCart({ email, whatsapp, name, note, items, total });
    return NextResponse.json({
      ok: true,
      id,
      total,
      message: "¡Listo! Guardamos tu selección 🤍 Nube te escribirá para asesorarte.",
    });
  } catch {
    return bad(
      500,
      "db",
      "Tuvimos un problemita al guardar tu selección. Intenta de nuevo en un momento 🤍",
    );
  }
}
