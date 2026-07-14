import { CloudMark } from "./CloudMark";

const nav = [
  { label: "Tienda", href: "#tienda" },
  { label: "Categorías", href: "#categorias" },
  { label: "Por qué nosotras", href: "#confianza" },
  { label: "Asistente", href: "#asistente" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-sand/70 bg-cloud/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <a href="#" className="flex shrink-0 items-center gap-2.5">
          <CloudMark className="h-8 w-10" />
          <span className="font-display text-lg font-semibold text-ink">
            nube de algodón
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-warmgray transition-colors hover:text-powder-deep"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* buscador */}
          <div className="hidden items-center gap-2 rounded-pill border border-sand bg-cream/60 px-4 py-2 md:flex">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4-4" />
            </svg>
            <input
              type="search"
              placeholder="Buscar productos…"
              aria-label="Buscar productos"
              className="w-36 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
          </div>

          {/* carrito */}
          <button
            type="button"
            aria-label="Carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-sand bg-cloud text-ink transition-colors hover:bg-cream"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 7h14l-1.2 10a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blush-deep text-[10px] font-bold text-cloud">
              2
            </span>
          </button>

          <a
            href="#asistente"
            data-open-chat
            className="hidden h-10 items-center rounded-pill bg-powder-deep px-5 text-sm font-semibold text-cloud shadow-cloud-sm transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Preguntar
          </a>
        </div>
      </div>
    </header>
  );
}
