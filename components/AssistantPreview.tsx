import { CloudMark } from "./CloudMark";

export function AssistantPreview() {
  return (
    <section id="asistente" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2">
        {/* Copy */}
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-blush-deep">
            Tu asistente de confianza
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Pregunta sin miedo a molestar
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-warmgray">
            Nuestro asistente conoce a fondo la tienda: precios, envíos,
            garantías, seguridad y más. Responde con calma y en segundos, a
            cualquier hora.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              "Sabe lo que hay en Nube de Algodón y te lo cuenta claro.",
              "Si no tiene el dato, lo admite; nunca se lo inventa.",
              "Para dudas de salud, siempre te sugiere ver a tu pediatra.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage/30 text-sage">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l4 4L19 6" />
                  </svg>
                </span>
                <span className="text-warmgray">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Maqueta del chat */}
        <div className="relative">
          <div className="overflow-hidden rounded-[32px] border border-sand bg-cloud shadow-cloud">
            {/* barra superior */}
            <div className="flex items-center gap-3 border-b border-sand/70 bg-cream/60 px-5 py-4">
              <CloudMark className="h-8 w-10" />
              <div>
                <p className="font-display text-sm font-semibold text-ink">
                  Asistente · Nube de Algodón
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <span className="h-2 w-2 rounded-full bg-sage" />
                  En línea
                </p>
              </div>
            </div>

            {/* mensajes */}
            <div className="space-y-4 px-5 py-6">
              <Bubble from="bot">
                ¡Hola! Soy el asistente de Nube de Algodón 🤍 ¿En qué te ayudo
                hoy?
              </Bubble>
              <Bubble from="user">
                ¿Cuánto cuesta el envío y en cuánto llega?
              </Bubble>
              <Bubble from="bot">
                El envío tiene un costo fijo de $5 y es gratis en compras
                mayores a $60. Llega en 2 a 4 días hábiles a todo el país. ¿Te
                ayudo con algo más?
              </Bubble>
            </div>

            {/* input: abre el chat en vivo con Nube */}
            <div className="border-t border-sand/70 px-4 py-4">
              <button
                type="button"
                data-open-chat
                aria-label="Abrir el chat con Nube"
                className="flex w-full items-center gap-2 rounded-pill border border-sand bg-cream/50 px-4 py-2.5 text-left transition-colors hover:bg-cream"
              >
                <span className="flex-1 text-sm text-muted">
                  Escribe tu pregunta…
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-powder-deep text-cloud">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
              <p className="mt-2 text-center text-xs text-muted">
                Toca para hablar con Nube · responde en segundos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bubble({
  from,
  children,
}: {
  from: "bot" | "user";
  children: React.ReactNode;
}) {
  const isBot = from === "bot";
  return (
    <div className={isBot ? "flex justify-start" : "flex justify-end"}>
      <p
        className={
          isBot
            ? "max-w-[80%] rounded-3xl rounded-tl-md bg-powder-soft px-4 py-3 text-sm leading-relaxed text-ink"
            : "max-w-[80%] rounded-3xl rounded-tr-md bg-blush-soft px-4 py-3 text-sm leading-relaxed text-ink"
        }
      >
        {children}
      </p>
    </div>
  );
}
