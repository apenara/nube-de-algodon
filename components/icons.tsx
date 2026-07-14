import type { ReactNode } from "react";

// Íconos de línea (paths dentro de un <svg viewBox="0 0 24 24">).
// Se comparten entre categorías y tarjetas de producto.
export const icons: Record<string, ReactNode> = {
  ropa: <path d="M8 4l4 3 4-3 4 3-2 3-2-1v9H8v-9l-2 1-2-3z" />,
  cochecito: (
    <>
      <path d="M4 5h6a6 6 0 0 1 6 6H4z" />
      <circle cx="8" cy="18" r="2" />
      <circle cx="16" cy="18" r="2" />
    </>
  ),
  cuna: <path d="M3 8v10M21 8v10M3 12h18M6 12v6M10 12v6M14 12v6M18 12v6" />,
  silla: <path d="M6 4h6l2 7h4v4h-4l-2 4H8a4 4 0 0 1-4-4V6z" />,
  panales: <path d="M4 6h16v4a10 10 0 0 1-10 8A6 6 0 0 1 4 12z" />,
  juguete: (
    <>
      <circle cx="8" cy="9" r="4" />
      <rect x="13" y="11" width="7" height="7" rx="1.5" />
    </>
  ),
  lactancia: <path d="M9 3h6l-1 4 2 3v9a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-9l2-3z" />,
  manta: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 9h16M9 4v16" />
    </>
  ),
  movil: (
    <>
      <path d="M4 4h16M12 4v3" />
      <circle cx="7" cy="12" r="2" />
      <circle cx="12" cy="14" r="2" />
      <circle cx="17" cy="12" r="2" />
      <path d="M7 7v3M17 7v3M12 7v5" />
    </>
  ),
};

export function Icon({
  name,
  className = "h-7 w-7",
}: {
  name: keyof typeof icons | string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name] ?? icons.ropa}
    </svg>
  );
}
