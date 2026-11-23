import { locales } from "@/i18n/config";
import { LegalDocument, legalMetadata } from "@/components/content/LegalDocument";

const slug = "privacy-policy";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy-policy">) {
  const { lang } = await params;
  return legalMetadata(lang, slug);
}

export default async function Page({ params }: PageProps<"/[lang]/privacy-policy">) {
  const { lang } = await params;
  return <LegalDocument lang={lang} slug={slug} />;
}
