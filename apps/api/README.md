# Status API

This is the repository for the Status API.

## Prerequisites

Required:

- **[Node.js](https://nodejs.org/)** v22.x
- **[pnpm](https://pnpm.io)** v9.12.x

## Getting Started
Go to the project directory:

```bash
  cd apps/api
```

Install dependencies:

```bash
  pnpm install
```

Pull environment variables:

```bash
  vercel env pull .env.local
```
> [!NOTE]
> This project is deployed on Vercel at [https://vercel.com/status-im-web/status-api](https://vercel.com/status-im-web/status-api).
> You can also get the environment variables manually from [there](https://vercel.com/status-im-web/status-api/settings/environment-variables). However this is recommended to pull envs through the Vercel CLI as there are a lot of them.


Start the development server:

```bash
  pnpm dev
```