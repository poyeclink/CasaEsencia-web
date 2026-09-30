import type { Metadata } from "next";
import "../globals.css";
import { nunito, playfair } from "../fonts";

export const metadata: Metadata = {
  title: "Panel · Casa Escencia",
  robots: { index: false, follow: false },
};

// Root layout propio: el panel no pasa por /[lang] (es solo en español).
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${nunito.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">{children}</body>
    </html>
  );
}
