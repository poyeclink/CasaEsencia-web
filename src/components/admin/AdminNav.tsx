"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, LayoutDashboard, Package, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/pedidos", label: "Pedidos", icon: Package },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
];

export function AdminNav({ badges }: { badges: Partial<Record<string, number>> }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Panel" className="flex gap-1 overflow-x-auto md:flex-col">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        const badge = badges[href];
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary-foreground/10 text-primary-foreground"
                : "text-primary-foreground/65 hover:bg-primary-foreground/5 hover:text-primary-foreground",
            )}
          >
            <Icon
              className={cn("size-4", active ? "text-gold" : "text-primary-foreground/50")}
              strokeWidth={1.75}
            />
            {label}
            {!!badge && (
              <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[0.65rem] font-bold text-primary tabular-nums">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
