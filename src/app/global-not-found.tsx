import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { nunito, playfair } from "./fonts";

export const metadata: Metadata = {
  title: "404 · Casa Escencia",
};

// Necesario con varios root layouts ([lang] y (admin)): cubre las URLs que no
// caen en ninguno de los dos.
export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${playfair.variable} ${nunito.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col items-center justify-center gap-6 px-5 text-center font-sans">
        <p className="font-serif text-8xl text-accent italic">404</p>
        <h1 className="display text-4xl">Página no encontrada · Page not found</h1>
        <div className="flex gap-6 text-sm font-semibold tracking-[0.18em] uppercase">
          <Link href="/es" className="underline underline-offset-8">
            Inicio
          </Link>
          <Link href="/en" className="underline underline-offset-8">
            Home
          </Link>
        </div>
      </body>
    </html>
  );
}
