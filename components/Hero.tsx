export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* halo cálido detrás, muy sutil, sin gradiente "AI" */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] h-[520px] w-[520px] rounded-full bg-powder-soft/60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 left-[-8%] h-[360px] w-[360px] rounded-full bg-blush-soft/60 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 pt-10 pb-16 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:pt-24 md:pb-28">
        {/* Copy */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-pill bg-cream px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blush-deep">
            Tienda online · asesoría cercana
          </span>

          <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.05] text-ink sm:text-5xl md:text-6xl">
            Suavecito, seguro,
            <br />
            hecho con{" "}
            <span className="relative whitespace-nowrap text-powder-deep">
              cariño
              <svg
                aria-hidden
                viewBox="0 0 200 12"
                className="absolute -bottom-2 left-0 w-full text-blush"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9C40 3 160 3 198 8"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
            .
          </h1>

          <p className="mt-7 text-lg leading-relaxed text-warmgray">
            Todo lo que tu bebé necesita en sus primeros años, con productos
            seguros y de calidad. Y si tienes dudas, nuestro asistente te
            acompaña con la misma calma que buscarías en una amiga.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <a
              href="#asistente"
              className="inline-flex items-center justify-center gap-2 rounded-pill bg-powder-deep px-7 py-3.5 text-base font-semibold text-cloud shadow-cloud transition-transform hover:-translate-y-0.5"
            >
              Pregúntame lo que necesites
              <span aria-hidden>→</span>
            </a>
            <a
              href="#categorias"
              className="inline-flex items-center justify-center rounded-pill border border-sand bg-cloud px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-cream"
            >
              Ver categorías
            </a>
          </div>

          <p className="mt-7 text-sm text-muted">
            Envío gratis en compras mayores a $60 · Cambios hasta 30 días
          </p>
        </div>

        {/* Ilustración: nube con volumen */}
        <div className="relative flex justify-center md:justify-end">
          <HeroCloud />
        </div>
      </div>
    </section>
  );
}

function HeroCloud() {
  return (
    <div className="relative w-full max-w-md">
      {/* sombra en el suelo */}
      <div
        aria-hidden
        className="absolute bottom-2 left-1/2 h-8 w-3/5 -translate-x-1/2 rounded-full bg-powder-deep/20 blur-2xl"
      />
      <svg
        viewBox="0 0 400 300"
        className="w-full drop-shadow-[0_30px_50px_rgba(78,112,145,0.28)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="heroCloud" cx="40%" cy="28%" r="85%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f3f8fc" />
            <stop offset="100%" stopColor="#cfe0ec" />
          </radialGradient>
        </defs>

        {/* estrellitas flotando */}
        <g fill="#E7C98F">
          <path d="M338 60l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" />
          <path d="M60 44l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" opacity="0.9" />
        </g>
        <circle cx="352" cy="120" r="4" fill="#E8C4C0" />
        <circle cx="44" cy="120" r="5" fill="#AEC6D9" />

        {/* nube */}
        <path
          d="M120 250C78 250 44 219 44 181c0-33 26-61 61-67C114 76 149 48 191 48c42 0 78 27 88 63 4-.8 8-1.2 12-1.2 35 0 63 26 63 58s-28 58-63 58H120Z"
          fill="url(#heroCloud)"
          stroke="#AEC6D9"
          strokeWidth="2.5"
        />
        {/* highlight */}
        <ellipse cx="150" cy="110" rx="42" ry="24" fill="#ffffff" opacity="0.7" />

        {/* carita tierna */}
        <g fill="#5C5A57">
          <circle cx="168" cy="168" r="6" />
          <circle cx="232" cy="168" r="6" />
        </g>
        {/* mejillas */}
        <ellipse cx="150" cy="190" rx="12" ry="7" fill="#E8C4C0" opacity="0.7" />
        <ellipse cx="250" cy="190" rx="12" ry="7" fill="#E8C4C0" opacity="0.7" />
        {/* sonrisa */}
        <path
          d="M182 190c8 10 28 10 36 0"
          stroke="#5C5A57"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
