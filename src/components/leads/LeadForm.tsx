"use client";

import { useState, type FormEvent } from "react";
import { CircleCheck } from "lucide-react";
import { TextField } from "@/components/ui/TextField";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { whatsappLink } from "@/content/site";
import { cn } from "@/lib/utils";

type Props = {
  source: "contacto" | "profesional";
  t: Dictionary["leadForm"];
  withMessage?: boolean;
  withCity?: boolean;
  defaultProducts?: string[];
  className?: string;
};

// Sin backend: el formulario arma la solicitud y abre el WhatsApp de la clienta.
export function LeadForm({
  source,
  t,
  withMessage = true,
  withCity = false,
  defaultProducts = [],
  className,
}: Props) {
  const [sent, setSent] = useState(false);
  const id = (field: string) => `${source}-${field}`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    const businessType = get("businessType");
    const lines = [
      t.waIntro,
      `${t.name}: ${get("name")}`,
      `${t.businessName}: ${get("businessName")}`,
      `${t.whatsapp}: ${get("whatsapp")}`,
      `${t.email}: ${get("email")}`,
      `${t.businessType}: ${t.businessTypes[businessType as keyof typeof t.businessTypes] ?? businessType}`,
      `${t.products}: ${data.getAll("products").join(", ")}`,
      `${t.quantity}: ${get("quantity")}`,
    ];
    if (withCity && get("city")) lines.push(`${t.city}: ${get("city")}`);
    if (withMessage && get("message")) lines.push(`${t.message}: ${get("message")}`);

    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  if (sent) {
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
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-5", className)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id={id("name")} label={t.name} name="name" autoComplete="name" required />
        <TextField
          id={id("businessName")}
          label={t.businessName}
          name="businessName"
          autoComplete="organization"
          required
        />
        <TextField
          id={id("whatsapp")}
          label={t.whatsapp}
          name="whatsapp"
          type="tel"
          autoComplete="tel"
          pattern="\+?[0-9 \-]{8,20}"
          required
        />
        <TextField
          id={id("email")}
          label={t.email}
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
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
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-xs font-semibold tracking-wide text-foreground/80">
          {t.products}
        </legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {t.productOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="products"
                value={option}
                defaultChecked={defaultProducts.includes(option)}
                className="size-4 accent-accent"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={id("quantity")}>{t.quantity}</Label>
        <Select id={id("quantity")} name="quantity" required defaultValue="">
          <option value="" disabled>
            {t.quantityPlaceholder}
          </option>
          {t.quantityOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>
      {withCity && (
        <TextField id={id("city")} label={t.city} name="city" autoComplete="address-level2" />
      )}
      {withMessage && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={id("message")}>{t.message}</Label>
          <Textarea id={id("message")} name="message" maxLength={2000} rows={4} />
        </div>
      )}
      <Button type="submit" size="lg" className="w-full">
        {t.submit}
      </Button>
      <p className="text-center text-xs text-muted-foreground">{t.note}</p>
    </form>
  );
}
