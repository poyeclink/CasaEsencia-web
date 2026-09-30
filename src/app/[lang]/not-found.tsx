import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/SectionHeading";

// not-found.tsx no recibe params: el texto va en ambos idiomas.
export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="font-serif text-8xl text-accent italic">404</p>
      <Ornament />
      <h1 className="display text-4xl">Página no encontrada · Page not found</h1>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/es" className={buttonVariants()}>
          Volver al inicio
        </Link>
        <Link href="/en" className={buttonVariants({ variant: "outline" })}>
          Back to home
        </Link>
      </div>
    </section>
  );
}
