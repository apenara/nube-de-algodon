type Benefit = {
  title: string;
  note: string;
  icon: React.ReactNode;
};

const benefits: Benefit[] = [
  {
    title: "Envío a domicilio",
    note: "Gratis desde $60",
    icon: (
      <>
        <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
        <circle cx="7" cy="17" r="1.6" />
        <circle cx="17" cy="17" r="1.6" />
      </>
    ),
  },
  {
    title: "Pago seguro",
    note: "Tarjeta o contra entrega",
    icon: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
      </>
    ),
  },
  {
    title: "Garantía real",
    note: "6 meses de fábrica",
    icon: (
      <>
        <path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    title: "Cambios sin apuro",
    note: "Hasta 30 días",
    icon: (
      <>
        <path d="M4 9a8 8 0 0 1 14-3l2 2M20 15a8 8 0 0 1-14 3l-2-2" />
        <path d="M20 4v4h-4M4 20v-4h4" />
      </>
    ),
  },
];

export function BenefitsStrip() {
  return (
    <section className="border-y border-sand/70 bg-cloud/60">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-6 py-8 lg:grid-cols-4">
        {benefits.map((b) => (
          <div key={b.title} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-powder-soft text-powder-deep">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                {b.icon}
              </svg>
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-ink">
                {b.title}
              </p>
              <p className="text-xs text-muted">{b.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
