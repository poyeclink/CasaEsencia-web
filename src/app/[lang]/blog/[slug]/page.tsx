import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getPost, posts, type Post } from "@/content/posts";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { Ornament } from "@/components/ui/SectionHeading";
import { BlogSection } from "@/components/sections/BlogSection";
import { ClosingCta } from "@/components/sections/ClosingCta";

export function generateStaticParams() {
  return locales.flatMap((lang) => posts.map((post) => ({ lang, slug: post.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  const post = getPost(slug);
  if (!hasLocale(lang) || !post) return {};
  const content = post.content[lang];
  return pageMetadata(lang, `/blog/${slug}`, {
    title: content.title,
    description: content.excerpt,
    image: post.image,
  });
}

function Body({ blocks }: { blocks: Post["content"]["es"]["body"] }) {
  return blocks.map((block, i) => {
    switch (block.type) {
      case "p":
        return <p key={i}>{block.text}</p>;
      case "h2":
        return (
          <h2 key={i} className="display pt-6 text-3xl text-foreground">
            {block.text}
          </h2>
        );
      case "quote":
        return (
          <blockquote
            key={i}
            className="display my-4 border-l-2 border-gold py-2 pl-6 text-2xl text-foreground italic sm:text-3xl"
          >
            {block.text}
          </blockquote>
        );
      case "list":
        return (
          <ul key={i} className="flex flex-col gap-3">
            {block.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-1 size-4 shrink-0 text-accent" strokeWidth={1.5} />
                {item}
              </li>
            ))}
          </ul>
        );
      case "steps":
        return (
          <ol key={i} className="grid gap-4 sm:grid-cols-2">
            {block.items.map((step, n) => (
              <li key={step.title} className="rounded-xl border border-border bg-card p-6">
                <span className="font-serif text-3xl text-accent italic">{n + 1}</span>
                <p className="mt-2 font-serif text-xl text-foreground">{step.title}</p>
                <p className="mt-1 text-base">{step.text}</p>
              </li>
            ))}
          </ol>
        );
    }
  });
}

export default async function PostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  const post = getPost(slug);
  if (!hasLocale(lang) || !post) notFound();
  const dict = await getDictionary(lang);
  const content = post.content[lang];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: content.title,
    description: content.excerpt,
    datePublished: post.date,
    image: `${site.url}${post.image}`,
    inLanguage: lang,
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <article>
        <header className="container-page flex flex-col items-center gap-6 pt-14 pb-12 text-center sm:pt-20">
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> {dict.common.backToBlog}
          </Link>
          <p className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="eyebrow">{content.category}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
            <span aria-hidden="true">·</span>
            <span>
              {post.readingMinutes} {dict.blog.minRead}
            </span>
          </p>
          <h1 className="display max-w-4xl text-4xl leading-[1.1] sm:text-6xl">{content.title}</h1>
          <Ornament />
        </header>
        <div className="container-page">
          <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-xl bg-secondary">
            <Image
              src={post.image}
              alt=""
              fill
              preload
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="container-page">
          <div className="mx-auto flex max-w-2xl flex-col gap-6 py-16 text-lg leading-relaxed text-muted-foreground sm:py-20">
            <Body blocks={content.body} />
          </div>
        </div>
      </article>
      <BlogSection locale={lang} dict={dict} excludeSlug={slug} />
      <ClosingCta locale={lang} dict={dict} />
    </>
  );
}
