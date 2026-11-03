/** TM marktwerte + kader pozisyon etiketleri → GK/DF/MF/FW */
export function mapPositionToKey(text) {
  const t = String(text).toLowerCase();
  if (t.includes("goalkeeper") || t.includes("kaleci") || t === "gk") return "GK";
  if (
    t.includes("defender") ||
    t.includes("defans") ||
    t.includes("back") ||
    t.includes("bek") ||
    t.includes("stoper") ||
    t.includes("centre-back") ||
    t.includes("center-back") ||
    t === "df"
  ) {
    return "DF";
  }
  if (
    t.includes("midfield") ||
    t.includes("orta saha") ||
    t.includes("orta-saha") ||
    t.includes("libero") ||
    t.includes("on numara") ||
    t.includes("onnumara") ||
    t.includes("midfielder") ||
    t === "mf"
  ) {
    return "MF";
  }
  if (
    t.includes("forward") ||
    t.includes("forvet") ||
    t.includes("santrafor") ||
    t.includes("kanat") ||
    t.includes("winger") ||
    t.includes("striker") ||
    t.includes("attack") ||
    t === "fw"
  ) {
    return "FW";
  }
  return null;
}
