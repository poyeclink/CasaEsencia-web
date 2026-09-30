import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { instagramPosts, instagramUrl, site } from "@/content/site";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { buttonVariants } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/SectionHeading";
import { InstagramIcon } from "@/components/layout/InstagramIcon";
import { cn } from "@/lib/utils";
import { ReelTile } from "./ReelTile";

const tileClass =
  "group relative block aspect-square overflow-hidden rounded-lg bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function InstagramFeed({ dict }: { dict: Dictionary }) {
  const t = dict.home;

  return (
    <section className="bg-secondary/70 py-24 sm:py-32">
      <div className="container-page flex flex-col gap-12 sm:gap-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">{t.instagramEyebrow}</p>
            <h2 className="display text-4xl leading-[1.1] sm:text-5xl">{t.instagramTitle}</h2>
            <Ornament className="justify-start" />
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t.instagramText}
            </p>
          </div>

          <div className="flex items-center gap-5 rounded-xl border border-border bg-card p-5 shadow-[0_20px_50px_-35px_rgb(21_50_71/0.5)] sm:p-6">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-gold via-accent to-primary p-[2px]">
              <span className="flex size-full items-center justify-center rounded-full bg-background">
                <Image src="/images/logo.svg" alt="" width={193} height={97} className="w-11" />
              </span>
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="font-semibold">casa.escencia</p>
              <p className="truncate text-sm text-muted-foreground">{t.instagramBio}</p>
            </div>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
            >
              <InstagramIcon className="size-4" />
              <span className="hidden sm:inline">{t.instagramCta}</span>
            </a>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {instagramPosts.map((post, i) => {
            const featured = i === 0;
            const image = (
              <Image
                src={`/images/instagram/${post.image}.webp`}
                alt={post.alt}
                fill
                sizes={
                  featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"
                }
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            );

            return (
              <li key={post.code} className={cn(featured && "col-span-2 row-span-2")}>
                {post.type === "reel" ? (
                  <ReelTile
                    code={post.code}
                    label={`${t.instagramWatch}: ${post.alt}`}
                    closeLabel={dict.nav.close}
                    className={cn(tileClass, "w-full")}
                  >
                    {image}
                    <span className="absolute top-3 left-3 rounded-full bg-primary/80 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.18em] text-primary-foreground uppercase backdrop-blur">
                      Reel
                    </span>
                  </ReelTile>
                ) : (
                  <a
                    href={instagramUrl(post)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t.instagramView}: ${post.alt}`}
                    className={tileClass}
                  >
                    {image}
                    <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/85 via-primary/20 to-transparent p-4 text-primary-foreground opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                      <InstagramIcon className="mb-2 size-5" />
                      <span className="line-clamp-2 text-sm">{post.alt}</span>
                    </span>
                    <ArrowUpRight className="absolute top-3 right-3 size-4 text-primary-foreground opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
