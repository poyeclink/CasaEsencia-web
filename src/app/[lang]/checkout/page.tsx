import { notFound, redirect } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSession } from "@/lib/session";
import { getLastOrderContact } from "@/server/services/order-service";
import { getAccountEmail } from "@/server/services/customer-service";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/checkout">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.checkout.title, robots: { index: false } };
}

export default async function CheckoutPage({ params }: PageProps<"/[lang]/checkout">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const session = await getSession();
  if (session?.role !== "cliente") redirect(`/${lang}/login?next=/${lang}/checkout`);

  const [dict, email, lastContact] = await Promise.all([
    getDictionary(lang),
    getAccountEmail(session.userId),
    getLastOrderContact(session.userId),
  ]);
  if (!email) redirect(`/${lang}/login?next=/${lang}/checkout`);

  return (
    <div className="container-page py-14 sm:py-20">
      <div className="mb-12 flex flex-col gap-3">
        <p className="eyebrow">{dict.checkout.eyebrow}</p>
        <h1 className="display text-4xl sm:text-5xl">{dict.checkout.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{dict.checkout.text}</p>
      </div>
      <CheckoutForm
        locale={lang}
        t={dict.checkout}
        cart={dict.cart}
        email={email}
        defaults={lastContact ?? { fullName: session.name }}
      />
    </div>
  );
}
