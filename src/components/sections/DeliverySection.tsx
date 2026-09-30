import Link from "next/link";
import { MapPin, PackageCheck, Truck } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { buttonVariants } from "@/components/ui/Button";

const icons = [MapPin, Truck, PackageCheck];

export function DeliverySection({ locale, t }: { locale: Locale; t: Dictionary["home"] }) {
  return (
    <section className="border-y border-border bg-background">
      <div className="container-page grid gap-12 py-20 lg:grid-cols-[1fr_2fr] lg:items-center">
        <div className="flex flex-col gap-4">
          <p className="eyebrow">{t.deliveryEyebrow}</p>
          <h2 className="display text-4xl">{t.deliveryTitle}</h2>
          <p className="text-muted-foreground">{t.deliveryText}</p>
          <Link href={`/${locale}/store`} className={`${buttonVariants()} mt-2 w-fit`}>
            {t.deliveryCta}
          </Link>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
          {t.deliveryItems.map((item, i) => {
            const Icon = icons[i];
            return (
              <li key={item.title} className="flex flex-col gap-4 bg-card p-8">
                <Icon className="size-7 text-accent" strokeWidth={1.25} />
                <p className="font-serif text-xl">{item.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
