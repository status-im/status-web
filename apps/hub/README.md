# Status Network Hub

This is the repository for [https://hub.status.network/](https://hub.status.network/) – Gasless Ethereum Layer 2 with Privacy.

## Prerequisites

Required:

- **[Node.js](https://nodejs.org/)** v22.x
- **[pnpm](https://pnpm.io)** v9.12.x

## Getting Started
Go to the project directory:

```bash
  cd apps/hub
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
> This project is deployed on Vercel at [https://vercel.com/status-im-web/status-network-hub](https://vercel.com/status-im-web/status-network-hub).
> You can also get the environment variables manually from [there](https://vercel.com/status-im-web/status-network-hub/settings/environment-variables).

> [!NOTE]
> `NEXT_PUBLIC_STATUS_NETWORK_API_URL`: Base URL for the Status Network API used by the hub for auth, current user (`/auth/me`), karma/sybil (proof-of-work), predeposit vaults APY, and captcha. You can run this API locally by cloning the sn-api repo [https://github.com/status-im/sn-api](https://github.com/status-im/sn-api). If you do so don't forget to change the value of this variable to the local API's URL.
>
> `NEXT_PUBLIC_STATUS_API_URL`: Base URL for the Status API used by the hub to fetch token exchange rates (market data).
> You can run this API locally by running `pnpm dev` in the [api](https://github.com/status-im/status-web/tree/main/apps/api) project. If you do so don't forget to change the value of this variable to `http://localhost:3030`.

Start the development server:

```bash
  pnpm dev
```

Open [http://localhost:3003](http://localhost:3003) with your browser to see the result.

You can start editing the pages. Pages auto-update as you edit the file.