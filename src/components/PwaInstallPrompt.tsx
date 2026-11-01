"use client";

import { Logo } from "@/components/Logo";
import { useCallback, useEffect, useState } from "react";

const DISMISS_KEY = "griddy-pwa-install-dismissed";
const DISMISS_DAYS = 10;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    // iOS Safari
    ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

function isAndroidDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /android/i.test(navigator.userAgent);
}

function wasDismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function markDismissed() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* private mode */
  }
}

export function PwaInstallPrompt() {
  const [open, setOpen] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (isStandaloneDisplay() || wasDismissedRecently()) return;
    if (!isAndroidDevice()) return;

    const onBip = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      setOpen(true);
    };

    window.addEventListener("beforeinstallprompt", onBip);

    const timer = window.setTimeout(() => {
      setOpen((prev) => {
        if (prev) return prev;
        return true;
      });
    }, 1200);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.clearTimeout(timer);
    };
  }, []);

  const close = useCallback(() => {
    markDismissed();
    setOpen(false);
  }, []);

  const onInstall = useCallback(async () => {
    if (!installEvent) {
      close();
      return;
    }
    setInstalling(true);
    try {
      await installEvent.prompt();
      const { outcome } = await installEvent.userChoice;
      if (outcome === "accepted") {
        setOpen(false);
      } else {
        markDismissed();
        setOpen(false);
      }
    } catch {
      close();
    } finally {
      setInstalling(false);
      setInstallEvent(null);
    }
  }, [installEvent, close]);

  if (!open || isStandaloneDisplay()) return null;

  const canNativeInstall = Boolean(installEvent);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#020806]/80 backdrop-blur-sm"
        aria-label="Kapat"
        onClick={close}
      />

      <div className="cheat-view-modal-panel relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,#0a1f16_0%,#051008_100%)] shadow-2xl ring-1 ring-gold/10">
        <div className="relative px-5 pb-5 pt-6">
          <div className="cheat-orbit-mesh pointer-events-none absolute inset-0 opacity-55" />
          <div className="cheat-orbit-aurora pointer-events-none absolute inset-0 opacity-35" />
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent" />

          <div className="relative flex flex-col items-center text-center">
            <div className="mb-4 rounded-2xl border border-white/10 bg-black/25 p-3 shadow-inner">
              <Logo showText={false} size="md" />
            </div>

            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
              Android uygulaması
            </p>
            <h2 id="pwa-install-title" className="text-lg font-bold text-white">
              Griddy Games&apos;i yükle
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-pitch-line/70">
              Ana ekrana ekleyerek cheat modlarına tek dokunuşla ulaş — tarayıcı
              çubuğu olmadan tam ekran açılır.
            </p>

            {!canNativeInstall && (
              <ol className="mt-4 w-full list-decimal space-y-1.5 pl-5 text-left text-xs text-pitch-line/65">
                <li>Chrome menüsünü aç (⋮)</li>
                <li>
                  <span className="text-pitch-line/85">&quot;Uygulamayı yükle&quot;</span> veya{" "}
                  <span className="text-pitch-line/85">&quot;Ana ekrana ekle&quot;</span> seç
                </li>
                <li>Onayla — logo ana ekranda görünür</li>
              </ol>
            )}

            <div className="mt-6 flex w-full flex-col gap-2.5">
              {canNativeInstall && (
                <button
                  type="button"
                  disabled={installing}
                  onClick={() => void onInstall()}
                  className="flex w-full items-center justify-center rounded-xl bg-gold py-3.5 text-sm font-bold text-pitch-dark shadow-lg transition active:scale-[0.98] disabled:opacity-70"
                >
                  {installing ? "Yükleniyor…" : "Ana ekrana ekle"}
                </button>
              )}
              <button
                type="button"
                onClick={close}
                className="w-full rounded-xl border border-white/12 bg-white/[0.04] py-3 text-sm font-semibold text-pitch-line/80 transition hover:border-white/20 hover:text-white"
              >
                Şimdi değil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
