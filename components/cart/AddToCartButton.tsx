"use client";

import { useCart } from "@/lib/cart/CartContext";

export function AddToCartButton({ slug, name }: { slug: string; name: string }) {
  const { add, open } = useCart();

  return (
    <button
      type="button"
      onClick={() => {
        add(slug);
        open(); // muestra el carrito para dar feedback inmediato
      }}
      aria-label={`Agregar ${name} al carrito`}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-powder-deep text-cloud transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}
