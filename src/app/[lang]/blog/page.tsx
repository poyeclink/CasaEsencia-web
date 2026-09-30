import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { posts } from "@/content/posts";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { PostCard } from "@/components/shop/PostCard";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, "/blog", { title: dict.nav.blog, description: dict.blog.text });
}

export default async function BlogPage({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const [featured, ...rest] = posts;
  const content = featured.content[lang];
  const href = `/${lang}/blog/${featured.slug}`;

  return (
    <>
      <PageHero eyebrow={dict.blog.eyebrow} title={dict.blog.title} text={dict.blog.text} />

      <section className="container-page py-20 sm:py-24">
        <article className="group grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Link href={href} className="relative block aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src={featured.image}
              alt=""
              fill
              preload
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </Link>
          <div className="flex flex-col gap-5">
            <p className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="eyebrow">{content.category}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={featured.date}>{formatDate(featured.date, lang)}</time>
            </p>
            <h2 className="display text-4xl leading-tight sm:text-5xl">
              <Link href={href} className="hover:text-accent">
                {content.title}
              </Link>
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">{content.excerpt}</p>
            <Link href={href} className={`${buttonVariants({ variant: "outline" })} w-fit`}>
              {dict.common.readMore}
            </Link>
          </div>
        </article>

        <div className="mt-24 grid gap-12 border-t border-border pt-16 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} locale={lang} readMore={dict.common.readMore} />
          ))}
        </div>
      </section>
    </>
  );
}
