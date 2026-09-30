import Link from "next/link";
import { posts } from "@/content/posts";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { buttonVariants } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard } from "@/components/shop/PostCard";

export function BlogSection({
  locale,
  dict,
  excludeSlug,
}: {
  locale: Locale;
  dict: Dictionary;
  excludeSlug?: string;
}) {
  const latest = posts.filter((post) => post.slug !== excludeSlug).slice(0, 3);

  return (
    <section className="container-page flex flex-col gap-14 py-24 sm:py-32">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeading
          eyebrow={dict.home.blogEyebrow}
          title={dict.home.blogTitle}
          text={dict.home.blogText}
        />
        <Link
          href={`/${locale}/blog`}
          className={`${buttonVariants({ variant: "outline" })} shrink-0 self-start md:self-auto`}
        >
          {dict.common.readBlog}
        </Link>
      </div>
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {latest.map((post) => (
          <PostCard key={post.slug} post={post} locale={locale} readMore={dict.common.readMore} />
        ))}
      </div>
    </section>
  );
}
