export type Product = {
  slug: string; // usado para public/products/<slug>.png
  name: string;
  category: string;
  icon: string; // clave en components/icons
  tint: string; // clase de fondo del thumbnail
  price: number;
  compareAt?: number; // precio tachado (oferta)
  badge?: string;
  imagePrompt: string; // para el generador de imágenes
};

// Productos destacados. Precios coherentes con la base de conocimiento.
export const products: Product[] = [
  {
    slug: "cochecito-nube",
    name: "Cochecito Nube 3 en 1",
    category: "Cochecitos",
    icon: "cochecito",
    tint: "bg-powder-soft",
    price: 189,
    compareAt: 220,
    badge: "Más vendido",
    imagePrompt:
      "a modern convertible baby stroller in soft powder-blue and cream, three-in-one travel system",
  },
  {
    slug: "cuna-sueno",
    name: "Cuna convertible Sueño",
    category: "Cunas",
    icon: "cuna",
    tint: "bg-cream",
    price: 199,
    badge: "Segura ASTM",
    imagePrompt:
      "a light wooden convertible baby crib with soft cream bedding, minimalist nursery furniture",
  },
  {
    slug: "silla-viaje",
    name: "Silla para auto Viaje Seguro",
    category: "Sillas para auto",
    icon: "silla",
    tint: "bg-powder-soft",
    price: 145,
    badge: "FMVSS 213",
    imagePrompt:
      "a rear-facing infant car seat in soft blush and grey fabric, safety certified baby car seat",
  },
  {
    slug: "body-algodon",
    name: "Body de algodón (pack x3)",
    category: "Ropa",
    icon: "ropa",
    tint: "bg-blush-soft",
    price: 22,
    compareAt: 26,
    badge: "Nuevo",
    imagePrompt:
      "a neatly folded set of three organic cotton baby bodysuits in cream, sage and powder-blue",
  },
  {
    slug: "movil-cuna",
    name: "Móvil didáctico de cuna",
    category: "Juguetes",
    icon: "movil",
    tint: "bg-cream",
    price: 34,
    imagePrompt:
      "a hanging baby crib mobile with soft felt clouds and stars in pastel colors",
  },
  {
    slug: "set-lactancia",
    name: "Set de lactancia esencial",
    category: "Lactancia",
    icon: "lactancia",
    tint: "bg-powder-soft",
    price: 28,
    imagePrompt:
      "a baby feeding set with bottles and accessories in soft cream and blue, breastfeeding essentials",
  },
  {
    slug: "panales-pack",
    name: "Pañales suaves (paquete)",
    category: "Pañales",
    icon: "panales",
    tint: "bg-blush-soft",
    price: 12,
    badge: "Básico",
    imagePrompt:
      "a soft package of premium baby diapers with gentle pastel packaging design",
  },
  {
    slug: "manta-algodon",
    name: "Manta de algodón orgánico",
    category: "Ropa",
    icon: "manta",
    tint: "bg-cream",
    price: 18,
    compareAt: 24,
    imagePrompt:
      "a knitted organic cotton baby blanket folded softly, in warm cream color",
  },
];
