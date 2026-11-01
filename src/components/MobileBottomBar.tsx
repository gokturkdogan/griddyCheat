"use client";

import {
  IconDraftinho,
  IconHedefiTuttur,
  IconHome,
  IconKariyerIkizi,
  IconSon7,
} from "@/components/tab-bar-icons";
import {
  MOBILE_APPBAR_HOME,
  MOBILE_APPBAR_LEFT,
  MOBILE_APPBAR_RIGHT,
  type NavItem,
  type TabIconId,
} from "@/lib/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function TabIcon({ id, className }: { id: TabIconId; className?: string }) {
  const map: Record<TabIconId, ReactNode> = {
    kariyer: <IconKariyerIkizi className={className} />,
    son7: <IconSon7 className={className} />,
    home: <IconHome className={className} />,
    hedef: <IconHedefiTuttur className={className} />,
    draft: <IconDraftinho className={className} />,
  };
  return map[id];
}

function MobileNavItem({ item, active }: { item: NavItem; active: boolean }) {
  const label = item.shortLabel ?? item.label;
  return (
    <Link
      href={item.href}
      className="app-mobile-tab group flex min-w-0 flex-1 flex-col items-center gap-1 px-0.5 pt-1"
      aria-current={active ? "page" : undefined}
    >
      <span
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
          active
            ? "bg-gold/20 text-gold shadow-[inset_0_0_0_1px_rgba(244,208,63,0.35)]"
            : "text-pitch-line/70 group-active:scale-95 group-active:bg-white/5"
        }`}
      >
        <TabIcon id={item.icon} className="h-[1.35rem] w-[1.35rem]" />
        {active ? (
          <span className="absolute -bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-gold" />
        ) : null}
      </span>
      <span
        className={`max-w-[4.5rem] truncate text-[10px] font-medium leading-none ${
          active ? "text-gold" : "text-pitch-line/60"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

export function MobileBottomBar() {
  const pathname = usePathname();
  const homeActive = pathname === MOBILE_APPBAR_HOME.href;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 sm:px-4 lg:hidden"
      style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom, 10px))" }}
    >
      <nav
        className="pointer-events-auto w-full max-w-[min(100%,26rem)]"
        aria-label="Mod seçimi"
      >
        <div className="app-mobile-bar relative grid grid-cols-5 items-end gap-0 rounded-2xl border border-white/[0.08] bg-pitch-dark/90 px-1.5 pb-2 pt-2 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <span
            className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
            aria-hidden
          />

          {MOBILE_APPBAR_LEFT.map((item) => (
            <MobileNavItem key={item.href} item={item} active={pathname === item.href} />
          ))}

          <div className="relative flex flex-col items-center">
            <Link
              href={MOBILE_APPBAR_HOME.href}
              className="absolute -top-6 flex flex-col items-center"
              aria-current={homeActive ? "page" : undefined}
            >
              <span
                className={`flex h-[3rem] w-[3rem] items-center justify-center rounded-full border-2 shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-transform active:scale-95 ${
                  homeActive
                    ? "border-gold bg-gold text-pitch-dark"
                    : "border-white/15 bg-pitch-mid text-gold"
                }`}
              >
                <TabIcon id="home" className="h-6 w-6" />
              </span>
            </Link>
            <span
              className={`mt-[1.85rem] text-[10px] font-semibold leading-none ${
                homeActive ? "text-gold" : "text-pitch-line/65"
              }`}
            >
              Ana
            </span>
          </div>

          {MOBILE_APPBAR_RIGHT.map((item) => (
            <MobileNavItem key={item.href} item={item} active={pathname === item.href} />
          ))}
        </div>
      </nav>
    </div>
  );
}
