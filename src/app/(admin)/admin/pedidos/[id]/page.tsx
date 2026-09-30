import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, MessageCircle, Phone, UserRound } from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { getOrder } from "@/server/services/order-service";
import { UNITS_PER_DOZEN } from "@/content/products";
import { formatCurrency, formatDateTime, isUuid, orderCode } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderUpdateForm } from "@/components/admin/OrderUpdateForm";
import { PageHeader, Panel, tableClass, tdClass, thClass, theadClass } from "@/components/admin/ui";
import { orderStatusLabels } from "@/components/admin/labels";

function whatsappTo(phone: string, text: string) {
  const digits = phone.replace(/\D/g, "");
  const number = digits.length === 8 ? `503${digits}` : digits;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export default async function AdminOrderPage({ params }: PageProps<"/admin/pedidos/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const order = await getOrder(id);
  if (!order) notFound();

  const code = orderCode(order.number);
  const total = order.total.toNumber();
  const dozens = order.items.reduce((sum, item) => sum + item.dozens, 0);

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-10">
      <Link
        href="/admin/pedidos"
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Pedidos
      </Link>

      <PageHeader
        eyebrow={`Pedido · ${formatDateTime(order.createdAt)}`}
        title={code}
        text={`Última actualización ${formatDateTime(order.updatedAt)} · Idioma ${order.locale.toUpperCase()}`}
      >
        <OrderStatusBadge
          status={order.status}
          label={orderStatusLabels[order.status]}
          className="px-3 py-1.5 text-sm"
        />
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-6">
          <Panel title="Productos">
            <div className="overflow-x-auto">
              <table className={`${tableClass} min-w-[520px]`}>
                <thead className={theadClass}>
                  <tr>
                    <th className={thClass}>Producto</th>
                    <th className={`${thClass} text-right`}>Docenas</th>
                    <th className={`${thClass} text-right`}>Unidades</th>
                    <th className={`${thClass} text-right`}>Precio docena</th>
                    <th className={`${thClass} text-right`}>Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className={tdClass}>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">SKU {item.sku}</p>
                      </td>
                      <td className={`${tdClass} text-right tabular-nums`}>{item.dozens}</td>
                      <td className={`${tdClass} text-right text-muted-foreground tabular-nums`}>
                        {item.dozens * UNITS_PER_DOZEN}
                      </td>
                      <td className={`${tdClass} text-right tabular-nums`}>
                        {formatCurrency(item.dozenPrice.toNumber())}
                      </td>
                      <td className={`${tdClass} text-right font-semibold tabular-nums`}>
                        {formatCurrency(item.dozenPrice.toNumber() * item.dozens)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <dl className="ml-auto flex max-w-xs flex-col gap-2 border-t border-border px-5 py-4 text-sm">
              <div className="flex justify-between gap-8">
                <dt className="text-muted-foreground">
                  Subtotal · {dozens} {dozens === 1 ? "docena" : "docenas"}
                </dt>
                <dd className="tabular-nums">{formatCurrency(total)}</dd>
              </div>
              <div className="flex justify-between gap-8">
                <dt className="text-muted-foreground">Envío</dt>
                <dd className="font-semibold text-forest">Gratis</dd>
              </div>
              <div className="flex justify-between gap-8 border-t border-border pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatCurrency(total)}</dd>
              </div>
            </dl>
          </Panel>

          <div className="grid gap-6 md:grid-cols-2">
            <Panel title="Cliente">
              <div className="flex flex-col gap-3 p-5 text-sm">
                <p className="flex items-center gap-2 font-semibold">
                  <UserRound className="size-4 text-accent" /> {order.fullName}
                </p>
                {order.businessName && (
                  <p className="text-muted-foreground">{order.businessName}</p>
                )}
                <a
                  href={`mailto:${order.email}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  <Mail className="size-4 text-accent" /> {order.email}
                </a>
                <a href={`tel:${order.phone}`} className="flex items-center gap-2 hover:underline">
                  <Phone className="size-4 text-accent" /> {order.phone}
                </a>
                <Link
                  href={`/admin/clientes/${order.user.id}`}
                  className="mt-1 text-xs text-accent hover:underline"
                >
                  Ver ficha del cliente →
                </Link>
              </div>
            </Panel>
            <Panel title="Entrega">
              <div className="flex flex-col gap-3 p-5 text-sm">
                <p className="flex gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>
                    {order.address}
                    <br />
                    <span className="text-muted-foreground">
                      {order.city}, {order.department}
                    </span>
                  </span>
                </p>
                {order.notes && (
                  <div className="rounded-md bg-secondary px-3 py-2">
                    <p className="text-xs font-semibold tracking-wide uppercase">
                      Notas del cliente
                    </p>
                    <p className="mt-1 whitespace-pre-line text-muted-foreground">{order.notes}</p>
                  </div>
                )}
              </div>
            </Panel>
          </div>
        </div>

        <aside className="flex flex-col gap-6 xl:sticky xl:top-6 xl:self-start">
          <Panel title="Gestionar pedido">
            <div className="p-5">
              <OrderUpdateForm
                id={order.id}
                status={order.status}
                adminNote={order.adminNote}
                options={orderStatusLabels}
              />
            </div>
          </Panel>
          <a
            href={whatsappTo(
              order.phone,
              `¡Hola ${order.fullName}! Te escribimos de Casa Escencia sobre tu pedido ${code} por ${formatCurrency(total)}.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-forest px-5 py-4 text-sm font-semibold text-forest-foreground transition-colors hover:bg-primary"
          >
            <MessageCircle className="size-4" /> Contactar por WhatsApp
          </a>
        </aside>
      </div>
    </div>
  );
}
