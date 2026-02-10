# Status Hub

This is the source for <https://hub.status.network> – a [Next.js](https://nextjs.org/) project with static export.

## Prerequisites

*   [Node.js](https://nodejs.org/en/) `v22.x`
*   **[pnpm](https://pnpm.io)** v9.12.x
*   **[perl](https://www.perl.org/)** v5.36.x

## Getting Started

First, follow the [root README](../../README.md#getting-started) to clone the repo, initialize submodules, and install dependencies.

Pull environment variables:

```bash
vercel env pull .env.local
```

Start the development server:

```bash
pnpm dev
```

## Building

Build the static export:

```bash
pnpm build
```

Preview the static build locally:

```bash
pnpm start
```

## Deploying

Deployment is handled via [`Jenkinsfile.website`](../../Jenkinsfile.website)
