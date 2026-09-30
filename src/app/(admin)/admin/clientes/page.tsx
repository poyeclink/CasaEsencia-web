import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { listCustomers } from "@/server/services/customer-service";
import { ADMIN_PAGE_SIZE, formatCurrency, formatDate } from "@/lib/utils";
import {
  adminHref,
  EmptyRow,
  PageHeader,
  Pagination,
  Panel,
  SearchBox,
  tableClass,
  tdClass,
  thClass,
  theadClass,
} from "@/components/admin/ui";

export default async function AdminCustomersPage({ searchParams }: PageProps<"/admin/clientes">) {
  await requireAdmin();
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const page = Math.max(1, Number(params.page) || 1);
  const { customers, total } = await listCustomers({ q, page, pageSize: ADMIN_PAGE_SIZE });
  const pages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-10">
      <PageHeader
        eyebrow="Relaciones"
        title="Clientes"
        text={`${total} ${total === 1 ? "cuenta registrada" : "cuentas registradas"} en la tienda.`}
      >
        <SearchBox
          action="/admin/clientes"
          defaultValue={q}
          placeholder="Buscar por nombre o correo…"
        />
      </PageHeader>

      <Panel>
        <div className="overflow-x-auto">
          <table className={`${tableClass} min-w-[760px]`}>
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Cliente</th>
                <th className={thClass}>Teléfono</th>
                <th className={thClass}>Registro</th>
                <th className={`${thClass} text-right`}>Pedidos</th>
                <th className={`${thClass} text-right`}>Total comprado</th>
                <th className={thClass}>Último pedido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.length === 0 && (
                <EmptyRow colSpan={6}>
                  {q
                    ? "Ningún cliente coincide con la búsqueda."
                    : "Todavía no hay clientes registrados."}
                </EmptyRow>
              )}
              {customers.map((customer) => (
                <tr key={customer.id} className="group hover:bg-secondary/40">
                  <td className={tdClass}>
                    <Link
                      href={`/admin/clientes/${customer.id}`}
                      className="flex items-center gap-3"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary font-serif text-accent">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                      <span>
                        <span className="block font-medium group-hover:text-accent">
                          {customer.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {customer.email}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className={`${tdClass} text-muted-foreground`}>{customer.phone ?? "—"}</td>
                  <td className={`${tdClass} whitespace-nowrap text-muted-foreground`}>
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className={`${tdClass} text-right tabular-nums`}>{customer.orderCount}</td>
                  <td className={`${tdClass} text-right font-semibold tabular-nums`}>
                    {formatCurrency(customer.spent)}
                  </td>
                  <td className={`${tdClass} whitespace-nowrap text-muted-foreground`}>
                    {customer.lastOrderAt ? formatDate(customer.lastOrderAt) : "Sin pedidos"}
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
        href={(p) => adminHref("/admin/clientes", { q, page: String(p) })}
      />
    </div>
  );
}
