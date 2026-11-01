import { normalizeCheatTitleForMatch } from "@/lib/cheat-title-flag";

/** Yerel lig logoları (api-sports kaynaklı, beyaz zemin üzerinde gösterilir) */
export const LEAGUE_LOGO_PATHS = {
  ucl: "/leagues/ucl.png",
  europa: "/leagues/europa.png",
  laliga: "/leagues/laliga.png",
  premier: "/leagues/premier.png",
  bundesliga: "/leagues/bundesliga.png",
  seriea: "/leagues/seriea.png",
  ligue1: "/leagues/ligue1.png",
  eredivisie: "/leagues/eredivisie.png",
  superlig: "/leagues/superlig.png",
  championship: "/leagues/championship.png",
  mls: "/leagues/mls.png",
  ligaportugal: "/leagues/ligaportugal.png",
  copadelrey: "/leagues/copadelrey.png",
  saudipl: "/leagues/saudipl.png",
  qatarstars: "/leagues/qatarstars.png",
} as const;

export type LeagueLogoKey = keyof typeof LEAGUE_LOGO_PATHS;

type LeagueRule = { re: RegExp; key: LeagueLogoKey };

const TITLE_LEAGUE_RULES: LeagueRule[] = [
  { re: /sampiyonlar\s*ligi|champions\s*league/, key: "ucl" },
  { re: /uefa\s*avrupa\s*ligi|europa\s*league/, key: "europa" },
  { re: /kral\s*kupasi|copa\s*del\s*rey/, key: "copadelrey" },
  { re: /super\s*lig/, key: "superlig" },
  { re: /premier\s*lig|premier\s*league/, key: "premier" },
  { re: /laliga|la\s*liga/, key: "laliga" },
  { re: /bundesliga/, key: "bundesliga" },
  { re: /serie\s*a/, key: "seriea" },
  { re: /ligue\s*1|ligur\s*1/, key: "ligue1" },
  { re: /eredivisie/, key: "eredivisie" },
  { re: /championship/, key: "championship" },
  { re: /\bmls\b/, key: "mls" },
  { re: /suudi\s*pro|saudi\s*pro/, key: "saudipl" },
  { re: /liga\s*portugal/, key: "ligaportugal" },
  { re: /katar\s*yildiz|qatar\s*stars/, key: "qatarstars" },
];

export function cheatTitleLeagueLogoUrl(title: string): string | null {
  const t = normalizeCheatTitleForMatch(title);
  if (!t) return null;
  for (const { re, key } of TITLE_LEAGUE_RULES) {
    if (re.test(t)) return LEAGUE_LOGO_PATHS[key];
  }
  return null;
}
