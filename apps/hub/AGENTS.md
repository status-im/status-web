# AGENTS.md

Rules for agents working in `apps/hub`. The root [AGENTS.md](../../AGENTS.md) also applies.

## Role

The Status Network hub website: a Next.js app exported as a static site in production and served from a GitHub Pages deploy branch. Dev server on port 3003. Never add features that need a Node server at runtime.

## Commands

    pnpm --filter hub dev                    # dev server, http://localhost:3003
    pnpm --filter hub build                  # static export into out/
    pnpm --filter hub start                  # serve out/
    pnpm --filter hub generate:legal-dates   # regenerate legal "last edited" dates
    pnpm --filter hub check                  # tsc --noEmit plus legal dates

## Rules

- Static export only applies in production builds: `next.config.ts` enables `output: 'export'` when `NODE_ENV === 'production'`. In dev, next-intl middleware handles locale routing, so test locale behaviour with `dev`, not the export.
- After editing legal markdown, run `generate:legal-dates` so the rendered "last edited" dates update. `predev` and `prebuild` run it automatically.
- `build:strip-locale` (run in `postbuild`) strips the default locale prefix from `out/`. If you change the default locale, update the strip script too.
- `NEXT_PUBLIC_*` variables are inlined at build time and validated by `src/app/_constants/env.client.mjs`. Add any new required public variable there.
- Reuse components, colors and icons from `packages/*` (see the root AGENTS.md).

## Caveats

- Images use `unoptimized: true`: the static export has no image optimization service.
- `pnpm start` serves `out/` via `serve`, which defaults to port 3000. Use `pnpm --filter hub dev` for the app on port 3003.

## Docs

- [Deployment](../../docs/deployment.md): how `ci/website.Jenkinsfile` publishes `out/`.
- [Architecture](../../docs/architecture.md): where `@status-im/status-network` and the Status API fit.
