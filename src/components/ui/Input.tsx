import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={cn(
        "h-12 w-full rounded-md border border-input bg-card px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70",
        "focus:border-ring focus:ring-2 focus:ring-ring/40",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    />
  );
}
