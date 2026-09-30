import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full rounded-md border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70",
        "focus:border-ring focus:ring-2 focus:ring-ring/40",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    />
  );
}
