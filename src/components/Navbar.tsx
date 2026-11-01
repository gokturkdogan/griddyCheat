"use client";

import { Logo } from "@/components/Logo";
import {
  IconDraftinho,
  IconHedefiTuttur,
  IconHome,
  IconKariyerIkizi,
  IconSon7,
} from "@/components/tab-bar-icons";
import { DESKTOP_NAV_LINKS, type NavItem, type TabIconId } from "@/lib/navigation";
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

function DesktopNavLink({ item, active }: { item: NavItem; active: boolean }) {
  const label = item.shortLabel ?? item.label;
  return (
    <Link
      href={item.href}
      className={`app-nav-link ${active ? "app-nav-link-active" : ""}`}
      aria-current={active ? "page" : undefined}
    >
      <TabIcon id={item.icon} className="h-4 w-4 shrink-0 opacity-90" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-pitch-dark/92 pt-[70px] backdrop-blur-md lg:pt-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
        <Link
          href="/"
          className="rounded-lg outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        >
          <Logo />
        </Link>

        <nav className="app-nav-track hidden lg:flex" aria-label="Mod seçimi">
          {DESKTOP_NAV_LINKS.map((item) => (
            <DesktopNavLink
              key={item.href}
              item={item}
              active={pathname === item.href}
            />
          ))}
        </nav>
      </div>
    </header>
  );
}
