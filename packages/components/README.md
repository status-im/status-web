# @status-im/components

The React components the Status apps and sites share, built on Radix UI and React Aria and styled with Tailwind CSS plus [`@status-im/colors`](../colors). Public exports come from [src/index.tsx](./src/index.tsx) and the Tailwind preset from [tailwind.config.ts](./tailwind.config.ts).

## Install

```bash
pnpm add @status-im/components
```

React 18 is a peer dependency. `@status-im/colors` and `@status-im/icons` come with it as dependencies.

## Usage

```tsx
import { Button, StatusProvider } from '@status-im/components'

export function App() {
  return (
    <StatusProvider config={{ link: 'a' }}>
      <Button variant="primary">Hello</Button>
    </StatusProvider>
  )
}
```

`StatusProvider` holds the config the components read: the element used for links, `a` by default. Next.js apps pass their own `Link` so `Button` with an `href` stays client-side. Components that need state carry a `use client` directive, and the build keeps it, so they work inside server components.

## Tailwind

The package publishes its preset under a second entry point. Both the preset and the `dist` line in `content` are needed:

```js
import config from '@status-im/components/config'

export default {
  presets: [config],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@status-im/components/dist/**/*.js',
  ],
}
```

The build emits a file per module, so component classes only exist in `dist/`, and Tailwind purges them if `content` does not list it.

## Storybook

https://status-components.vercel.app has the components, the color palettes and the icon set. Run it locally with:

```bash
pnpm --filter @status-im/components storybook
```

Storybook serves on port 3001. Use its customisation and background toolbars to check a component on each color family and in dark mode.

The version on npm is behind this repo, and publishing is by hand with no owner. See [docs/deployment.md](../../docs/deployment.md#npm-packages).
