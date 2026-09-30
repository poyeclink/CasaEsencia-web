import type { OrderStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

const styles: Record<OrderStatus, string> = {
  pendiente: "bg-gold/25 text-accent",
  confirmado: "bg-primary/10 text-primary",
  enviado: "bg-sage text-primary",
  entregado: "bg-forest/10 text-forest",
  cancelado: "bg-destructive/10 text-destructive",
};

export function OrderStatusBadge({
  status,
  label,
  className,
}: {
  status: OrderStatus;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        styles[status],
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
