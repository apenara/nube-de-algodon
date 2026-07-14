"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { products } from "@/data/products";

// El carrito solo guarda slug + cantidad; nombre y precio salen del catálogo.
export type CartLine = { slug: string; qty: number };

const STORAGE_KEY = "nube-cart";
const MAX_QTY = 99;

const bySlug = new Map(products.map((p) => [p.slug, p]));

type CartContextValue = {
  lines: CartLine[];
  count: number; // total de unidades
  total: number; // en la misma moneda que el catálogo
  isOpen: boolean;
  add: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Carga desde localStorage una vez montado (evita mismatch de hidratación).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) {
          const restored = parsed
            .filter((l) => l && bySlug.has(l.slug)) // descarta slugs que ya no existen
            .map((l) => ({ slug: l.slug, qty: Math.min(Math.max(1, l.qty | 0), MAX_QTY) }));
          // setState intencional post-montaje: el estado inicial debe ser [] en
          // el primer render (SSR) para no romper la hidratación; se rellena aquí.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          if (restored.length) setLines(restored);
        }
      }
    } catch {
      // localStorage no disponible o JSON corrupto: empezamos vacío
    }
    setHydrated(true);
  }, []);

  // Persiste cada cambio (solo después de hidratar, para no pisar con []).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // sin persistencia si localStorage falla
    }
  }, [lines, hydrated]);

  const add = useCallback((slug: string) => {
    if (!bySlug.has(slug)) return;
    setLines((prev) => {
      const found = prev.find((l) => l.slug === slug);
      if (found) {
        return prev.map((l) =>
          l.slug === slug ? { ...l, qty: Math.min(l.qty + 1, MAX_QTY) } : l,
        );
      }
      return [...prev, { slug, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((l) => l.slug !== slug);
      return prev.map((l) =>
        l.slug === slug ? { ...l, qty: Math.min(qty, MAX_QTY) } : l,
      );
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);
  const total = useMemo(
    () =>
      lines.reduce((sum, l) => sum + (bySlug.get(l.slug)?.price ?? 0) * l.qty, 0),
    [lines],
  );

  const value = useMemo(
    () => ({ lines, count, total, isOpen, add, setQty, remove, clear, open, close }),
    [lines, count, total, isOpen, add, setQty, remove, clear, open, close],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
