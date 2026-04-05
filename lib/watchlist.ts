/** Normalize user input for the persisted watchlist (US tickers or BASE/USD crypto). */
export function normalizeWatchlistSymbol(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  const u = t.toUpperCase();
  if (u.includes("/")) {
    const parts = u.split("/").map((x) => x.trim()).filter(Boolean);
    if (parts.length !== 2) return null;
    const [base, quote] = parts;
    if (!base || !quote) return null;
    return `${base}/${quote}`;
  }
  if (!/^[A-Z0-9.-]{1,32}$/.test(u)) return null;
  return u;
}

export function watchlistSymbolMatchesSession(
  symbol: string,
  sessionIsCrypto: boolean
): boolean {
  const crypto = symbol.includes("/");
  return sessionIsCrypto ? crypto : !crypto;
}
