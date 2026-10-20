# @status-im/eslint-config

Shared flat ESLint config for the monorepo: TypeScript, React, import order, jsx-a11y, prettier and
optional Tailwind rules. Entry point [index.js](./index.js).

## Install

    pnpm add -D @status-im/eslint-config

ESLint 9 is a peer dependency.

## Usage

In `eslint.config.mjs`:

    import configs, { tailwindcssConfigs } from '@status-im/eslint-config'

    export default [...configs, ...tailwindcssConfigs]

The default export covers TypeScript, React, hooks, import order, jsx-a11y and prettier. The named
`tailwindcssConfigs` export adds Tailwind class rules and is used by every workspace that styles with
Tailwind. See [packages/components/eslint.config.mjs](../components/eslint.config.mjs) for an example.

Publishing is currently manual with no automated flow; see
[../../docs/deployment.md#npm-packages](../../docs/deployment.md#npm-packages).
