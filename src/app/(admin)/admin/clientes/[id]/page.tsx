import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleDollarSign, Mail, Package, Phone } from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { getCustomer } from "@/server/services/customer-service";
import { dozensIn } from "@/server/services/order-service";
import { formatCurrency, formatDate, formatDateTime, isUuid, orderCode } from "@/lib/utils";
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
import { orderStatusLabels } from "@/components/admin/labels";

export default async function AdminCustomerPage({ params }: PageProps<"/admin/clientes/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const customer = await getCustomer(id);
  if (!customer) notFound();
  const totalDozens = customer.orders
    .filter((order) => order.status !== "cancelado")
    .reduce((sum, order) => sum + dozensIn(order), 0);

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-10">
      <Link
        href="/admin/clientes"
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Clientes
      </Link>

      <PageHeader
        eyebrow={`Cliente desde ${formatDate(customer.createdAt)}`}
        title={customer.name}
        text={
          <span className="flex flex-wrap gap-x-5 gap-y-1">
            <a
              href={`mailto:${customer.email}`}
              className="inline-flex items-center gap-1.5 hover:underline"
            >
              <Mail className="size-3.5" /> {customer.email}
            </a>
            {customer.phone && (
              <a
                href={`tel:${customer.phone}`}
                className="inline-flex items-center gap-1.5 hover:underline"
              >
                <Phone className="size-3.5" /> {customer.phone}
              </a>
            )}
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          tone="highlight"
          label="Total comprado"
          value={formatCurrency(customer.spent)}
          icon={CircleDollarSign}
          hint="Excluye pedidos cancelados"
        />
        <StatCard
          label="Pedidos"
          value={String(customer.orderCount)}
          icon={Package}
          hint={
            customer.lastOrderAt ? `Último: ${formatDate(customer.lastOrderAt)}` : "Sin pedidos"
          }
        />
        <StatCard
          label="Docenas"
          value={String(totalDozens)}
          icon={Package}
          hint={`${totalDozens * 12} unidades en total`}
        />
      </div>

      <Panel title="Historial de pedidos">
        <div className="overflow-x-auto">
          <table className={`${tableClass} min-w-[640px]`}>
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Pedido</th>
                <th className={thClass}>Fecha</th>
                <th className={thClass}>Entrega</th>
                <th className={`${thClass} text-right`}>Docenas</th>
                <th className={thClass}>Estado</th>
                <th className={`${thClass} text-right`}>Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customer.orders.length === 0 && (
                <EmptyRow colSpan={6}>Este cliente todavía no ha hecho pedidos.</EmptyRow>
              )}
              {customer.orders.map((order) => (
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
    </div>
  );
}
