"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export function CartButton({ label }: { label: string }) {
  const { count, setOpen } = useCart();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="relative inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-secondary"
      aria-label={`${label} (${count})`}
    >
      <ShoppingBag className="size-5" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute top-0.5 right-0.5 flex size-4.5 items-center justify-center rounded-full bg-accent text-[0.6rem] font-bold text-accent-foreground">
          {count}
        </span>
      )}
    </button>
  );
}
