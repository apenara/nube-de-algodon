import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { KitTool } from "@/components/kit/KitTool";

export const metadata: Metadata = {
  title: "Arma el kit perfecto para tu bebé · Nube de Algodón",
  description:
    "Responde 5 preguntas y recibe una lista personalizada de lo que tu bebé necesita, con tallas, cantidades y consejos. Gratis, sin registrarte.",
  openGraph: {
    title: "Arma el kit perfecto para tu bebé",
    description:
      "5 preguntas y te decimos exactamente qué necesita tu bebé, con tallas y cantidades a tu medida.",
    url: "/kit",
    type: "website",
  },
};

export default function KitPage() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1">
        {/* intro */}
        <section className="mx-auto w-full max-w-3xl px-6 pt-12 text-center sm:pt-16">
          <span className="inline-flex items-center gap-2 rounded-pill border border-sand bg-cream px-4 py-1.5 text-sm font-medium text-powder-deep">
            🧸 Herramienta gratis
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Arma el kit perfecto para tu bebé
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-warmgray">
            Ser primerizo abruma: mil productos y miedo a equivocarse. Responde 5 preguntas y
            te armamos <span className="font-semibold text-ink">el kit que necesitas de verdad</span>,
            con tallas, cantidades y el porqué de cada cosa. Gratis, en un minuto.
          </p>
        </section>

        {/* la herramienta */}
        <section className="px-6 py-10 sm:py-14">
          <KitTool />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
