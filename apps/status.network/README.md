# Status Network Website

This is the source for <https://status.network> – a [Next.js](https://nextjs.org/) project.

## Getting Started

First, follow the [root README](../../README.md#getting-started) to clone the repo, initialize submodules, and install dependencies.

Start the development server:

```bash
pnpm dev
```

## Blog environment

`/blog` uses Ghost Content API data from `our.status.im`.

Set these environment variables (for local/dev/prod as needed):

* `NEXT_PUBLIC_GHOST_API_URL` (optional, defaults to `https://our.status.im`)
* `NEXT_PUBLIC_GHOST_API_KEY`

Example (`apps/status.app/.env.development` naming):

```bash
NEXT_PUBLIC_GHOST_API_URL=
NEXT_PUBLIC_GHOST_API_KEY=
```
