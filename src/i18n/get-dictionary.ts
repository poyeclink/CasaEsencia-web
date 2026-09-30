import "server-only";
import type { Locale } from "@/i18n/config";

// Import dinámico: cada locale queda en su propio chunk de servidor y nunca
// viaja al bundle del cliente.
const dictionaries = {
  es: () => import("./dictionaries/es").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();
