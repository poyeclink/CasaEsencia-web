import Image from "next/image";
import Link from "next/link";
import { unitPrice, type Product } from "@/content/products";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { formatCurrency } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

type Props = {
  product: Product;
  locale: Locale;
  dict: Pick<Dictionary, "cart" | "product">;
  sizes?: string;
};

export function ProductCard({
  product,
  locale,
  dict,
  sizes = "(min-width: 768px) 45vw, 100vw",
}: Props) {
  const content = product.content[locale];
  const href = `/${locale}/store/${product.slug}`;

  return (
    <article className="group flex flex-col gap-6">
      <Link
        href={href}
        className="relative block aspect-[4/5] overflow-hidden rounded-t-full bg-secondary"
        aria-label={content.name}
      >
        <Image
          src={product.image}
          alt={content.name}
          fill
          sizes={sizes}
          className="object-contain p-10 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
        />
        <Image
          src={product.hoverImage}
          alt=""
          fill
          sizes={sizes}
          className="scale-105 object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
        />
      </Link>
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="eyebrow">{content.tagline}</p>
        <h3 className="display text-3xl">
          <Link href={href} className="hover:text-accent">
            {content.name}
          </Link>
        </h3>
        <p className="text-lg tabular-nums">
          {formatCurrency(product.dozenPrice)}{" "}
          <span className="text-sm text-muted-foreground">{dict.product.perDozen}</span>
        </p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {dict.product.unitReference.replace("{price}", formatCurrency(unitPrice(product)))}
        </p>
        <AddToCartButton
          slug={product.slug}
          label={dict.cart.add}
          addedLabel={dict.cart.added}
          variant="outline"
          className="mt-3 w-full max-w-xs"
        />
      </div>
    </article>
  );
}
