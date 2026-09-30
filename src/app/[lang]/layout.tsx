import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { nunito, playfair } from "../fonts";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { PwaProvider } from "@/components/pwa/PwaProvider";

export const viewport: Viewport = {
  themeColor: "#153247",
  viewportFit: "cover",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.title, template: `%s · ${site.name}` },
    description: dict.meta.description,
    applicationName: site.name,
    appleWebApp: { capable: true, title: site.name, statusBarStyle: "default" },
    formatDetection: { telephone: false },
    openGraph: {
      siteName: site.name,
      locale: lang === "es" ? "es_SV" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className={`${playfair.variable} ${nunito.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {dict.nav.skipToContent}
        </a>
        <CartProvider>
          <AnnouncementBar text={dict.announcement} />
          <Header locale={lang} dict={dict} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer locale={lang} dict={dict} />
          <CartDrawer locale={lang} t={dict.cart} />
          <PwaProvider t={dict.pwa} />
        </CartProvider>
      </body>
    </html>
  );
}
