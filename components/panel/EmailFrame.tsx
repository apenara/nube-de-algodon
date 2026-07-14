import { CloudMark } from "@/components/CloudMark";

// Marco que simula un cliente de correo, para mostrar cómo se vería el email.
// (Es una maqueta visual; no se envía nada — no hay servicio de correo conectado.)
export function EmailFrame({
  from,
  to,
  subject,
  children,
}: {
  from: string;
  to: string;
  subject: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-sand bg-cloud shadow-cloud-sm">
      {/* barra del "cliente de correo" */}
      <div className="space-y-1 border-b border-sand bg-cream/60 px-5 py-4 text-sm">
        <div className="flex gap-2">
          <span className="w-16 shrink-0 text-muted">De:</span>
          <span className="font-medium text-ink">{from}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-16 shrink-0 text-muted">Para:</span>
          <span className="font-medium text-ink">{to}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-16 shrink-0 text-muted">Asunto:</span>
          <span className="font-semibold text-ink">{subject}</span>
        </div>
      </div>

      {/* cuerpo del correo */}
      <div className="bg-cream px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-[560px] overflow-hidden rounded-[28px] bg-cloud">
          {/* encabezado con la marca */}
          <div className="flex items-center gap-2.5 border-b border-sand/70 px-7 py-5">
            <CloudMark className="h-8 w-11" />
            <span className="font-display text-lg font-semibold text-ink">
              nube de algodón
            </span>
          </div>
          <div className="px-7 py-7">{children}</div>
          {/* pie del correo */}
          <div className="border-t border-sand/70 px-7 py-5 text-center text-xs text-muted">
            Nube de Algodón · Atención lunes a sábado, 9:00 a 19:00
            <br />
            Recibes este correo porque dejaste tus datos en nuestra tienda.
          </div>
        </div>
      </div>
    </div>
  );
}
