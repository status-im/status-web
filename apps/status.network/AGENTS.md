# AGENTS.md

Rules for agents working in `apps/status.network`. The root [AGENTS.md](../../AGENTS.md) also applies.

## Role

The Status Network website on port 3002, built from [`src/app`](src/app), with a Ghost blog. It ships as a static export, so nothing here may need a Node server at runtime.

## Commands

    pnpm --filter status.network dev                    # dev server, http://localhost:3002
    pnpm --filter status.network build                  # static export into out/
    pnpm --filter status.network start                  # serve out/ on port 3002
    pnpm --filter status.network preview:production     # build then serve
    pnpm --filter status.network env:check              # validate the Ghost variables in .env
    pnpm --filter status.network generate:legal-dates   # refresh the legal "last edited" dates

## Rules

- `output: 'export'` is only on when `NODE_ENV === 'production'` (`next.config.ts`). Dev runs the next-intl middleware for locale routing, so check locale behaviour with `dev`; the export is a different code path.
- `env:check` reads `.env` and runs in `prebuild`. The four Ghost variables must be in `.env` for a build to pass; `.env` is committed with demo values, so the check passes out of the box.
- Run `generate:legal-dates` after editing legal markdown. `predev` and `prebuild` run it too.
- `build:strip-locale` runs in `postbuild` and strips the default locale prefix from `out/`. Update `scripts/strip-default-locale-prefix.sh` if the default locale changes.
- `postbuild` also copies `serve.json` into `out/`. It sets `cleanUrls` for `serve`; update it if the static server needs different URL handling.

## Caveats

- `content/` is published site content (legal, the `legal-external` submodule, `karma-tokenomics.md`). Do not edit it during docs work.
- Run `git submodule update --init --recursive apps/status.network/content/legal-external` before a build that needs the real legal pages.
- Hub renders its legal pages from this app's `content/legal` and `content/legal-external`, so a change there affects both sites.
- When Ghost is unreachable at build time, `/blog/[slug]` falls back to `content/network-blog-slugs.json`. Update that list when new posts ship.

## Docs

- [Deployment](../../docs/deployment.md): how `ci/website.Jenkinsfile` builds and publishes `out/`.
- [Architecture](../../docs/architecture.md): content pipeline and package consumers.
