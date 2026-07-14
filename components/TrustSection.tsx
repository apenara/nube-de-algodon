const items = [
  {
    title: "Envíos a todo el país",
    body: "Llega en 2 a 4 días hábiles. Costo fijo de $5, y gratis en compras mayores a $60.",
  },
  {
    title: "Garantía de 6 meses",
    body: "En cochecitos, cunas y sillas para auto por defectos de fábrica. Con respaldo real.",
  },
  {
    title: "Seguridad certificada",
    body: "Cochecitos ASTM F833, cunas ASTM F1169 y sillas para auto FMVSS 213.",
  },
  {
    title: "Cambios sin apuro",
    body: "Hasta 30 días desde tu compra, con el producto sin uso y su empaque original.",
  },
  {
    title: "Asesoría cercana",
    body: "Soporte por chat para dudas de armado o uso. Estamos para acompañarte.",
  },
  {
    title: "Pagas como prefieras",
    body: "Tarjeta de crédito o débito, y pago contra entrega en ciudades seleccionadas.",
  },
];

export function TrustSection() {
  return (
    <section id="confianza" className="scroll-mt-20 bg-cream py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-blush-deep">
            Comprar tranquila
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ink">
            Pensado para dar paz, no dudas
          </h2>
          <p className="mt-4 text-lg text-warmgray">
            Sabemos que ser mamá o papá primerizo viene con mil preguntas. Por
            eso cada compra viene con reglas claras y sin letra chica.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div key={item.title} className="relative pl-14">
              <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-cloud font-display text-base font-semibold text-powder-deep shadow-cloud-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 leading-relaxed text-warmgray">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
