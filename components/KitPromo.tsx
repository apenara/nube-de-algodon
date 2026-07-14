import Link from "next/link";
import { CloudMark } from "./CloudMark";

// Gancho en la home hacia la herramienta de valor (/kit). Da la promesa
// concreta —qué necesita tu bebé, a tu medida— antes de pedir nada.
export function KitPromo() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[36px] border border-sand bg-cream px-7 py-10 sm:px-14 sm:py-14">
          <div aria-hidden className="pointer-events-none absolute -right-8 -top-10 h-48 w-48 rounded-full bg-powder-soft/70 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-10 -left-8 h-44 w-44 rounded-full bg-blush-soft/70 blur-2xl" />

          <div className="relative grid items-center gap-8 sm:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-pill bg-cloud px-4 py-1.5 text-sm font-medium text-powder-deep">
                🧸 Herramienta gratis
              </span>
              <h2 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
                ¿No sabes por dónde empezar?
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-warmgray">
                Responde 5 preguntas y arma en un minuto el{" "}
                <span className="font-semibold text-ink">kit perfecto para tu bebé</span>:
                qué necesitas de verdad, con tallas, cantidades y el porqué de cada cosa.
                Gratis y a tu medida.
              </p>
              <Link
                href="/kit"
                className="mt-8 inline-flex items-center gap-2 rounded-pill bg-powder-deep px-7 py-3.5 text-base font-semibold text-cloud transition-transform hover:-translate-y-0.5"
              >
                Armar mi kit
                <span aria-hidden>→</span>
              </Link>
            </div>

            {/* mini-muestra del resultado */}
            <div className="rounded-3xl border border-sand bg-cloud p-5 shadow-cloud-sm">
              <div className="flex items-center gap-2">
                <CloudMark className="h-7 w-10" />
                <p className="text-sm font-semibold text-ink">Tu kit para recién nacido</p>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  { name: "Body de algodón ×2", tag: "Talla 0–3m" },
                  { name: "Pañales suaves ×2", tag: "Talla 1–2" },
                  { name: "Silla para auto", tag: "Esencial" },
                ].map((row) => (
                  <li key={row.name} className="flex items-center justify-between gap-3">
                    <span className="text-warmgray">{row.name}</span>
                    <span className="rounded-pill bg-powder-soft/60 px-2.5 py-0.5 text-xs font-medium text-powder-deep">
                      {row.tag}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-sand pt-3 text-xs text-muted">
                + consejos como “no compres el coche sin verificar que…”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
