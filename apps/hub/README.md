# Status Hub

The Status Network hub dapp at <https://hub.status.network>: staking, karma, pre-deposits, the checker, discover and the legal pages. A Next.js app built from [`src/app`](src/app) and exported as a static site.

## Run

    pnpm --filter hub dev    # http://localhost:3003

Run it from the repo root. `predev` regenerates the "last edited" dates shown on the legal pages before the dev server starts.

## Build

    pnpm --filter hub build   # static export into out/
    pnpm --filter hub start   # serve out/ with serve

`next.config.ts` turns on `output: 'export'` for production builds. `postbuild` writes the sitemap and then runs `scripts/strip-default-locale-prefix.sh`, which moves the `en` pages to the root and adds a `page/index.html` alias for each route, so `/checker` works on a plain file server.

## Environment

`.env` and `.env.development` are committed with local defaults. Pull the real values with `vercel env pull .env.local`.

`src/app/_constants/env.client.mjs` parses these with zod:

| Variable                               | Notes                                        |
| -------------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | required                                     |
| `NEXT_PUBLIC_STATUS_NETWORK_API_URL`   | required, base URL of the Status Network API |
| `NEXT_PUBLIC_STATUS_API_URL`           | required, exchange rates and the RPC proxy   |
| `NEXT_PUBLIC_USE_PUZZLE_AUTH`          | optional, defaults to `false`                |
| `NEXT_PUBLIC_RPC_PROXY_URL`            | optional                                     |

## Deploy

Jenkins builds the export and pushes `out/` to a deploy branch with `ghp-import`. `master` publishes hub.status.network, `develop` publishes dev-hub.status.network. See [ci/website.Jenkinsfile](../../ci/website.Jenkinsfile) for the pipeline and [docs/deployment.md](../../docs/deployment.md) for the full picture.

## More

- [Agent guide](AGENTS.md): commands, rules and caveats for coding agents.
