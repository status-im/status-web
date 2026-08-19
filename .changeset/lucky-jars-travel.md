---
'wallet': patch
---

feat(wallet): route dApp reads to the chain the dApp is on

Reads for a connected dApp now go to the chain it switched to instead of always
to Ethereum mainnet. Status Network Sepolia has no upstream proxy route yet, so
reads there fail with "chain is not available" where they previously returned
mainnet data.
