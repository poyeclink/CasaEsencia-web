import es from "@/i18n/dictionaries/es";

// El panel es solo en español: reutiliza las etiquetas del diccionario es
// para que cliente y admin llamen igual a cada estado.
export const orderStatusLabels = es.orders.statuses;

export const leadStatusLabels = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  convertido: "Convertido",
  descartado: "Descartado",
};

export const leadSourceLabels = {
  contacto: "Contacto",
  profesional: "Línea profesional",
};

export const businessTypeLabels: Record<string, string> = es.leadForm.businessTypes;
