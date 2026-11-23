"use client";

import { useState, type FormEvent } from "react";
import { CircleCheck, Minus, Plus } from "lucide-react";
import { TextField } from "@/components/ui/TextField";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import { MIN_ORDER_UNITS, products } from "@/content/products";
import { whatsappLink } from "@/content/site";
import { trackLead } from "@/lib/analytics";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { cn } from "@/lib/utils";

type Props = {
  source: "contacto" | "profesional";
  locale: Locale;
  t: Dictionary["leadForm"];
  withMessage?: boolean;
  withCity?: boolean;
  className?: string;
};

// Sin backend: el formulario arma la solicitud y abre el WhatsApp de la clienta.
// Los productos y cantidades son el mismo carrito que usan las tarjetas.
export function LeadForm({
  source,
  locale,
  t,
  withMessage = true,
  withCity = false,
  className,
}: Props) {
  const { items, add, update } = useCart();
  const [sent, setSent] = useState(false);
  const [needsProducts, setNeedsProducts] = useState(false);
  const id = (field: string) => `${source}-${field}`;
  const unitsLabel = (units: number) => t.unitsLabel.replace("{units}", String(units));
  const quantityOf = (slug: string) => items.find((item) => item.slug === slug)?.quantity ?? 0;
  const lines = items.flatMap((item) => {
    const product = products.find((p) => p.slug === item.slug);
    return product ? [`${product.content[locale].name}: ${unitsLabel(item.quantity)}`] : [];
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lines.length === 0) {
      setNeedsProducts(true);
      return;
    }
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    const businessType = get("businessType");
    const message = [
      t.waIntro,
      `${t.name}: ${get("name")}`,
      `${t.businessName}: ${get("businessName")}`,
      `${t.whatsapp}: ${get("whatsapp")}`,
      `${t.email}: ${get("email") || t.emailPending}`,
      `${t.businessType}: ${t.businessTypes[businessType as keyof typeof t.businessTypes] ?? businessType}`,
      `${t.products}:`,
      ...lines.map((line) => `• ${line}`),
    ];
    if (withCity && get("city")) message.push(`${t.city}: ${get("city")}`);
    if (withMessage && get("message")) message.push(`${t.message}: ${get("message")}`);

    trackLead(source);

    window.open(whatsappLink(message.join("\n")), "_blank", "noopener,noreferrer");
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
        <p className="text-xs text-muted-foreground">
          {t.productsNote.replace("{min}", String(MIN_ORDER_UNITS))}
        </p>
        <ul className="flex flex-col divide-y divide-border">
          {products.map((product) => {
            const quantity = quantityOf(product.slug);
            return (
              <li key={product.slug} className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm">{product.content[locale].name}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={quantity === 0}
                    onClick={() => update(product.slug, quantity - MIN_ORDER_UNITS)}
                    aria-label={t.decrease}
                    className="flex size-8 items-center justify-center rounded-full border border-border hover:bg-secondary disabled:opacity-40"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-20 text-center text-xs tabular-nums" aria-live="polite">
                    {quantity ? unitsLabel(quantity) : "0"}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      quantity === 0
                        ? add(product.slug, MIN_ORDER_UNITS)
                        : update(product.slug, quantity + MIN_ORDER_UNITS)
                    }
                    aria-label={t.increase}
                    className="flex size-8 items-center justify-center rounded-full border border-border hover:bg-secondary"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        {needsProducts && lines.length === 0 && (
          <p role="alert" className="text-sm text-destructive">
            {t.needProducts}
          </p>
        )}
      </fieldset>
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
