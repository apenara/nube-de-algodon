"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CloudMark } from "../CloudMark";
import { Icon } from "../icons";
import type { ChatProduct, ChatTurn } from "@/lib/assistant/types";

// Saludo inicial de Nube (se muestra sin llamar a la API).
const WELCOME: UiMessage = {
  id: "welcome",
  role: "assistant",
  reply:
    "¡Hola! Soy Nube, tu asesora de Nube de Algodón ☁️ Estoy aquí para ayudarte con calma y sin apuros. ¿En qué momento estás?",
  quickReplies: [
    "🤰 Estoy esperando",
    "👶 Ya nació",
    "🎁 Busco un regalo",
    "📦 Tengo un pedido",
  ],
};

const MAX_LEN = 500;

type UiMessage = {
  id: string;
  role: "user" | "assistant";
  // usuario
  content?: string;
  // asistente
  reply?: string;
  quickReplies?: string[];
  products?: ChatProduct[];
  error?: boolean;
};

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `m${idCounter}`;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // sessionId estable para el hilo (no se renderiza, no hay mismatch de hidratación).
  const sessionRef = useRef<string>("");
  if (!sessionRef.current) {
    sessionRef.current =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `s-${idCounter}-${messages.length}`;
  }

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Abrir el chat desde cualquier botón con [data-open-chat] en la página.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-open-chat]")) {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Autoscroll al último mensaje / indicador de escribiendo.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, open]);

  // Enfocar el input al abrir (solo en desktop: en móvil abriría el
  // teclado de golpe y taparía la conversación).
  useEffect(() => {
    if (open && window.innerWidth >= 640) inputRef.current?.focus();
  }, [open]);

  // En móvil, iOS Safari NO encoge un panel `fixed` cuando aparece el
  // teclado, así que el input queda escondido detrás. Seguimos el
  // visualViewport para que el panel llene exactamente el área visible y
  // el input siempre quede a la vista. En desktop dejamos que manden las
  // clases de Tailwind (limpiamos los estilos inline).
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const vv = window.visualViewport;

    function sync() {
      if (!panel) return;
      const isMobile = window.innerWidth < 640;
      if (!isMobile || !vv) {
        panel.style.cssText = "";
        return;
      }
      const m = 12; // margen alrededor del panel
      panel.style.position = "fixed";
      panel.style.left = `${m}px`;
      panel.style.right = `${m}px`;
      panel.style.width = "auto";
      panel.style.top = `${vv.offsetTop + m}px`;
      panel.style.bottom = "auto";
      panel.style.height = `${vv.height - m * 2}px`;
    }

    sync();
    vv?.addEventListener("resize", sync);
    vv?.addEventListener("scroll", sync);
    window.addEventListener("resize", sync);
    return () => {
      vv?.removeEventListener("resize", sync);
      vv?.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      if (panel) panel.style.cssText = "";
    };
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || loading) return;

      const userMsg: UiMessage = { id: nextId(), role: "user", content };
      const withUser = [...messages, userMsg];
      setMessages(withUser);
      setInput("");
      setLoading(true);

      const turns: ChatTurn[] = withUser
        .filter((m) => m.role === "user" || (m.role === "assistant" && !m.error))
        .map((m) => ({
          role: m.role,
          content: (m.role === "user" ? m.content : m.reply) ?? "",
        }))
        .filter((t) => t.content);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionRef.current,
            messages: turns,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setMessages((m) => [
            ...m,
            {
              id: nextId(),
              role: "assistant",
              reply:
                data?.message ??
                "Ups, algo no salió bien. Intenta de nuevo en un momento 🤍",
              error: true,
            },
          ]);
        } else {
          setMessages((m) => [
            ...m,
            {
              id: nextId(),
              role: "assistant",
              reply: data.reply,
              quickReplies: data.quickReplies ?? [],
              products: data.products ?? [],
            },
          ]);
        }
      } catch {
        setMessages((m) => [
          ...m,
          {
            id: nextId(),
            role: "assistant",
            reply:
              "No pude conectar. Revisa tu conexión e intenta de nuevo 🤍",
            error: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages],
  );

  // Chips solo del último mensaje del asistente (evita chips viejos).
  const last = messages[messages.length - 1];
  const activeChips =
    !loading && last?.role === "assistant" && !last.error
      ? last.quickReplies ?? []
      : [];

  return (
    <>
      {/* Launcher flotante */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir el chat con Nube"
          className="group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-pill bg-powder-deep py-3 pl-3 pr-5 text-cloud shadow-cloud transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-cloud/95">
            <CloudMark className="h-6 w-8" />
            {/* indicador de presencia, asentado sobre el avatar */}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-sage ring-2 ring-powder-deep" />
          </span>
          <span className="text-sm font-semibold">Pregúntale a Nube</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Chat con Nube, asesora de Nube de Algodón"
          className="fixed inset-x-3 bottom-3 top-3 z-40 flex flex-col overflow-hidden rounded-[26px] border border-sand bg-cloud shadow-cloud sm:inset-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[min(620px,80vh)] sm:w-[390px]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-sand/70 bg-cream/70 px-4 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cloud shadow-cloud-sm">
              <CloudMark className="h-7 w-9" />
            </span>
            <div className="flex-1">
              <p className="font-display text-sm font-semibold leading-tight text-ink">
                Nube · tu asesora
              </p>
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <span className="h-2 w-2 rounded-full bg-sage" />
                En línea · responde en segundos
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar el chat"
              className="flex h-9 w-9 items-center justify-center rounded-full text-warmgray transition-colors hover:bg-sand/50"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Mensajes */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
          >
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[82%] rounded-3xl rounded-tr-md bg-blush-soft px-4 py-2.5 text-sm leading-relaxed text-ink">
                    {m.content}
                  </p>
                </div>
              ) : (
                <div key={m.id} className="flex flex-col gap-2.5">
                  <div className="flex items-end gap-2">
                    <span className="mb-0.5 flex h-7 w-9 shrink-0 items-center justify-center">
                      <CloudMark className="h-6 w-8" />
                    </span>
                    <p
                      className={`max-w-[82%] rounded-3xl rounded-tl-md px-4 py-2.5 text-sm leading-relaxed ${
                        m.error
                          ? "bg-blush-soft/70 text-ink"
                          : "bg-powder-soft text-ink"
                      }`}
                    >
                      {m.reply}
                    </p>
                  </div>

                  {/* Tarjetas de producto */}
                  {m.products && m.products.length > 0 && (
                    <div className="ml-11 flex flex-col gap-2">
                      {m.products.map((p) => (
                        <ChatProductCard key={p.slug} product={p} />
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}

            {/* Indicador de escribiendo */}
            {loading && (
              <div className="flex items-end gap-2">
                <span className="mb-0.5 flex h-7 w-9 shrink-0 items-center justify-center">
                  <CloudMark className="h-6 w-8" />
                </span>
                <span className="flex items-center gap-1 rounded-3xl rounded-tl-md bg-powder-soft px-4 py-3">
                  <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
                </span>
              </div>
            )}
          </div>

          {/* Chips de sugerencias */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {activeChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => send(chip)}
                  className="rounded-pill border border-powder/70 bg-cloud px-3.5 py-1.5 text-xs font-semibold text-powder-deep transition-colors hover:bg-powder-soft"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-sand/70 px-3 py-3"
          >
            <div className="flex items-center gap-2 rounded-pill border border-sand bg-cream/50 py-1.5 pl-4 pr-1.5 focus-within:border-powder">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_LEN))}
                maxLength={MAX_LEN}
                placeholder="Escribe tu pregunta…"
                aria-label="Escribe tu pregunta"
                className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Enviar"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-powder-deep text-cloud transition-transform enabled:hover:scale-105 disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
            <p className="mt-1.5 text-center text-[11px] text-muted">
              Nube responde con la info de la tienda. Para dudas de salud,
              consulta a tu pediatra.
            </p>
          </form>
        </div>
      )}
    </>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-powder-deep/60"
      style={{ animationDelay: delay }}
    />
  );
}

function ChatProductCard({ product }: { product: ChatProduct }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <a
      href="#tienda"
      className="group flex items-center gap-3 rounded-2xl border border-sand/80 bg-cloud p-2 pr-3 transition-colors hover:bg-cream/60"
    >
      <span
        className={`relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl ${
          imgOk && product.src ? "bg-cream" : product.tint
        }`}
      >
        {imgOk && product.src ? (
          <Image
            src={product.src}
            alt={product.name}
            fill
            sizes="64px"
            className="object-cover"
            onError={() => setImgOk(false)}
          />
        ) : (
          <Icon name={product.icon} className="h-8 w-8 text-powder-deep/70" />
        )}
      </span>
      <span className="flex-1">
        <span className="block font-display text-sm font-semibold leading-snug text-ink">
          {product.name}
        </span>
        <span className="mt-0.5 flex items-baseline gap-1.5">
          <span className="font-display text-sm font-semibold text-ink">
            ${product.price}
          </span>
          {product.compareAt && (
            <span className="text-xs text-muted line-through">
              ${product.compareAt}
            </span>
          )}
        </span>
      </span>
      <span className="text-powder-deep transition-transform group-hover:translate-x-0.5">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </span>
    </a>
  );
}
