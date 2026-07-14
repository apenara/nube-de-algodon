"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { useCart } from "@/lib/cart/CartContext";
import { CloudMark } from "@/components/CloudMark";
import { Icon } from "@/components/icons";
import { QUESTIONS } from "@/lib/kit/questions";
import { recommend } from "@/lib/kit/recommend";
import type {
  Budget,
  CategoryKey,
  KitAnswers,
  KitItem,
  KitResult as KitResultType,
  Mobility,
  Priority,
  Stage,
} from "@/lib/kit/types";

// Catálogo indexado para sacar tint/icon del thumbnail.
const bySlug = new Map(products.map((p) => [p.slug, p]));

type Draft = {
  stage?: Stage;
  mobility?: Mobility;
  budget?: Budget;
  priority?: Priority;
  has: CategoryKey[];
};

type SaveStatus = "idle" | "loading" | "success" | "error";

const money = (n: number) => `$${n.toLocaleString("es-CO")}`;

const ROLE_LABEL: Record<KitItem["role"], string> = {
  esencial: "Esencial",
  recomendado: "Recomendado",
  opcional: "Opcional",
};

export function KitTool() {
  // "quiz" responde · "capture" pide el registro (gate) · "result" muestra el kit.
  const [phase, setPhase] = useState<"quiz" | "capture" | "result">("quiz");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({ has: [] });

  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const isLast = step === total - 1;

  function pickSingle(id: "stage" | "mobility" | "budget" | "priority", value: string) {
    setDraft((d) => ({ ...d, [id]: value }) as Draft);
    // Auto-avanza en preguntas de una sola opción para que fluya.
    if (isLast) setPhase("capture");
    else setStep((s) => Math.min(s + 1, total - 1));
  }

  function toggleHas(value: CategoryKey) {
    setDraft((d) => ({
      ...d,
      has: d.has.includes(value)
        ? d.has.filter((v) => v !== value)
        : [...d.has, value],
    }));
  }

  function backToQuiz() {
    setPhase("quiz");
    setStep(total - 1);
  }

  function stepBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function restart() {
    setDraft({ has: [] });
    setStep(0);
    setPhase("quiz");
  }

  const answers = useMemo<KitAnswers | null>(() => {
    if (!draft.stage || !draft.mobility || !draft.budget || !draft.priority) return null;
    return {
      stage: draft.stage,
      mobility: draft.mobility,
      budget: draft.budget,
      priority: draft.priority,
      has: draft.has,
    };
  }, [draft]);

  const kit = useMemo(() => (answers ? recommend(answers) : null), [answers]);

  if (phase === "capture" && answers && kit) {
    return (
      <KitCapture
        answers={answers}
        kit={kit}
        onBack={backToQuiz}
        onSaved={() => setPhase("result")}
      />
    );
  }

  if (phase === "result" && answers && kit) {
    return <KitResult kit={kit} onRestart={restart} />;
  }

  // ---- Quiz ----
  const selectedValue = draft[q.id as keyof Draft];

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* progreso */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>
            Paso {step + 1} de {total}
          </span>
          {step > 0 && (
            <button
              type="button"
              onClick={stepBack}
              className="font-medium text-powder-deep hover:underline"
            >
              ← Atrás
            </button>
          )}
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-pill bg-sand">
          <div
            className="h-full rounded-pill bg-powder-deep transition-all duration-300"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-[32px] border border-sand bg-cloud p-6 shadow-cloud-sm sm:p-9">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{q.title}</h2>
        {q.help && <p className="mt-2 text-sm text-warmgray">{q.help}</p>}

        {q.kind === "single" ? (
          <div className="mt-6 grid gap-3">
            {q.options.map((opt) => {
              const active = selectedValue === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => pickSingle(q.id, opt.value)}
                  className={`flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all hover:-translate-y-0.5 ${
                    active
                      ? "border-powder-deep bg-powder-soft/50"
                      : "border-sand bg-cream/50 hover:border-powder"
                  }`}
                >
                  <span className="text-2xl" aria-hidden>
                    {opt.emoji}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-semibold text-ink">{opt.label}</span>
                    {opt.hint && <span className="text-sm text-muted">{opt.hint}</span>}
                  </span>
                  <span
                    aria-hidden
                    className={`ml-auto text-powder-deep transition-opacity ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    ✓
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {q.options.map((opt) => {
                const active = draft.has.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleHas(opt.value)}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                      active
                        ? "border-powder-deep bg-powder-soft/50"
                        : "border-sand bg-cream/50 hover:border-powder"
                    }`}
                  >
                    <span className="text-xl" aria-hidden>
                      {opt.emoji}
                    </span>
                    <span className="font-medium text-ink">{opt.label}</span>
                    <span
                      aria-hidden
                      className={`ml-auto text-powder-deep ${active ? "opacity-100" : "opacity-0"}`}
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => (isLast ? setPhase("capture") : setStep((s) => s + 1))}
              className="mt-7 h-12 w-full rounded-pill bg-powder-deep px-7 text-sm font-semibold text-cloud transition-transform hover:-translate-y-0.5"
            >
              {draft.has.length ? "Continuar" : "No tengo nada aún · continuar"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ //
//  Captura (gate): el kit ya está listo pero se pide el registro      //
//  ANTES de mostrar el detalle. Marketing 101: el deseo está al tope. //
// ------------------------------------------------------------------ //

function KitCapture({
  answers,
  kit,
  onBack,
  onSaved,
}: {
  answers: KitAnswers;
  kit: KitResultType;
  onBack: () => void;
  onSaved: () => void;
}) {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, whatsapp, answers }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (res.ok) {
        // Registrado: desbloqueamos el resultado.
        onSaved();
      } else {
        setStatus("error");
        setMessage(data.message ?? "No pudimos desbloquear tu kit. Intenta de nuevo 🤍");
      }
    } catch {
      setStatus("error");
      setMessage("Sin conexión. Revisa tu internet e intenta de nuevo 🤍");
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-4">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-powder-deep hover:underline"
        >
          ← Ajustar respuestas
        </button>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-sand bg-cloud shadow-cloud-sm">
        {/* teaser: el kit está listo */}
        <div className="border-b border-sand bg-cream px-6 py-8 text-center sm:px-10">
          <div className="flex justify-center">
            <CloudMark className="h-11 w-16" />
          </div>
          <p className="mt-4 text-sm font-medium uppercase tracking-wide text-powder-deep">
            Tu kit está listo
          </p>
          <h2 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">
            {kit.included.length} productos a la medida de {kit.stageLabel}
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-warmgray">
            <span>
              Total estimado <span className="font-semibold text-ink">{money(kit.total)}</span>
            </span>
            <span>Con tallas exactas · cantidades · consejos</span>
          </div>
        </div>

        {/* vista previa difuminada + formulario que lo desbloquea */}
        <div className="relative px-6 py-8 sm:px-10">
          {/* nombres reales del kit, difuminados: se ve que hay algo valioso */}
          <ul
            aria-hidden
            className="pointer-events-none space-y-3 select-none blur-[6px]"
          >
            {kit.included.slice(0, 4).map((item) => (
              <li
                key={item.slug}
                className="flex items-center gap-3 rounded-2xl border border-sand bg-cream/50 px-4 py-3"
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-powder-soft" />
                <span className="font-semibold text-ink">{item.name}</span>
                <span className="ml-auto text-sm text-muted">{money(item.price)}</span>
              </li>
            ))}
          </ul>

          {/* candado + form encima del blur */}
          <div className="mt-6 rounded-[28px] border border-powder bg-powder-soft/40 px-6 py-7 sm:px-8">
            <h3 className="text-center font-display text-2xl font-semibold text-ink">
              Desbloquea tu kit y llévate un 10%
            </h3>
            <p className="mx-auto mt-2 max-w-md text-center text-warmgray">
              Te lo enviamos con las tallas, cantidades y consejos, y{" "}
              <span className="font-semibold text-blush-deep">Nube</span> te acompaña si tienes
              dudas. Sin spam.
            </p>
            <form onSubmit={handleSubmit} noValidate className="mx-auto mt-6 flex max-w-md flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                placeholder="tu@correo.com"
                aria-label="Correo electrónico"
                className="h-12 rounded-pill border border-sand bg-cloud px-5 text-sm text-ink outline-none placeholder:text-muted focus:border-powder-deep disabled:opacity-60"
              />
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                disabled={status === "loading"}
                placeholder="WhatsApp (opcional)"
                aria-label="WhatsApp (opcional)"
                className="h-12 rounded-pill border border-sand bg-cloud px-5 text-sm text-ink outline-none placeholder:text-muted focus:border-powder-deep disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-12 rounded-pill bg-powder-deep px-7 text-sm font-semibold text-cloud transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {status === "loading" ? "Desbloqueando…" : "Ver mi kit y recibir 10%"}
              </button>
              {status === "error" && (
                <p role="alert" className="text-center text-sm font-medium text-blush-deep">
                  {message}
                </p>
              )}
              <p className="text-center text-xs text-muted">
                🔒 Solo lo usamos para enviarte tu kit y asesorarte.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ //
//  Resultado: se muestra SOLO tras registrarse                        //
// ------------------------------------------------------------------ //

function KitResult({ kit, onRestart }: { kit: KitResultType; onRestart: () => void }) {
  const { add, setQty, open } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  function addKitToCart() {
    for (const item of kit.included) {
      add(item.slug);
      setQty(item.slug, item.qty);
    }
    setAddedToCart(true);
    open();
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* confirmación de registro */}
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-powder bg-powder-soft/40 px-5 py-4 text-center sm:flex-row sm:text-left">
        <CloudMark className="h-8 w-11 shrink-0" />
        <p className="text-sm text-ink">
          <span className="font-semibold">¡Listo!</span> Guardamos tu kit y te lo enviamos con tu
          10% de bienvenida 🤍
        </p>
        <button
          type="button"
          onClick={onRestart}
          className="text-sm font-medium text-muted hover:text-ink hover:underline sm:ml-auto"
        >
          Empezar de nuevo
        </button>
      </div>

      {/* encabezado del kit */}
      <div className="mt-6 rounded-[32px] border border-sand bg-cream px-6 py-8 text-center sm:px-10">
        <p className="text-sm font-medium uppercase tracking-wide text-powder-deep">
          Tu kit personalizado
        </p>
        <h2 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">
          El kit perfecto para {kit.stageLabel}
        </h2>
        <p className="mt-3 text-warmgray">
          {kit.included.length} productos elegidos a tu medida ·{" "}
          <span className="font-semibold text-ink">{money(kit.total)}</span> en total
        </p>
        <button
          type="button"
          onClick={addKitToCart}
          className="mt-6 inline-flex h-12 items-center rounded-pill bg-powder-deep px-7 text-sm font-semibold text-cloud transition-transform hover:-translate-y-0.5"
        >
          {addedToCart ? "Añadido al carrito ✓" : "Agregar el kit al carrito"}
        </button>
      </div>

      {/* en tu kit */}
      <div className="mt-6 space-y-3">
        {kit.included.map((item) => (
          <KitItemCard key={item.slug} item={item} />
        ))}
      </div>

      {/* total */}
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-sand bg-cloud px-5 py-4">
        <div>
          <p className="text-sm text-warmgray">Total de tu kit</p>
          {kit.essentialTotal !== kit.total && (
            <p className="text-xs text-muted">Solo lo esencial: {money(kit.essentialTotal)}</p>
          )}
        </div>
        <p className="font-display text-2xl font-semibold text-ink">{money(kit.total)}</p>
      </div>

      {/* para más adelante */}
      {kit.later.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-xl font-semibold text-ink">Para más adelante</h3>
          <p className="mt-1 text-sm text-warmgray">
            No urge ahora según lo que nos contaste, pero te lo dejamos anotado.
          </p>
          <div className="mt-3 space-y-2">
            {kit.later.map((item) => (
              <div
                key={item.slug}
                className="flex items-center gap-3 rounded-2xl border border-sand/70 bg-cream/40 px-4 py-3"
              >
                <Thumb slug={item.slug} name={item.name} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                  <p className="truncate text-xs text-muted">{item.reason}</p>
                </div>
                <span className="ml-auto text-sm text-muted">{money(item.price)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* acciones finales */}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={addKitToCart}
          className="h-12 rounded-pill bg-powder-deep px-7 text-sm font-semibold text-cloud transition-transform hover:-translate-y-0.5"
        >
          {addedToCart ? "Añadido al carrito ✓" : "Agregar el kit al carrito"}
        </button>
        <Link href="/panel" className="text-sm font-semibold text-powder-deep hover:underline">
          Ver registros y cómo se vería tu correo →
        </Link>
      </div>
    </div>
  );
}

function KitItemCard({ item }: { item: KitItem }) {
  return (
    <div className="rounded-2xl border border-sand bg-cloud p-4 sm:p-5">
      <div className="flex gap-4">
        <Thumb slug={item.slug} name={item.name} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <div className="min-w-0">
              <p className="font-semibold text-ink">{item.name}</p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <Tag>{ROLE_LABEL[item.role]}</Tag>
                {item.qty > 1 && <Tag>×{item.qty}</Tag>}
                {item.size && <Tag>{item.size}</Tag>}
              </div>
            </div>
            <p className="shrink-0 font-semibold text-ink">{money(item.price * item.qty)}</p>
          </div>
          <p className="mt-2 text-sm text-warmgray">{item.reason}</p>
          {item.tip && (
            <p className="mt-2 rounded-xl bg-honey/20 px-3 py-2 text-sm text-ink">💡 {item.tip}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-pill bg-powder-soft/60 px-2.5 py-0.5 text-xs font-medium text-powder-deep">
      {children}
    </span>
  );
}

// Thumbnail con la foto real del producto; si no existe, cae al ícono de línea.
function Thumb({ slug, name }: { slug: string; name: string }) {
  const [err, setErr] = useState(false);
  const p = bySlug.get(slug);
  const tint = p?.tint ?? "bg-cream";
  const icon = p?.icon ?? "ropa";

  if (err) {
    return (
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${tint}`}
      >
        <Icon name={icon} className="h-8 w-8 text-powder-deep/70" />
      </div>
    );
  }
  return (
    <Image
      src={`/products/${slug}.webp`}
      alt={name}
      width={64}
      height={64}
      onError={() => setErr(true)}
      className="h-16 w-16 shrink-0 rounded-2xl bg-cream object-cover"
    />
  );
}
