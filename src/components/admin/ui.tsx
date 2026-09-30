import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Params = Record<string, string | undefined>;

export function adminHref(path: string, params: Params) {
  const query = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => !!entry[1]),
  ).toString();
  return query ? `${path}?${query}` : path;
}

export function PageHeader({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow?: string;
  title: string;
  text?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="display text-3xl text-foreground sm:text-4xl">{title}</h1>
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: React.ReactNode;
  icon: LucideIcon;
  tone?: "default" | "highlight";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border p-5",
        tone === "highlight"
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card",
      )}
    >
      <div className="flex items-center justify-between">
        <p
          className={cn(
            "text-xs font-semibold tracking-wide uppercase",
            tone === "highlight" ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-full",
            tone === "highlight"
              ? "bg-primary-foreground/10 text-gold"
              : "bg-secondary text-accent",
          )}
        >
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
      </div>
      <p className="font-serif text-3xl tabular-nums">{value}</p>
      {hint && (
        <p
          className={cn(
            "text-xs",
            tone === "highlight" ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      {title && (
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <h2 className="font-serif text-xl">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function FilterTabs({
  items,
}: {
  items: { label: string; href: string; count?: number; active: boolean }[];
}) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            item.active
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span
              className={cn(
                "rounded-full px-1.5 text-xs tabular-nums",
                item.active ? "bg-primary-foreground/15" : "bg-secondary",
              )}
            >
              {item.count}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

// Form GET simple: la búsqueda queda en la URL y sobrevive a recargas y enlaces.
export function SearchBox({
  action,
  defaultValue,
  placeholder,
  hidden,
}: {
  action: string;
  defaultValue?: string;
  placeholder: string;
  hidden?: Params;
}) {
  return (
    <form action={action} className="relative w-full sm:w-72">
      {Object.entries(hidden ?? {}).map(
        ([name, value]) => value && <input key={name} type="hidden" name={name} value={value} />,
      )}
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-input bg-card pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-ring focus:ring-2 focus:ring-ring/40"
      />
    </form>
  );
}

export function Pagination({
  page,
  pages,
  total,
  href,
}: {
  page: number;
  pages: number;
  total: number;
  href: (page: number) => string;
}) {
  if (pages <= 1) return null;
  const linkClass =
    "inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 hover:bg-secondary";
  return (
    <nav className="flex items-center justify-between text-sm" aria-label="Paginación">
      <span className="text-muted-foreground">
        Página {page} de {pages} · {total} resultados
      </span>
      <div className="flex gap-2">
        {page > 1 && (
          <Link href={href(page - 1)} className={linkClass}>
            <ChevronLeft className="size-4" /> Anterior
          </Link>
        )}
        {page < pages && (
          <Link href={href(page + 1)} className={linkClass}>
            Siguiente <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
    </nav>
  );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-14 text-center text-muted-foreground">
        {children}
      </td>
    </tr>
  );
}

export const tableClass = "w-full text-left text-sm";
export const theadClass = "bg-secondary/70 text-xs tracking-wide text-muted-foreground uppercase";
export const thClass = "px-5 py-3 font-semibold whitespace-nowrap";
export const tdClass = "px-5 py-3.5";
