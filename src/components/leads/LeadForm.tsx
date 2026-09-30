"use client";

import { useActionState } from "react";
import { CircleCheck } from "lucide-react";
import { submitLeadAction, type LeadActionState } from "@/server/actions/lead-actions";
import { TextField } from "@/components/ui/TextField";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/FormError";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { cn } from "@/lib/utils";

type Props = {
  source: "contacto" | "profesional";
  locale: Locale;
  t: Dictionary["leadForm"];
  withMessage?: boolean;
  className?: string;
};

const initialState: LeadActionState = {};

export function LeadForm({ source, locale, t, withMessage = true, className }: Props) {
  const [state, formAction] = useActionState(submitLeadAction.bind(null, source), initialState);
  const id = (field: string) => `${source}-${field}`;

  if (state.ok) {
    return (
      <div
        role="status"
        className={cn("flex flex-col items-center gap-4 py-10 text-center", className)}
      >
        <CircleCheck className="size-10 text-accent" strokeWidth={1.25} />
        <p className="display text-2xl">{t.success}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className={cn("flex flex-col gap-5", className)}>
      <input type="hidden" name="locale" value={locale} />
      <div aria-hidden="true" className="hidden">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id={id("name")} label={t.name} name="name" autoComplete="name" required />
        <TextField
          id={id("email")}
          label={t.email}
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      {source === "profesional" && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={id("businessType")}>{t.businessType}</Label>
          <Select id={id("businessType")} name="businessType" required defaultValue="">
            <option value="" disabled>
              {t.businessPlaceholder}
            </option>
            {Object.entries(t.businessTypes).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      )}
      {withMessage && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={id("message")}>{t.message}</Label>
          <Textarea id={id("message")} name="message" maxLength={2000} rows={4} />
        </div>
      )}
      <FormError message={state.error && t.errors[state.error]} />
      <SubmitButton size="lg">{t.submit}</SubmitButton>
    </form>
  );
}
