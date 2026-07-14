"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { products } from "@/data/products";
import { useCart } from "@/lib/cart/CartContext";
import { Icon } from "@/components/icons";

const bySlug = new Map(products.map((p) => [p.slug, p]));

type View = "cart" | "form" | "success";
type Status = "idle" | "loading" | "error";

export function CartDrawer() {
  const { lines, total, isOpen, count, setQty, remove, clear, close } = useCart();

  const [view, setView] = useState<View>("cart");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [note, setNote] = useState("");

  // Bloquea el scroll del fondo y cierra con Escape mientras el drawer está abierto.
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function handleClose() {
    close();
    // Resetea el estado transitorio para la próxima apertura.
    setView("cart");
    setStatus("idle");
    setMessage("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          whatsapp,
          note,
          items: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };

      if (res.ok) {
        setView("success");
        setStatus("idle");
        setMessage(data.message ?? "¡Listo! Guardamos tu selección 🤍");
        clear();
        setEmail("");
        setWhatsapp("");
        setNote("");
      } else {
        setStatus("error");
        setMessage(data.message ?? "No pudimos guardar tu selección. Intenta de nuevo 🤍");
      }
    } catch {
      setStatus("error");
      setMessage("Sin conexión. Revisa tu internet e intenta de nuevo 🤍");
    }
  }

  if (!isOpen) return null;

  const items = lines
    .map((l) => {
      const p = bySlug.get(l.slug);
      return p ? { ...p, qty: l.qty } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Tu selección"
    >
      {/* fondo */}
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={handleClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/40 backdrop-blur-sm"
      />

      {/* panel */}
      <div className="relative flex h-full w-full max-w-md flex-col bg-cloud shadow-cloud">
        {/* encabezado */}
        <div className="flex items-center justify-between border-b border-sand px-5 py-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            {view === "success" ? "¡Gracias!" : "Tu selección"}
            {view === "cart" && count > 0 && (
              <span className="ml-2 text-sm font-medium text-muted">
                {count} {count === 1 ? "artículo" : "artículos"}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-sand/50"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* cuerpo */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {view === "success" ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage/20">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-sage" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mt-5 max-w-xs text-ink">{message}</p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-8 h-11 rounded-pill bg-powder-deep px-7 text-sm font-semibold text-cloud transition-transform hover:-translate-y-0.5"
              >
                Seguir explorando
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-muted">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 7h14l-1.2 10a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
                  <path d="M9 7a3 3 0 0 1 6 0" />
                </svg>
              </div>
              <p className="mt-4 font-display text-lg font-semibold text-ink">
                Tu selección está vacía
              </p>
              <p className="mt-2 max-w-xs text-sm text-warmgray">
                Agrega productos que te interesen y guárdalos para que Nube te asesore.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-6 h-11 rounded-pill border border-sand bg-cloud px-6 text-sm font-semibold text-ink transition-colors hover:bg-cream"
              >
                Ver productos
              </button>
            </div>
          ) : view === "form" ? (
            <form id="cart-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <p className="text-sm text-warmgray">
                Déjanos tus datos y Nube te asesora sobre esta selección —sin compromiso 🤍
              </p>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink">Correo *</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="h-12 rounded-2xl border border-sand bg-cloud px-4 text-sm text-ink outline-none placeholder:text-muted focus:border-powder-deep"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink">
                  WhatsApp <span className="text-muted">(opcional)</span>
                </span>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+57 300 000 0000"
                  className="h-12 rounded-2xl border border-sand bg-cloud px-4 text-sm text-ink outline-none placeholder:text-muted focus:border-powder-deep"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink">
                  ¿Algo que debamos saber? <span className="text-muted">(opcional)</span>
                </span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Ej: el bebé nace en octubre, es mi primer hijo…"
                  className="resize-none rounded-2xl border border-sand bg-cloud px-4 py-3 text-sm text-ink outline-none placeholder:text-muted focus:border-powder-deep"
                />
              </label>
              {status === "error" && (
                <p role="alert" className="text-sm font-medium text-blush-deep">
                  {message}
                </p>
              )}
            </form>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.slug} className="flex gap-3">
                  <CartThumb slug={item.slug} name={item.name} tint={item.tint} icon={item.icon} />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-snug text-ink">{item.name}</p>
                      <button
                        type="button"
                        onClick={() => remove(item.slug)}
                        aria-label={`Quitar ${item.name}`}
                        className="shrink-0 text-muted transition-colors hover:text-blush-deep"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-muted">{item.category}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-pill border border-sand">
                        <button
                          type="button"
                          onClick={() => setQty(item.slug, item.qty - 1)}
                          aria-label="Quitar uno"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14" /></svg>
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-ink">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(item.slug, item.qty + 1)}
                          aria-label="Agregar uno"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                        </button>
                      </div>
                      <span className="font-display text-base font-semibold text-ink">
                        ${item.price * item.qty}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* pie */}
        {view === "cart" && items.length > 0 && (
          <div className="border-t border-sand px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-warmgray">Total estimado</span>
              <span className="font-display text-xl font-semibold text-ink">${total}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setView("form");
              }}
              className="mt-3 h-12 w-full rounded-pill bg-powder-deep text-sm font-semibold text-cloud transition-transform hover:-translate-y-0.5"
            >
              Guardar y pedir asesoría
            </button>
            <p className="mt-2 text-center text-xs text-muted">
              Guardamos tu selección para asesorarte. No procesamos pagos en esta demo.
            </p>
          </div>
        )}

        {view === "form" && (
          <div className="border-t border-sand px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setView("cart")}
                className="font-medium text-powder-deep hover:underline"
              >
                ← Volver
              </button>
              <span className="text-warmgray">
                Total <span className="font-semibold text-ink">${total}</span>
              </span>
            </div>
            <button
              type="submit"
              form="cart-form"
              disabled={status === "loading"}
              className="h-12 w-full rounded-pill bg-powder-deep text-sm font-semibold text-cloud transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {status === "loading" ? "Guardando…" : "Guardar mi selección"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CartThumb({
  slug,
  name,
  tint,
  icon,
}: {
  slug: string;
  name: string;
  tint: string;
  icon: string;
}) {
  const [err, setErr] = useState(false);

  if (err) {
    return (
      <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${tint}`}>
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
