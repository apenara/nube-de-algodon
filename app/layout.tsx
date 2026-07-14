import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { DemoToast } from "@/components/DemoToast";
import { CartProvider } from "@/lib/cart/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

// Titulares: serif con carácter y ejes "soft" para un aire cálido y redondeado.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
});

// Cuerpo: geométrica humanista, amable y legible.
const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const TITLE = "Nube de Algodón — Todo para tu bebé, con calma";
const DESCRIPTION =
  "Tienda online de artículos para bebés con asesoría cercana. Ropa, cochecitos, cunas, sillas para auto y más. Pregúntale a Nube, tu asistente, y resuelve tus dudas en segundos.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Nube de Algodón",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "Nube de Algodón",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
          <CartDrawer />
          <ChatWidget />
          <DemoToast />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
