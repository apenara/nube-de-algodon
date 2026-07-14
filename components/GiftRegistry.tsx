export function GiftRegistry() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[36px] bg-powder-deep px-7 py-10 text-cloud sm:px-14 sm:py-14">
          {/* nubecitas decorativas */}
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-cloud/10 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-12 left-16 h-40 w-40 rounded-full bg-blush/20 blur-2xl" />

          <div className="relative max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-powder">
              Lista de bebé
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              Que la familia regale justo lo que necesitan
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cloud/85">
              Crea tu lista de regalos y compártela. Familiares y amigos podrán
              comprar de ella sin repetir ni adivinar. Simple para todos, útil
              para ti.
            </p>
            <a
              href="#asistente"
              data-open-chat
              className="mt-8 inline-flex items-center gap-2 rounded-pill bg-cloud px-7 py-3.5 text-base font-semibold text-powder-deep transition-transform hover:-translate-y-0.5"
            >
              Pregúntale al asistente cómo empezar
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
