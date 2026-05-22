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

Environment variables are defined in this app — not the full `status.app` set. Copy the example file:

```bash
cp .env.example .env.local
```

Only `GITHUB_TOKEN` is commonly needed locally (latest release tags in nav and `/apps`). Everything else is optional.

```bash
pnpm --filter get.status.app dev
```

From the monorepo root, `pnpm dev` also starts this app (no separate `predev` install — root `predev` handles that once).

Runs on port **3005** (hub uses 3003).

## Shared assets

- `content/legal` → symlink to `status.app/content/legal`
- `public` → symlink to `status.app/public`
