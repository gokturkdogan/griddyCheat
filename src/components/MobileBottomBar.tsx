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

function SideTab({ item, active }: { item: NavItem; active: boolean }) {
  const label = item.shortLabel ?? item.label;
  return (
    <Link
      href={item.href}
      className="group flex min-w-0 flex-1 flex-col items-center gap-1.5 px-1 py-1"
      aria-current={active ? "page" : undefined}
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
          active
            ? "bg-gold/25 text-gold shadow-[inset_0_0_0_1px_rgba(244,208,63,0.45)]"
            : "text-pitch-line/70 group-active:scale-95 group-active:bg-white/5"
        }`}
      >
        <TabIcon id={item.icon} className="h-[22px] w-[22px]" />
      </span>
      <span
        className={`max-w-[5.25rem] truncate text-[11px] font-medium leading-none ${
          active ? "text-gold" : "text-pitch-line/65"
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
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-2.5 sm:px-4 lg:hidden"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))" }}
    >
      <nav
        className="pointer-events-auto relative w-full max-w-[min(100%,28rem)]"
        aria-label="Mobil alt menü"
      >
        <div
          className="relative grid grid-cols-5 items-end gap-0 rounded-[1.75rem] border border-white/10 bg-pitch-dark/80 px-2 pb-2.5 pt-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur-xl"
        >
          <div
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            aria-hidden
          />

          {MOBILE_APPBAR_LEFT.map((item) => (
            <SideTab key={item.href} item={item} active={pathname === item.href} />
          ))}

          <div className="relative flex flex-col items-center">
            <Link
              href={MOBILE_APPBAR_HOME.href}
              className="absolute -top-7 flex flex-col items-center"
              aria-current={homeActive ? "page" : undefined}
            >
              <span
                className={`flex h-[3.35rem] w-[3.35rem] items-center justify-center rounded-full border-[3px] shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform active:scale-95 ${
                  homeActive
                    ? "border-gold bg-gradient-to-b from-gold to-amber-400 text-pitch-dark"
                    : "border-pitch-line/30 bg-gradient-to-b from-pitch-mid to-pitch-dark text-gold"
                }`}
              >
                <TabIcon id="home" className="h-7 w-7" />
              </span>
            </Link>
            <span
              className={`mt-[2.15rem] text-[11px] font-semibold leading-none ${
                homeActive ? "text-gold" : "text-pitch-line/70"
              }`}
            >
              Anasayfa
            </span>
          </div>

          {MOBILE_APPBAR_RIGHT.map((item) => (
            <SideTab key={item.href} item={item} active={pathname === item.href} />
          ))}
        </div>
      </nav>
    </div>
  );
}
