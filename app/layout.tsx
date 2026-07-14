import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Nube de Algodón — Todo para tu bebé, con calma",
  description:
    "Tienda online de artículos para bebés con asesoría cercana. Ropa, cochecitos, cunas, sillas para auto y más. Habla con nuestro asistente y resuelve tus dudas en segundos.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
