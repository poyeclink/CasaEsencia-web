"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/i18n/dictionaries/es";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "ce-pwa-dismissed";
const DISMISS_DAYS = 30;

function recentlyDismissed() {
  try {
    const at = Number(localStorage.getItem(DISMISSED_KEY));
    return at > 0 && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

// iPadOS 13+ se anuncia como Mac, por eso se mira también el táctil.
function isIos() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function PwaProvider({ t }: { t: Dictionary["pwa"] }) {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [showIos, setShowIos] = useState(false);

  useEffect(() => {
    // Sin SW en desarrollo: cachearía assets de Turbopack y confunde al depurar.
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch(() => {});
    }

    if (isStandalone() || recentlyDismissed()) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallEvent);
    };
    const onInstalled = () => setInstallEvent(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    // eslint-disable-next-line react-hooks/set-state-in-effect -- detectar iOS solo es posible tras el montaje
    if (isIos()) setShowIos(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {}
    setInstallEvent(null);
    setShowIos(false);
  }

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  if (!installEvent && !showIos) return null;

  return (
    <aside
      role="dialog"
      aria-label={t.installTitle}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-start gap-4 rounded-xl bg-primary p-4 text-primary-foreground shadow-2xl animate-fade-up"
    >
      <Image
        src="/icons/icon-192.png"
        alt=""
        width={48}
        height={48}
        className="size-12 shrink-0 rounded-lg"
      />
      <div className="flex flex-1 flex-col gap-3">
        <div>
          <p className="font-serif text-lg leading-tight">{t.installTitle}</p>
          <p className="mt-1 text-xs leading-relaxed text-primary-foreground/75">
            {installEvent ? t.installText : t.iosText}
          </p>
        </div>
        {installEvent && (
          <div className="flex gap-2">
            <Button type="button" variant="light" size="sm" onClick={install}>
              {t.install}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={dismiss}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              {t.dismiss}
            </Button>
          </div>
        )}
      </div>
      {!installEvent && (
        <button
          type="button"
          onClick={dismiss}
          aria-label={t.dismiss}
          className="-m-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-primary-foreground/10"
        >
          <X className="size-4" />
        </button>
      )}
    </aside>
  );
}
