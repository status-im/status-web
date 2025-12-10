# @status-im/wallet

## 0.1.1

### Patch Changes

- f50d31d: Enhance chart tag label text width measurement using canvas measureText() for accurate proportional font rendering
- d92da0c: Refactor: Replace CRYPTOCOMPARE references with MARKET_PROXY
- 8500222: Optimize CoinGecko API endpoints for market data by using `/simple/price` and `/coins/markets` instead of `/coins/${id}`. Keep `/coins/${id}` only for token descriptions. Improve market cap data freshness and fix fully diluted calculation.
- 9c3823b: upgrade next

## 0.1.0

### Minor Changes

- 0a14da4: add import wallet flow

### Patch Changes

- d354913: add new wallet flow
- 264da50: move buy to wallet
- 6e65af8: add received transaction history
- 4298940: add year to date in transaction history
- 8467e46: Add value chart
- 4740bd7: update sticky bar for assets and collectibles
- 8d4d607: loading states
- 8467e46: Add CTA to main view
- d234d39: change feedback link
- 8467e46: integrate pending wallet activity
- 57e6277: add wallet feedback
- 610315e: update .env
- 8467e46: Rename tabs
- e227e08: change number of retries based on number of api keys
- fda7e3b: fix mnemonic validation & navbar route
- fbec37a: add wallet recovery flow
- bc65408: use placeholderData for config
- 31f9b89: Fixes onBack in import recovery phrase flow
- ee2a2bd: add link to feedback, change onboarding copy
- dbe7dae: limit wallet networks
- adc8c21: add /activity to wallet
- af9e83f: update token lists
- ea4c192: port wallet receive button
- dec09cf: port wallet detail routes
- dd59d1b: change api key on retry
- 6598026: add simple api key rotation
- c7a6e71: fix collectibles
- 0c007f8: add default tokens
- 997b4a1: remote config env
- Updated dependencies [6e65af8]
- Updated dependencies [0a14da4]
- Updated dependencies [fdc3fe9]
- Updated dependencies [66d30c0]
- Updated dependencies [8467e46]
  - @status-im/components@1.1.0
