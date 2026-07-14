import { Icon } from "./icons";

type Category = {
  name: string;
  note: string;
  icon: string;
  tint: string;
};

const categories: Category[] = [
  { name: "Ropa", note: "0 a 24 meses · desde $8", icon: "ropa", tint: "bg-blush-soft" },
  { name: "Cochecitos", note: "desde $120 · norma ASTM", icon: "cochecito", tint: "bg-powder-soft" },
  { name: "Cunas", note: "desde $150 · seguras", icon: "cuna", tint: "bg-cream" },
  { name: "Sillas para auto", note: "desde $90 · FMVSS 213", icon: "silla", tint: "bg-powder-soft" },
  { name: "Pañales", note: "por paquete · desde $12", icon: "panales", tint: "bg-blush-soft" },
  { name: "Juguetes didácticos", note: "para cada etapa", icon: "juguete", tint: "bg-cream" },
  { name: "Lactancia", note: "todo para alimentar", icon: "lactancia", tint: "bg-powder-soft" },
];

export function Categories() {
  return (
    <section id="categorias" className="scroll-mt-20 bg-cloud py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-blush-deep">
            Comprar por categoría
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ink">
            Encuentra justo lo que buscas
          </h2>
          <p className="mt-4 text-lg text-warmgray">
            Todo organizado por etapa y necesidad, del recién nacido al pequeño
            explorador.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href="#tienda"
              className="group flex items-center gap-4 rounded-3xl border border-sand/80 bg-cloud p-5 transition-all hover:-translate-y-1 hover:shadow-cloud-sm"
            >
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${cat.tint} text-powder-deep`}
              >
                <Icon name={cat.icon} className="h-7 w-7" />
              </span>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-ink">
                  {cat.name}
                </h3>
                <p className="text-sm text-muted">{cat.note}</p>
              </div>
              <span className="text-powder-deep opacity-0 transition-opacity group-hover:opacity-100">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
