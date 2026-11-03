"use client";

import { ClubLogo } from "@/components/ClubLogo";
import { CountryFlag } from "@/components/CountryFlag";
import { formatPlayerName, positionEmoji } from "@/lib/country-display";
import { formatMarketValueEur } from "@/lib/format-market-value";
import type { TallestSquadPlayer, WorldCupMostGoalsPlayer, WorldCupMostPlayedPlayer, WorldCupMostValuablePlayer, WorldCupSquadCountryEntry } from "@/lib/types";
import { useEffect, useId } from "react";

type SquadModalEntry = WorldCupSquadCountryEntry | {
  id: number;
  country: string;
  players: TallestSquadPlayer[] | WorldCupMostPlayedPlayer[] | WorldCupMostGoalsPlayer[] | WorldCupMostValuablePlayer[];
};

type PlayerStat = "age" | "height" | "caps" | "goals" | "value_eur";

type Props = {
  entry: SquadModalEntry | null;
  onClose: () => void;
  playerStat?: PlayerStat;
  modalSubtitle?: string;
  headerVisual?: "country" | "club";
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

export function WorldCupSquadCountryModal({
  entry,
  onClose,
  playerStat = "age",
  modalSubtitle = "Kadro",
  headerVisual = "country",
}: Props) {
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
      className="cheat-view-modal fixed inset-0 z-[100] flex flex-col sm:items-center sm:justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="cheat-view-modal-backdrop absolute inset-0 bg-[#020806]/88 backdrop-blur-md"
        aria-label="Kapat"
        onClick={onClose}
      />

      <div className="cheat-view-modal-panel relative z-10 flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-[linear-gradient(180deg,#0a1f16_0%,#051008_100%)] shadow-2xl sm:my-auto sm:max-h-[min(92dvh,720px)] sm:flex-none sm:max-w-md sm:rounded-2xl sm:border sm:border-white/10 sm:ring-1 sm:ring-gold/10">
        <div className="relative shrink-0 overflow-hidden border-b border-white/[0.08] px-4 pb-4 pt-[max(0.65rem,env(safe-area-inset-top))] sm:pt-4">
          <div className="cheat-orbit-mesh pointer-events-none absolute inset-0 opacity-50" />
          <div className="cheat-orbit-aurora pointer-events-none absolute inset-0 opacity-30" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 top-[max(0.5rem,env(safe-area-inset-top))] z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 text-pitch-line/90 backdrop-blur-sm transition hover:border-gold/35 hover:bg-white/10 hover:text-white active:scale-95 sm:right-3 sm:top-3"
            aria-label="Kapat"
          >
            <CloseIcon />
          </button>

          <div className="relative flex flex-col items-center gap-2.5 px-8 pt-2 text-center">
            <span
              className={
                headerVisual === "club"
                  ? "inline-flex"
                  : "rounded-2xl bg-white p-2.5 shadow-md ring-1 ring-black/[0.06]"
              }
            >
              {headerVisual === "club" ? (
                <ClubLogo team={entry.country} size="modal" />
              ) : (
                <CountryFlag country={entry.country} size="modal" />
              )}
            </span>
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400/85">
                {modalSubtitle}
              </p>
              <h2 id={titleId} className="text-lg font-bold leading-snug text-white">
                {entry.country}
              </h2>
              <p className="mt-1 text-xs text-pitch-line/55">
                {entry.players.length} oyuncu
              </p>
            </div>
          </div>
        </div>

        <ul className="min-h-0 flex-1 divide-y divide-white/[0.06] overflow-y-auto overscroll-contain">
          {entry.players.map((player, i) => (
            <li
              key={`${entry.id}-${i}-${player.name}-${player.surname}`}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3.5 text-sm transition-colors hover:bg-white/[0.03] sm:flex-nowrap sm:gap-4 sm:px-5"
            >
              <div className="flex w-full min-w-0 items-center gap-2 sm:w-[38%]">
                <span className="text-base leading-none" aria-hidden>
                  {positionEmoji(player.position)}
                </span>
                <span className="truncate text-pitch-line/75">{player.position}</span>
              </div>
              <p className="min-w-0 flex-1 font-medium text-white">
                {formatPlayerName(player.name, player.surname)}
              </p>
              <span className="shrink-0 rounded-lg border border-gold/25 bg-gold/[0.08] px-2.5 py-1 text-xs font-semibold tabular-nums text-gold">
                {playerStat === "height" && "height_cm" in player
                  ? `${player.height_cm} cm`
                  : playerStat === "caps" && "caps" in player
                    ? `${player.caps} maç`
                    : playerStat === "goals" && "goals" in player
                      ? `${player.goals} gol`
                      : playerStat === "value_eur" && "value_eur" in player
                        ? formatMarketValueEur(player.value_eur)
                        : "age" in player
                        ? `${player.age} yaş`
                        : "—"}
              </span>
            </li>
          ))}
        </ul>

        <div className="shrink-0 border-t border-white/[0.06] bg-black/25 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-xl bg-gold py-3.5 text-sm font-bold text-pitch-dark shadow-lg active:scale-[0.98]"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
