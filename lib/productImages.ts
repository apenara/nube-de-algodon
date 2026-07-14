import { readdirSync } from "node:fs";
import { join } from "node:path";

// Mapea slug -> ruta pública de su imagen (con la extensión real que exista).
// Se usa en el server component para decidir foto real vs. placeholder,
// sin asumir .png ni .webp.
export function getProductImageMap(): Map<string, string> {
  const map = new Map<string, string>();
  try {
    const files = readdirSync(join(process.cwd(), "public", "products"));
    for (const file of files) {
      if (/\.(png|jpe?g|webp|avif)$/i.test(file)) {
        const slug = file.replace(/\.[^.]+$/, "");
        // Prefiere webp si hubiera duplicados.
        if (!map.has(slug) || /\.webp$/i.test(file)) {
          map.set(slug, `/products/${file}`);
        }
      }
    }
  } catch {
    // sin carpeta o sin imágenes: se usan placeholders
  }
  return map;
}
