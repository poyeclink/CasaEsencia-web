"use client";

import { useTransition } from "react";
import { updateLeadStatusAction } from "@/server/actions/admin-actions";
import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  nuevo: "border-gold bg-gold/20 text-accent",
  contactado: "border-primary/20 bg-primary/5 text-primary",
  convertido: "border-forest/30 bg-forest/10 text-forest",
  descartado: "border-border bg-muted text-muted-foreground",
};

export function LeadStatusSelect({
  id,
  status,
  options,
}: {
  id: string;
  status: string;
  options: Record<string, string>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      aria-label="Estado del lead"
      defaultValue={status}
      disabled={pending}
      onChange={(event) => {
        const formData = new FormData();
        formData.set("id", id);
        formData.set("status", event.target.value);
        startTransition(() => updateLeadStatusAction(formData));
      }}
      className={cn(
        "h-8 cursor-pointer rounded-full border px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-60",
        tones[status],
      )}
    >
      {Object.entries(options).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
