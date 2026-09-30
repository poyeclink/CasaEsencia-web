import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/registro">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.auth.registerTitle, robots: { index: false } };
}

export default async function RegisterPage({
  params,
  searchParams,
}: PageProps<"/[lang]/registro">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : undefined;
  const dict = await getDictionary(lang);

  return (
    <AuthCard title={dict.auth.registerTitle}>
      {nextPath?.endsWith("/checkout") && (
        <p className="mb-6 rounded-md bg-secondary px-4 py-3 text-center text-sm text-secondary-foreground">
          {dict.auth.checkoutLogin}
        </p>
      )}
      <RegisterForm locale={lang} t={dict.auth} next={nextPath} />
    </AuthCard>
  );
}
