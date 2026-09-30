import { Nunito_Sans, Playfair_Display } from "next/font/google";

// Mismas familias que el sitio original: Playfair Display para titulares y
// Nunito Sans para texto.
export const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
});
