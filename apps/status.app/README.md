# status.app

Next.js 15 app behind [https://status.app](https://status.app): the marketing site, help centre,
specs hub, blog and admin tooling.

## Run

```bash
pnpm --filter status.app dev:next      # http://localhost:3001
pnpm --filter status.app dev:content   # watch content/ and rebuild Contentlayer
pnpm --filter status.app build         # lint + blog search index + next build
pnpm --filter status.app test          # vitest
pnpm --filter status.app types:check   # Contentlayer build + tsc
```

## Environment

Copy `.env.example` to `.env.local` and fill in values, or pull the Vercel set:

```bash
cp .env.example .env.local
vercel env pull .env.local
```

`pnpm --filter status.app env:check` validates `.env` against
`src/config/env.server.mjs` and `src/config/env.client.mjs`. Postgres and Keycloak are only needed
for the admin and API routes.

## Deploy

Deployed on Vercel for production. A self-hosted Docker image is built from
[`Dockerfile`](./Dockerfile) and pushed to Harbor by `ci/docker.Jenkinsfile`; run it locally with
`pnpm --filter status.app preview:docker`.

## More

- [Self-hosting guide](docs/self-hosting.md)
- [Docs index](docs/README.md)
- [Agent guide](AGENTS.md)
