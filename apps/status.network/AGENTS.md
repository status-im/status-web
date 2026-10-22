# AGENTS.md

Rules for agents working in `apps/status.network`. The root [AGENTS.md](../../AGENTS.md) also applies.

## Role

The Status Network website: a Next.js app exported as a static site in production, with a Ghost blog. Dev server on port 3002. Never add features that need a Node server at runtime.

## Commands

    pnpm --filter status.network dev                    # dev server, http://localhost:3002
    pnpm --filter status.network build                  # static export into out/
    pnpm --filter status.network start                  # serve out/ on port 3002
    pnpm --filter status.network preview:production     # build then serve (production-like)
    pnpm --filter status.network env:check              # validate Ghost env from .env
    pnpm --filter status.network generate:legal-dates   # regenerate legal "last edited" dates

## Rules

- Static export only applies in production builds: `next.config.ts` enables `output: 'export'` when `NODE_ENV === 'production'`. In dev, next-intl middleware handles locale routing, so test locale behaviour with `dev`, not the export.
- `env:check` reads `.env` (not `.env.local`) and runs in `prebuild`. The four Ghost variables must be present in `.env` for a build to pass.
- After editing legal markdown, run `generate:legal-dates`. `predev` and `prebuild` run it automatically.
- `build:strip-locale` (run in `postbuild`) strips the default locale prefix from `out/`. Update the strip script if the default locale changes.
- `postbuild` copies `serve.json` into `out/`; keep it in sync with any new rewrite or redirect rules.

## Caveats

- `content/` is published site content (legal, the `legal-external` submodule, `karma-tokenomics.md`). Do not treat it as code docs or edit it during docs work.
- Initialize the submodule before building with real content: `git submodule update --init --recursive apps/status.network/content/legal-external`.
- When Ghost is unavailable at build time, `/blog/[slug]` falls back to `content/network-blog-slugs.json`; update that list when new posts ship.

## Docs

- [Deployment](../../docs/deployment.md): how `ci/website.Jenkinsfile` builds and publishes `out/`.
- [Architecture](../../docs/architecture.md): content pipeline and package consumers.
