"use client";

import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getProduct, UNITS_PER_DOZEN } from "@/content/products";
import { cn, formatCurrency } from "@/lib/utils";
import { useCart } from "./CartProvider";

type Props = {
  slug: string;
  label: string;
  addedLabel: string;
  // summary: plantilla con {units} y {total} que se muestra bajo el selector.
  withQuantity?: { label: string; increase: string; decrease: string; summary: string };
  className?: string;
  variant?: "primary" | "outline";
};

export function AddToCartButton({
  slug,
  label,
  addedLabel,
  withQuantity,
  className,
  variant,
}: Props) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const dozenPrice = getProduct(slug)?.dozenPrice ?? 0;

  function handleAdd() {
    add(slug, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-3">
        {withQuantity && (
          <div
            role="group"
            aria-label={withQuantity.label}
            className="flex h-13 items-center rounded-full border border-primary/20"
          >
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label={withQuantity.decrease}
              className="flex size-11 items-center justify-center rounded-full hover:bg-secondary"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label={withQuantity.increase}
              className="flex size-11 items-center justify-center rounded-full hover:bg-secondary"
            >
              <Plus className="size-4" />
            </button>
          </div>
        )}
        <Button
          type="button"
          size={withQuantity ? "lg" : "md"}
          variant={variant}
          onClick={handleAdd}
          className="flex-1"
        >
          {added ? <Check className="size-4" /> : null}
          {added ? addedLabel : label}
        </Button>
      </div>
      {withQuantity && (
        <p className="text-sm text-muted-foreground tabular-nums">
          {withQuantity.label}: {quantity} ·{" "}
          {withQuantity.summary
            .replace("{units}", String(quantity * UNITS_PER_DOZEN))
            .replace("{total}", formatCurrency(dozenPrice * quantity))}
        </p>
      )}
    </div>
  );
}
