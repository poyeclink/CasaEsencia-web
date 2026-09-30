import Image from "next/image";
import { Ornament } from "@/components/ui/SectionHeading";

type Props = {
  eyebrow: string;
  title: string;
  text?: string;
  image?: string;
};

export function PageHero({ eyebrow, title, text, image }: Props) {
  if (!image) {
    return (
      <section className="border-b border-border bg-secondary/60">
        <div className="container-page flex flex-col items-center gap-6 py-20 text-center sm:py-28">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display max-w-4xl text-5xl leading-[1.05] sm:text-6xl">{title}</h1>
          <Ornament />
          {text && (
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{text}</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
      <Image src={image} alt="" fill preload sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/90 via-primary/60 to-primary/20" />
      <div className="container-page flex min-h-[26rem] flex-col justify-center gap-6 py-20 sm:min-h-[32rem]">
        <p className="eyebrow text-gold">{eyebrow}</p>
        <h1 className="display max-w-3xl text-5xl leading-[1.05] sm:text-6xl">{title}</h1>
        {text && (
          <p className="max-w-xl text-lg leading-relaxed text-primary-foreground/80">{text}</p>
        )}
      </div>
    </section>
  );
}
