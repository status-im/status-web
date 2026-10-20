# Status Hub

Source for the Status Network hub website, <https://hub.status.network>. A [Next.js](https://nextjs.org/) app exported as a static build.

## Run

    pnpm --filter hub dev    # http://localhost:3003

Run from the repo root. `predev` regenerates the legal "last edited" dates before the server starts.

## Build

    pnpm --filter hub build   # next build -> out/
    pnpm --filter hub start   # serve the out/ export

`build` runs the static export (`output: 'export'`). `postbuild` generates the sitemap and strips the default locale prefix.

## Environment

Secrets are not committed. Pull them locally:

    vercel env pull .env.local

The build validates these variables (see `src/app/_constants/env.client.mjs`):

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (required)
- `NEXT_PUBLIC_STATUS_NETWORK_API_URL` (required, the Status Network API base URL)
- `NEXT_PUBLIC_STATUS_API_URL` (required, the Status API used for exchange rates and the RPC proxy)
- `NEXT_PUBLIC_USE_PUZZLE_AUTH`, `NEXT_PUBLIC_RPC_PROXY_URL` (optional)

Committed defaults live in `.env` and `.env.development`.

## Deploy

Jenkins builds the export and publishes it with `ghp-import`. `master` deploys `hub.status.network`, `develop` deploys `dev-hub.status.network`. See [deployment](../../docs/deployment.md) and [ci/website.Jenkinsfile](../../ci/website.Jenkinsfile).

## More

- [Agent guide](AGENTS.md)
