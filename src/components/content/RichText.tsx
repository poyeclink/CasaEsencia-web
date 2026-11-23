import { Check } from "lucide-react";
import type { Block } from "@/content/posts";

export function RichText({ blocks }: { blocks: Block[] }) {
  return blocks.map((block, i) => {
    switch (block.type) {
      case "p":
        return <p key={i}>{block.text}</p>;
      case "h2":
        return (
          <h2 key={i} className="display pt-6 text-3xl text-foreground">
            {block.text}
          </h2>
        );
      case "quote":
        return (
          <blockquote
            key={i}
            className="display my-4 border-l-2 border-gold py-2 pl-6 text-2xl text-foreground italic sm:text-3xl"
          >
            {block.text}
          </blockquote>
        );
      case "list":
        return (
          <ul key={i} className="flex flex-col gap-3">
            {block.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-1 size-4 shrink-0 text-accent" strokeWidth={1.5} />
                {item}
              </li>
            ))}
          </ul>
        );
      case "steps":
        return (
          <ol key={i} className="grid gap-4 sm:grid-cols-2">
            {block.items.map((step, n) => (
              <li key={step.title} className="rounded-xl border border-border bg-card p-6">
                <span className="font-serif text-3xl text-accent italic">{n + 1}</span>
                <p className="mt-2 font-serif text-xl text-foreground">{step.title}</p>
                <p className="mt-1 text-base">{step.text}</p>
              </li>
            ))}
          </ol>
        );
    }
  });
}
