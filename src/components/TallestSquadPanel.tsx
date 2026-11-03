"use client";

import { WorldCupSquadList } from "@/components/WorldCupSquadList";
import { WorldCupSquadToolbar } from "@/components/WorldCupSquadToolbar";
import type {
  TallestCurrent,
  TallestSquad,
  TallestSquadCountryEntry,
  TallestSquadEra,
} from "@/lib/types";
import { titleMatchesSearch } from "@/lib/search";
import { useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  era: TallestSquadEra;
  searchId: string;
};

export function TallestSquadPanel({ era, searchId }: Props) {
  const [all, setAll] = useState<TallestSquadCountryEntry[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        era === "current"
          ? "/api/tallest-current"
          : `/api/tallestsquad?era=${encodeURIComponent(era)}`;
      const res = await fetch(endpoint);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Liste alınamadı");
      }

      if (era === "current") {
        const data: TallestCurrent[] = await res.json();
        setAll(
          data.map((row) => ({
            id: row.id,
            country: row.team,
            players: row.players,
          })),
        );
      } else {
        const data: TallestSquad[] = await res.json();
        setAll(
          data.map((row) => ({
            id: row.id,
            country: row.country,
            players: row.players,
          })),
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [era]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return all;
    return all.filter((entry) => titleMatchesSearch(entry.country, q));
  }, [all, query]);

  return (
    <section className="pt-0.5">
      <WorldCupSquadToolbar
        searchId={searchId}
        query={query}
        onQueryChange={setQuery}
        recordCount={filtered.length}
        loading={loading}
      />

      {error && (
        <p className="mb-4 rounded-lg border border-red-400/50 bg-red-950/40 px-4 py-2.5 text-sm text-red-200">
          {error}
        </p>
      )}

      <WorldCupSquadList
        entries={filtered}
        loading={loading}
        hasSearchQuery={Boolean(query.trim())}
        emptyMessage={
          era === "current" ? "Henüz takım eklenmedi." : "Henüz kayıt yok."
        }
        emptySearchMessage={
          era === "current" ? "Aradığın takım bulunamadı." : "Aradığın ülke bulunamadı."
        }
        playerStat="height"
        modalSubtitle="En uzun kadro"
        tileVisual={era === "current" ? "club" : "country"}
      />
    </section>
  );
}
