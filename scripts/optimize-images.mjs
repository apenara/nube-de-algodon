// Comprime las imágenes de producto: PNG -> WebP (calidad 82) y borra el PNG.
// Aligera el repo sin perder calidad visible (las tarjetas se ven pequeñas).
//
// Uso:  node scripts/optimize-images.mjs

import { readdirSync, statSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, "..", "public", "products");

const kb = (bytes) => (bytes / 1024).toFixed(0) + " KB";

let pngs;
try {
  pngs = readdirSync(dir).filter((f) => /\.png$/i.test(f));
} catch {
  console.error("❌ No existe public/products/ (genera imágenes primero).");
  process.exit(1);
}

if (pngs.length === 0) {
  console.log("No hay PNG que optimizar (¿ya están en WebP?).");
  process.exit(0);
}

let before = 0;
let after = 0;

for (const file of pngs) {
  const src = join(dir, file);
  const dest = src.replace(/\.png$/i, ".webp");
  const inBytes = statSync(src).size;

  // Redimensiona a máx. 1024px (suficiente para las tarjetas) y convierte a WebP.
  await sharp(src)
    .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(dest);

  const outBytes = statSync(dest).size;
  unlinkSync(src); // quita el PNG pesado

  before += inBytes;
  after += outBytes;
  console.log(`✓ ${file.replace(/\.png$/i, "")}  ${kb(inBytes)} → ${kb(outBytes)}`);
}

const saved = (((before - after) / before) * 100).toFixed(0);
console.log(`\n✅ ${kb(before)} → ${kb(after)}  (−${saved}%)`);
