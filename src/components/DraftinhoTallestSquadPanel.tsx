"use client";

import { TallestSquadPanel } from "@/components/TallestSquadPanel";
import {
  AppSegmentTabPanel,
  AppSegmentTabs,
  type AppSegmentTab,
} from "@/components/AppSegmentTabs";
import type { TallestSquadEra } from "@/lib/types";
import { useId, useState } from "react";

const TALLEST_SUB_TABS: (AppSegmentTab & { era: TallestSquadEra })[] = [
  { id: "current", label: "Güncel", era: "current" },
  { id: "all-time", label: "Tüm zamanlar", era: "all_time" },
];

type TallestSubTabId = (typeof TALLEST_SUB_TABS)[number]["id"];

export function DraftinhoTallestSquadPanel() {
  const [activeSub, setActiveSub] = useState<TallestSubTabId>("current");
  const subTabListId = useId();
  const panelPrefix = `${subTabListId}-panel`;

  return (
    <div>
      <div className="mb-3">
        <AppSegmentTabs
          tabs={TALLEST_SUB_TABS}
          activeId={activeSub}
          onChange={(id) => setActiveSub(id as TallestSubTabId)}
          ariaLabel="En uzun kadro dönemi"
          variant="secondary"
          appearance="simple"
          tabListId={subTabListId}
          panelIdPrefix={panelPrefix}
        />
      </div>

      {TALLEST_SUB_TABS.map((tab) => (
        <AppSegmentTabPanel
          key={tab.id}
          id={`${panelPrefix}-${tab.id}`}
          labelledBy={`${subTabListId}-${tab.id}`}
          hidden={activeSub !== tab.id}
        >
          <TallestSquadPanel era={tab.era} searchId={`tallest-squad-${tab.id}`} />
        </AppSegmentTabPanel>
      ))}
    </div>
  );
}
