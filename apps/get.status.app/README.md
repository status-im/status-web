# get.status.app

Scoped download-focused site that reuses [`status.app`](../status.app) components, styles, and page implementations.

## Pages

- `/` — homepage
- `/apps` — apps
- `/legal/terms-of-use`
- `/legal/privacy-policy`
- `/security`

Navigation and footer only link to routes available on this site (see `src/config/routes.ts`).

## Development

Uses the same environment variables as `status.app` (Ghost, Infura, Hasura, etc.). Copy or symlink env files from `apps/status.app`:

```bash
ln -sf ../status.app/.env.local .env.local
```

```bash
pnpm --filter get.status.app dev
```

From the monorepo root, `pnpm dev` also starts this app (no separate `predev` install — root `predev` handles that once).

Runs on port **3005** (hub uses 3003).

## Shared assets

- `content/legal` → symlink to `status.app/content/legal`
- `public` → symlink to `status.app/public`
