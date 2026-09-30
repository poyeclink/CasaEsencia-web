import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  Clock,
  Inbox,
  Package,
  Users,
} from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { getDashboardStats } from "@/server/services/dashboard-service";
import { dozensIn } from "@/server/services/order-service";
import { formatCurrency, formatDateTime, orderCode, STORE_TIME_ZONE } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import {
  EmptyRow,
  PageHeader,
  Panel,
  StatCard,
  tableClass,
  tdClass,
  thClass,
  theadClass,
} from "@/components/admin/ui";
import { leadSourceLabels, orderStatusLabels } from "@/components/admin/labels";

const todayLabel = new Intl.DateTimeFormat("es", { dateStyle: "full", timeZone: STORE_TIME_ZONE });
const monthLabel = new Intl.DateTimeFormat("es", { month: "short", timeZone: STORE_TIME_ZONE });
const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: STORE_TIME_ZONE,
    }).format(new Date()),
  );
  return hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";
}

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const stats = await getDashboardStats();
  const change = stats.previousRevenue
    ? ((stats.revenue - stats.previousRevenue) / stats.previousRevenue) * 100
    : null;
  const maxRevenue = Math.max(...stats.months.map((m) => m.revenue), 1);
  const maxDozens = Math.max(...stats.dozensByProduct.map((p) => p.dozens), 1);
  const totalDozens = stats.dozensByProduct.reduce((sum, p) => sum + p.dozens, 0);

  return (
    <div className="flex flex-col gap-8 p-6 lg:p-10">
      <PageHeader
        eyebrow={todayLabel.format(new Date())}
        title={`${greeting()}, ${session.name}`}
        text="Así va Casa Escencia este mes."
      >
        {stats.pending > 0 && (
          <Link
            href="/admin/pedidos?status=pendiente"
            className="inline-flex items-center gap-2 rounded-full bg-gold/25 px-4 py-2 text-sm font-semibold text-accent hover:bg-gold/40"
          >
            <Clock className="size-4" /> {stats.pending}{" "}
            {stats.pending === 1 ? "pedido por confirmar" : "pedidos por confirmar"}
          </Link>
        )}
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          tone="highlight"
          label="Ventas del mes"
          value={formatCurrency(stats.revenue)}
          icon={CircleDollarSign}
          hint={
            change === null ? (
              "Sin ventas el mes anterior"
            ) : (
              <span className="inline-flex items-center gap-1">
                {change >= 0 ? (
                  <ArrowUpRight className="size-3.5 text-gold" />
                ) : (
                  <ArrowDownRight className="size-3.5 text-gold" />
                )}
                {Math.abs(change).toFixed(0)}% vs. mes anterior
              </span>
            )
          }
        />
        <StatCard
          label="Pedidos del mes"
          value={String(stats.ordersThisMonth)}
          icon={Package}
          hint={`Ticket promedio ${formatCurrency(stats.averageOrder)} · ${stats.recentWeek} en 7 días`}
        />
        <StatCard
          label="Clientes"
          value={String(stats.customers)}
          icon={Users}
          hint={`${stats.newCustomers} nuevos este mes`}
        />
        <StatCard
          label="Leads por atender"
          value={String(stats.newLeads)}
          icon={Inbox}
          hint={
            <Link href="/admin/leads?status=nuevo" className="underline underline-offset-4">
              Ver leads nuevos
            </Link>
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Panel title="Ventas últimos 6 meses">
          <div className="flex h-64 items-end gap-3 px-5 pt-8 pb-5 sm:gap-6">
            {stats.months.map((month, i) => {
              const current = i === stats.months.length - 1;
              return (
                <div key={month.key} className="flex h-full flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 flex-col items-center justify-end gap-1.5">
                    <span className="text-[0.7rem] font-semibold text-muted-foreground tabular-nums">
                      {month.revenue ? compactCurrency.format(month.revenue) : ""}
                    </span>
                    <div
                      title={`${formatCurrency(month.revenue)} · ${month.orders} pedidos`}
                      className={
                        current
                          ? "w-full max-w-14 rounded-t-md bg-primary"
                          : "w-full max-w-14 rounded-t-md bg-gold/60"
                      }
                      style={{ height: `${Math.max((month.revenue / maxRevenue) * 100, 2)}%` }}
                    />
                  </div>
                  <span
                    className={
                      current
                        ? "text-xs font-semibold capitalize"
                        : "text-xs text-muted-foreground capitalize"
                    }
                  >
                    {monthLabel.format(month.start)}
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Docenas vendidas · mes">
          <div className="flex flex-col gap-5 p-5">
            <p className="font-serif text-4xl tabular-nums">
              {totalDozens}
              <span className="ml-2 font-sans text-sm text-muted-foreground">
                docenas · {totalDozens * 12} unidades
              </span>
            </p>
            {stats.dozensByProduct.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aún no hay ventas este mes.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {stats.dozensByProduct.map((product) => (
                  <li key={product.name} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-sm">
                      <span>{product.name}</span>
                      <span className="font-semibold tabular-nums">{product.dozens}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${(product.dozens / maxDozens) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Panel
          title="Pedidos recientes"
          action={
            <Link href="/admin/pedidos" className="text-sm text-accent hover:underline">
              Ver todos
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className={`${tableClass} min-w-[560px]`}>
              <thead className={theadClass}>
                <tr>
                  <th className={thClass}>Pedido</th>
                  <th className={thClass}>Cliente</th>
                  <th className={thClass}>Docenas</th>
                  <th className={thClass}>Estado</th>
                  <th className={`${thClass} text-right`}>Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.recentOrders.length === 0 && (
                  <EmptyRow colSpan={5}>Todavía no hay pedidos.</EmptyRow>
                )}
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/40">
                    <td className={tdClass}>
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="font-semibold hover:text-accent"
                      >
                        {orderCode(order.number)}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </td>
                    <td className={tdClass}>
                      <p className="font-medium">{order.fullName}</p>
                      {order.businessName && (
                        <p className="text-xs text-muted-foreground">{order.businessName}</p>
                      )}
                    </td>
                    <td className={`${tdClass} tabular-nums`}>{dozensIn(order)}</td>
                    <td className={tdClass}>
                      <OrderStatusBadge
                        status={order.status}
                        label={orderStatusLabels[order.status]}
                      />
                    </td>
                    <td className={`${tdClass} text-right font-semibold tabular-nums`}>
                      {formatCurrency(order.total.toNumber())}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Leads recientes"
          action={
            <Link href="/admin/leads" className="text-sm text-accent hover:underline">
              Ver todos
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {stats.recentLeads.length === 0 && (
              <li className="px-5 py-14 text-center text-sm text-muted-foreground">
                Todavía no hay leads.
              </li>
            )}
            {stats.recentLeads.map((lead) => (
              <li key={lead.id} className="flex items-start gap-3 px-5 py-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary font-serif text-accent">
                  {lead.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{lead.name}</p>
                    {lead.status === "nuevo" && (
                      <span className="size-2 shrink-0 rounded-full bg-gold" title="Nuevo" />
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {leadSourceLabels[lead.source]} · {formatDateTime(lead.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
