export type TabIconId = "kariyer" | "son7" | "home" | "hedef" | "draft";

export type NavItem = {
  href: string;
  label: string;
  shortLabel?: string;
  icon: TabIconId;
};

export const DESKTOP_NAV_LINKS: NavItem[] = [
  { href: "/", label: "Ana Sayfa", icon: "home" },
  { href: "/kariyer-ikizi", label: "Kariyer İkizi", icon: "kariyer" },
  {
    href: "/son-7-modu-hileleri",
    label: "Son 7 Modu Hileleri",
    shortLabel: "Son 7",
    icon: "son7",
  },
  { href: "/hedefi-tuttur", label: "Hedefi Tuttur", icon: "hedef" },
  { href: "/draftinho", label: "Draftinho", icon: "draft" },
];

export const MOBILE_APPBAR_LEFT: NavItem[] = [
  {
    href: "/kariyer-ikizi",
    label: "Kariyer İkizi",
    shortLabel: "Kariyer",
    icon: "kariyer",
  },
  {
    href: "/son-7-modu-hileleri",
    label: "Son 7",
    shortLabel: "Son 7",
    icon: "son7",
  },
];

export const MOBILE_APPBAR_HOME: NavItem = {
  href: "/",
  label: "Anasayfa",
  shortLabel: "Anasayfa",
  icon: "home",
};

export const MOBILE_APPBAR_RIGHT: NavItem[] = [
  {
    href: "/hedefi-tuttur",
    label: "Hedefi Tuttur",
    shortLabel: "Hedef",
    icon: "hedef",
  },
  {
    href: "/draftinho",
    label: "Draftinho",
    shortLabel: "Draft",
    icon: "draft",
  },
];
