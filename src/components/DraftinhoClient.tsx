"use client";

import { DraftinhoWorldCupSeriesPanel } from "@/components/DraftinhoWorldCupSeriesPanel";
import {
  IconDraftinhoCareerGoal,
  IconDraftinhoWorldCup,
} from "@/components/draftinho/DraftinhoIcons";
import { ModPageHeader } from "@/components/ModPageHeader";
import { useId, useState } from "react";

const TABS = [
  {
    id: "dunya-kupasi",
    label: "Dünya Kupası Serisi",
    Icon: IconDraftinhoWorldCup,
  },
  {
    id: "kariyer-golu",
    label: "Kariyer Golü",
    emptyHint: "Kariyer golü modu içerikleri hazırlanıyor.",
    Icon: IconDraftinhoCareerGoal,
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function DraftinhoClient() {
  const [active, setActive] = useState<TabId>("dunya-kupasi");
  const tabListId = useId();
  const activeTab = TABS.find((t) => t.id === active)!;

  return (
    <div className="mod-list-page relative mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-950/35 to-transparent"
        aria-hidden
      />

      <ModPageHeader modLabel="DRAFTINHO · MOD" title="Draftinho" />

      <div
        className="mb-5 flex flex-col gap-2 sm:flex-row"
        role="tablist"
        id={tabListId}
        aria-label="Draftinho modları"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          const Icon = tab.Icon;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${tabListId}-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`${tabListId}-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={`flex flex-1 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                isActive
                  ? "border-gold/40 bg-[rgba(6,18,12,0.65)] text-white shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                  : "border-white/10 bg-[rgba(4,14,10,0.35)] text-pitch-line/65 hover:border-white/15"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  isActive
                    ? "bg-gold/15 text-gold"
                    : "bg-white/[0.04] text-emerald-300/75"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 text-sm font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${tabListId}-panel-${activeTab.id}`}
        aria-labelledby={`${tabListId}-${activeTab.id}`}
        className="rounded-xl border border-white/10 bg-[rgba(6,18,12,0.45)] px-4 py-5 sm:px-5 sm:py-6"
      >
        <header className="mb-4 flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 text-gold"
            aria-hidden
          >
            <activeTab.Icon className="h-5 w-5" />
          </span>
          <h2 className="text-lg font-bold text-white">{activeTab.label}</h2>
        </header>

        {activeTab.id === "dunya-kupasi" ? (
          <DraftinhoWorldCupSeriesPanel />
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-white/15 bg-pitch-dark/30 px-4 py-10 text-center">
            <p className="text-sm text-pitch-line/55">{activeTab.emptyHint}</p>
          </div>
        )}
      </div>
    </div>
  );
}
