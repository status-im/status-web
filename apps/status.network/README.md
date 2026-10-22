# Status Network Website

Source for <https://status.network>: the marketing pages plus a blog backed by Ghost. The pages and the Ghost client live in [`src/app`](src/app).

## Run

    pnpm --filter status.network dev    # http://localhost:3002

Run it from the repo root. Without real Ghost credentials the marketing pages render and the blog stays empty.

## Build

    pnpm --filter status.network build                  # static export into out/
    pnpm --filter status.network start                  # serve out/ on port 3002
    pnpm --filter status.network preview:production     # build then serve, close to the Jenkins path

`prebuild` regenerates the legal dates and runs `env:check`. `postbuild` writes the sitemap, strips the default locale prefix and copies `serve.json` into `out/`.

## Environment

The site needs four Ghost variables, two for the build and two for the browser:

- `GHOST_API_URL` and `GHOST_API_KEY` are read during the build.
- `NEXT_PUBLIC_GHOST_API_URL` and `NEXT_PUBLIC_GHOST_API_KEY` are inlined at build time so the browser can refresh blog content after deploy. Set them to the same values.

`.env` is committed with demo Ghost values, so a build works out of the box. For live content copy `.env.example` to `.env.local` and fill in the real values; Next reads `.env.local` over `.env`. `pnpm --filter status.network env:check` validates `.env` (not `.env.local`) and runs in `prebuild`.

When Ghost is unreachable at build time, `/blog/[slug]` falls back to the committed list in `content/network-blog-slugs.json`.

## Deploy

Jenkins builds the export and pushes `out/` to a deploy branch with `ghp-import`, passing the Ghost key from the `status-network-ghost-api-key` credential. `master` publishes status.network, `develop` publishes dev.status.network. See [ci/website.Jenkinsfile](../../ci/website.Jenkinsfile) and [docs/deployment.md](../../docs/deployment.md).

## More

- [Agent guide](AGENTS.md): commands, rules and caveats for coding agents.
