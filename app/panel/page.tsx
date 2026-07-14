import Link from "next/link";
import type { Metadata } from "next";
import {
  getClubMembers,
  getSavedCarts,
  type ClubMemberRow,
  type SavedCartRow,
  type SavedCartItem,
} from "@/lib/db";
import { maskEmail, maskPhone } from "@/lib/mask";
import { CloudMark } from "@/components/CloudMark";
import { ClubWelcomeEmail, CartConfirmationEmail } from "@/components/panel/EmailPreviews";

// Lee de la base de datos en cada visita: dinámico, runtime Node, sin prerender.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// No queremos que un panel con datos de personas se indexe en buscadores.
export const metadata: Metadata = {
  title: "Panel de registros · Nube de Algodón",
  robots: { index: false, follow: false },
};

// Carrito de ejemplo para el preview cuando aún no hay carritos guardados.
const EXAMPLE_ITEMS: SavedCartItem[] = [
  { slug: "cochecito-nube", name: "Cochecito Nube 3 en 1", qty: 1, price: 189 },
  { slug: "body-algodon", name: "Body de algodón (pack x3)", qty: 2, price: 22 },
];

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default async function PanelPage() {
  let clubMembers: ClubMemberRow[] = [];
  let savedCarts: SavedCartRow[] = [];
  let dbError = false;

  try {
    [clubMembers, savedCarts] = await Promise.all([getClubMembers(), getSavedCarts()]);
  } catch {
    dbError = true;
  }

  const cartsValue = savedCarts.reduce((sum, c) => sum + Number(c.total), 0);

  // Previews con el último registro real (o un ejemplo si aún no hay ninguno).
  const clubTo = clubMembers[0] ? maskEmail(clubMembers[0].email) : "ju•••@correo.com";
  const latestCart = savedCarts[0];
  const cartTo = latestCart ? maskEmail(latestCart.email) : "ma•••@correo.com";
  const cartItems = latestCart?.items?.length ? latestCart.items : EXAMPLE_ITEMS;
  const cartTotal = latestCart
    ? Number(latestCart.total)
    : EXAMPLE_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const cartNote = latestCart
    ? latestCart.note
    : "Es mi primer bebé, nace en octubre 🤍";
  const usingExampleCart = !latestCart;
  const usingExampleClub = !clubMembers[0];

  return (
    <main className="min-h-screen bg-cream">
      {/* barra superior */}
      <header className="border-b border-sand bg-cloud/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <CloudMark className="h-8 w-11" />
            <span className="font-display text-lg font-semibold text-ink">
              Panel de registros
            </span>
          </div>
          <Link
            href="/"
            className="text-sm font-semibold text-powder-deep hover:underline"
          >
            ← Volver a la tienda
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <p className="max-w-2xl text-warmgray">
          Aquí se ven los datos que las personas dejan de verdad en la tienda —guardados en
          la base de datos— y una vista previa de los correos que recibirían. Los correos y
          teléfonos se muestran <span className="font-semibold text-ink">enmascarados</span>{" "}
          por privacidad.
        </p>

        {dbError ? (
          <div className="mt-8 rounded-3xl border border-sand bg-cloud px-6 py-8 text-center text-warmgray">
            No pudimos leer los registros en este momento. Intenta de nuevo en un rato 🤍
          </div>
        ) : (
          <>
            {/* resumen */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatCard label="Registros del Club" value={String(clubMembers.length)} />
              <StatCard label="Carritos guardados" value={String(savedCarts.length)} />
              <StatCard
                label="Valor en carritos"
                value={`$${cartsValue.toLocaleString("es-CO")}`}
              />
            </div>

            {/* registros del club */}
            <Section title="Registros del Club" count={clubMembers.length}>
              {clubMembers.length === 0 ? (
                <Empty>Aún no hay registros del Club.</Empty>
              ) : (
                <ul className="divide-y divide-sand/70">
                  {clubMembers.map((m) => (
                    <li key={m.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
                      <span className="font-medium text-ink">{maskEmail(m.email)}</span>
                      <span className="rounded-pill bg-powder-soft/60 px-3 py-0.5 text-xs font-medium text-powder-deep">
                        {m.source}
                      </span>
                      <span className="ml-auto text-sm text-muted">{fmtDate(m.created_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            {/* carritos guardados */}
            <Section title="Carritos guardados (leads con asesoría)" count={savedCarts.length}>
              {savedCarts.length === 0 ? (
                <Empty>Aún no hay carritos guardados.</Empty>
              ) : (
                <ul className="space-y-3">
                  {savedCarts.map((c) => (
                    <li key={c.id} className="rounded-2xl border border-sand/70 bg-cream/50 p-4">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-medium text-ink">{maskEmail(c.email)}</span>
                        {c.whatsapp && (
                          <span className="text-sm text-muted">WhatsApp: {maskPhone(c.whatsapp)}</span>
                        )}
                        <span className="ml-auto text-sm text-muted">{fmtDate(c.created_at)}</span>
                      </div>
                      <p className="mt-2 text-sm text-warmgray">
                        {c.items.map((i) => `${i.name} ×${i.qty}`).join(" · ")}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-sm font-semibold text-ink">
                          Total ${Number(c.total).toLocaleString("es-CO")}
                        </span>
                      </div>
                      {c.note && (
                        <p className="mt-2 rounded-xl bg-cloud px-3 py-2 text-sm text-ink">
                          “{c.note}”
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            {/* vista previa de correos */}
            <div className="mt-12">
              <h2 className="font-display text-2xl font-semibold text-ink">
                Así se verían los correos
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-warmgray">
                Maquetas con el diseño de la marca, armadas con el{" "}
                {usingExampleCart && usingExampleClub ? "un ejemplo" : "último registro real"}.
                Aún no conectamos un servicio de envío: es una muestra del diseño.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-semibold text-ink">
                    Bienvenida del Club
                    {usingExampleClub && <ExampleTag />}
                  </p>
                  <ClubWelcomeEmail toMasked={clubTo} />
                </div>
                <div>
                  <p className="mb-3 text-sm font-semibold text-ink">
                    Confirmación del carrito
                    {usingExampleCart && <ExampleTag />}
                  </p>
                  <CartConfirmationEmail
                    toMasked={cartTo}
                    items={cartItems}
                    total={cartTotal}
                    note={cartNote}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-sand bg-cloud px-5 py-5">
      <p className="text-sm text-warmgray">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="flex items-baseline gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
        <span className="text-sm font-medium text-muted">{count}</span>
      </div>
      <div className="mt-4 rounded-3xl border border-sand bg-cloud px-5 py-2">{children}</div>
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-sm text-muted">{children}</p>;
}

function ExampleTag() {
  return (
    <span className="ml-2 rounded-pill bg-honey/30 px-2.5 py-0.5 text-xs font-medium text-ink">
      ejemplo
    </span>
  );
}
