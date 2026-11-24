# Status Network Website

Source for <https://status.network>: the marketing pages plus a blog backed by Ghost. The pages and the Ghost client live in [`src/app`](src/app).

## Run

    pnpm --filter status.network dev    # http://localhost:3002

Run it from the repo root. Without real Ghost credentials the marketing pages render and the blog stays empty.

## Build

    pnpm --filter status.network build                  # static export into out/
    pnpm --filter status.network start                  # serve out/ on port 3002
    pnpm --filter status.network preview:production     # build then serve, close to the Jenkins path

`prebuild` regenerates the legal dates and runs `env:check`. `postbuild` writes `out/sitemap.xml`, strips the default locale prefix and copies `serve.json` into `out/`.

The export uses Next.js build IDs for client-side navigation. Both build commands unset `NEXT_DEPLOYMENT_ID` so Next.js includes a matching build ID in the generated HTML and page data. Vercel serves `out/` as static files without the Next.js deployment ID response header.

## Environment

The site needs four Ghost variables, two for the build and two for the browser:

- `GHOST_API_URL` and `GHOST_API_KEY` are read during the build.
- `NEXT_PUBLIC_GHOST_API_URL` and `NEXT_PUBLIC_GHOST_API_KEY` are inlined at build time so the browser can refresh blog content after deploy. Set them to the same values.

`.env` is committed with demo Ghost values, so a build works out of the box. For live content copy `.env.example` to `.env.local` and fill in the real values; Next reads `.env.local` over `.env`. `pnpm --filter status.network env:check` validates `.env` (not `.env.local`) and runs in `prebuild`.

During a build, [Ghost requests](src/app/_lib/ghost.ts) time out after 10 seconds. Local and CI builds can use the committed slug list in `content/network-blog-slugs.json` when Ghost has no posts. Jenkins and Vercel set `REQUIRE_NETWORK_BLOG=1` so a missing blog index, article body, or blog sitemap fails the build before publication. Configure the live Ghost variables in each deployment environment. Keep the committed slug list in sync if a listed post is permanently removed.

## Deploy

Jenkins builds the export and pushes `out/` to a deploy branch with `ghp-import`, passing the Ghost key from the `status-network-ghost-api-key` credential. `master` publishes status.network, `develop` publishes dev.status.network. See [ci/website.Jenkinsfile](../../ci/website.Jenkinsfile) and [docs/deployment.md](../../docs/deployment.md).

## More

- [Agent guide](AGENTS.md): commands, rules and caveats for coding agents.
