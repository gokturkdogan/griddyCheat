"use client";

import type { Cheat } from "@/lib/types";
import Image from "next/image";
import { useEffect } from "react";

type Props = {
  cheat: Cheat | null;
  onClose: () => void;
};

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

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={cheat.title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        aria-label="Kapat"
        onClick={onClose}
      />
      <div className="relative z-10 flex w-full max-w-3xl max-h-[min(90dvh,900px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-pitch-dark shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
          <h2
            className="min-w-0 flex-1 break-words pr-1 text-sm font-semibold leading-snug text-gold sm:text-base"
          >
            {cheat.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-pitch-line/80 hover:bg-white/10 hover:text-white"
            aria-label="Kapat"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="relative flex min-h-[200px] flex-1 items-center justify-center bg-black/40 p-3 sm:p-5">
          <div className="relative h-[min(75dvh,780px)] w-full max-w-full">
            <Image
              src={cheat.image_url}
              alt={cheat.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 768px"
              unoptimized={unoptimized}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
