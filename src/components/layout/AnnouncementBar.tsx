// El texto se repite dos veces y la pista se desplaza -50%: así el loop del
// marquee es continuo sin JS.
export function AnnouncementBar({ text }: { text: string }) {
  const items = Array.from({ length: 4 }, (_, i) => (
    <span key={i} className="flex shrink-0 items-center gap-10 pr-10">
      {text}
      <span aria-hidden="true" className="text-gold">
        ✦
      </span>
    </span>
  ));

  return (
    <div className="overflow-hidden bg-primary py-2.5 text-[0.7rem] font-semibold tracking-[0.14em] text-primary-foreground uppercase">
      <p className="sr-only">{text}</p>
      <div
        aria-hidden="true"
        className="flex w-max animate-marquee hover:[animation-play-state:paused]"
      >
        {items}
        {items}
      </div>
    </div>
  );
}
