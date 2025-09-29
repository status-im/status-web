# Status Website

This is the repository for the [https://status.app](https://status.app) – a [Next.js](https://nextjs.org/) project.

## Prerequisites

- [Node.js](https://nodejs.org/en/) `v18.x.x`
- **[pnpm](https://pnpm.io)** v9.12.x

## Getting Started

Clone the project:

```bash
  git clone https://github.com/status-im/status-website.git
  git submodule init
  git submodule update
```

Optionally, update submodules:

```bash
  git submodule update --remote [submodule]
```

Go to the project directory:

```bash
  cd status-website
```

Install dependencies:

```bash
  pnpm install
```

Pull environment variables:

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
