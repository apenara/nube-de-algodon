import { CloudMark } from "./CloudMark";

export function SiteFooter() {
  return (
    <footer className="border-t border-sand bg-cream">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* marca */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <CloudMark className="h-8 w-10" />
              <span className="font-display text-lg font-semibold text-ink">
                nube de algodón
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-warmgray">
              Artículos para bebés de 0 a 3 años, con asesoría cercana para
              padres primerizos.
            </p>
          </div>

          {/* atención */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">
              Atención al cliente
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-warmgray">
              <li>Lunes a sábado</li>
              <li>9:00 a 19:00</li>
              <li>Chat y WhatsApp</li>
            </ul>
          </div>

          {/* tienda */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">
              La tienda
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-warmgray">
              <li>100% online</li>
              <li>Envíos a domicilio</li>
              <li>Sin tienda física</li>
            </ul>
          </div>

          {/* enlaces */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">
              Explora
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { label: "Productos", href: "#categorias" },
                { label: "Por qué nosotras", href: "#confianza" },
                { label: "Asistente", href: "#asistente" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-warmgray transition-colors hover:text-powder-deep"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-sand pt-8 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Nube de Algodón. Hecho con cariño.</p>
          <p>Productos seguros, de calidad, con asesoría cercana.</p>
        </div>
      </div>
    </footer>
  );
}
