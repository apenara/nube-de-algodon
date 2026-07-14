// Tipos del recomendador "Kit perfecto para tu bebé" (Proyecto 3).
// El motor es de reglas puras y vive en lib/kit/recommend.ts; estos tipos
// se comparten entre cliente (mostrar el kit al instante) y servidor (recalcular
// al guardar el lead, sin confiar en lo que manda el cliente).

export type Stage = "embarazo" | "0-3m" | "3-6m" | "6-12m" | "1-3a";
export type Mobility = "auto" | "a-pie" | "mixto";
export type Budget = "ajustado" | "medio" | "holgado";
export type Priority = "esencial" | "comodidad" | "estimulacion";

// Categorías para el "¿qué ya tienes?" (excluyen productos del kit).
export type CategoryKey =
  | "dormir"
  | "paseo"
  | "auto"
  | "ropa"
  | "alimentacion"
  | "panales"
  | "juguetes";

export type Role = "esencial" | "recomendado" | "opcional";

// Las respuestas del quiz.
export type KitAnswers = {
  stage: Stage;
  mobility: Mobility;
  budget: Budget;
  priority: Priority;
  has: CategoryKey[]; // lo que la persona ya tiene
};

// Un producto dentro del kit, ya personalizado.
export type KitItem = {
  slug: string;
  name: string;
  qty: number;
  price: number;
  size: string | null; // talla sugerida cuando aplica
  reason: string; // por qué se recomienda para esta persona
  tip: string | null; // consejo tipo "no compres el coche sin…"
  role: Role;
};

// El resultado que ve la persona y que guardamos como lead.
export type KitResult = {
  stageLabel: string; // etiqueta legible de la etapa
  included: KitItem[]; // "en tu kit"
  later: KitItem[]; // "para más adelante" (según presupuesto/prioridad)
  total: number; // suma de included
  essentialTotal: number; // suma solo de los esenciales dentro de included
  unitCount: number; // total de unidades en included
};
