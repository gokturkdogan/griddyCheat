"use client";

import { Logo } from "@/components/Logo";
import { DESKTOP_NAV_LINKS } from "@/lib/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-pitch-light/40 bg-pitch-dark/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="rounded-lg outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        >
          <Logo />
        </Link>

        <nav
          className="hidden max-w-[calc(100%-12rem)] flex-1 items-center justify-end gap-0.5 overflow-x-auto lg:flex"
          aria-label="Ana menü"
        >
          {DESKTOP_NAV_LINKS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition xl:px-3 ${
                  active
                    ? "bg-pitch-light/35 text-white"
                    : "text-pitch-line/90 hover:bg-pitch-light/25 hover:text-white"
                }`}
              >
                {item.shortLabel ?? item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
