"use client";

import { CountryFlag } from "@/components/CountryFlag";
import { formatPlayerName, positionEmoji } from "@/lib/country-display";
import type { WorldCupSquadCountryEntry } from "@/lib/types";
import { useEffect, useId } from "react";

type Props = {
  entry: WorldCupSquadCountryEntry | null;
  onClose: () => void;
};

export function WorldCupSquadCountryModal({ entry, onClose }: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!entry) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [entry, onClose]);

  if (!entry) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        aria-label="Kapat"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[min(88vh,640px)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-pitch-dark shadow-2xl">
        <div className="relative border-b border-white/10 px-4 pb-4 pt-5 sm:px-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-pitch-line/80 hover:bg-white/10 hover:text-white sm:right-4"
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

          <div className="flex flex-col items-center gap-2 pt-1 text-center">
            <CountryFlag country={entry.country} size="modal" />
            <h2 id={titleId} className="text-lg font-semibold text-white">
              {entry.country}
            </h2>
            <p className="text-xs text-pitch-line/55">
              {entry.players.length} oyuncu
            </p>
          </div>
        </div>

        <ul className="min-h-0 flex-1 divide-y divide-white/[0.06] overflow-y-auto">
          {entry.players.map((player, i) => (
            <li
              key={`${entry.id}-${i}-${player.name}-${player.surname}`}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-sm sm:flex-nowrap sm:gap-4 sm:px-5"
            >
              <div className="flex w-full min-w-0 items-center gap-2 sm:w-[40%]">
                <span className="text-base leading-none" aria-hidden>
                  {positionEmoji(player.position)}
                </span>
                <span className="truncate text-pitch-line/80">{player.position}</span>
              </div>
              <p className="min-w-0 flex-1 font-medium text-white">
                {formatPlayerName(player.name, player.surname)}
              </p>
              <span className="shrink-0 rounded-md border border-white/10 bg-pitch-dark/40 px-2.5 py-1 text-xs font-medium tabular-nums text-gold">
                {player.age} yaş
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
