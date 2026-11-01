const COUNTRY_FLAG_CODES: Record<string, string> = {
  ispanya: "es",
  fransa: "fr",
  ingiltere: "gb-eng",
  portekiz: "pt",
  almanya: "de",
  italya: "it",
  hollanda: "nl",
  brezilya: "br",
  arjantin: "ar",
  turkiye: "tr",
  türkiye: "tr",
  abd: "us",
  amerika: "us",
  birlesikdevletler: "us",
  belcika: "be",
  hirvatistan: "hr",
  uruguay: "uy",
  kolombiya: "co",
  meksika: "mx",
  japonya: "jp",
  guneykore: "kr",
  avustralya: "au",
  kanada: "ca",
  isvicre: "ch",
  avusturya: "at",
  polonya: "pl",
  iskocya: "gb-sct",
  galler: "gb-wls",
  irlanda: "ie",
  kamerun: "cm",
  senegal: "sn",
  fas: "ma",
  fildisisahili: "ci",
  curacao: "cw",
  norvec: "no",
  katar: "qa",
  misir: "eg",
  nijerya: "ng",
  gana: "gh",
  ekvador: "ec",
  sili: "cl",
  peru: "pe",
  paraguay: "py",
  venezuela: "ve",
  kostarika: "cr",
  panama: "pa",
  iran: "ir",
  suudiarabistan: "sa",
  catari: "qa",
  cezayir: "dz",
  bosnahersek: "ba",
  yesilburun: "cv",
  kongo: "cd",
  kongodc: "cd",
  cekya: "cz",
  haiti: "ht",
  urdun: "jo",
  yenizelanda: "nz",
  irak: "iq",
  tunus: "tn",
  isvec: "se",
  guneyafrika: "za",
  ozbekistan: "uz",
};

function normalizeCountryKey(country: string): string {
  return country
    .trim()
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "");
}

/** flagcdn.com kodu (ör. es, gb-eng) */
export function countryFlagCode(country: string): string | null {
  const key = normalizeCountryKey(country);
  return COUNTRY_FLAG_CODES[key] ?? null;
}

export function countryFlagSvgUrl(country: string): string | null {
  const code = countryFlagCode(country);
  if (!code) return null;
  return `https://flagcdn.com/${code}.svg`;
}

export function countryFlagSvgUrlFromCode(code: string): string {
  return `https://flagcdn.com/${code}.svg`;
}

export function countryFlagEmojiFallback(country: string): string {
  void country;
  return "🏳️";
}

export function positionEmoji(position: string): string {
  const p = position.toLocaleLowerCase("tr");
  if (p.includes("kaleci") || p === "gk") return "🧤";
  if (p.includes("defans") || p === "df") return "🛡️";
  if (p.includes("orta") || p === "mf") return "⚙️";
  if (p.includes("forvet") || p === "fw" || p === "st") return "⚽";
  return "👤";
}

export function formatPlayerName(name: string, surname: string): string {
  const n = name.trim();
  const s = surname.trim();
  if (n && s) return `${n} ${s}`;
  return n || s || "—";
}
