import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronRight, Package } from "lucide-react";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSession } from "@/lib/session";
import { dozensIn, listOrdersForUser } from "@/server/services/order-service";
import { formatCurrency, formatDate, orderCode } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";

export async function generateMetadata({ params }: PageProps<"/[lang]/my-account">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.auth.accountTitle, robots: { index: false } };
}

export default async function AccountPage({ params }: PageProps<"/[lang]/my-account">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const session = await getSession();
  if (session?.role !== "cliente") redirect(`/${lang}/login`);
  const [dict, orders] = await Promise.all([
    getDictionary(lang),
    listOrdersForUser(session.userId),
  ]);
  const t = dict.orders;

  return (
    <div className="container-page py-14 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">{dict.auth.accountTitle}</p>
          <h1 className="display text-4xl sm:text-5xl">
            {dict.auth.greeting.replace("{name}", session.name)}
          </h1>
          <p className="text-muted-foreground">{dict.auth.accountText}</p>
        </div>
        <LogoutButton locale={lang} label={dict.auth.logout} />
      </div>

      <section className="mt-12 flex flex-col gap-6">
        <h2 className="font-serif text-2xl">{t.title}</h2>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-5 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <Package className="size-8 text-accent" strokeWidth={1.25} />
            <p className="text-muted-foreground">{t.empty}</p>
            <Link href={`/${lang}/store`} className={buttonVariants()}>
              {t.shopCta}
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/${lang}/my-account/orders/${order.id}`}
                  className="grid grid-cols-2 items-center gap-x-6 gap-y-2 px-5 py-5 transition-colors hover:bg-secondary/50 sm:grid-cols-[1fr_1fr_auto_auto_auto] sm:px-6"
                >
                  <div>
                    <p className="font-semibold">{orderCode(order.number)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt, lang)}
                    </p>
                  </div>
                  <div className="justify-self-end sm:justify-self-start">
                    <OrderStatusBadge status={order.status} label={t.statuses[order.status]} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {dozensIn(order)} {t.dozens.toLowerCase()}
                  </p>
                  <p className="justify-self-end font-semibold tabular-nums">
                    {formatCurrency(order.total.toNumber())}
                  </p>
                  <ChevronRight
                    className="hidden size-4 text-muted-foreground sm:block"
                    aria-label={t.view}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
