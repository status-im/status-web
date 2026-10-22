# @status-im/status-network

Code the Status Network sites share: [apps/status.network](../../apps/status.network) and the hub ([apps/hub](../../apps/hub)). It is private and only built inside the workspace, so import it through its subpaths, not from the root.

## What is in it

Built from [src](./src). There is no root import path, so use one of these subpaths:

- `@status-im/status-network/components`: `Button`, `ButtonLink`, `GameCard`, `Divider`, `DropdownMenu`, `FeedbackPopover`, `Footer`, `Link`, `ShortenAddress`.
- `@status-im/status-network/config`: `SOCIALS`, `LEGAL` and the external URLs in [src/config/routes.ts](./src/config/routes.ts).
- `@status-im/status-network/hooks`: `useCopyToClipboard`.
- `@status-im/status-network/utils`: `generateMetadata`, `getPathname`, `createGoneResponse`, date and color helpers.
- `@status-im/status-network/tailwind.config`: the theme preset.

The hub imports most of it: the buttons and cards, `SOCIALS` for its footer, and `createGoneResponse` in [apps/hub/src/middleware.ts](../../apps/hub/src/middleware.ts) to answer 410 on routes that moved. status.network only uses `generateMetadata` so far, in `apps/status.network/src/app/_metadata.ts`.

`getPathname` reads the `x-pathname` header and imports `server-only`, so keep it in server components and metadata files.

The Tailwind preset is exported but neither site imports it at the moment: hub extends `@status-im/components/config` and status.network has its own copy of the theme in `tailwind.config.ts`. A change there will not reach either site until one of them imports it.

## Run

```bash
pnpm --filter @status-im/status-network dev     # Vite build in watch mode
pnpm --filter @status-im/status-network build   # Vite build plus type declarations
```
