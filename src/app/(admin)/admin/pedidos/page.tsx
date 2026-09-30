import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import {
  countOrdersByStatus,
  dozensIn,
  listOrders,
  ORDER_STATUSES,
} from "@/server/services/order-service";
import { ADMIN_PAGE_SIZE, formatCurrency, formatDateTime, orderCode } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import {
  adminHref,
  EmptyRow,
  FilterTabs,
  PageHeader,
  Pagination,
  Panel,
  SearchBox,
  tableClass,
  tdClass,
  thClass,
  theadClass,
} from "@/components/admin/ui";
import { orderStatusLabels } from "@/components/admin/labels";
import type { OrderStatus } from "@/generated/prisma/enums";

function isStatus(value: unknown): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/pedidos">) {
  await requireAdmin();
  const params = await searchParams;
  const status = isStatus(params.status) ? params.status : undefined;
  const q = typeof params.q === "string" ? params.q : undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const [{ orders, total }, counts] = await Promise.all([
    listOrders({ status, q, page, pageSize: ADMIN_PAGE_SIZE }),
    countOrdersByStatus(),
  ]);
  const pages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  const all = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-10">
      <PageHeader
        eyebrow="Ventas"
        title="Pedidos"
        text="Todos los pedidos por docena realizados desde la tienda."
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          items={[
            {
              label: "Todos",
              href: adminHref("/admin/pedidos", { q }),
              count: all,
              active: !status,
            },
            ...ORDER_STATUSES.map((s) => ({
              label: orderStatusLabels[s],
              href: adminHref("/admin/pedidos", { status: s, q }),
              count: counts[s],
              active: status === s,
            })),
          ]}
        />
        <SearchBox
          action="/admin/pedidos"
          defaultValue={q}
          placeholder="Buscar por n.º, cliente, correo…"
          hidden={{ status }}
        />
      </div>

      <Panel>
        <div className="overflow-x-auto">
          <table className={`${tableClass} min-w-[820px]`}>
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Pedido</th>
                <th className={thClass}>Fecha</th>
                <th className={thClass}>Cliente</th>
                <th className={thClass}>Entrega</th>
                <th className={`${thClass} text-right`}>Docenas</th>
                <th className={thClass}>Estado</th>
                <th className={`${thClass} text-right`}>Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length === 0 && (
                <EmptyRow colSpan={7}>
                  {q || status
                    ? "Ningún pedido coincide con el filtro."
                    : "Todavía no hay pedidos."}
                </EmptyRow>
              )}
              {orders.map((order) => (
                <tr key={order.id} className="group hover:bg-secondary/40">
                  <td className={tdClass}>
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="font-semibold group-hover:text-accent"
                    >
                      {orderCode(order.number)}
                    </Link>
                  </td>
                  <td className={`${tdClass} whitespace-nowrap text-muted-foreground`}>
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className={tdClass}>
                    <p className="font-medium">{order.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.businessName ?? order.email}
                    </p>
                  </td>
                  <td className={`${tdClass} text-muted-foreground`}>
                    {order.city}, {order.department}
                  </td>
                  <td className={`${tdClass} text-right tabular-nums`}>{dozensIn(order)}</td>
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

      <Pagination
        page={page}
        pages={pages}
        total={total}
        href={(p) => adminHref("/admin/pedidos", { status, q, page: String(p) })}
      />
    </div>
  );
}
