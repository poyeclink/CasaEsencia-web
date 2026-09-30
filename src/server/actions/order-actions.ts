"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { departments } from "@/content/site";
import { defaultLocale, hasLocale } from "@/i18n/config";
import es, { type Dictionary } from "@/i18n/dictionaries/es";
import { createOrder, MAX_DOZENS_PER_LINE, OrderError } from "@/server/services/order-service";

export type CheckoutErrorKey = keyof Dictionary["checkout"]["errors"];
export type CheckoutActionState = { error?: CheckoutErrorKey };

const optionalText = (max: number, key: CheckoutErrorKey) =>
  z
    .string()
    .trim()
    .max(max, key)
    .transform((value) => value || undefined);

const cartSchema = z
  .array(
    z.object({ slug: z.string(), quantity: z.number().int().min(1).max(MAX_DOZENS_PER_LINE) }),
    "cart",
  )
  .min(1, "cart");

const checkoutSchema = z.object({
  fullName: z.string("fullName").trim().min(3, "fullName").max(120, "fullName"),
  phone: z
    .string("phone")
    .trim()
    .regex(/^\+?[\d\s-]{8,20}$/, "phone"),
  businessName: optionalText(120, "businessName"),
  department: z.enum(departments, "department"),
  city: z.string("city").trim().min(2, "city").max(120, "city"),
  address: z.string("address").trim().min(10, "address").max(300, "address"),
  notes: optionalText(1000, "notes"),
  items: z.string("cart").transform((value, ctx) => {
    try {
      return cartSchema.parse(JSON.parse(value));
    } catch {
      ctx.addIssue({ code: "custom", message: "cart" });
      return z.NEVER;
    }
  }),
});

function errorKey(message?: string): CheckoutErrorKey {
  return message && message in es.checkout.errors ? (message as CheckoutErrorKey) : "generic";
}

export async function placeOrderAction(
  _prevState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const localeValue = String(formData.get("locale"));
  const locale = hasLocale(localeValue) ? localeValue : defaultLocale;
  const session = await getSession();
  if (session?.role !== "cliente") redirect(`/${locale}/login?next=/${locale}/checkout`);

  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: errorKey(parsed.error.issues[0]?.message) };

  const { items, ...contact } = parsed.data;
  let orderId: string;
  try {
    const order = await createOrder({ ...contact, locale, userId: session.userId, lines: items });
    orderId = order.id;
  } catch (error) {
    if (error instanceof OrderError) return { error: error.key };
    console.error("No se pudo crear el pedido", error);
    return { error: "generic" };
  }

  redirect(`/${locale}/my-account/orders/${orderId}?placed=1`);
}
