/**
 * Transfermarkt land (filter) adı → uygulama ülke adı (Türkçe)
 * Kaynak: marktwerte sayfası land_id dropdown (DE/TR karışık etiketler)
 */
export const TM_LAND_LABEL_TO_COUNTRY_TR = {
  Algerien: "Cezayir",
  Algerie: "Cezayir",
  Argentinien: "Arjantin",
  Australien: "Avustralya",
  "Österreich": "Avusturya",
  Osterreich: "Avusturya",
  Belgien: "Belçika",
  "Bosnien-Herzegowina": "Bosna Hersek",
  "Bosna-Hersek": "Bosna Hersek",
  Brasilien: "Brezilya",
  "Kap Verde": "Yeşil Burun",
  "Yeşil Burun Adaları": "Yeşil Burun",
  Kanada: "Kanada",
  Kolumbien: "Kolombiya",
  "DR Kongo": "Kongo DC",
  "Demokratik Kongo Cumhuriyeti": "Kongo DC",
  "Elfenbeinküste": "Fildişi Sahili",
  "Cote d'Ivoire": "Fildişi Sahili",
  Kroatien: "Hırvatistan",
  Curaçao: "Curaçao",
  Curacao: "Curaçao",
  Tschechien: "Çekya",
  Ecuador: "Ekvador",
  Ägypten: "Mısır",
  Agypten: "Mısır",
  England: "İngiltere",
  Frankreich: "Fransa",
  Deutschland: "Almanya",
  Ghana: "Gana",
  Haiti: "Haiti",
  Iran: "İran",
  Irak: "Irak",
  Japan: "Japonya",
  Jordanien: "Ürdün",
  "Südkorea": "Güney Kore",
  Sudkorea: "Güney Kore",
  Mexiko: "Meksika",
  Marokko: "Fas",
  Niederlande: "Hollanda",
  "Neuseeland": "Yeni Zelanda",
  Norwegen: "Norveç",
  Panama: "Panama",
  Paraguay: "Paraguay",
  Portugal: "Portekiz",
  Katar: "Katar",
  "Saudi-Arabien": "Suudi Arabistan",
  Schottland: "İskoçya",
  Senegal: "Senegal",
  "Südafrika": "Güney Afrika",
  Sudafrika: "Güney Afrika",
  Spanien: "İspanya",
  Schweden: "İsveç",
  Schweiz: "İsviçre",
  Tunesien: "Tunus",
  Türkei: "Türkiye",
  Turkei: "Türkiye",
  Uruguay: "Uruguay",
  USA: "ABD",
  "Vereinigte Staaten": "ABD",
  Usbekistan: "Özbekistan",
  "Amerika Birleşik Devletleri": "ABD",
};

/** TM katılımcı / dropdown etiketi → uygulama ülke adı (Türkçe) */
export function tmTeilnehmerLabelToCountryTr(label) {
  const t = String(label).trim();
  if (TM_LAND_LABEL_TO_COUNTRY_TR[t]) return TM_LAND_LABEL_TO_COUNTRY_TR[t];
  const mapped = tmLandLabelToCountryTr(t);
  if (mapped) return mapped;
  return t;
}

export function tmLandLabelToCountryTr(label) {
  const t = String(label).trim();
  if (TM_LAND_LABEL_TO_COUNTRY_TR[t]) return TM_LAND_LABEL_TO_COUNTRY_TR[t];
  const norm = t
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ");
  for (const [k, v] of Object.entries(TM_LAND_LABEL_TO_COUNTRY_TR)) {
    const kn = k.normalize("NFD").replace(/\p{M}/gu, "");
    if (kn === norm) return v;
  }
  return null;
}
