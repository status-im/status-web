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

* `GHOST_API_URL` (optional, defaults to `https://our.status.im`)
* `GHOST_API_KEY`

Example (`apps/status.network/.env.local`):

* `GHOST_API_URL=https://demo.ghost.io`
* `GHOST_API_KEY=22444f78447824223cefc48062`
