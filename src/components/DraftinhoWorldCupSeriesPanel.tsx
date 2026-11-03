"use client";

import {
  AppSegmentTabPanel,
  AppSegmentTabs,
  type AppSegmentTab,
} from "@/components/AppSegmentTabs";
import { OldestWorldCupPanel } from "@/components/OldestWorldCupPanel";
import { WorldCupShortestPanel } from "@/components/WorldCupShortestPanel";
import { WorldCupTallestPanel } from "@/components/WorldCupTallestPanel";
import { WorldCupYoungestPanel } from "@/components/WorldCupYoungestPanel";
import { useId, useState } from "react";

const WC_SUB_TABS: AppSegmentTab[] = [
  { id: "youngest-squad", label: "En genç" },
  { id: "oldest-squad", label: "En yaşlı" },
  { id: "tallest-squad", label: "En uzun" },
  { id: "shortest-squad", label: "En kısa" },
];

type WcSubTabId = (typeof WC_SUB_TABS)[number]["id"];

export function DraftinhoWorldCupSeriesPanel() {
  const [activeSub, setActiveSub] = useState<WcSubTabId>("youngest-squad");
  const subTabListId = useId();
  const panelPrefix = `${subTabListId}-panel`;

  return (
    <div>
      <div className="mb-3">
        <AppSegmentTabs
          tabs={WC_SUB_TABS}
          activeId={activeSub}
          onChange={(id) => setActiveSub(id as WcSubTabId)}
          ariaLabel="Kadro listesi"
          variant="secondary"
          appearance="simple"
          tabListId={subTabListId}
          panelIdPrefix={panelPrefix}
        />
      </div>

      <AppSegmentTabPanel
        id={`${panelPrefix}-youngest-squad`}
        labelledBy={`${subTabListId}-youngest-squad`}
        hidden={activeSub !== "youngest-squad"}
      >
        <WorldCupYoungestPanel />
      </AppSegmentTabPanel>
      <AppSegmentTabPanel
        id={`${panelPrefix}-oldest-squad`}
        labelledBy={`${subTabListId}-oldest-squad`}
        hidden={activeSub !== "oldest-squad"}
      >
        <OldestWorldCupPanel />
      </AppSegmentTabPanel>
      <AppSegmentTabPanel
        id={`${panelPrefix}-tallest-squad`}
        labelledBy={`${subTabListId}-tallest-squad`}
        hidden={activeSub !== "tallest-squad"}
      >
        <WorldCupTallestPanel />
      </AppSegmentTabPanel>
      <AppSegmentTabPanel
        id={`${panelPrefix}-shortest-squad`}
        labelledBy={`${subTabListId}-shortest-squad`}
        hidden={activeSub !== "shortest-squad"}
      >
        <WorldCupShortestPanel />
      </AppSegmentTabPanel>
    </div>
  );
}
