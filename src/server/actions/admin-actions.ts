"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/session";
import { ORDER_STATUSES, updateOrder } from "@/server/services/order-service";
import { LEAD_STATUSES, updateLeadStatus } from "@/server/services/lead-service";

export type AdminActionState = { ok?: boolean; error?: string };

const orderSchema = z.object({
  id: z.uuid(),
  status: z.enum(ORDER_STATUSES),
  adminNote: z.string().trim().max(2000).optional(),
});

export async function updateOrderAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = orderSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Datos inválidos." };

  const { id, ...data } = parsed.data;
  await updateOrder(id, data);
  revalidatePath("/admin", "layout");
  return { ok: true };
}

const leadSchema = z.object({ id: z.uuid(), status: z.enum(LEAD_STATUSES) });

export async function updateLeadStatusAction(formData: FormData) {
  await requireAdmin();
  const parsed = leadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  await updateLeadStatus(parsed.data.id, parsed.data.status);
  revalidatePath("/admin", "layout");
}
