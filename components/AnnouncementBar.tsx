const messages = [
  "Envío gratis en compras mayores a $60",
  "Cambios y devoluciones hasta 30 días",
  "Garantía de 6 meses en cochecitos, cunas y sillas",
];

export function AnnouncementBar() {
  return (
    <div className="bg-powder-deep text-cloud">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-2 px-6 py-2 text-center text-xs font-medium sm:text-sm">
        {messages.map((msg, i) => (
          <span
            key={msg}
            className={i === 0 ? "flex items-center gap-2" : "hidden items-center gap-2 sm:flex"}
          >
            {i > 0 && <span aria-hidden className="text-cloud/50">·</span>}
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
