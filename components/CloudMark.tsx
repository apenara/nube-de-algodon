// Marca "nube" dibujada a mano: puffs redondeados con un highlight suave.
// Tamaño controlado por className (width/height) o props.
export function CloudMark({
  className = "h-7 w-9",
  title = "Nube de Algodón",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 34"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="cloudFill" cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#eff5fa" />
          <stop offset="100%" stopColor="#cfe0ec" />
        </radialGradient>
      </defs>
      <path
        d="M13.5 30C7.7 30 3 25.6 3 20.2c0-4.7 3.6-8.7 8.5-9.6C12.9 5.6 17.3 2 22.6 2c5.3 0 9.8 3.5 11 8.4.5-.1 1-.2 1.6-.2 4.9 0 8.8 3.7 8.8 8.3S40.1 27 35.2 27H13.5Z"
        fill="url(#cloudFill)"
        stroke="#AEC6D9"
        strokeWidth="1.6"
      />
      {/* highlight suave arriba-izquierda */}
      <ellipse cx="18" cy="12.5" rx="5" ry="3.2" fill="#ffffff" opacity="0.75" />
    </svg>
  );
}
