# Status Network Website

Source for <https://status.network>. A [Next.js](https://nextjs.org/) app exported as a static build, with a Ghost-powered blog.

## Run

    pnpm --filter status.network dev    # http://localhost:3002

Run from the repo root. Without real Ghost credentials the marketing pages work and the blog is empty.

## Build

    pnpm --filter status.network build                  # next build -> out/
    pnpm --filter status.network start                  # serve out/ on port 3002
    pnpm --filter status.network preview:production     # build then serve, the Jenkins-like path

`prebuild` runs the legal dates generator and `env:check`. `postbuild` generates the sitemap, strips the default locale prefix and copies `serve.json` into `out/`.

## Environment

The blog and static export need Ghost Content API credentials.

- `.env` (committed) holds demo Ghost values, so builds work out of the box.
- Copy `.env.example` to `.env.local` and fill real `GHOST_API_URL` and `GHOST_API_KEY` for live content. Set `NEXT_PUBLIC_GHOST_API_URL` and `NEXT_PUBLIC_GHOST_API_KEY` to the same values for client refresh after deploy.
- `pnpm --filter status.network env:check` validates the four variables from `.env`; `prebuild` runs it automatically.

When Ghost is unavailable at build time, `/blog/[slug]` routes fall back to the committed slug list in `content/network-blog-slugs.json`.

## Deploy

Jenkins builds the export and publishes it with `ghp-import`, passing the Ghost key from the `status-network-ghost-api-key` secret. `master` deploys `status.network`, `develop` deploys `dev.status.network`. See [deployment](../../docs/deployment.md) and [ci/website.Jenkinsfile](../../ci/website.Jenkinsfile).

## More

- [Agent guide](AGENTS.md)
