// Preguntas del quiz "Kit perfecto para tu bebé", en el orden en que se muestran.
// Sirven para renderizar la UI y para validar en el servidor (los value son la
// fuente de verdad de los enums de KitAnswers).

import type {
  Budget,
  CategoryKey,
  Mobility,
  Priority,
  Stage,
} from "@/lib/kit/types";

export type SingleQuestion<T extends string> = {
  id: "stage" | "mobility" | "budget" | "priority";
  kind: "single";
  title: string;
  help?: string;
  options: { value: T; label: string; hint?: string; emoji?: string }[];
};

export type MultiQuestion = {
  id: "has";
  kind: "multi";
  title: string;
  help?: string;
  options: { value: CategoryKey; label: string; emoji?: string }[];
};

export const STAGE_QUESTION: SingleQuestion<Stage> = {
  id: "stage",
  kind: "single",
  title: "¿En qué etapa estás?",
  help: "Así ajustamos tallas y cantidades a tu bebé.",
  options: [
    { value: "embarazo", label: "Esperando a mi bebé", hint: "Preparando la llegada", emoji: "🤰" },
    { value: "0-3m", label: "Recién nacido", hint: "0 a 3 meses", emoji: "🍼" },
    { value: "3-6m", label: "3 a 6 meses", hint: "Ya sostiene la cabecita", emoji: "🧸" },
    { value: "6-12m", label: "6 a 12 meses", hint: "Se sienta y explora", emoji: "🌱" },
    { value: "1-3a", label: "1 a 3 años", hint: "Camina y descubre", emoji: "🚀" },
  ],
};

export const MOBILITY_QUESTION: SingleQuestion<Mobility> = {
  id: "mobility",
  kind: "single",
  title: "¿Cómo se mueven en el día a día?",
  help: "Define si priorizamos la silla de auto o un coche ligero.",
  options: [
    { value: "auto", label: "Casi siempre en auto", emoji: "🚗" },
    { value: "a-pie", label: "Caminando o transporte público", emoji: "🚶" },
    { value: "mixto", label: "Un poco de todo", emoji: "🔁" },
  ],
};

export const BUDGET_QUESTION: SingleQuestion<Budget> = {
  id: "budget",
  kind: "single",
  title: "¿Cómo está el presupuesto?",
  help: "Sin juicios: te armamos el mejor kit para lo que tienes.",
  options: [
    { value: "ajustado", label: "Ajustado", hint: "Solo lo esencial", emoji: "🌾" },
    { value: "medio", label: "Equilibrado", hint: "Esencial + comodidad", emoji: "☁️" },
    { value: "holgado", label: "Holgado", hint: "El kit completo", emoji: "✨" },
  ],
};

export const HAS_QUESTION: MultiQuestion = {
  id: "has",
  kind: "multi",
  title: "¿Qué ya tienes?",
  help: "Marca lo que ya conseguiste para no repetirlo. Puedes dejarlo vacío.",
  options: [
    { value: "dormir", label: "Cuna / dónde duerme", emoji: "🛏️" },
    { value: "paseo", label: "Coche de paseo", emoji: "👶" },
    { value: "auto", label: "Silla para auto", emoji: "🚗" },
    { value: "ropa", label: "Ropa básica", emoji: "👕" },
    { value: "alimentacion", label: "Cosas de lactancia", emoji: "🍼" },
    { value: "panales", label: "Pañales", emoji: "🧷" },
    { value: "juguetes", label: "Juguetes / estímulo", emoji: "🧸" },
  ],
};

export const PRIORITY_QUESTION: SingleQuestion<Priority> = {
  id: "priority",
  kind: "single",
  title: "¿Qué es lo más importante para ti?",
  help: "Ajustamos el kit a lo que más te interesa.",
  options: [
    { value: "esencial", label: "Cubrir lo esencial", hint: "Nada de sobra", emoji: "🎯" },
    { value: "comodidad", label: "Comodidad y bienestar", hint: "Que todo sea fácil", emoji: "🤍" },
    { value: "estimulacion", label: "Estímulo y desarrollo", hint: "Que aprenda jugando", emoji: "🌟" },
  ],
};

// Orden del quiz.
export const QUESTIONS = [
  STAGE_QUESTION,
  MOBILITY_QUESTION,
  BUDGET_QUESTION,
  HAS_QUESTION,
  PRIORITY_QUESTION,
] as const;

// Conjuntos válidos (para validar en el servidor).
export const VALID_STAGES = STAGE_QUESTION.options.map((o) => o.value);
export const VALID_MOBILITY = MOBILITY_QUESTION.options.map((o) => o.value);
export const VALID_BUDGET = BUDGET_QUESTION.options.map((o) => o.value);
export const VALID_PRIORITY = PRIORITY_QUESTION.options.map((o) => o.value);
export const VALID_CATEGORIES = HAS_QUESTION.options.map((o) => o.value);
