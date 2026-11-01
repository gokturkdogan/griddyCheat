/** Son 7 başlığından bayrak — yalnızca milliyet / ülke adı */
type FlagRule = { re: RegExp; code: string };

function normalizeCheatTitle(title: string): string {
  return title
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ç/g, "c")
    .replace(/ı/g, "i")
    .replace(/[''`´]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Başlık eşleştirme (lig + milliyet) */
export function normalizeCheatTitleForMatch(title: string): string {
  return normalizeCheatTitle(title);
}

const TITLE_FLAG_RULES: FlagRule[] = [
  { re: /fildisi\s*sahilli|fildisili|fildisi\s*sahil/, code: "ci" },
  { re: /birlesik\s*krallik/, code: "gb" },
  { re: /hollandali/, code: "nl" },
  { re: /\bhollanda\b/, code: "nl" },
  { re: /portekizli/, code: "pt" },
  { re: /\bportekiz\b/, code: "pt" },
  { re: /brezilyali/, code: "br" },
  { re: /\bbrezilya\b/, code: "br" },
  { re: /arjantinli|arjantinliler|\barjantin\b/, code: "ar" },
  { re: /belcikali|belcikalilar/, code: "be" },
  { re: /\bbelcika\b/, code: "be" },
  { re: /norvecli|\bnorvec\b/, code: "no" },
  { re: /fransiz|fransizlar/, code: "fr" },
  { re: /\bfransa\b/, code: "fr" },
  { re: /ispanyol|ispanyollar/, code: "es" },
  { re: /\bispanya\b/, code: "es" },
  { re: /almanlar|\balman\b/, code: "de" },
  { re: /\balmanya\b/, code: "de" },
  { re: /italyan|italyanlar/, code: "it" },
  { re: /\bitalya\b/, code: "it" },
  { re: /hirvat\b|hirvatistan/, code: "hr" },
  { re: /sirp\b|sirbistan/, code: "rs" },
  { re: /turk\b|turkiye/, code: "tr" },
  { re: /nijeryali|\bnijerya\b/, code: "ng" },
  { re: /senegalli|\bsenegal\b/, code: "sn" },
  { re: /kamerun/, code: "cm" },
  { re: /misirli|\bmisir\b/, code: "eg" },
  { re: /ganali|\bgana\b/, code: "gh" },
  { re: /uruguayli|\buruguay\b/, code: "uy" },
  { re: /\bkolombiya\b/, code: "co" },
  { re: /\bmeksika\b/, code: "mx" },
  { re: /japon\b|\bjaponya\b/, code: "jp" },
  { re: /cinli|\bcin\b/, code: "cn" },
  { re: /iranli|\biran\b/, code: "ir" },
  { re: /suudi|suudi\s*arabistan/, code: "sa" },
  { re: /\bkatar\b/, code: "qa" },
  { re: /\bpolonya\b|polonyali/, code: "pl" },
  { re: /\bisvicre\b|isvicreli/, code: "ch" },
  { re: /\bavusturya\b|avusturyali/, code: "at" },
  /** Spesifik ülke yoksa — Avrupa Birliği bayrağı (UEFA Avrupa Ligi ile karışmaz) */
  { re: /avrupalilar|avrupali|avrupa\s*uyruklu/, code: "eu" },
  /** Spesifik ülke yoksa — CAF (Afrika) */
  { re: /afrikalilar|afrikali|afrika\s*uyruklu/, code: "caf" },
  /** Spesifik ülke yoksa — AFC / Asya */
  { re: /asyalilar|asyali|asya\s*uyruklu/, code: "afc" },
  /** Milliyet yok — asist temalı başlıklar (gol ikonundan önce) */
  {
    re: /gol\s*asist|asist\s*yapan(?:lar|lari|inin)?|asist\s*yapm(?:is|ist)|asist\s*ver(?:en|enler|di)?|\basist(?:i|ler|lerin)?\b/,
    code: "assist",
  },
  /** Milliyet yok — gol atan / gol temalı başlıklar */
  {
    re: /gol\s*atan(?:lar|lari|inin)?|gol\s*atm(?:is|ist)|gol\s*at(?:ti|an)/,
    code: "goal",
  },
];

const FLAG_IMAGE_OVERRIDES: Record<string, string> = {
  eu: "https://flagcdn.com/eu.svg",
  caf: "/confederations/caf.png",
  afc: "/confederations/afc-asia.png",
  goal: "/icons/goal.png",
  assist: "/icons/assist.png",
};

/** Milliyet görseli — ISO bayrak veya özel ikon (AB, CAF, AFC, gol, asist) */
export function cheatTitleFlagImageUrl(code: string | null): string | null {
  if (!code) return null;
  const override = FLAG_IMAGE_OVERRIDES[code];
  if (override) return override;
  return `https://flagcdn.com/${code}.svg`;
}

export function cheatTitleFlagCode(title: string): string | null {
  const t = normalizeCheatTitle(title);
  if (!t) return null;
  for (const { re, code } of TITLE_FLAG_RULES) {
    if (re.test(t)) return code;
  }
  return null;
}
