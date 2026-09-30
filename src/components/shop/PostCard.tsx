import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/content/posts";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/lib/utils";

export function PostCard({
  post,
  locale,
  readMore,
}: {
  post: Post;
  locale: Locale;
  readMore: string;
}) {
  const content = post.content[locale];
  const href = `/${locale}/blog/${post.slug}`;

  return (
    <article className="group flex flex-col gap-5">
      <Link
        href={href}
        className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-secondary"
      >
        <Image
          src={post.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-col gap-3">
        <p className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="eyebrow">{content.category}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
        </p>
        <h3 className="display text-2xl leading-snug">
          <Link href={href} className="transition-colors hover:text-accent">
            {content.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {content.excerpt}
        </p>
        <Link
          href={href}
          className="mt-1 inline-flex w-fit items-center gap-1.5 text-xs font-semibold tracking-[0.18em] uppercase"
          aria-label={`${readMore}: ${content.title}`}
        >
          {readMore}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
