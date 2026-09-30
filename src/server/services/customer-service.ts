import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

type Purchase = { total: Prisma.Decimal; createdAt: Date; phone: string };

// Los pedidos cancelados no cuentan como compra.
function summarize(orders: Purchase[]) {
  return {
    orderCount: orders.length,
    spent: orders.reduce((sum, order) => sum + order.total.toNumber(), 0),
    lastOrderAt: orders[0]?.createdAt ?? null,
    phone: orders[0]?.phone ?? null,
  };
}

export async function listCustomers({
  q,
  page,
  pageSize,
}: {
  q?: string;
  page: number;
  pageSize: number;
}) {
  const search = q?.trim();
  const where: Prisma.UserWhereInput = {
    role: "cliente",
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        orders: {
          where: { status: { not: "cancelado" } },
          orderBy: { createdAt: "desc" },
          select: { total: true, createdAt: true, phone: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    customers: users.map(({ orders, ...user }) => ({ ...user, ...summarize(orders) })),
    total,
  };
}

export async function getCustomer(id: string) {
  const user = await prisma.user.findFirst({
    where: { id, role: "cliente" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: { select: { dozens: true } } },
      },
    },
  });
  if (!user) return null;
  return {
    ...user,
    ...summarize(user.orders.filter((order) => order.status !== "cancelado")),
  };
}

export async function getAccountEmail(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  return user?.email;
}
