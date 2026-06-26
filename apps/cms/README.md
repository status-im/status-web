# Status CMS

Payload CMS admin for editing **get.status.app** content only. Changes do not affect `status.app`.

- Admin UI: `http://localhost:3010/admin`
- Content fixtures: `content/get.status.app/**`
- Local writes: `CONTENT_LOCAL_WRITE=true` in `apps/cms/.env`

## Quick start

```bash
docker compose -f docker-compose.cms.yml up -d
cp apps/cms/.env.example apps/cms/.env   # set PAYLOAD_SECRET
pnpm install
pnpm --filter cms sync-from-content
pnpm dev:get
```

- CMS: http://localhost:3010/admin
- get.status.app: http://localhost:3005

## Editing content locally

1. Open **Pages → home** in Admin.
2. Edit the `page` JSON (`sections` → `hero` → `headline` / `body`).
3. Save — writes to `content/get.status.app/pages/en/home.json`.
4. Refresh get.status.app to see updated copy (homepage hero uses CMS via i18n message overrides).

## Scope

| Collection | Writes to |
| --- | --- |
| Pages | `content/get.status.app/pages/en/<slug>.json` |
| Site settings | `content/get.status.app/site/en/settings.json` |
| Site navigation | `content/get.status.app/site/en/navigation.json` |
| Site footer | `content/get.status.app/site/en/footer.json` |

`status.app` is not connected to this CMS and continues to use its own i18n files and content sources.
