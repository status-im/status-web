# Status CMS

Payload CMS admin for editing **get.status.app** content only. Changes do not affect `status.app`.

- Content fixtures: `content/get.status.app/**`
- Scope: Pages + site settings/navigation/footer for get.status.app

## Two ways to run locally

### Option A — Dev mode (recommended for editing)

Hot reload, direct file writes, fastest iteration. From the **monorepo root**:

```bash
cp apps/cms/.env.example apps/cms/.env   # once: set PAYLOAD_SECRET
pnpm install
pnpm --filter cms sync-from-content      # once: seed CMS from content/get.status.app
pnpm dev:get                             # CMS :3010 + get.status.app :3005 only
# or pnpm dev                            # all apps (includes CMS + get.status.app)
```

`pnpm dev` and `pnpm dev:get` both start the dev Postgres container (`docker-compose.cms.yml`) automatically.

| Service | URL |
| --- | --- |
| CMS admin | http://localhost:3010/admin |
| get.status.app | http://localhost:3005 |

Set `CONTENT_LOCAL_WRITE=true` in `apps/cms/.env` so saves write directly to `content/get.status.app/**`.

### Option B — Production-like Docker stack

Full parity with logos-web: Postgres + CMS container, migrations on boot, media volume, optional GitHub PR workflow.

```bash
cp apps/cms/.env.docker.example .env.docker
# Edit .env.docker — localhost URLs are pre-filled for local testing
docker compose -f docker-compose.prod.yml --env-file .env.docker up -d --build
```

| Service | URL |
| --- | --- |
| CMS admin | http://localhost:3010/admin (or `CMS_PORT` from `.env.docker`) |
| get.status.app | Run separately: `pnpm --filter get.status.app dev` → :3005 |

For local Docker testing without GitHub App credentials, set `CONTENT_LOCAL_WRITE=true` in `.env.docker`.

`get.status.app` is not containerised here — it reads `content/get.status.app/**` from the repo on the host.

## Editing content

1. Open **Pages → home** in Admin.
2. Edit the `page` JSON (`sections` → `hero` → `headline` / `body`).
3. Save.
4. Refresh get.status.app to see updated copy.

With `CONTENT_LOCAL_WRITE=true`, saves go to `content/get.status.app/pages/en/home.json`. Otherwise saves open a GitHub PR (requires `GITHUB_*` in env).

## Content scope

| Collection | Writes to |
| --- | --- |
| Pages | `content/get.status.app/pages/en/<slug>.json` |
| Site settings | `content/get.status.app/site/en/settings.json` |
| Site navigation | `content/get.status.app/site/en/navigation.json` |
| Site footer | `content/get.status.app/site/en/footer.json` |

## Production deployment

Self-hosted Docker (from repo root):

```bash
cp apps/cms/.env.docker.example .env.docker
# Set real NEXT_PUBLIC_SERVER_URL, NEXT_PUBLIC_WEB_URL, PAYLOAD_SECRET, etc.
docker compose -f docker-compose.prod.yml --env-file .env.docker up -d --build
```

`NEXT_PUBLIC_*` are baked into the client bundle at **build time** — changing them requires a rebuild.

The container entrypoint runs `payload migrate`, optionally syncs `content/get.status.app/**` (`CMS_SYNC_ON_BOOT`), then `next start`.

Standalone image build:

```bash
docker build -f apps/cms/Dockerfile \
  --build-arg NEXT_PUBLIC_SERVER_URL=https://cms.example.com \
  --build-arg NEXT_PUBLIC_WEB_URL=https://get.status.app \
  -t status-cms .
```

## Commands

```bash
pnpm --filter cms dev                 # CMS on host :3010
pnpm --filter cms sync-from-content   # Import content/get.status.app into Postgres
pnpm --filter cms migrate             # Apply SQL migrations
pnpm --filter cms generate-types      # Regenerate Payload types
pnpm dev:get                          # CMS + get.status.app on host
```
