"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

// <dialog> nativo: foco atrapado, Escape y backdrop sin librerías.
export function Sheet({ open, onClose, title, closeLabel, children, footer }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      aria-label={title}
      className={cn(
        "m-0 h-dvh max-h-dvh w-full max-w-md bg-background p-0 text-foreground backdrop:bg-primary/40 backdrop:backdrop-blur-sm",
        "ml-auto open:animate-[sheet-in_0.35s_cubic-bezier(0.22,1,0.36,1)]",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="display text-2xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="inline-flex size-10 items-center justify-center rounded-full hover:bg-secondary"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {footer && <div className="border-t border-border px-6 py-6">{footer}</div>}
      </div>
    </dialog>
  );
}
