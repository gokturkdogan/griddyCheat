"use client";

import {
  IconSquadOld,
  IconSquadYoung,
} from "@/components/draftinho/DraftinhoIcons";
import { OldestWorldCupPanel } from "@/components/OldestWorldCupPanel";
import { WorldCupYoungestPanel } from "@/components/WorldCupYoungestPanel";
import { useId, useState } from "react";

const WC_SUB_TABS = [
  {
    id: "youngest-squad",
    label: "En Genç Kadro",
    Icon: IconSquadYoung,
  },
  {
    id: "oldest-squad",
    label: "En Yaşlı Kadro",
    Icon: IconSquadOld,
  },
] as const;

type WcSubTabId = (typeof WC_SUB_TABS)[number]["id"];

export function DraftinhoWorldCupSeriesPanel() {
  const [activeSub, setActiveSub] = useState<WcSubTabId>("youngest-squad");
  const subTabListId = useId();
  const activeSubTab = WC_SUB_TABS.find((t) => t.id === activeSub)!;

  return (
    <div className="mt-5 border-t border-white/10 pt-5">
      <div
        className="mb-4 flex flex-col gap-2 sm:flex-row"
        role="tablist"
        id={subTabListId}
        aria-label="Kadro modu"
      >
        {WC_SUB_TABS.map((tab) => {
          const isActive = tab.id === activeSub;
          const Icon = tab.Icon;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${subTabListId}-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`${subTabListId}-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveSub(tab.id)}
              className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors sm:px-4 ${
                isActive
                  ? "border-gold/35 bg-gold/[0.08] text-white"
                  : "border-white/10 bg-pitch-dark/30 text-pitch-line/70 hover:border-white/15 hover:text-pitch-line"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  isActive
                    ? "bg-gold/15 text-gold"
                    : "bg-white/[0.04] text-emerald-300/80"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 text-sm font-semibold leading-snug">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${subTabListId}-panel-${activeSubTab.id}`}
        aria-labelledby={`${subTabListId}-${activeSubTab.id}`}
        className="overflow-hidden rounded-xl border border-white/10 bg-[rgba(4,14,10,0.35)]"
      >
        {activeSubTab.id === "youngest-squad" && <WorldCupYoungestPanel />}
        {activeSubTab.id === "oldest-squad" && <OldestWorldCupPanel />}
      </div>
    </div>
  );
}
