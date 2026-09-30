import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { countOrdersByStatus } from "@/server/services/order-service";
import { countLeadsByStatus } from "@/server/services/lead-service";
import { Logo } from "@/components/layout/Logo";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminLogoutButton } from "@/components/auth/AdminLogoutButton";

// Sidebar azul marino fija en escritorio y barra superior con nav desplazable
// en móvil. Los contadores del nav (pendientes / leads nuevos) se leen aquí
// para que estén presentes en todas las secciones.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const [orders, leads] = await Promise.all([countOrdersByStatus(), countLeadsByStatus()]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background md:flex-row">
      <aside className="flex shrink-0 flex-col gap-4 bg-primary px-4 py-4 text-primary-foreground md:sticky md:top-0 md:h-screen md:w-64 md:gap-8 md:px-4 md:py-6">
        <div className="flex items-center justify-between md:flex-col md:items-start md:gap-2 md:px-3">
          <Link href="/admin" aria-label="Resumen">
            <Logo light className="w-24 md:w-28" />
          </Link>
          <span className="text-[0.65rem] font-semibold tracking-[0.3em] text-gold uppercase">
            Panel
          </span>
        </div>

        <AdminNav badges={{ "/admin/pedidos": orders.pendiente, "/admin/leads": leads.nuevo }} />

        <div className="mt-auto hidden flex-col gap-3 border-t border-primary-foreground/10 pt-5 md:flex">
          <Link
            href="/es"
            target="_blank"
            className="flex items-center gap-2 px-3 text-xs text-primary-foreground/60 hover:text-primary-foreground"
          >
            <ExternalLink className="size-3.5" /> Ver sitio
          </Link>
          <div className="flex items-center gap-3 px-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-gold font-serif text-primary">
              {session.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{session.name}</p>
              <p className="text-xs text-primary-foreground/60">Administrador</p>
            </div>
          </div>
          <AdminLogoutButton variant="outlineLight" className="w-full" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1">{children}</main>
        <div className="border-t border-border px-6 py-4 md:hidden">
          <AdminLogoutButton />
        </div>
      </div>
    </div>
  );
}
