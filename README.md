# `status-web`

[![CI](https://github.com/status-im/status-web/actions/workflows/ci.yml/badge.svg)](https://github.com/status-im/status-web/actions/workflows/ci.yml)

Packages for building user interfaces, websites, web applications, dapps, browser extensions, and APIs in the Status ecosystem.

## Packages

| Name                                                   | Deployments                                                                                                          | Builds                                                                                                                              | Description                                                                                                                                                                   |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@status-im/colors`](./packages/colors)               | [![vercel](https://img.shields.io/badge/vercel-black)](https://status-components.vercel.app/?path=/story/colors)     | [![npm version](https://img.shields.io/npm/v/@status-im/colors.svg)](https://www.npmjs.com/package/@status-im/colors)               | Auto-generated color palette based on our [design system](https://www.figma.com/design/v98g9ZiaSHYUdKWrbFg9eM/Foundations?node-id=619-5995&node-type=canvas&m=dev).           |
| [`@status-im/icons`](./packages/icons)                 | [![vercel](https://img.shields.io/badge/vercel-black)](https://status-components.vercel.app/?path=/story/icons)      | [![npm version](https://img.shields.io/npm/v/@status-im/icons)](https://www.npmjs.com/package/@status-im/icons)                     | Auto-generated icon library based on our [design system](https://www.figma.com/design/qLLuMLfpGxK9OfpIavwsmK/Iconset?node-id=3239-987&node-type=frame&t=0h8iIiZ3Sf0g4MRV-11). |
| [`@status-im/components`](./packages/components)       | [![vercel](https://img.shields.io/badge/vercel-black)](https://status-components.vercel.app/?path=/story/components) | [![npm version](https://img.shields.io/npm/v/@status-im/components)](https://www.npmjs.com/package/@status-im/components)           | Component library built with Radix UI, React Aria, Tailwind CSS.                                                                                                              |
| [`@status-im/js`](./packages/status-js)                |                                                                                                                      | [![npm version](https://img.shields.io/npm/v/@status-im/js)](https://www.npmjs.com/package/@status-im/js)                           |                                                                                                                                                                               |
| [`@status-im/wallet`](./packages/wallet)               |                                                                                                                      |                                                                                                                                     |
| [`@status-im/eslint-config`](./packages/eslint-config) |                                                                                                                      | [![npm version](https://img.shields.io/npm/v/@status-im/eslint-config.svg)](https://www.npmjs.com/package/@status-im/eslint-config) | Shared ESLint configuration for consistent code style across projects.                                                                                                        |

## Apps

| Name                                   | Deployments                                                                                                                                | Builds                                                                                                                   | Description                                                                                                       |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| [`./apps/connector`](./apps/connector) | [![chrome web store](https://img.shields.io/badge/chrome-grey)](https://chromewebstore.google.com/detail/kahehnbpamjplefhpkhafinaodkkenpg) | [![jenkins job](https://img.shields.io/badge/jenkins-grey)](https://ci.status.im/job/status-web/job/main/job/connector/) | Status Desktop Wallet extended to decentralised applications in your browser.                                     |
| [`./apps/portfolio`](./apps/portfolio) |                                                                                                                                            |                                                                                                                          |                                                                                                                   |
| [`./apps/wallet`](./apps/wallet)       | [![chrome web store](https://img.shields.io/badge/chrome-grey)](https://chromewebstore.google.com/detail/opkfeajbclhjdneghppfnfiannideafj) | [![jenkins job](https://img.shields.io/badge/jenkins-grey)](https://ci.status.im/job/status-web/job/main/job/wallet/)    | Easily view and manage your crypto portfolio in real time — Beta crypto wallet and Web3 portfolio tracker in one. |
| [`./apps/api`](./apps/api)             |                                                                                                                                            |                                                                                                                          |                                                                                                                   |

## Prerequisites

Required:

- **[Node.js](https://nodejs.org/)** v20.x
- **[pnpm](https://pnpm.io)** v9.12.x

## Stack

- **Turborepo**: Manages our monorepo and speeds up builds
- **TypeScript**: Adds type safety to our code
- **React**: Our main library for building UIs
- **Radix UI / React Aria**: Provides accessible UI primitives
- **Tailwind CSS**: Used for styling
- **Vite**: Our build tool and dev server
- **Storybook**: For developing and showcasing components
- **ESLint**: Keeps our code consistent and catches potential issues
- **Prettier**: Formats our code
- **Changesets**: Manages versioning and changelogs

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/status-im/status-web.git
   cd status-web
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Build all packages:

   ```
   pnpm build
   ```

4. Run tests:

   ```
   pnpm test
   ```

5. Start development mode:
   ```
   pnpm dev
   ```

## Storybook

To view and interact with the components, you can run Storybook:

```
pnpm storybook
```

This will start the Storybook server, allowing you to browse and test components in isolation.

## Sponsors

This project is sponsored by Browserstack.
