"use client";

import type { Cheat } from "@/lib/types";
import { useEffect, useId, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (cheat: Cheat) => void;
};

export function AddCheatModal({ open, onClose, onCreated }: Props) {
  const titleId = useId();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setTitle("");
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleClose() {
    if (submitting) return;
    resetForm();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !file) return;
    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("title", title.trim());
      form.append("image", file);
      const res = await fetch("/api/cheats", { method: "POST", body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Kayıt eklenemedi");
      }
      const created: Cheat = await res.json();
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
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-pitch-light/40 bg-pitch-dark shadow-2xl"
      >
        <div
          className="flex items-center justify-between border-b border-pitch-light/25 bg-pitch-mid/40 px-5 py-4"
        >
          <h2 id={titleId} className="text-lg font-semibold text-gold">
            Yeni kayıt ekle
          </h2>
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

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label htmlFor="cheat-title" className="mb-1.5 block text-xs font-medium text-pitch-line/70">
              Başlık
            </label>
            <input
              id="cheat-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              placeholder="Hile adı"
              className="w-full rounded-xl border border-pitch-light/40 bg-pitch-dark/90 px-3 py-2.5 text-white placeholder:text-pitch-line/35 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25"
            />
          </div>
          <div>
            <label htmlFor="cheat-image" className="mb-1.5 block text-xs font-medium text-pitch-line/70">
              Görsel
            </label>
            <input
              ref={fileInputRef}
              id="cheat-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-pitch-line/80 file:mr-3 file:rounded-lg file:border-0 file:bg-gold file:px-3 file:py-2 file:text-sm file:font-semibold file:text-pitch-dark"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-400/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
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
