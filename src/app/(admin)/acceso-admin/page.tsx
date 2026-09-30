import Image from "next/image";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { Logo } from "@/components/layout/Logo";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <Image
          src="/images/lifestyle-vanity.webp"
          alt=""
          fill
          sizes="50vw"
          className="object-cover opacity-25"
        />
        <Logo light className="relative w-36" />
        <div className="relative flex flex-col gap-4">
          <p className="text-[0.7rem] font-semibold tracking-[0.32em] text-gold uppercase">
            Panel administrativo
          </p>
          <p className="display max-w-md text-4xl">
            Pedidos, clientes y leads de Casa Escencia en un solo lugar.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Logo className="mx-auto mb-10 w-32 lg:hidden" />
          <p className="eyebrow">Acceso restringido</p>
          <h1 className="display mt-2 mb-8 text-4xl">Iniciar sesión</h1>
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
