import Image from "next/image";
import type { SavedCartItem } from "@/lib/db";
import { EmailFrame } from "./EmailFrame";

export const CLUB_COUPON = "NUBE10";
const FROM = "Nube de Algodón <nube@nubedealgodon.com>";

// Correo de bienvenida al Club, con el código de descuento.
export function ClubWelcomeEmail({ toMasked }: { toMasked: string }) {
  return (
    <EmailFrame from={FROM} to={toMasked} subject="¡Bienvenidos al club! Aquí está tu 10% 🤍">
      <h1 className="font-display text-2xl font-semibold text-ink">
        ¡Hola! Qué gusto tenerte 🤍
      </h1>
      <p className="mt-4 text-warmgray">
        Ya eres parte del club de Nube de Algodón. Como regalo de bienvenida, aquí
        tienes tu <span className="font-semibold text-blush-deep">10% de descuento</span>{" "}
        para tu primera compra.
      </p>

      <div className="mt-6 rounded-2xl border border-dashed border-powder-deep bg-powder-soft/40 px-6 py-5 text-center">
        <p className="text-xs uppercase tracking-wider text-warmgray">Tu código</p>
        <p className="mt-1 font-display text-3xl font-semibold tracking-wide text-powder-deep">
          {CLUB_COUPON}
        </p>
      </div>

      <p className="mt-6 text-warmgray">
        También te enviaremos consejos para primerizos y avisos de novedades —con calma,
        sin spam. Si tienes cualquier duda, Nube (nuestra asistente) te ayuda en segundos.
      </p>

      <div className="mt-7">
        <span className="inline-flex h-11 items-center rounded-pill bg-powder-deep px-7 text-sm font-semibold text-cloud">
          Empezar a explorar
        </span>
      </div>
    </EmailFrame>
  );
}

// Correo de confirmación cuando alguien guarda su carrito y pide asesoría.
export function CartConfirmationEmail({
  toMasked,
  items,
  total,
  note,
}: {
  toMasked: string;
  items: SavedCartItem[];
  total: number;
  note?: string | null;
}) {
  return (
    <EmailFrame
      from={FROM}
      to={toMasked}
      subject="Recibimos tu selección — Nube te escribirá pronto 🤍"
    >
      <h1 className="font-display text-2xl font-semibold text-ink">
        Recibimos tu selección 🤍
      </h1>
      <p className="mt-4 text-warmgray">
        ¡Gracias por confiar en nosotros! Guardamos los productos que te interesan y muy
        pronto Nube te escribirá para asesorarte —sin compromiso.
      </p>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item.slug} className="flex items-center gap-3">
            <Image
              src={`/products/${item.slug}.webp`}
              alt={item.name}
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-xl bg-cream object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">{item.name}</p>
              <p className="text-xs text-muted">Cantidad: {item.qty}</p>
            </div>
            <span className="text-sm font-semibold text-ink">
              ${item.price * item.qty}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-sand pt-4">
        <span className="text-sm text-warmgray">Total estimado</span>
        <span className="font-display text-lg font-semibold text-ink">${total}</span>
      </div>

      {note && (
        <div className="mt-5 rounded-2xl bg-cream px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-muted">Nos contaste</p>
          <p className="mt-1 text-sm text-ink">“{note}”</p>
        </div>
      )}

      <p className="mt-6 text-warmgray">
        No procesamos pagos aún: esto es una solicitud de asesoría. Si quieres adelantar
        algo, respóndenos este correo y con gusto te ayudamos.
      </p>

      <div className="mt-7">
        <span className="inline-flex h-11 items-center rounded-pill bg-powder-deep px-7 text-sm font-semibold text-cloud">
          Ver la tienda
        </span>
      </div>
    </EmailFrame>
  );
}
