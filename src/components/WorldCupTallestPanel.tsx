"use client";

import { WorldCupSquadList } from "@/components/WorldCupSquadList";
import { WorldCupSquadToolbar } from "@/components/WorldCupSquadToolbar";
import type { WorldCupTallest } from "@/lib/types";
import { titleMatchesSearch } from "@/lib/search";
import { useCallback, useEffect, useMemo, useState } from "react";

export function WorldCupTallestPanel() {
  const [all, setAll] = useState<WorldCupTallest[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/worldcup-tallest");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Liste alınamadı");
      }
      const data: WorldCupTallest[] = await res.json();
      setAll(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, []);

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
        searchId="wc-tallest-search"
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
        emptyMessage="Henüz kayıt yok. PDF seed çalıştır: npm run db:seed:worldcup-tallest-pdf"
        emptySearchMessage="Aradığın ülke bulunamadı."
        playerStat="height"
        modalSubtitle="En uzun kadro"
      />
    </section>
  );
}
