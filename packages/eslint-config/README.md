# @status-im/eslint-config

The flat ESLint config used across this monorepo: TypeScript, React, hooks, import order, jsx-a11y and prettier, with an optional layer for Tailwind classes. Everything lives in [index.js](./index.js).

## Install

```bash
pnpm add -D @status-im/eslint-config
```

ESLint 9.14 or newer is a peer dependency.

## Usage

Create `eslint.config.mjs` in the workspace:

```js
import configs, { tailwindcssConfigs } from '@status-im/eslint-config'

export default [...configs, ...tailwindcssConfigs]
```

Both exports are arrays of flat configs, so spread them. The default export is the base layer; `tailwindcssConfigs` adds the Tailwind class rules, treats `cx` and `cva` as class name functions, and only belongs in workspaces that render Tailwind. [packages/components](../components/eslint.config.mjs) turns it on and [packages/colors](../colors/eslint.config.mjs) does not.

The Next.js apps also run `eslint-config-next`; `apps/api` and `apps/status.network` use that alone, and `apps/community-dapp` keeps its own config.

The import resolver is set up for this repo's layout: it reads `tsconfig.base.json` and the `tsconfig.json` of each workspace under `packages/*` and `apps/*`, so outside this repo you will want to adjust that block. Type-aware linting is not enabled, see the TODO in [index.js](./index.js).

There is no publish flow: releases happen by hand and have no owner. See [docs/deployment.md](../../docs/deployment.md#npm-packages).
