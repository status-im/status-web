# @status-im/wallet

The wallet components and data layer the Status apps share: UI, hooks, constants, utilities and the tRPC router behind the portfolio data. Private to the repo, never published, consumed as a workspace package.

`apps/wallet` and `apps/portfolio` use the components, portfolio also takes the Tailwind preset, and [apps/api](../../apps/api) serves `data/api` over tRPC. `apps/hub` lists the package but imports nothing from it yet. The code is in [src](./src).

## Subpaths

- `@status-im/wallet/components`: token lists, charts, account cards, dialogs and the rest of the wallet UI.
- `@status-im/wallet/data`: the tRPC router (`apiRouter`, `createCaller`, `createTRPCContext`), the Next.js `createAPI` helper and the service clients behind them (Alchemy, CoinGecko and the market and RPC proxies).
- `@status-im/wallet/constants`: the ERC-20 and native token lists, gradients and error constants.
- `@status-im/wallet/hooks` and `/utils`: shared hooks and helpers.
- `@status-im/wallet/tailwind.config`: the Tailwind preset. `apps/portfolio` uses it; the other apps do not.

## Page limits in the data API

The paged procedures in [src/data/api/routers](./src/data/api/routers) bound their input so one request cannot fan out into unbounded upstream calls. Input outside these bounds fails validation.

`activities.page` takes a `limit` that is a positive integer up to 50 (`MAX_PAGE_LIMIT` in `activity.ts`). Each transfer in a page triggers its own status lookup, so the page size bounds the upstream calls; the wallet extension requests 20. The `networks` input goes through `networksSchema`, which drops duplicate networks.

`collectibles.page` takes a `limit` that is an integer from 1 to 100 and an `offset` that is a non-negative integer. It reads at most 50 Alchemy pages of 100 NFTs per network per request (`MAX_UPSTREAM_PAGES` in `collectibles.ts`), so 5,000 NFTs. When it hits that budget it does not throw:

- The full scan path (used for a non-default sort) sorts what it collected and adds `truncated: true` to the response when a network still had a page key left. The field is absent otherwise.
- The page-key path returns the next page key, so the client keeps paginating from there.

## Run

```bash
pnpm --filter @status-im/wallet dev        # Vite library build in watch mode
pnpm --filter @status-im/wallet build      # Vite build plus type declarations
pnpm --filter @status-im/wallet typecheck
pnpm --filter @status-im/wallet test       # vitest
```

Apps that use the components must add `./node_modules/@status-im/wallet/dist/**/*.js` to their Tailwind `content`, or the classes in this package get purged. See [apps/wallet/tailwind.config.ts](../../apps/wallet/tailwind.config.ts). The package declares React 18 as its peer, while the repo root overrides React to 19.1.2 for every workspace.

## Environment

`.env` is committed with empty values and names every key the data layer needs: Infura and Alchemy, CoinGecko, Mercuryo and the RPC and market proxy URLs. Fill it in locally and run:

```bash
pnpm --filter @status-im/wallet env:check
```

That validates `.env` against [src/config/env.server.mjs](./src/config/env.server.mjs). The module throws when it is imported in a browser, which is deliberate: the data services read these secrets and stay on the server.

## Generated files

```bash
pnpm --filter @status-im/wallet sync:tokens:erc20   # src/constants/erc20.json
pnpm --filter @status-im/wallet sync:cloudinary     # src/components/image/types.ts
```

Both scripts read `.env.local` rather than `.env`, so copy your keys there first; `sync:cloudinary` needs `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`. The ERC-20 script writes the token list for the six chains it names at the top, and `sync:cloudinary` reads the Cloudinary resource list to generate the image types. Both files are committed: regenerate them with the scripts instead of editing them.

## More

- [AGENTS.md](./AGENTS.md): rules for working on the package.
