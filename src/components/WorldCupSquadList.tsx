"use client";

import { ClubLogo } from "@/components/ClubLogo";
import { CountryFlag } from "@/components/CountryFlag";
import { WorldCupSquadCountryModal } from "@/components/WorldCupSquadCountryModal";
import type { TallestSquadPlayer, WorldCupMostGoals, WorldCupMostPlayed, WorldCupMostValuable, WorldCupSquadCountryEntry } from "@/lib/types";
import { useState } from "react";

type SquadListEntry = WorldCupSquadCountryEntry | {
  id: number;
  country: string;
  players: TallestSquadPlayer[];
} | WorldCupMostPlayed | WorldCupMostGoals | WorldCupMostValuable;

type PlayerStat = "age" | "height" | "caps" | "goals" | "value_eur";

type Props = {
  entries: SquadListEntry[];
  loading: boolean;
  emptyMessage: string;
  emptySearchMessage: string;
  hasSearchQuery: boolean;
  playerStat?: PlayerStat;
  modalSubtitle?: string;
  /** Güncel kulüp listesi: amblem; yoksa ülke bayrağı */
  tileVisual?: "country" | "club";
};

export function WorldCupSquadList({
  entries,
  loading,
  emptyMessage,
  emptySearchMessage,
  hasSearchQuery,
  playerStat = "age",
  modalSubtitle = "Kadro",
  tileVisual = "country",
}: Props) {
  const [selected, setSelected] = useState<SquadListEntry | null>(null);

  if (loading) {
    return (
      <p className="py-6 text-center text-sm text-pitch-line/55">Yükleniyor…</p>
    );
  }

  if (entries.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-pitch-line/50">
        {hasSearchQuery ? emptySearchMessage : emptyMessage}
      </p>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
        {entries.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => setSelected(entry)}
              className="draft-country-tile group w-full text-left outline-none transition duration-300 active:scale-[0.98] focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-gold/45 focus-visible:ring-offset-2 focus-visible:ring-offset-pitch-dark"
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
              <div className="relative aspect-[5/3] w-full overflow-hidden">
                <div className="cheat-orbit-mesh pointer-events-none absolute inset-0" />
                <div className="cheat-orbit-aurora pointer-events-none absolute inset-0 opacity-60" />
                <div className="cheat-orbit-grid pointer-events-none absolute inset-0 opacity-[0.2]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/[0.07] to-transparent" />
                <div className="relative flex h-full items-center justify-center p-2 sm:p-2.5">
                  {tileVisual === "club" ? (
                    <ClubLogo
                      team={entry.country}
                      size="tile"
                      className="!h-full !max-h-full !w-full !max-w-full"
                    />
                  ) : (
                    <CountryFlag
                      country={entry.country}
                      size="tile"
                      className="!h-full !max-h-full !w-full !max-w-full !rounded-md !border !border-white/20 !shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                    />
                  )}
                </div>
              </div>
              <span className="draft-country-tile-label block truncate px-2 py-2.5 text-center text-[11px] font-semibold leading-tight tracking-tight sm:text-xs">
                {entry.country}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <WorldCupSquadCountryModal
        entry={selected}
        onClose={() => setSelected(null)}
        playerStat={playerStat}
        modalSubtitle={modalSubtitle}
        headerVisual={tileVisual}
      />
    </>
  );
}
