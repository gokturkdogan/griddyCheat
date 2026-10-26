"use client";

import { AddCheatModal } from "@/components/AddCheatModal";
import { CheatCard } from "@/components/CheatCard";
import { CheatImageModal } from "@/components/CheatImageModal";
import { ModPageHeader } from "@/components/ModPageHeader";
import type { Cheat } from "@/lib/types";
import { useCallback, useEffect, useMemo, useState } from "react";

type CheatsClientProps = {
  modLabel?: string;
  pageTitle?: string;
};

export function CheatsClient({
  modLabel = "SON 7 · MOD",
  pageTitle = "Son 7 Modu Hileleri",
}: CheatsClientProps) {
  const [all, setAll] = useState<Cheat[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [viewCheat, setViewCheat] = useState<Cheat | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cheats");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Liste alınamadı");
      }
      const data: Cheat[] = await res.json();
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
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((c) => c.title.toLowerCase().includes(q));
  }, [all, query]);

  return (
    <div className="mod-list-page relative mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-950/40 to-transparent"
        aria-hidden
      />

      <ModPageHeader
        modLabel={modLabel}
        title={pageTitle}
        count={loading ? undefined : filtered.length}
      />

      <div className="relative mb-5 flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <label htmlFor="search" className="sr-only">Başlıkta ara</label>
          <input
            id="search"
            type="search"
            placeholder="Başlıkta ara…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-[rgba(6,18,12,0.5)] px-3.5 py-2.5 text-sm text-white placeholder:text-pitch-line/35 backdrop-blur-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-gold text-pitch-dark shadow-md transition hover:bg-yellow-300 active:scale-[0.96]"
          aria-label="Yeni kayıt ekle"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-400/50 bg-red-950/40 px-4 py-2.5 text-sm text-red-200">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-pitch-line/60">Yükleniyor…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-pitch-line/60">
          {query ? "Aramaya uygun kayıt yok." : "Henüz kayıt yok — Yeni ekle ile başlayın."}
        </p>
      ) : (
        <ul className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {filtered.map((cheat) => (
            <li key={cheat.id}>
              <CheatCard cheat={cheat} onOpen={() => setViewCheat(cheat)} />
            </li>
          ))}
        </ul>
      )}

      <CheatImageModal cheat={viewCheat} onClose={() => setViewCheat(null)} />

      <AddCheatModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={(created) => setAll((prev) => [created, ...prev])}
      />
    </div>
  );
}
