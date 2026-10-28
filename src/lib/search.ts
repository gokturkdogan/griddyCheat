const TR = "tr-TR";

/** Türkçe uyumlu arama: İ/ı/I/i ve büyük-küçük harf farkını yok sayar */
export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFC")
    .toLocaleLowerCase(TR)
    .replace(/\u0131/g, "i"); // ı → i (ör. İngilizce I ile yazılmış ITALYAN)
}

export function titleMatchesSearch(title: string, query: string): boolean {
  const q = normalizeSearchText(query.trim());
  if (!q) return true;
  return normalizeSearchText(title).includes(q);
}
