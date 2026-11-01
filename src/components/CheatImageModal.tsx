"use client";

import { CheatTwinCover } from "@/components/CheatTwinCover";
import {
  cheatTitleFlagCode,
  cheatTitleFlagImageUrl,
} from "@/lib/cheat-title-flag";
import { cheatTitleLeagueLogoUrl } from "@/lib/cheat-title-league";
import type { Cheat } from "@/lib/types";
import Image from "next/image";
import { useEffect } from "react";

type Props = {
  cheat: Cheat | null;
  onClose: () => void;
};

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CheatImageModal({ cheat, onClose }: Props) {
  useEffect(() => {
    if (!cheat) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cheat, onClose]);

  if (!cheat) return null;

  const unoptimized =
    cheat.image_url.startsWith("/uploads/") ||
    cheat.image_url.includes("res.cloudinary.com");

  const flagSrc = cheatTitleFlagImageUrl(cheatTitleFlagCode(cheat.title));
  const leagueLogoUrl = cheatTitleLeagueLogoUrl(cheat.title);

  return (
    <div
      className="cheat-view-modal fixed inset-0 z-[110] flex flex-col sm:items-center sm:justify-center sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cheat-modal-title"
    >
      <button
        type="button"
        className="cheat-view-modal-backdrop absolute inset-0 bg-[#020806]/88 backdrop-blur-md"
        aria-label="Kapat"
        onClick={onClose}
      />

      <div className="cheat-view-modal-panel relative z-10 flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-[linear-gradient(180deg,#0a1f16_0%,#051008_100%)] shadow-2xl sm:my-auto sm:max-h-[min(92dvh,880px)] sm:flex-none sm:rounded-2xl sm:border sm:border-white/10 sm:ring-1 sm:ring-gold/10">
        <div className="cheat-view-modal-header relative shrink-0 overflow-hidden border-b border-white/[0.08] px-3 pb-3 pt-[max(0.65rem,env(safe-area-inset-top))] sm:px-5 sm:pb-4 sm:pt-4">
          <div className="cheat-orbit-mesh pointer-events-none absolute inset-0 opacity-60" />
          <div className="cheat-orbit-aurora pointer-events-none absolute inset-0 opacity-40" />
          <span
            className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent"
            aria-hidden
          />

          <div className="relative flex items-start gap-3">
            <div className="cheat-view-modal-cover-wrap shrink-0 rounded-xl p-0.5 ring-1 ring-gold/25 shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
              <CheatTwinCover
                leagueLogoUrl={leagueLogoUrl}
                flagSrc={flagSrc}
                compact
                className="h-[4.25rem] w-[4.25rem] rounded-[10px] sm:h-[4.75rem] sm:w-[4.75rem]"
              />
            </div>

            <div className="min-w-0 flex-1 pt-0.5 pr-11 sm:pr-0">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
                Son 7
              </p>
              <h2
                id="cheat-modal-title"
                className="line-clamp-4 break-words text-sm font-bold leading-snug text-white sm:line-clamp-3 sm:text-base"
              >
                {cheat.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 text-pitch-line/90 shadow-lg backdrop-blur-sm transition hover:border-gold/35 hover:bg-white/10 hover:text-white active:scale-95 sm:relative sm:h-10 sm:w-10 sm:shrink-0 sm:self-start"
              aria-label="Kapat"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="cheat-view-modal-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 sm:px-4 sm:py-4">
            <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-white/[0.06] bg-black/40 ring-1 ring-white/[0.04] sm:rounded-2xl">
              <div className="relative aspect-[3/4] w-full min-h-[45dvh] sm:min-h-[320px] sm:aspect-auto sm:h-[min(58dvh,640px)]">
                <Image
                  src={cheat.image_url}
                  alt={cheat.title}
                  fill
                  className="object-contain p-1 sm:p-2"
                  sizes="(max-width: 640px) 100vw, 672px"
                  unoptimized={unoptimized}
                  priority
                />
              </div>
            </div>
          </div>

          <div className="cheat-view-modal-footer shrink-0 border-t border-white/[0.06] bg-black/25 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
            <button
              type="button"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-bold text-pitch-dark shadow-lg active:scale-[0.98]"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
