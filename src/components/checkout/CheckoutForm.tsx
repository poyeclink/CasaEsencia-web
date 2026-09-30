"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck } from "lucide-react";
import { placeOrderAction, type CheckoutActionState } from "@/server/actions/order-actions";
import { useCart } from "@/components/cart/CartProvider";
import { getProduct, UNITS_PER_DOZEN } from "@/content/products";
import { departments } from "@/content/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { buttonVariants } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { TextField } from "@/components/ui/TextField";
import { Textarea } from "@/components/ui/Textarea";
import { formatCurrency, formatDozens } from "@/lib/utils";

type Props = {
  locale: Locale;
  t: Dictionary["checkout"];
  cart: Dictionary["cart"];
  email: string;
  defaults: {
    fullName?: string;
    phone?: string;
    businessName?: string | null;
    department?: string;
    city?: string;
    address?: string;
  };
};

const initialState: CheckoutActionState = {};

export function CheckoutForm({ locale, t, cart, email, defaults }: Props) {
  const { items, count, total, loaded, setOpen } = useCart();
  const [state, formAction] = useActionState(placeOrderAction, initialState);

  const lines = items.flatMap((item) => {
    const product = getProduct(item.slug);
    return product ? [{ ...item, product, name: product.content[locale].name }] : [];
  });

  if (!loaded) {
    return <div className="h-96 animate-pulse rounded-xl bg-secondary" aria-hidden="true" />;
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card px-6 py-20 text-center">
        <p className="display text-2xl text-muted-foreground">{t.empty}</p>
        <Link href={`/${locale}/store`} className={buttonVariants()}>
          {t.backToStore}
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-14">
      <input type="hidden" name="locale" value={locale} />
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(lines.map(({ slug, quantity }) => ({ slug, quantity })))}
      />

      <div className="flex flex-col gap-10">
        <fieldset className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 sm:p-8">
          <legend className="sr-only">{t.contactTitle}</legend>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-serif text-2xl">{t.contactTitle}</h2>
            <p className="text-xs text-muted-foreground">{t.buyingAs.replace("{email}", email)}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label={t.fullName}
              name="fullName"
              autoComplete="name"
              defaultValue={defaults.fullName}
              minLength={3}
              maxLength={120}
              required
            />
            <TextField
              label={t.phone}
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="7000 0000"
              pattern="\+?[\d\s\-]{8,20}"
              defaultValue={defaults.phone}
              required
            />
          </div>
          <TextField
            label={t.businessName}
            name="businessName"
            autoComplete="organization"
            defaultValue={defaults.businessName ?? ""}
            maxLength={120}
          />
        </fieldset>

        <fieldset className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 sm:p-8">
          <legend className="sr-only">{t.deliveryTitle}</legend>
          <h2 className="font-serif text-2xl">{t.deliveryTitle}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="department">{t.department}</Label>
              <Select
                id="department"
                name="department"
                defaultValue={defaults.department ?? ""}
                required
              >
                <option value="" disabled>
                  {t.departmentPlaceholder}
                </option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </Select>
            </div>
            <TextField
              label={t.city}
              name="city"
              autoComplete="address-level2"
              defaultValue={defaults.city}
              minLength={2}
              maxLength={120}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">{t.address}</Label>
            <Textarea
              id="address"
              name="address"
              autoComplete="street-address"
              placeholder={t.addressPlaceholder}
              defaultValue={defaults.address}
              className="min-h-20"
              minLength={10}
              maxLength={300}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">{t.notes}</Label>
            <Textarea id="notes" name="notes" placeholder={t.notesPlaceholder} maxLength={1000} />
          </div>
        </fieldset>
      </div>

      <aside className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:p-8 lg:sticky lg:top-28 lg:self-start">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl">{t.summaryTitle}</h2>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            {t.edit}
          </button>
        </div>
        <ul className="flex flex-col divide-y divide-border">
          {lines.map((line) => (
            <li key={line.slug} className="flex items-center gap-4 py-4 first:pt-0">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                <Image
                  src={line.product.image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-1">
                <p className="font-serif text-lg leading-tight">{line.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDozens(line.quantity, cart)} ·{" "}
                  {cart.units.replace("{units}", String(line.quantity * UNITS_PER_DOZEN))}
                </p>
              </div>
              <p className="text-sm tabular-nums">
                {formatCurrency(line.product.dozenPrice * line.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <dl className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              {cart.subtotal} · {formatDozens(count, cart)}
            </dt>
            <dd className="tabular-nums">{formatCurrency(total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{cart.shipping}</dt>
            <dd className="font-semibold text-forest">{cart.free}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold">
            <dt>{cart.total}</dt>
            <dd className="tabular-nums">{formatCurrency(total)}</dd>
          </div>
        </dl>
        <FormError message={state.error && t.errors[state.error]} />
        <SubmitButton size="lg">{t.submit}</SubmitButton>
        <ul className="flex flex-col gap-3 text-xs text-muted-foreground">
          <li className="flex gap-2">
            <Truck className="size-4 shrink-0 text-accent" strokeWidth={1.5} />
            {cart.checkoutNote}
          </li>
          <li className="flex gap-2">
            <ShieldCheck className="size-4 shrink-0 text-accent" strokeWidth={1.5} />
            {t.note}
          </li>
        </ul>
      </aside>
    </form>
  );
}
