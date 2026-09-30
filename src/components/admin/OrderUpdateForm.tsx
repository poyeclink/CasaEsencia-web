"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { updateOrderAction, type AdminActionState } from "@/server/actions/admin-actions";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/Textarea";
import { FormError } from "@/components/ui/FormError";

const initialState: AdminActionState = {};

export function OrderUpdateForm({
  id,
  status,
  adminNote,
  options,
}: {
  id: string;
  status: string;
  adminNote: string | null;
  options: Record<string, string>;
}) {
  const [state, formAction] = useActionState(updateOrderAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={id} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="status">Estado del pedido</Label>
        <Select key={status} id="status" name="status" defaultValue={status} className="h-11">
          {Object.entries(options).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="adminNote">Nota interna</Label>
        <Textarea
          key={adminNote ?? ""}
          id="adminNote"
          name="adminNote"
          defaultValue={adminNote ?? ""}
          maxLength={2000}
          placeholder="Pago recibido, fecha de entrega acordada… (no la ve el cliente)"
          className="min-h-24"
        />
      </div>
      <FormError message={state.error} />
      {state.ok && (
        <p role="status" className="flex items-center gap-2 text-sm font-semibold text-forest">
          <Check className="size-4" /> Cambios guardados
        </p>
      )}
      <SubmitButton size="sm">Guardar cambios</SubmitButton>
    </form>
  );
}
