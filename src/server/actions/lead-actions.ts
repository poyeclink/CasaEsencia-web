"use server";

import { z } from "zod";
import { BUSINESS_TYPES, createLead } from "@/server/services/lead-service";
import { hasLocale } from "@/i18n/config";

// Los errores viajan como claves del diccionario (leadForm.errors) para que el
// formulario los muestre en el idioma activo.
export type LeadErrorKey = "name" | "email" | "businessType" | "message" | "generic";
export type LeadActionState = { ok?: boolean; error?: LeadErrorKey };

const baseSchema = z.object({
  name: z.string().trim().min(2, "name").max(120, "name"),
  email: z.email("email").max(200, "email"),
  message: z.string().trim().max(2000, "message").optional(),
  locale: z.string().refine(hasLocale, "generic"),
});

const schemas = {
  contacto: baseSchema,
  profesional: baseSchema.extend({
    businessType: z.enum(BUSINESS_TYPES, "businessType"),
  }),
};

export async function submitLeadAction(
  source: keyof typeof schemas,
  _prevState: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  // Honeypot: los bots suelen rellenar todos los campos.
  if (formData.get("website")) return { ok: true };

  const raw = Object.fromEntries(formData);
  const parsed = schemas[source].safeParse({ ...raw, message: raw.message || undefined });
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
