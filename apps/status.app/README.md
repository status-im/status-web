# Status Website

This is the source for [https://status.app](https://status.app) – a [Next.js](https://nextjs.org/) project.

## Getting Started

First, follow the [root README](../../README.md#getting-started) to clone the repo, initialize submodules, and install dependencies.

Then, pull environment variables:

```bash
vercel env pull .env.local
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the pages or content. Pages auto-update as you edit the file.

## Database (development)

Explore environment's database:

```bash
pnpm db:explore
```

Directly modify the database and its schema:

```bash
pnpm db:push
```

On conflict, drop your migrations and generate new ones:

```bash
rm -r ./migrations && git checkout <base> -- ./migrations && pnpm db:generate
```
