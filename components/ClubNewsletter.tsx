"use client";

import { useState } from "react";
import { CloudMark } from "./CloudMark";

type Status = "idle" | "loading" | "success" | "error";

export function ClubNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/club", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter" }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
      };

      if (res.ok) {
        setStatus("success");
        setMessage(data.message ?? "¡Listo! Ya eres parte del club 🤍");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(
          data.message ?? "No pudimos registrarte. Intenta de nuevo en un momento 🤍",
        );
      }
    } catch {
      setStatus("error");
      setMessage("Sin conexión. Revisa tu internet e intenta de nuevo 🤍");
    }
  }

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[36px] border border-sand bg-cream px-7 py-10 text-center sm:px-14 sm:py-14">
          <div aria-hidden className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-blush-soft/70 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute -right-6 bottom-0 h-44 w-44 rounded-full bg-powder-soft/70 blur-2xl" />

          <div className="relative mx-auto max-w-xl">
            <div className="flex justify-center">
              <CloudMark className="h-12 w-16" />
            </div>
            <h2 className="mt-5 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Únete al club de Nube de Algodón
            </h2>
            <p className="mt-4 text-warmgray">
              Recibe <span className="font-semibold text-blush-deep">10% en tu primera compra</span>,
              consejos para primerizos y avisos de novedades. Sin spam, lo prometemos.
            </p>

            {status === "success" ? (
              <div
                role="status"
                aria-live="polite"
                className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-3xl border border-powder bg-cloud px-6 py-5 text-sm font-medium text-ink"
              >
                <CloudMark className="h-6 w-8 shrink-0" />
                <span>{message}</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  placeholder="tu@correo.com"
                  aria-label="Correo electrónico"
                  className="h-12 flex-1 rounded-pill border border-sand bg-cloud px-5 text-sm text-ink outline-none placeholder:text-muted focus:border-powder-deep disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-12 shrink-0 rounded-pill bg-powder-deep px-7 text-sm font-semibold text-cloud transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {status === "loading" ? "Registrando…" : "Quiero mi 10%"}
                </button>
              </form>
            )}

            {status === "error" && (
              <p role="alert" className="mt-3 text-sm font-medium text-blush-deep">
                {message}
              </p>
            )}

            <p className="mt-3 text-xs text-muted">
              Atención al cliente: lunes a sábado, 9:00 a 19:00
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
