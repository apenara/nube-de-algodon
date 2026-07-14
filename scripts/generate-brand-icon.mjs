// Genera el ícono de marca (mascota Nube) con gpt-image-1 y produce los
// assets: public/brand/nube-icon.png (full), app/icon.png (favicon),
// app/apple-icon.png (iOS). Requiere OPENAI_API_KEY en .env.local o entorno.
//
// Uso:  node scripts/generate-brand-icon.mjs   (usa --force para regenerar)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Carga .env.local si la key no está en el entorno.
if (!process.env.OPENAI_API_KEY) {
  try {
    for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
}

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error("❌ Falta OPENAI_API_KEY (ponla en .env.local o el entorno).");
  process.exit(1);
}

const brandDir = join(root, "public", "brand");
const appDir = join(root, "app");
const srcPng = join(brandDir, "nube-icon.png");
const force = process.argv.includes("--force");
const quality = process.env.IMAGE_QUALITY || "medium";

const PROMPT =
  "A minimalist brand app icon for a premium, cozy baby store. " +
  "A soft plush cloud character with a gentle cute face: two small dark dot eyes, " +
  "tiny rosy blush cheeks, and a small friendly smile. Rounded, pillowy, huggable, " +
  "in soft powder-blue and warm white with a delicate gradient and a subtle soft shadow. " +
  "Centered with generous padding on a warm cream (#F5EFE6) rounded-square background. " +
  "Flat, clean, modern, high-end, tactile pastel palette. No text, no letters, no watermark.";

async function generate() {
  if (existsSync(srcPng) && !force) {
    console.log("• public/brand/nube-icon.png ya existe (usa --force para regenerar)");
    return;
  }
  mkdirSync(brandDir, { recursive: true });
  process.stdout.write("… generando ícono de marca ");
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: PROMPT,
      size: "1024x1024",
      quality,
      n: 1,
    }),
  });
  if (!res.ok) {
    console.log("");
    throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("respuesta sin imagen");
  writeFileSync(srcPng, Buffer.from(b64, "base64"));
  console.log("✓");
}

async function derive() {
  // Favicon (Next usa app/icon.png) y apple-icon.
  await sharp(srcPng).resize(512, 512).png({ quality: 90 }).toFile(join(appDir, "icon.png"));
  await sharp(srcPng).resize(180, 180).png({ quality: 90 }).toFile(join(appDir, "apple-icon.png"));
  // Versión ligera para el logo del header/footer (webp).
  await sharp(srcPng).resize(160, 160).webp({ quality: 88 }).toFile(join(brandDir, "nube-icon.webp"));
  console.log("✓ derivados: app/icon.png, app/apple-icon.png, public/brand/nube-icon.webp");
}

try {
  await generate();
  await derive();
  console.log("✅ Listo.");
} catch (err) {
  console.error("❌", err.message);
  process.exit(1);
}
