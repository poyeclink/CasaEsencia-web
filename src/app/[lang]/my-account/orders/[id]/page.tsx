import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CircleCheck, MessageCircle } from "lucide-react";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSession } from "@/lib/session";
import { getOrderForUser } from "@/server/services/order-service";
import { whatsappLink } from "@/content/site";
import { formatCurrency, formatDateTime, isUuid, orderCode } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { ClearCart } from "@/components/cart/ClearCart";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";

export async function generateMetadata({ params }: PageProps<"/[lang]/my-account/orders/[id]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.orders.order, robots: { index: false } };
}

export default async function OrderPage({
  params,
  searchParams,
}: PageProps<"/[lang]/my-account/orders/[id]">) {
  const { lang, id } = await params;
  if (!hasLocale(lang) || !isUuid(id)) notFound();
  const session = await getSession();
  if (session?.role !== "cliente") redirect(`/${lang}/login`);
  const [dict, order, { placed }] = await Promise.all([
    getDictionary(lang),
    getOrderForUser(id, session.userId),
    searchParams,
  ]);
  if (!order) notFound();
  const t = dict.orders;
  const code = orderCode(order.number);
  const total = order.total.toNumber();

  return (
    <div className="container-page py-14 sm:py-20">
      {placed && <ClearCart />}
      <Link
        href={`/${lang}/my-account`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {t.back}
      </Link>

      {placed && (
        <div className="mt-8 flex flex-col items-start gap-5 rounded-xl bg-primary p-8 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <CircleCheck className="mt-1 size-7 shrink-0 text-gold" strokeWidth={1.5} />
            <div>
              <p className="display text-2xl sm:text-3xl">{t.placedTitle}</p>
              <p className="mt-2 text-sm text-primary-foreground/80">
                {t.placedText.replace("{code}", code)}
              </p>
            </div>
          </div>
          <a
            href={whatsappLink(t.whatsappMessage.replace("{code}", code))}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "light" })}
          >
            <MessageCircle className="size-4" /> {t.whatsappCta}
          </a>
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="eyebrow">{t.order}</p>
          <h1 className="display mt-2 text-4xl">{code}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDateTime(order.createdAt, lang)}
          </p>
        </div>
        <OrderStatusBadge
          status={order.status}
          label={t.statuses[order.status]}
          className="px-3 py-1.5 text-sm"
        />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-5 py-3 font-semibold">{t.product}</th>
                <th className="px-5 py-3 text-right font-semibold">{t.dozens}</th>
                <th className="hidden px-5 py-3 text-right font-semibold sm:table-cell">
                  {t.dozenPrice}
                </th>
                <th className="px-5 py-3 text-right font-semibold">{t.total}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4">
                    <p className="font-serif text-lg">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">{item.sku}</p>
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums">{item.dozens}</td>
                  <td className="hidden px-5 py-4 text-right tabular-nums sm:table-cell">
                    {formatCurrency(item.dozenPrice.toNumber())}
                  </td>
                  <td className="px-5 py-4 text-right font-semibold tabular-nums">
                    {formatCurrency(item.dozenPrice.toNumber() * item.dozens)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <dl className="flex flex-col gap-2 border-t border-border px-5 py-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t.subtotal}</dt>
              <dd className="tabular-nums">{formatCurrency(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t.shipping}</dt>
              <dd className="font-semibold text-forest">{t.free}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>{t.total}</dt>
              <dd className="tabular-nums">{formatCurrency(total)}</dd>
            </div>
          </dl>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card p-6 text-sm">
            <h2 className="mb-3 font-serif text-xl">{t.deliveryTitle}</h2>
            <p className="font-semibold">{order.fullName}</p>
            {order.businessName && <p>{order.businessName}</p>}
            <p className="mt-2 text-muted-foreground">{order.address}</p>
            <p className="text-muted-foreground">
              {order.city}, {order.department}
            </p>
            <p className="mt-2">{order.phone}</p>
            {order.notes && (
              <>
                <h3 className="mt-5 mb-1 text-xs font-semibold tracking-wide uppercase">
                  {t.notesTitle}
                </h3>
                <p className="whitespace-pre-line text-muted-foreground">{order.notes}</p>
              </>
            )}
          </div>
          <div className="rounded-xl bg-secondary p-6 text-sm">
            <p className="font-semibold">{t.help}</p>
            <a
              href={whatsappLink(t.whatsappMessage.replace("{code}", code))}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-accent underline underline-offset-4"
            >
              <MessageCircle className="size-4" /> {t.whatsappCta}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
