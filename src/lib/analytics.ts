// GA4 solo se carga si NEXT_PUBLIC_GA_ID existe en build (ver GoogleAnalytics en el layout).
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// WhatsApp no deja registro en el sitio: este evento es la única medición de solicitudes.
export function trackLead(form: "contacto" | "profesional" | "carrito") {
  window.gtag?.("event", "generate_lead", { form });
}
