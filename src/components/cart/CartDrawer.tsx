"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Truck } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { buttonVariants } from "@/components/ui/Button";
import { getProduct, UNITS_PER_DOZEN } from "@/content/products";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { cn, formatCurrency, formatDozens } from "@/lib/utils";
import { useCart } from "./CartProvider";

export function CartDrawer({ locale, t }: { locale: Locale; t: Dictionary["cart"] }) {
  const { items, count, total, open, setOpen, update } = useCart();

  const lines = items.flatMap((item) => {
    const product = getProduct(item.slug);
    return product ? [{ ...item, product, name: product.content[locale].name }] : [];
  });

  return (
    <Sheet
      open={open}
      onClose={() => setOpen(false)}
      title={t.title}
      closeLabel={t.continue}
      footer={
        lines.length > 0 && (
          <div className="flex flex-col gap-4">
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  {t.subtotal} · {formatDozens(count, t)}
                </dt>
                <dd className="tabular-nums">{formatCurrency(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t.shipping}</dt>
                <dd className="font-semibold text-forest">{t.free}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                <dt>{t.total}</dt>
                <dd className="tabular-nums">{formatCurrency(total)}</dd>
              </div>
            </dl>
            <Link
              href={`/${locale}/checkout`}
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
            >
              {t.checkout}
            </Link>
            <p className="text-center text-xs text-muted-foreground">{t.checkoutNote}</p>
          </div>
        )
      }
    >
      {lines.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
          <p className="display text-xl text-muted-foreground">{t.empty}</p>
          <Link
            href={`/${locale}/store`}
            onClick={() => setOpen(false)}
            className={buttonVariants({ variant: "outline" })}
          >
            {t.continue}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <p className="flex items-center justify-center gap-2 rounded-md bg-secondary px-4 py-3 text-center text-xs font-semibold text-secondary-foreground">
            <Truck className="size-4 shrink-0 text-accent" strokeWidth={1.5} />
            {t.dozenNotice}
          </p>
          <ul className="flex flex-col divide-y divide-border">
            {lines.map((line) => (
              <li key={line.slug} className="flex gap-4 py-4 first:pt-0">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-secondary">
                  <Image
                    src={line.product.image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-2">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="font-serif text-lg leading-tight">{line.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatCurrency(line.product.dozenPrice)} × {formatDozens(line.quantity, t)}{" "}
                        · {t.units.replace("{units}", String(line.quantity * UNITS_PER_DOZEN))}
                      </p>
                    </div>
                    <p className="text-sm tabular-nums">
                      {formatCurrency(line.product.dozenPrice * line.quantity)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        type="button"
                        onClick={() => update(line.slug, line.quantity - 1)}
                        aria-label={t.decrease}
                        className="flex size-8 items-center justify-center rounded-full hover:bg-secondary"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => update(line.slug, line.quantity + 1)}
                        aria-label={t.increase}
                        className="flex size-8 items-center justify-center rounded-full hover:bg-secondary"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => update(line.slug, 0)}
                      className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                      {t.remove}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Sheet>
  );
}
