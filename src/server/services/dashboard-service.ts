import { prisma } from "@/lib/prisma";
import { STORE_TIME_ZONE } from "@/lib/utils";

const MONTHS_IN_CHART = 6;
const monthKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: STORE_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
});

function monthKey(date: Date) {
  return monthKeyFormatter.format(date).slice(0, 7);
}

// Inicio de mes en hora de El Salvador (UTC-6 fijo, sin horario de verano).
function monthStart(year: number, month: number) {
  return new Date(Date.UTC(year, month, 1, 6));
}

export async function getDashboardStats() {
  const [year, month] = monthKey(new Date()).split("-").map(Number);
  const thisMonth = monthStart(year, month - 1);
  const chartFrom = monthStart(year, month - MONTHS_IN_CHART);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    orders,
    pending,
    recentWeek,
    customers,
    newCustomers,
    newLeads,
    recentOrders,
    recentLeads,
    items,
  ] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: chartFrom }, status: { not: "cancelado" } },
      select: { total: true, createdAt: true },
    }),
    prisma.order.count({ where: { status: "pendiente" } }),
    prisma.order.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.count({ where: { role: "cliente" } }),
    prisma.user.count({ where: { role: "cliente", createdAt: { gte: thisMonth } } }),
    prisma.lead.count({ where: { status: "nuevo" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { items: { select: { dozens: true } } },
    }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.orderItem.groupBy({
      by: ["productName"],
      where: { order: { status: { not: "cancelado" }, createdAt: { gte: thisMonth } } },
      _sum: { dozens: true },
    }),
  ]);

  const months = Array.from({ length: MONTHS_IN_CHART }, (_, i) => {
    const start = monthStart(year, month - MONTHS_IN_CHART + i);
    return { key: monthKey(start), start, revenue: 0, orders: 0 };
  });
  for (const order of orders) {
    const bucket = months.find((m) => m.key === monthKey(order.createdAt));
    if (!bucket) continue;
    bucket.revenue += order.total.toNumber();
    bucket.orders += 1;
  }

  const current = months.at(-1)!;
  const previous = months.at(-2)!;

  return {
    revenue: current.revenue,
    previousRevenue: previous.revenue,
    ordersThisMonth: current.orders,
    averageOrder: current.orders ? current.revenue / current.orders : 0,
    pending,
    recentWeek,
    customers,
    newCustomers,
    newLeads,
    months,
    dozensByProduct: items
      .map((item) => ({ name: item.productName, dozens: item._sum.dozens ?? 0 }))
      .sort((a, b) => b.dozens - a.dozens),
    recentOrders,
    recentLeads,
  };
}
