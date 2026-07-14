"use client";

import { useEffect, useRef, useState } from "react";
import { CloudMark } from "./CloudMark";

const DEFAULT_MSG =
  "Esta es una versión simple para el reto de Platzi 🤍 Todavía no procesamos compras reales.";

// Muestra un aviso amable cuando se presiona cualquier control decorativo
// marcado con [data-demo] (o al enviar un <form data-demo>). Si el atributo
// trae texto, se usa como mensaje personalizado.
export function DemoToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    function show(el: Element) {
      const custom = el.getAttribute("data-demo");
      setMsg(custom && custom.trim().length > 1 ? custom : DEFAULT_MSG);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMsg(null), 4000);
    }

    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest?.("[data-demo]");
      if (!el) return;
      e.preventDefault();
      show(el);
    }

    function onSubmit(e: SubmitEvent) {
      const form = e.target as HTMLElement | null;
      if (!form?.closest?.("[data-demo]")) return;
      e.preventDefault();
      show(form);
    }

    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("submit", onSubmit);
      clearTimeout(timer.current);
    };
  }, []);

  if (!msg) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-24 z-50 mx-auto flex max-w-sm items-start gap-3 rounded-3xl border border-sand bg-cloud px-4 py-3 shadow-cloud sm:inset-x-auto sm:left-1/2 sm:bottom-8 sm:-translate-x-1/2"
    >
      <span className="mt-0.5 flex h-8 w-10 shrink-0 items-center justify-center">
        <CloudMark className="h-6 w-8" />
      </span>
      <p className="text-sm leading-snug text-ink">{msg}</p>
      <button
        type="button"
        onClick={() => setMsg(null)}
        aria-label="Cerrar aviso"
        className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-sand/50"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
