import { locales } from "@/i18n/config";
import { LegalDocument, legalMetadata } from "@/components/content/LegalDocument";

const slug = "terminos-y-condiciones";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/terminos-y-condiciones">) {
  const { lang } = await params;
  return legalMetadata(lang, slug);
}

export default async function Page({ params }: PageProps<"/[lang]/terminos-y-condiciones">) {
  const { lang } = await params;
  return <LegalDocument lang={lang} slug={slug} />;
}
