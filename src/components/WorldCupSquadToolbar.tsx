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
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <label htmlFor={searchId} className="sr-only">
          Ülkede ara
        </label>
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-pitch-line/40">
          <IconSearch />
        </span>
        <input
          id={searchId}
          type="search"
          placeholder="Ülke ara…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-pitch-dark/40 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-pitch-line/40 focus:border-gold/45 focus:outline-none focus:ring-2 focus:ring-gold/15"
        />
      </div>
      {!loading && recordCount !== undefined && (
        <span className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs text-pitch-line/60 sm:py-2.5">
          {recordCount} ülke
        </span>
      )}
    </div>
  );
}
