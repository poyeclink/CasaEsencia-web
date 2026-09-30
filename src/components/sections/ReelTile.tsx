"use client";

import { useRef, useState } from "react";
import { Play, X } from "lucide-react";

type Props = {
  code: string;
  label: string;
  closeLabel: string;
  className?: string;
  children: React.ReactNode;
};

// Fachada: la miniatura es una imagen local y el iframe de Instagram (pesado)
// solo se monta cuando se abre el reel.
export function ReelTile({ code, label, closeLabel, className, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  function show() {
    setOpen(true);
    ref.current?.showModal();
  }

  return (
    <>
      <button type="button" onClick={show} aria-label={label} className={className}>
        {children}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-background/90 text-primary shadow-lg backdrop-blur transition-transform duration-500 group-hover:scale-110">
            <Play className="ml-0.5 size-5 fill-current" />
          </span>
        </span>
      </button>
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === ref.current) ref.current.close();
        }}
        aria-label={label}
        className="m-auto w-[min(92vw,400px)] overflow-visible bg-transparent p-0 backdrop:bg-primary/70 backdrop:backdrop-blur-sm"
      >
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label={closeLabel}
          className="absolute -top-12 right-0 flex size-10 items-center justify-center rounded-full bg-background text-primary"
        >
          <X className="size-5" />
        </button>
        <div className="h-[min(80vh,720px)] overflow-hidden rounded-xl bg-card">
          {open && (
            <iframe
              src={`https://www.instagram.com/reel/${code}/embed/`}
              title={label}
              allow="autoplay; encrypted-media; picture-in-picture; web-share"
              className="h-[calc(100%+110px)] w-full border-0"
            />
          )}
        </div>
      </dialog>
    </>
  );
}
