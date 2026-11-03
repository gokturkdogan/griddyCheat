/** Güncel en uzun kadro kulüpleri — yerel amblem (public/clubs) */
export const CLUB_LOGO_PATHS: Record<string, string> = {
  Arsenal: "/clubs/arsenal.png",
  Galatasaray: "/clubs/galatasaray.png",
  "Fenerbahçe": "/clubs/fenerbahce.png",
  Rizespor: "/clubs/rizespor.png",
  Barcelona: "/clubs/barcelona.png",
  "Real Madrid": "/clubs/real-madrid.png",
  Ajax: "/clubs/ajax.png",
  "Beşiktaş": "/clubs/besiktas.png",
  Trabzonspor: "/clubs/trabzonspor.png",
  Marseille: "/clubs/marseille.png",
  Lyon: "/clubs/lyon.png",
  Lille: "/clubs/lille.png",
  Tottenham: "/clubs/tottenham.png",
};

export function clubLogoUrl(team: string): string | null {
  const key = team.trim();
  return CLUB_LOGO_PATHS[key] ?? null;
}

/** Transfermarkt verein id — scripts/fetch-club-logos.mjs ile senkron */
export const CLUB_VEREIN_IDS: Record<string, number> = {
  Arsenal: 11,
  Galatasaray: 141,
  "Fenerbahçe": 36,
  Rizespor: 126,
  Barcelona: 131,
  "Real Madrid": 418,
  Ajax: 610,
  "Beşiktaş": 114,
  Trabzonspor: 449,
  Marseille: 244,
  Lyon: 1041,
  Lille: 1082,
  Tottenham: 148,
};
