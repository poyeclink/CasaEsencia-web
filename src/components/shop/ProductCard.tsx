import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/content/products";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { buttonVariants } from "@/components/ui/Button";

type CardProps = {
  href: string;
  name: string;
  tagline: string;
  image: string;
  hoverImage?: string;
  sizes?: string;
  ideal?: { label: string; items: string[] };
  note?: string;
  cta: { label: string; href: string };
  details?: { label: string; href: string };
};

export function CollectionCard({
  href,
  name,
  tagline,
  image,
  hoverImage,
  sizes = "(min-width: 768px) 45vw, 100vw",
  ideal,
  note,
  cta,
  details,
}: CardProps) {
  return (
    <article className="group flex flex-col gap-6">
      <Link
        href={href}
        className="relative block aspect-[4/5] overflow-hidden rounded-t-full bg-secondary"
        aria-label={name}
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes={sizes}
          className={
            hoverImage
              ? "object-contain p-10 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
              : "object-contain p-10 transition-transform duration-700 ease-out group-hover:scale-105"
          }
        />
        {hoverImage && (
          <Image
            src={hoverImage}
            alt=""
            fill
            sizes={sizes}
            className="scale-105 object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
          />
        )}
      </Link>
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="eyebrow">{tagline}</p>
        <h3 className="display text-3xl">
          <Link href={href} className="hover:text-accent">
            {name}
          </Link>
        </h3>
        {ideal && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">{ideal.label}:</span> {ideal.items.join(" · ")}
          </p>
        )}
        {note && <p className="text-xs text-muted-foreground">{note}</p>}
        <Link
          href={cta.href}
          className={`${buttonVariants({ variant: "outline" })} mt-3 w-full max-w-xs`}
        >
          {cta.label}
        </Link>
        {details && (
          <Link
            href={details.href}
            className="text-xs font-semibold tracking-[0.18em] text-accent uppercase underline-offset-8 hover:underline"
          >
            {details.label} →
          </Link>
        )}
      </div>
    </article>
  );
}

type Props = {
  product: Product;
  locale: Locale;
  dict: Pick<Dictionary, "common" | "store">;
  sizes?: string;
  wholesale?: boolean;
};

export function ProductCard({ product, locale, dict, sizes, wholesale = false }: Props) {
  const href = `/${locale}/wholesale/${product.slug}`;
  const content = product.content[locale];

  return (
    <CollectionCard
      href={href}
      name={content.name}
      tagline={content.tagline}
      image={product.image}
      hoverImage={product.hoverImage}
      sizes={sizes}
      ideal={
        wholesale
          ? {
              label: dict.store.idealFor,
              items: dict.store.ideal[product.slug as keyof typeof dict.store.ideal],
            }
          : undefined
      }
      note={wholesale ? dict.store.tierLine : undefined}
      cta={{ label: dict.common.requestQuote, href: `/${locale}#cotizar` }}
      details={wholesale ? { label: dict.store.details, href } : undefined}
    />
  );
}
