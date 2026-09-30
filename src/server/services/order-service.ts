import { prisma } from "@/lib/prisma";
import { getProduct } from "@/content/products";
import type { OrderStatus, Prisma } from "@/generated/prisma/client";

export const ORDER_STATUSES = [
  "pendiente",
  "confirmado",
  "enviado",
  "entregado",
  "cancelado",
] as const satisfies readonly OrderStatus[];

export const MAX_DOZENS_PER_LINE = 500;

export class OrderError extends Error {
  constructor(public key: "cart") {
    super(key);
  }
}

type CartLine = { slug: string; quantity: number };

// Los precios se recalculan siempre desde el catálogo del servidor: el
// carrito del navegador solo aporta qué productos y cuántas docenas.
export function priceCart(lines: CartLine[]) {
  const items = lines.map((line) => {
    const product = getProduct(line.slug);
    if (!product || !Number.isInteger(line.quantity) || line.quantity < 1) {
      throw new OrderError("cart");
    }
    return {
      productSlug: product.slug,
      productName: product.content.es.name,
      sku: product.sku,
      dozens: line.quantity,
      dozenPrice: product.dozenPrice,
    };
  });
  if (items.length === 0 || new Set(items.map((i) => i.productSlug)).size !== items.length) {
    throw new OrderError("cart");
  }
  const total = items.reduce((sum, item) => sum + item.dozenPrice * item.dozens, 0);
  return { items, total: Math.round(total * 100) / 100 };
}

type CreateOrderInput = {
  userId: string;
  fullName: string;
  phone: string;
  businessName?: string;
  department: string;
  city: string;
  address: string;
  notes?: string;
  locale: string;
  lines: CartLine[];
};

export async function createOrder({ lines, ...input }: CreateOrderInput) {
  const { items, total } = priceCart(lines);
  const { email } = await prisma.user.findUniqueOrThrow({
    where: { id: input.userId },
    select: { email: true },
  });
  return prisma.order.create({
    data: { ...input, email, total, items: { create: items } },
  });
}

export function listOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: { select: { dozens: true } } },
  });
}

export function getOrderForUser(id: string, userId: string) {
  return prisma.order.findFirst({ where: { id, userId }, include: { items: true } });
}

export function getLastOrderContact(userId: string) {
  return prisma.order.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      fullName: true,
      phone: true,
      businessName: true,
      department: true,
      city: true,
      address: true,
    },
  });
}

type ListOrdersFilter = { status?: OrderStatus; q?: string; page: number; pageSize: number };

export async function listOrders({ status, q, page, pageSize }: ListOrdersFilter) {
  const search = q?.trim();
  const number = search ? Number(search.replace(/^ce-?/i, "")) : NaN;
  const where: Prisma.OrderWhereInput = {
    status,
    ...(search && {
      OR: [
        // Tope de Int4: un teléfono largo parsea como número y haría fallar la consulta.
        ...(Number.isInteger(number) && number <= 2_147_483_647 ? [{ number }] : []),
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { businessName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ],
    }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { items: { select: { dozens: true } } },
    }),
    prisma.order.count({ where }),
  ]);
  return { orders, total };
}

export async function countOrdersByStatus() {
  const groups = await prisma.order.groupBy({ by: ["status"], _count: true });
  const counts = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0])) as Record<
    OrderStatus,
    number
  >;
  for (const group of groups) counts[group.status] = group._count;
  return counts;
}

export function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true, user: { select: { id: true, name: true, createdAt: true } } },
  });
}

export function updateOrder(id: string, data: { status: OrderStatus; adminNote?: string }) {
  return prisma.order.update({
    where: { id },
    data: { ...data, adminNote: data.adminNote || null },
  });
}

export function dozensIn(order: { items: { dozens: number }[] }) {
  return order.items.reduce((sum, item) => sum + item.dozens, 0);
}
