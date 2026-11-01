"use client";

import {
  AppSegmentTabPanel,
  AppSegmentTabs,
  type AppSegmentTab,
} from "@/components/AppSegmentTabs";
import { OldestWorldCupPanel } from "@/components/OldestWorldCupPanel";
import { WorldCupYoungestPanel } from "@/components/WorldCupYoungestPanel";
import { useId, useState } from "react";

const WC_SUB_TABS: AppSegmentTab[] = [
  { id: "youngest-squad", label: "En genç" },
  { id: "oldest-squad", label: "En yaşlı" },
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
    </div>
  );
}
