# status.app

Next.js 15 app behind [status.app](https://status.app): the marketing pages, help centre, specs
hub and blog.

## Run

```bash
pnpm --filter status.app dev:next      # http://localhost:3001
pnpm --filter status.app dev:content   # watch content/ and rebuild Contentlayer
```

The app has no `dev` script, only `dev:next`, so the first command is the one you want. Run the
second in another terminal while you edit anything under `content/`, otherwise the Contentlayer
output goes stale.

```bash
pnpm --filter status.app build         # lint, blog search index, next build
pnpm --filter status.app test          # vitest
pnpm --filter status.app types:check   # Contentlayer build, then tsc
```

`build` runs `lint:remark` over `content/help` and `content/legal` before it compiles, so a Markdown
error stops the build.

## Environment

`.env` is committed with defaults, and `.env.local` (gitignored) layers your values on top. Build
yours from the documented list or pull the set the deployed app uses:

```bash
cp .env.example .env.local   # then fill in the values you need
vercel env pull .env.local
```

`.env.example` lists the values for SSG, ISR and public API fetches (Ghost, Infura, Greenhouse,
GitHub and Hasura), plus optional analytics settings. The public site does not require Postgres,
Keycloak or BambooHR. `/admin`, `/login/keycloak` and the admin-only tRPC services have been removed.

The database schema, migrations and `db:*` commands remain for maintenance of existing data.
Only those commands need `POSTGRES_URL`; the website does not connect to that database.

`pnpm --filter status.app env:check` validates the values against `src/config/env.server.mjs` and
`src/config/env.client.mjs`. It reads `.env`, so it will report variables you only set in
`.env.local` as missing.

## Deploy

Vercel builds production. The same app also ships as a Docker image built from
[`Dockerfile`](./Dockerfile) and pushed to Harbor by `ci/docker.Jenkinsfile`; try it locally with
`pnpm --filter status.app preview:docker`. [Self-hosting](docs/self-hosting.md) covers the image,
the environment split and the caching an operator needs to get right.

## More

- [Self-hosting guide](docs/self-hosting.md)
- [Docs index](docs/README.md)
- [Agent guide](AGENTS.md)
