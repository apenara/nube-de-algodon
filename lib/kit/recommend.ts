// Motor de recomendación por reglas puras del "Kit perfecto para tu bebé".
// Sin IA, sin base de datos, determinista: las mismas respuestas dan el mismo kit.
// Isomórfico: el cliente lo usa para mostrar el kit al instante y el servidor lo
// vuelve a ejecutar al guardar el lead (nunca confía en el kit que manda el cliente).

import { products, type Product } from "@/data/products";
import type {
  CategoryKey,
  KitAnswers,
  KitItem,
  KitResult,
  Role,
  Stage,
} from "@/lib/kit/types";

const bySlug = new Map(products.map((p) => [p.slug, p] as const));

const STAGE_LABEL: Record<Stage, string> = {
  embarazo: "la llegada de tu bebé",
  "0-3m": "tu recién nacido (0–3 meses)",
  "3-6m": "tu bebé de 3 a 6 meses",
  "6-12m": "tu bebé de 6 a 12 meses",
  "1-3a": "tu peque de 1 a 3 años",
};

// Orden de etapas para comparaciones "desde/hasta".
const STAGE_ORDER: Stage[] = ["embarazo", "0-3m", "3-6m", "6-12m", "1-3a"];
const stageIdx = (s: Stage) => STAGE_ORDER.indexOf(s);

// Una regla por producto del catálogo. Decide si entra, en qué rol, cuántas
// unidades, qué talla y por qué. size/reason/tip pueden depender de las respuestas.
type Rule = {
  slug: string;
  category: CategoryKey; // para el "¿qué ya tienes?"
  // Rol base; puede ajustarse según movilidad/prioridad más abajo.
  role: (a: KitAnswers) => Role | null; // null => no aplica a esta persona
  qty: (a: KitAnswers) => number;
  size?: (a: KitAnswers) => string | null;
  reason: (a: KitAnswers) => string;
  tip?: string;
};

// Talla de pañal / ropa aproximada por etapa (referencia general).
// Cada valor es autodescriptivo: la UI lo muestra tal cual, sin anteponer "Talla".
const DIAPER_SIZE: Record<Stage, string> = {
  embarazo: "Talla 1 (recién nacido)",
  "0-3m": "Talla 1–2",
  "3-6m": "Talla 2–3",
  "6-12m": "Talla 3–4",
  "1-3a": "Talla 4–5",
};

const CLOTHES_SIZE: Record<Stage, string> = {
  embarazo: "Talla 0–3 meses",
  "0-3m": "Talla 0–3 meses",
  "3-6m": "Talla 3–6 meses",
  "6-12m": "Talla 6–12 meses",
  "1-3a": "Talla 12–24 meses",
};

const RULES: Rule[] = [
  {
    slug: "cuna-sueno",
    category: "dormir",
    role: (a) => (stageIdx(a.stage) <= stageIdx("6-12m") ? "esencial" : "recomendado"),
    qty: () => 1,
    reason: () =>
      "Un lugar seguro para dormir es lo primero; esta es convertible y crece de cuna a cama.",
    tip: "Colchón firme y sin almohadas ni peluches dentro: es la mejor forma de reducir el riesgo al dormir.",
  },
  {
    slug: "silla-viaje",
    category: "auto",
    // Esencial si andan en auto; si van a pie sigue siendo necesaria para cualquier viaje.
    role: (a) => (a.mobility === "a-pie" ? "recomendado" : "esencial"),
    qty: () => 1,
    size: (a) =>
      stageIdx(a.stage) <= stageIdx("0-3m") ? "Grupo 0+ (a contramarcha)" : "A contramarcha",
    reason: (a) =>
      a.mobility === "a-pie"
        ? "Aunque no uses auto a diario, la vas a necesitar para el alta del hospital y cualquier viaje."
        : "Con tu día a día en auto es imprescindible desde el primer trayecto.",
    tip: "Mantén la silla a contramarcha el mayor tiempo posible: es mucho más segura ante un impacto.",
  },
  {
    slug: "cochecito-nube",
    category: "paseo",
    role: (a) => (a.stage === "embarazo" ? "recomendado" : "esencial"),
    qty: () => 1,
    reason: (a) => {
      if (a.mobility === "auto")
        return "Sistema 3 en 1: se acopla con la silla de auto para pasar del coche al paseo sin despertarlo.";
      if (a.mobility === "a-pie")
        return "Ligero y plegable, pensado para transporte público, escaleras y espacios pequeños.";
      return "Versátil para tu día a día mixto: cómodo para caminar y compatible con la silla de auto.";
    },
    tip: "No compres el coche sin probar que pliega con una mano y que cabe en tu baúl o ascensor.",
  },
  {
    slug: "body-algodon",
    category: "ropa",
    role: () => "esencial",
    qty: (a) => (a.stage === "1-3a" ? 1 : 2), // packs de 3
    size: (a) => CLOTHES_SIZE[a.stage],
    reason: () =>
      "Son la prenda que más se ensucia y más se usa; conviene tener de sobra en la talla correcta.",
    tip: "Compra pocos de talla recién nacido: se le quedan pequeños en 2–3 semanas.",
  },
  {
    slug: "panales-pack",
    category: "panales",
    role: (a) => (a.stage === "1-3a" ? "recomendado" : "esencial"),
    qty: (a) => (stageIdx(a.stage) <= stageIdx("0-3m") ? 2 : 1),
    size: (a) => DIAPER_SIZE[a.stage],
    reason: (a) =>
      stageIdx(a.stage) <= stageIdx("0-3m")
        ? "Un recién nacido usa entre 8 y 10 al día: mejor tener reserva."
        : "El básico de cada día; te dejamos la talla aproximada para tu bebé.",
    tip: "Antes de nacer compra pocos de talla 1: hay bebés que casi se la saltan.",
  },
  {
    slug: "set-lactancia",
    category: "alimentacion",
    role: (a) => (stageIdx(a.stage) <= stageIdx("3-6m") ? "recomendado" : "opcional"),
    qty: () => 1,
    reason: () =>
      "Útil desde el primer día, tanto si amamantas como si complementas con biberón.",
    tip: "Ten al menos un biberón listo y esterilizado antes de la fecha: evita carreras de última hora.",
  },
  {
    slug: "manta-algodon",
    category: "ropa",
    role: () => "recomendado",
    qty: (a) => (stageIdx(a.stage) <= stageIdx("0-3m") ? 2 : 1),
    reason: () =>
      "Para la cuna, el coche y las salidas; ayuda a regular su temperatura con suavidad.",
    tip: "En el coche, mejor la manta por encima del arnés, nunca debajo: el arnés debe ir pegado al cuerpo.",
  },
  {
    slug: "movil-cuna",
    category: "juguetes",
    // Opcional en general; recomendado si la prioridad es estimulación y está en edad.
    role: (a) => {
      if (stageIdx(a.stage) > stageIdx("6-12m")) return null; // ya no aporta tanto
      return a.priority === "estimulacion" ? "recomendado" : "opcional";
    },
    qty: () => 1,
    reason: () =>
      "Estimula la vista y lo calma en la cuna; un primer juguete que acompaña el desarrollo.",
    tip: "Cuélgalo a unos 30 cm de su cara y retíralo cuando empiece a intentar alcanzarlo o sentarse.",
  },
];

// Dado el rol y las respuestas, ¿el item entra "en el kit" o va "para más adelante"?
// - Esencial: siempre en el kit.
// - Recomendado: si el presupuesto no es ajustado y la prioridad no es "solo esencial",
//   o si la prioridad es "comodidad".
// - Opcional: solo con presupuesto holgado, o si la prioridad es "estimulación".
function isIncluded(role: Role, a: KitAnswers): boolean {
  if (role === "esencial") return true;
  if (role === "recomendado") {
    if (a.priority === "esencial") return false;
    if (a.priority === "comodidad") return true;
    return a.budget !== "ajustado";
  }
  // opcional
  if (a.priority === "estimulacion") return true;
  return a.budget === "holgado";
}

export function recommend(answers: KitAnswers): KitResult {
  const has = new Set<CategoryKey>(answers.has ?? []);
  const included: KitItem[] = [];
  const later: KitItem[] = [];

  for (const rule of RULES) {
    const product = bySlug.get(rule.slug) as Product | undefined;
    if (!product) continue;
    if (has.has(rule.category)) continue; // ya lo tiene

    const role = rule.role(answers);
    if (!role) continue;

    const item: KitItem = {
      slug: rule.slug,
      name: product.name,
      qty: Math.max(1, rule.qty(answers)),
      price: product.price,
      size: rule.size ? rule.size(answers) : null,
      reason: rule.reason(answers),
      tip: rule.tip ?? null,
      role,
    };

    if (isIncluded(role, answers)) included.push(item);
    else later.push(item);
  }

  // Orden estable por rol: esencial → recomendado → opcional.
  const roleWeight: Record<Role, number> = { esencial: 0, recomendado: 1, opcional: 2 };
  included.sort((x, y) => roleWeight[x.role] - roleWeight[y.role]);
  later.sort((x, y) => roleWeight[x.role] - roleWeight[y.role]);

  const total = included.reduce((s, i) => s + i.price * i.qty, 0);
  const essentialTotal = included
    .filter((i) => i.role === "esencial")
    .reduce((s, i) => s + i.price * i.qty, 0);
  const unitCount = included.reduce((s, i) => s + i.qty, 0);

  return {
    stageLabel: STAGE_LABEL[answers.stage],
    included,
    later,
    total,
    essentialTotal,
    unitCount,
  };
}
