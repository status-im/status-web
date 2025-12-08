---
'@status-im/wallet': patch
---

Optimize CoinGecko API endpoints for market data by using `/simple/price` and `/coins/markets` instead of `/coins/${id}`. Keep `/coins/${id}` only for token descriptions. Improve market cap data freshness and fix fully diluted calculation.
