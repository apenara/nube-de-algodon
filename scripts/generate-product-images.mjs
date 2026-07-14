// Genera fotos de producto con la API de imágenes de OpenAI (gpt-image-1)
// y las guarda en public/products/<slug>.png.
//
// Uso:  node scripts/generate-product-images.mjs
// Requiere OPENAI_API_KEY en el entorno o en .env.local.
//
// Mantener los slugs/prompts en sync con data/products.ts.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "products");

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

// Estilo común para que todas las fotos se vean coherentes con la marca.
const STYLE =
  "soft studio product photography, seamless warm cream (#FBFAF7) background, " +
  "gentle natural light, pastel palette, minimalist, cozy premium baby brand, " +
  "centered single product, no text, no watermark, no people";

const products = [
  { slug: "cochecito-nube", prompt: "a modern convertible baby stroller in soft powder-blue and cream, three-in-one travel system" },
  { slug: "cuna-sueno", prompt: "a light wooden convertible baby crib with soft cream bedding, minimalist nursery furniture" },
  { slug: "silla-viaje", prompt: "a rear-facing infant car seat in soft blush and grey fabric, safety certified baby car seat" },
  { slug: "body-algodon", prompt: "a neatly folded set of three organic cotton baby bodysuits in cream, sage and powder-blue" },
  { slug: "movil-cuna", prompt: "a hanging baby crib mobile with soft felt clouds and stars in pastel colors" },
  { slug: "set-lactancia", prompt: "a baby feeding set with bottles and accessories in soft cream and blue, breastfeeding essentials" },
  { slug: "panales-pack", prompt: "a soft package of premium baby diapers with gentle pastel packaging design" },
  { slug: "manta-algodon", prompt: "a knitted organic cotton baby blanket folded softly, in warm cream color" },
];

const force = process.argv.includes("--force");
// Calidad fija para que el costo sea predecible. Override: IMAGE_QUALITY=high|low
const quality = process.env.IMAGE_QUALITY || "medium";

async function generate({ slug, prompt }) {
  const dest = join(outDir, `${slug}.png`);
  // Salta si ya existe la imagen en cualquier formato (evita re-gastar).
  const already = [".png", ".webp", ".jpg", ".jpeg"].some((ext) =>
    existsSync(join(outDir, `${slug}${ext}`)),
  );
  if (already && !force) {
    console.log(`• ${slug} ya existe (usa --force para regenerar)`);
    return;
  }
  process.stdout.write(`… generando ${slug} `);
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: `${prompt}. ${STYLE}`,
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
  writeFileSync(dest, Buffer.from(b64, "base64"));
  console.log("✓");
}

mkdirSync(outDir, { recursive: true });

try {
  for (const p of products) {
    await generate(p); // secuencial para no golpear rate limits
  }
  console.log("✅ Listo. Imágenes en public/products/");
} catch (err) {
  console.error("❌", err.message);
  process.exit(1);
}
