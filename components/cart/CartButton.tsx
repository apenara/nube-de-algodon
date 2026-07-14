"use client";

import { useCart } from "@/lib/cart/CartContext";

export function CartButton() {
  const { count, open } = useCart();

  return (
    <button
      type="button"
      onClick={open}
      aria-label={count > 0 ? `Carrito, ${count} artículos` : "Carrito"}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-sand bg-cloud text-ink transition-colors hover:bg-cream"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 7h14l-1.2 10a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blush-deep text-[10px] font-bold text-cloud">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
