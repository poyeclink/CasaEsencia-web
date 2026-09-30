import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  className?: string;
};

export function Ornament({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("flex items-center gap-2 text-gold", className)}>
      <span className="h-px w-10 bg-current" />
      <span className="size-1.5 rotate-45 border border-current" />
      <span className="h-px w-10 bg-current" />
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  tone = "light",
  as: Heading = "h2",
  className,
}: Props) {
  const center = align === "center";
  const dark = tone === "dark";

  return (
    <div className={cn("flex flex-col gap-5", center && "items-center text-center", className)}>
      {eyebrow && <p className={cn("eyebrow", dark && "text-gold")}>{eyebrow}</p>}
      <Heading
        className={cn(
          "display max-w-3xl text-4xl leading-[1.1] sm:text-5xl",
          dark ? "text-primary-foreground" : "text-foreground",
        )}
      >
        {title}
      </Heading>
      {center && <Ornament />}
      {text && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed sm:text-lg",
            dark ? "text-primary-foreground/75" : "text-muted-foreground",
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}
