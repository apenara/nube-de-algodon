// Aplica el esquema y el seed contra la base de datos de Neon.
// Uso: node db/setup.mjs
// Requiere DATABASE_URL en el entorno (o en .env.local).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Carga simple de .env.local si DATABASE_URL no está en el entorno.
if (!process.env.DATABASE_URL) {
  try {
    const envPath = join(__dirname, "..", ".env.local");
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // sin .env.local; se espera DATABASE_URL en el entorno
  }
}

if (!process.env.DATABASE_URL) {
  console.error("❌ Falta DATABASE_URL. Ponla en .env.local o en el entorno.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function run(file) {
  const text = readFileSync(join(__dirname, file), "utf8");
  // El driver HTTP de Neon ejecuta una sentencia por llamada: quitamos
  // comentarios de línea y dividimos por ';'. (Los datos no contienen ';'.)
  const statements = text
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log(`✓ ${file} aplicado (${statements.length} sentencias)`);
}

try {
  await run("schema.sql");
  await run("seed.sql");
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM knowledge_base`;
  console.log(`✅ Listo. ${count} datos en knowledge_base.`);
} catch (err) {
  console.error("❌ Error aplicando la base de datos:", err.message);
  process.exit(1);
}
