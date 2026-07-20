---
'@status-im/wallet': patch
---

Apply rate limits to every ETH RPC and market-backed wallet API route, isolate
global limits by client IP, and preserve upstream rate-limit responses.
