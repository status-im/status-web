# `status-web`

[![CI](https://github.com/status-im/status-web/actions/workflows/ci.yml/badge.svg)](https://github.com/status-im/status-web/actions/workflows/ci.yml)

This monorepo contains packages for building web applications in the Status ecosystem. These packages can be used separately or combined to create consistent and beautiful user interfaces.

## Packages

| Name                                                   | `npm`                                                                                                                               | Description                                                                                                                                                                   |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@status-im/components`](./packages/components)       | [![npm version](https://img.shields.io/npm/v/@status-im/components)](https://www.npmjs.com/package/@status-im/components)           | Component library built with Radix UI, React Aria, Tailwind CSS.                                                                                                              |
| [`@status-im/js`](./packages/status-js)                | [![npm version](https://img.shields.io/npm/v/@status-im/js)](https://www.npmjs.com/package/@status-im/js)                           | Library for Waku protocol integration and blockchain interactions.                                                                                                             |
| [`@status-im/icons`](./packages/icons)                 | [![npm version](https://img.shields.io/npm/v/@status-im/icons)](https://www.npmjs.com/package/@status-im/icons)                     | Auto-generated icon library based on our [design system](https://www.figma.com/design/qLLuMLfpGxK9OfpIavwsmK/Iconset?node-id=3239-987&node-type=frame&t=0h8iIiZ3Sf0g4MRV-11). |
| [`@status-im/colors`](./packages/colors)               | [![npm version](https://img.shields.io/npm/v/@status-im/colors.svg)](https://www.npmjs.com/package/@status-im/colors)               | Auto-generated color palette based on our [design system](https://www.figma.com/design/v98g9ZiaSHYUdKWrbFg9eM/Foundations?node-id=619-5995&node-type=canvas&m=dev).           |
| [`@status-im/eslint-config`](./packages/eslint-config) | [![npm version](https://img.shields.io/npm/v/@status-im/eslint-config.svg)](https://www.npmjs.com/package/@status-im/eslint-config) | Shared ESLint configuration for consistent code style across projects.                                                                                                        |

## Apps

| Name                                   | Description                                                                   |
| -------------------------------------- | ----------------------------------------------------------------------------- |
| [`./apps/connector`](./apps/connector) | Status Desktop Wallet extended to decentralised applications in your browser. |

## Prerequisites

Required:

- **[Node.js](https://nodejs.org/)** v20.x
- **[pnpm](https://pnpm.io)** v9.12.x

Recommended:

- **[Visual Studio Code](https://code.visualstudio.com/)**
  - install extensions listed in `.vscode/extensions.json` for optimal development experience

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
