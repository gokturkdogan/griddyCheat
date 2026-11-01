"use client";

import type { WorldCupYoungest, WorldCupYoungestPlayer } from "@/lib/types";
import { useEffect, useId, useState } from "react";

type PlayerRow = {
  key: string;
  position: string;
  age: string;
  name: string;
  surname: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (entry: WorldCupYoungest) => void;
};

function emptyPlayer(): PlayerRow {
  return {
    key: crypto.randomUUID(),
    position: "",
    age: "",
    name: "",
    surname: "",
  };
}

function rowsToPlayers(rows: PlayerRow[]): WorldCupYoungestPlayer[] | null {
  const players: WorldCupYoungestPlayer[] = [];
  for (const row of rows) {
    const position = row.position.trim();
    const name = row.name.trim();
    const surname = row.surname.trim();
    const age = Number(row.age);
    if (!position || !name || !surname || !Number.isFinite(age) || age < 0) {
      return null;
    }
    players.push({
      position,
      name,
      surname,
      age: Math.round(age),
    });
  }
  return players.length > 0 ? players : null;
}

export function AddWorldCupYoungestModal({ open, onClose, onCreated }: Props) {
  const titleId = useId();
  const [country, setCountry] = useState("");
  const [playerRows, setPlayerRows] = useState<PlayerRow[]>([emptyPlayer()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, submitting]);

  function resetForm() {
    setCountry("");
    setPlayerRows([emptyPlayer()]);
    setError(null);
  }

  function handleClose() {
    if (submitting) return;
    resetForm();
    onClose();
  }

  function updateRow(key: string, patch: Partial<Omit<PlayerRow, "key">>) {
    setPlayerRows((prev) =>
      prev.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  }

  function removeRow(key: string) {
    setPlayerRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((row) => row.key !== key);
    });
  }

  function addRow() {
    setPlayerRows((prev) => [...prev, emptyPlayer()]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedCountry = country.trim();
    const players = rowsToPlayers(playerRows);
    if (!trimmedCountry || !players) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/worldcup-youngest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: trimmedCountry, players }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Kayıt eklenemedi");
      }
      const created: WorldCupYoungest = await res.json();
      onCreated(created);
      resetForm();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

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
        onClick={handleClose}
      />
      <div
        className="relative z-10 flex max-h-[min(90vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-pitch-light/40 bg-pitch-dark shadow-2xl"
      >
        <div
          className="flex shrink-0 items-center justify-between border-b border-pitch-light/25 bg-pitch-mid/40 px-5 py-4"
        >
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-gold">
              En Genç Dünya Kupası Kadrosu
            </h2>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-pitch-line/50">
              worldcupyoungest
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-pitch-line/80 hover:bg-pitch-light/20 hover:text-white disabled:opacity-40"
            aria-label="Modalı kapat"
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

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
            <div>
              <label
                htmlFor="wc-country"
                className="mb-1.5 block text-xs font-medium text-pitch-line/70"
              >
                Ülke
              </label>
              <input
                id="wc-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                autoFocus
                placeholder="Örn. İspanya"
                className="w-full rounded-xl border border-pitch-light/40 bg-pitch-dark/90 px-3 py-2.5 text-white placeholder:text-pitch-line/35 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-pitch-line/70">Oyuncular</span>
                <button
                  type="button"
                  onClick={addRow}
                  className="rounded-lg border border-pitch-light/30 px-2.5 py-1 text-xs font-medium text-gold hover:bg-pitch-light/10"
                >
                  + Oyuncu
                </button>
              </div>

              <ul className="space-y-3">
                {playerRows.map((row, index) => (
                  <li
                    key={row.key}
                    className="rounded-xl border border-pitch-light/25 bg-pitch-dark/60 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-pitch-line/45">
                        #{index + 1}
                      </span>
                      {playerRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(row.key)}
                          className="text-xs text-red-300/80 hover:text-red-200"
                        >
                          Kaldır
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="mb-1 block text-[10px] text-pitch-line/50">
                          Pozisyon
                        </label>
                        <input
                          value={row.position}
                          onChange={(e) =>
                            updateRow(row.key, { position: e.target.value })
                          }
                          required
                          placeholder="ST"
                          className="w-full rounded-lg border border-pitch-light/35 bg-pitch-dark/90 px-2.5 py-2 text-sm text-white placeholder:text-pitch-line/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/25"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] text-pitch-line/50">
                          Yaş
                        </label>
                        <input
                          value={row.age}
                          onChange={(e) => updateRow(row.key, { age: e.target.value })}
                          required
                          type="number"
                          min={0}
                          placeholder="19"
                          className="w-full rounded-lg border border-pitch-light/35 bg-pitch-dark/90 px-2.5 py-2 text-sm text-white placeholder:text-pitch-line/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/25"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] text-pitch-line/50">
                          Ad
                        </label>
                        <input
                          value={row.name}
                          onChange={(e) => updateRow(row.key, { name: e.target.value })}
                          required
                          className="w-full rounded-lg border border-pitch-light/35 bg-pitch-dark/90 px-2.5 py-2 text-sm text-white placeholder:text-pitch-line/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/25"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] text-pitch-line/50">
                          Soyad
                        </label>
                        <input
                          value={row.surname}
                          onChange={(e) =>
                            updateRow(row.key, { surname: e.target.value })
                          }
                          required
                          className="w-full rounded-lg border border-pitch-light/35 bg-pitch-dark/90 px-2.5 py-2 text-sm text-white placeholder:text-pitch-line/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/25"
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {error && (
              <p className="rounded-lg border border-red-400/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}
          </div>

          <div className="flex shrink-0 gap-3 border-t border-pitch-light/20 p-5">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 rounded-xl border border-pitch-light/35 px-4 py-2.5 text-sm font-medium text-pitch-line/90 hover:bg-pitch-light/15 disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-pitch-dark disabled:opacity-50"
            >
              {submitting ? "Kaydediliyor…" : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
