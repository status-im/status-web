# AGENTS.md

Rules for agents working in `apps/hub`. The root [AGENTS.md](../../AGENTS.md) also applies.

## Role

The Status Network hub site on port 3003, built from [`src/app`](src/app). It ships as a static export to GitHub Pages, so nothing here may need a Node server at runtime.

## Commands

    pnpm --filter hub dev                    # dev server, http://localhost:3003
    pnpm --filter hub build                  # static export into out/
    pnpm --filter hub start                  # serve out/
    pnpm --filter hub generate:legal-dates   # refresh the legal "last edited" dates
    pnpm --filter hub check                  # legal dates plus tsc --noEmit

## Rules

- `output: 'export'` is only on when `NODE_ENV === 'production'` (`next.config.ts`). Dev runs the next-intl middleware for locale routing, so check locale behaviour with `dev`; the export is a different code path.
- Run `generate:legal-dates` after editing the legal markdown that hub renders, which lives in `apps/status.network/content/legal` and `content/legal-external`. `predev` and `prebuild` run it too.
- `build:strip-locale` runs in `postbuild` and strips the default locale prefix from `out/`. If you change the default locale, update `scripts/strip-default-locale-prefix.sh` as well.
- Every `NEXT_PUBLIC_*` value is inlined at build time and parsed by the schema in `src/app/_constants/env.client.mjs`. Add a new variable to that schema, or nothing checks it.
- Reuse the components, colors and icons in `packages/*` instead of writing new ones.

## Caveats

- Images use `unoptimized: true` because the static export has no image optimizer.
- `pnpm start` serves `out/` on port 3000, not 3003. It has no middleware either, so use `dev` while you work on routing.
- The legal markdown under `apps/status.network/content/` is published site content. Leave it alone when a task is about docs.

## Docs

- [Deployment](../../docs/deployment.md): how `ci/website.Jenkinsfile` publishes `out/`.
- [Architecture](../../docs/architecture.md): where `@status-im/status-network` and the Status API fit.
