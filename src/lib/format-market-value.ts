/** Transfermarkt tarzı piyasa değeri (EUR) */
export function formatMarketValueEur(eur: number): string {
  const n = Math.max(0, Math.round(eur));
  if (n >= 1_000_000) {
    const mn = n / 1_000_000;
    const s =
      mn >= 100
        ? mn.toFixed(0)
        : mn >= 10
          ? mn.toFixed(1).replace(/\.0$/, "")
          : mn.toFixed(2).replace(/\.?0+$/, "");
    return `${s} Mn €`;
  }
  if (n >= 1_000) {
    const bin = n / 1_000;
    const s = bin >= 100 ? bin.toFixed(0) : bin.toFixed(0);
    return `${s} bin €`;
  }
  return `${n} €`;
}
