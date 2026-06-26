# AGENTS.md

Guidance for agents working inside `apps/cms`. The root `AGENTS.md` still applies; this file adds CMS-specific instructions for the nearest subtree.

## App Role

This is the Payload CMS 3.x admin app on Next.js 16. It runs on port `3001`, with the admin UI at `/admin`.

Payload Postgres is not the production content source of truth. It stores users, sessions, drafts, and PR cache. Published content changes must flow through the GitHub PR workflow targeting `develop`.

## Commands

Run from the repo root unless a task explicitly needs the app directory:

```bash
pnpm --filter cms dev
pnpm --filter cms build
pnpm --filter cms lint
pnpm --filter cms check-types
pnpm --filter cms generate-types
pnpm --filter cms generate-import-map
```

Use `pnpm generate-types` from the repo root after Payload collection or schema changes that affect generated types.

## Code Organization

- Payload collections live in `src/collections/`.
- GitHub-backed content mutation logic lives in `src/services/content-workflow/`.
- Admin-specific UI belongs under `src/components/admin/`.
- Keep reusable content schemas, loaders, locale helpers, and GitHub mutation helpers in `@status-im/content`, not duplicated in this app.

## Content Workflow Rules

- Do not write published content directly to Postgres.
- Do not bypass `save-as-pr.ts`, `save-idea-as-pr.ts`, `save-rfp-as-pr.ts`, or the existing content workflow helpers when changing CMS publishing behavior.
- CMS-generated content PRs target `develop`.
- If a collection edits content under `content/**`, keep the Payload collection, `@status-im/content` schema/loader, fixtures, and generated types in sync.

## Environment

The CMS must not silently fall back to localhost in production-like environments. Keep the existing assertions around `NEXT_PUBLIC_SERVER_URL` and `NEXT_PUBLIC_WEB_URL`; fix the environment instead of weakening those checks.

