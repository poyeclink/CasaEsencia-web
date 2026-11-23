import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLegalPage } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { Ornament } from "@/components/ui/SectionHeading";
import { RichText } from "./RichText";

export function legalMetadata(lang: string, slug: string) {
  const content = hasLocale(lang) ? getLegalPage(slug)?.content[lang] : undefined;
  if (!hasLocale(lang) || !content) return {};
  return pageMetadata(lang, `/${slug}`, { title: content.title, description: content.description });
}

export async function LegalDocument({ lang, slug }: { lang: string; slug: string }) {
  const page = getLegalPage(slug);
  if (!hasLocale(lang) || !page) notFound();
  const dict = await getDictionary(lang);
  const content = page.content[lang];

  return (
    <article className="container-page">
      <header className="flex flex-col items-center gap-6 pt-14 pb-10 text-center sm:pt-20">
        <h1 className="display text-4xl leading-[1.1] sm:text-6xl">{content.title}</h1>
        <Ornament />
        <p className="text-xs text-muted-foreground">
          {dict.common.lastUpdated}:{" "}
          <time dateTime={page.updated}>{formatDate(page.updated, lang)}</time>
        </p>
      </header>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 pb-16 text-lg leading-relaxed text-muted-foreground sm:pb-24">
        <RichText blocks={content.body} />
      </div>
    </article>
  );
}
