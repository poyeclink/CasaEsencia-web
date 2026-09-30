import Image from "next/image";

export function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container-page grid min-h-[75vh] items-center gap-12 py-16 lg:grid-cols-2">
      <div className="relative mx-auto hidden aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-full lg:block">
        <Image
          src="/images/lifestyle-vanity.webp"
          alt=""
          fill
          sizes="28rem"
          className="object-cover"
        />
      </div>
      <div className="mx-auto w-full max-w-sm">
        <h1 className="display mb-8 text-center text-4xl">{title}</h1>
        {children}
      </div>
    </div>
  );
}
