"use client";

import { DraftinhoWorldCupSeriesPanel } from "@/components/DraftinhoWorldCupSeriesPanel";
import {
  AppSegmentTabPanel,
  AppSegmentTabs,
  type AppSegmentTab,
} from "@/components/AppSegmentTabs";
import { ModPageHeader } from "@/components/ModPageHeader";
import { useId, useState } from "react";

const TABS: (AppSegmentTab & { emptyHint?: string })[] = [
  { id: "dunya-kupasi", label: "Dünya Kupası" },
  { id: "kariyer-golu", label: "Kariyer Golü", emptyHint: "Kariyer golü modu içerikleri hazırlanıyor." },
];

type TabId = (typeof TABS)[number]["id"];

export function DraftinhoClient() {
  const [active, setActive] = useState<TabId>("dunya-kupasi");
  const tabListId = useId();
  const panelPrefix = `${tabListId}-panel`;
  const activeTab = TABS.find((t) => t.id === active)!;

  return (
    <div className="mod-list-page relative mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-950/35 to-transparent"
        aria-hidden
      />

      <ModPageHeader modLabel="DRAFTINHO · MOD" title="Draftinho" />

      <div className="mb-4">
        <AppSegmentTabs
          tabs={TABS}
          activeId={active}
          onChange={(id) => setActive(id as TabId)}
          ariaLabel="Draftinho bölümü"
          variant="primary"
          appearance="simple"
          tabListId={tabListId}
          panelIdPrefix={panelPrefix}
        />
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[rgba(4,14,10,0.35)] px-3 py-4 sm:px-4 sm:py-5">
        <AppSegmentTabPanel
          id={`${panelPrefix}-dunya-kupasi`}
          labelledBy={`${tabListId}-dunya-kupasi`}
          hidden={activeTab.id !== "dunya-kupasi"}
        >
          <DraftinhoWorldCupSeriesPanel />
        </AppSegmentTabPanel>

        <AppSegmentTabPanel
          id={`${panelPrefix}-kariyer-golu`}
          labelledBy={`${tabListId}-kariyer-golu`}
          hidden={activeTab.id !== "kariyer-golu"}
        >
          <div className="py-10 text-center">
            <p className="text-sm text-pitch-line/55">{activeTab.emptyHint}</p>
          </div>
        </AppSegmentTabPanel>
      </div>
    </div>
  );
}
