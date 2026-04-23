# Status Hub

This is the source for <https://hub.status.network> – a [Next.js](https://nextjs.org/) project with static export.

## Prerequisites

*   **[Node.js](https://nodejs.org/en/)** `v22.x`
*   **[pnpm](https://pnpm.io)** v9.12.x
*   **[perl](https://www.perl.org/)** v5.36.x

## Getting Started

First, follow the [root README](../../README.md#getting-started) to clone the repo, initialize submodules, and install dependencies.

Then, pull environment variables:

```bash
  vercel env pull .env.local
```

> \[!NOTE]
> `NEXT_PUBLIC_STATUS_NETWORK_API_URL`: Base URL for the Status Network API used by the hub for auth, current user (`/auth/me`), karma/sybil (proof-of-work), predeposit vaults APR, and captcha. You can run this API locally by cloning the sn-api repo <https://github.com/status-im/sn-api>. If you do so don't forget to change the value of this variable to the local API's URL.
>
> `NEXT_PUBLIC_STATUS_API_URL`: Base URL for the Status API used by the hub to fetch token exchange rates (market data) and as the default RPC proxy for Mainnet/Linea chain interactions (`/api/trpc/rpc.proxy`). If this variable is empty, wagmi's built-in public RPCs are used as fallback. You can override RPC endpoints per-chain with `NEXT_PUBLIC_MAINNET_RPC_URL` and `NEXT_PUBLIC_LINEA_RPC_URL`.
> You can run this API locally by running `pnpm dev` the root or in the [api](https://github.com/status-im/status-web/tree/main/apps/api) project. If you do so don't forget to change the value of this variable to `http://localhost:3030`.

Start the development server:

```bash
pnpm dev
```

## Building

Build the static export:

```bash
pnpm build
```

Preview the static build locally:

```bash
pnpm start
```

## Deploying

Deployment is handled via [`Jenkinsfile.website`](../../Jenkinsfile.website)
