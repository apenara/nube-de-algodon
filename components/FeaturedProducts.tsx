import Image from "next/image";
import { products, type Product } from "@/data/products";
import { getProductImageMap } from "@/lib/productImages";
import { Icon } from "./icons";

export function FeaturedProducts() {
  const images = getProductImageMap();

  return (
    <section id="tienda" className="scroll-mt-20 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-blush-deep">
              Los favoritos
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-ink">
              Más vendidos esta semana
            </h2>
          </div>
          <a
            href="#categorias"
            className="text-sm font-semibold text-powder-deep hover:underline"
          >
            Ver todo →
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              src={images.get(product.slug)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  src,
}: {
  product: Product;
  src?: string;
}) {
  return (
    <article className="group flex flex-row overflow-hidden rounded-3xl border border-sand/80 bg-cloud transition-all hover:-translate-y-1 hover:shadow-cloud-sm sm:flex-col">
      {/* imagen / placeholder */}
      <div
        className={`relative aspect-square w-36 shrink-0 overflow-hidden sm:w-full ${src ? "bg-cream" : product.tint}`}
      >
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-pill bg-cloud/90 px-3 py-1 text-xs font-semibold text-ink shadow-cloud-sm backdrop-blur">
            {product.badge}
          </span>
        )}

        {src ? (
          <Image
            src={src}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 160px, (max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon
              name={product.icon}
              className="h-16 w-16 text-powder-deep/70 transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )}
      </div>

      {/* info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs uppercase tracking-wide text-muted">
          {product.category}
        </p>
        <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink">
          {product.name}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-semibold text-ink">
              ${product.price}
            </span>
            {product.compareAt && (
              <span className="text-sm text-muted line-through">
                ${product.compareAt}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label={`Agregar ${product.name}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-powder-deep text-cloud transition-transform hover:scale-110"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
