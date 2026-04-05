/** Alpaca crypto spot pairs use a slash (e.g. BTC/USD). */
export function isCryptoPairSymbol(symbol: string): boolean {
  return symbol.trim().includes("/");
}

/** TradingView widget symbol for equities vs crypto. */
export function tradingViewSymbolForInstrument(symbol: string): string {
  const u = symbol.trim().toUpperCase();
  if (u.includes(":")) return u;
  if (u.includes("/")) {
    const [base, quote] = u.split("/");
    const b = (base ?? "").trim();
    const q = (quote ?? "").trim();
    if (b && q === "USD") {
      return `COINBASE:${b}USD`;
    }
    return `COINBASE:${u.replace("/", "")}`;
  }
  return `NASDAQ:${u}`;
}
