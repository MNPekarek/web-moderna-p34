import type { Metadata } from "next";
import "@fontsource/instrument-serif/400.css";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadata: Metadata = {
  title: "PARALELO 34 — Arquitectura y desarrollo",
  description:
    "Habitar el territorio. Una experiencia conceptual de arquitectura y desarrollo por Vykora.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
