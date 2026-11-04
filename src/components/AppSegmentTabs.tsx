"use client";

import type { ComponentType, ReactNode } from "react";
import { useEffect, useRef } from "react";

export type AppSegmentTab = {
  id: string;
  label: string;
  description?: string;
  Icon?: ComponentType<{ className?: string }>;
};

type Props = {
  tabs: AppSegmentTab[];
  activeId: string;
  onChange: (id: string) => void;
  ariaLabel: string;
  variant?: "primary" | "secondary";
  /** draftinho: yalnızca metin, ikon/açıklama yok */
  appearance?: "default" | "simple";
  tabListId: string;
  panelIdPrefix: string;
};

export function AppSegmentTabs({
  tabs,
  activeId,
  onChange,
  ariaLabel,
  variant = "primary",
  appearance = "default",
  tabListId,
  panelIdPrefix,
}: Props) {
  const isPrimary = variant === "primary";
  const isSimple = appearance === "simple";
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSimple || !trackRef.current) return;
    const active = trackRef.current.querySelector<HTMLElement>(
      '[role="tab"][aria-selected="true"]',
    );
    active?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeId, isSimple]);

  const trackClass = `app-segment-track ${
    isSimple
      ? "app-segment-track--simple"
      : isPrimary
        ? "app-segment-track--primary"
        : "app-segment-track--secondary"
  }`;

  return (
    <div className={isSimple ? "app-segment-scroll-shell" : undefined}>
      <div
        ref={trackRef}
        className={trackClass}
        role="tablist"
        id={tabListId}
        aria-label={ariaLabel}
      >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        const Icon = tab.Icon;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${tabListId}-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`${panelIdPrefix}-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`app-segment-tab ${isActive ? "app-segment-tab-active" : ""} ${
              isSimple
                ? "app-segment-tab--simple"
                : isPrimary
                  ? "app-segment-tab--primary"
                  : "app-segment-tab--secondary"
            }`}
          >
            {!isSimple && Icon ? (
              <span
                className={`app-segment-tab-icon ${isActive ? "app-segment-tab-icon-active" : ""}`}
                aria-hidden
              >
                <Icon className={isPrimary ? "h-5 w-5" : "h-4 w-4"} />
              </span>
            ) : null}
            <span
              className={`min-w-0 ${isSimple ? "text-center" : "app-segment-tab-text flex-1 text-left"}`}
            >
              <span className="app-segment-tab-label block">{tab.label}</span>
              {!isSimple && tab.description ? (
                <span className="app-segment-tab-desc block truncate">{tab.description}</span>
              ) : null}
            </span>
          </button>
        );
      })}
      </div>
    </div>
  );
}

export function AppSegmentTabPanel({
  id,
  labelledBy,
  children,
  hidden,
}: {
  id: string;
  labelledBy: string;
  children: ReactNode;
  hidden?: boolean;
}) {
  if (hidden) return null;
  return (
    <div role="tabpanel" id={id} aria-labelledby={labelledBy}>
      {children}
    </div>
  );
}
