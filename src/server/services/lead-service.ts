import { prisma } from "@/lib/prisma";
import type { LeadSource, LeadStatus, Prisma } from "@/generated/prisma/client";

export const BUSINESS_TYPES = ["salon-independiente", "salon", "estilista", "vendedor"] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const LEAD_STATUSES = [
  "nuevo",
  "contactado",
  "convertido",
  "descartado",
] as const satisfies readonly LeadStatus[];

type CreateLeadInput = {
  source: LeadSource;
  name: string;
  email: string;
  businessType?: BusinessType;
  message?: string;
  locale: string;
};

export function createLead(input: CreateLeadInput) {
  return prisma.lead.create({ data: input });
}

type ListLeadsFilter = {
  source?: LeadSource;
  status?: LeadStatus;
  q?: string;
  page: number;
  pageSize: number;
};

export async function listLeads({ source, status, q, page, pageSize }: ListLeadsFilter) {
  const search = q?.trim();
  const where: Prisma.LeadWhereInput = {
    source,
    status,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.lead.count({ where }),
  ]);
  return { leads, total };
}

export async function countLeadsByStatus() {
  const groups = await prisma.lead.groupBy({ by: ["status"], _count: true });
  const counts = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0])) as Record<LeadStatus, number>;
  for (const group of groups) counts[group.status] = group._count;
  return counts;
}

export function updateLeadStatus(id: string, status: LeadStatus) {
  return prisma.lead.update({ where: { id }, data: { status } });
}
