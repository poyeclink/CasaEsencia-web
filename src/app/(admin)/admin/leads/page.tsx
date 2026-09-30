import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { countLeadsByStatus, LEAD_STATUSES, listLeads } from "@/server/services/lead-service";
import { ADMIN_PAGE_SIZE, formatDateTime } from "@/lib/utils";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
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
import { businessTypeLabels, leadSourceLabels, leadStatusLabels } from "@/components/admin/labels";
import type { LeadSource, LeadStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

const sources = Object.keys(leadSourceLabels) as LeadSource[];

export default async function AdminLeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  await requireAdmin();
  const params = await searchParams;
  const status = LEAD_STATUSES.includes(params.status as LeadStatus)
    ? (params.status as LeadStatus)
    : undefined;
  const source = sources.includes(params.source as LeadSource)
    ? (params.source as LeadSource)
    : undefined;
  const q = typeof params.q === "string" ? params.q : undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const [{ leads, total }, counts] = await Promise.all([
    listLeads({ source, status, q, page, pageSize: ADMIN_PAGE_SIZE }),
    countLeadsByStatus(),
  ]);
  const pages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  const all = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-10">
      <PageHeader
        eyebrow="Prospectos"
        title="Leads"
        text="Mensajes de los formularios de contacto y de línea profesional."
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          items={[
            {
              label: "Todos",
              href: adminHref("/admin/leads", { source, q }),
              count: all,
              active: !status,
            },
            ...LEAD_STATUSES.map((s) => ({
              label: leadStatusLabels[s],
              href: adminHref("/admin/leads", { status: s, source, q }),
              count: counts[s],
              active: status === s,
            })),
          ]}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex gap-1 text-sm">
            {[undefined, ...sources].map((s) => (
              <Link
                key={s ?? "all"}
                href={adminHref("/admin/leads", { status, source: s, q })}
                className={cn(
                  "rounded-full border px-3 py-1.5 whitespace-nowrap transition-colors",
                  source === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {s ? leadSourceLabels[s] : "Todo origen"}
              </Link>
            ))}
          </div>
          <SearchBox
            action="/admin/leads"
            defaultValue={q}
            placeholder="Buscar nombre, correo…"
            hidden={{ status, source }}
          />
        </div>
      </div>

      <Panel>
        <div className="overflow-x-auto">
          <table className={`${tableClass} min-w-[900px]`}>
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Fecha</th>
                <th className={thClass}>Contacto</th>
                <th className={thClass}>Origen</th>
                <th className={thClass}>Negocio</th>
                <th className={thClass}>Mensaje</th>
                <th className={thClass}>Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.length === 0 && (
                <EmptyRow colSpan={6}>
                  {q || status || source
                    ? "Ningún lead coincide con el filtro."
                    : "Todavía no hay leads."}
                </EmptyRow>
              )}
              {leads.map((lead) => (
                <tr key={lead.id} className="align-top hover:bg-secondary/40">
                  <td className={`${tdClass} whitespace-nowrap text-muted-foreground`}>
                    {formatDateTime(lead.createdAt)}
                  </td>
                  <td className={tdClass}>
                    <p className="font-medium">{lead.name}</p>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-xs text-accent underline-offset-4 hover:underline"
                    >
                      {lead.email}
                    </a>
                  </td>
                  <td className={tdClass}>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
                        lead.source === "profesional"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground",
                      )}
                    >
                      {leadSourceLabels[lead.source]}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground uppercase">
                      {lead.locale}
                    </span>
                  </td>
                  <td className={tdClass}>
                    {lead.businessType
                      ? (businessTypeLabels[lead.businessType] ?? lead.businessType)
                      : "—"}
                  </td>
                  <td className={`${tdClass} max-w-xs whitespace-pre-line text-muted-foreground`}>
                    {lead.message ?? "—"}
                  </td>
                  <td className={tdClass}>
                    <LeadStatusSelect
                      key={lead.status}
                      id={lead.id}
                      status={lead.status}
                      options={leadStatusLabels}
                    />
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
        href={(p) => adminHref("/admin/leads", { status, source, q, page: String(p) })}
      />
    </div>
  );
}
