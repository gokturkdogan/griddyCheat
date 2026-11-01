"use client";

import { CountryFlag } from "@/components/CountryFlag";
import { WorldCupSquadCountryModal } from "@/components/WorldCupSquadCountryModal";
import type { WorldCupSquadCountryEntry } from "@/lib/types";
import { useState } from "react";

type Props = {
  entries: WorldCupSquadCountryEntry[];
  loading: boolean;
  emptyMessage: string;
  emptySearchMessage: string;
  hasSearchQuery: boolean;
};

export function WorldCupSquadList({
  entries,
  loading,
  emptyMessage,
  emptySearchMessage,
  hasSearchQuery,
}: Props) {
  const [selected, setSelected] = useState<WorldCupSquadCountryEntry | null>(null);

  if (loading) {
    return <p className="py-6 text-center text-sm text-pitch-line/65">Yükleniyor…</p>;
  }

  if (entries.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-pitch-line/60">
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
              className="flex w-full flex-col items-center gap-2.5 rounded-xl border border-white/10 bg-[rgba(6,18,12,0.4)] px-2 py-4 transition-colors hover:border-gold/30 hover:bg-[rgba(6,18,12,0.55)] active:scale-[0.98]"
            >
              <CountryFlag country={entry.country} size="card" />
              <span className="line-clamp-2 w-full text-center text-sm font-medium leading-snug text-white">
                {entry.country}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <WorldCupSquadCountryModal
        entry={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
