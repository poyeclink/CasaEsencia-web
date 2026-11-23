"use server";

import { z } from "zod";
import { BUSINESS_TYPES, createLead } from "@/server/services/lead-service";
import { hasLocale } from "@/i18n/config";

// Los errores viajan como claves del diccionario (leadForm.errors) para que el
// formulario los muestre en el idioma activo.
export type LeadErrorKey =
  | "name"
  | "businessName"
  | "whatsapp"
  | "email"
  | "businessType"
  | "products"
  | "quantity"
  | "message"
  | "generic";
export type LeadActionState = { ok?: boolean; error?: LeadErrorKey };

const baseSchema = z.object({
  name: z.string().trim().min(2, "name").max(120, "name"),
  email: z.email("email").max(200, "email"),
  message: z.string().trim().max(2000, "message").optional(),
  locale: z.string().refine(hasLocale, "generic"),
});

const fullSchema = baseSchema.extend({
  businessName: z.string().trim().min(2, "businessName").max(160, "businessName"),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{8,20}$/, "whatsapp"),
  city: z.string().trim().max(80).optional(),
  businessType: z.enum(BUSINESS_TYPES, "businessType"),
  products: z.array(z.string().max(80)).min(1, "products").max(10, "products"),
  quantity: z.string().trim().min(1, "quantity").max(30, "quantity"),
});

const schemas = { contacto: fullSchema, profesional: fullSchema };

export async function submitLeadAction(
  source: keyof typeof schemas,
  _prevState: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  // Honeypot: los bots suelen rellenar todos los campos.
  if (formData.get("website")) return { ok: true };

  const raw = Object.fromEntries(formData);
  const parsed = schemas[source].safeParse({
    ...raw,
    products: formData.getAll("products"),
    city: raw.city || undefined,
    message: raw.message || undefined,
  });
  if (!parsed.success) {
    return { error: (parsed.error.issues[0]?.message as LeadErrorKey) ?? "generic" };
  }

  try {
    await createLead({ source, ...parsed.data });
  } catch (error) {
    console.error("No se pudo guardar el lead", error);
    return { error: "generic" };
  }

  return { ok: true };
}
