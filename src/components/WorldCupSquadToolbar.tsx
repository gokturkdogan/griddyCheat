"use client";

import { IconSearch } from "@/components/draftinho/DraftinhoIcons";

type Props = {
  searchId: string;
  query: string;
  onQueryChange: (value: string) => void;
  recordCount?: number;
  loading?: boolean;
};

export function WorldCupSquadToolbar({
  searchId,
  query,
  onQueryChange,
  recordCount,
  loading,
}: Props) {
  return (
    <div className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
      <div className="relative min-w-0 flex-1">
        <label htmlFor={searchId} className="sr-only">
          Ülkede ara
        </label>
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-pitch-line/35">
          <IconSearch />
        </span>
        <input
          id={searchId}
          type="search"
          placeholder="Ülke ara…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full rounded-xl border border-white/[0.08] bg-[rgba(6,18,12,0.5)] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-pitch-line/35 backdrop-blur-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      </div>
      {!loading && recordCount !== undefined && (
        <span className="shrink-0 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2 text-xs font-medium tabular-nums text-pitch-line/55 sm:py-2.5">
          {recordCount} ülke
        </span>
      )}
    </div>
  );
}
