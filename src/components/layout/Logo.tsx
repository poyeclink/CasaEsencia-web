import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ light, className }: { light?: boolean; className?: string }) {
  return (
    <Image
      src={light ? "/images/logo-light.svg" : "/images/logo.svg"}
      alt="Casa Escencia"
      width={193}
      height={97}
      className={cn("h-auto w-32 sm:w-36", className)}
      loading="eager"
    />
  );
}
