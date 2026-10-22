# @status-im/colors

The Status color palette as plain objects, one export per palette, generated from Figma. Values are `rgba()` strings, so they go straight into a Tailwind config, a `style` object or a stylesheet. Everything is re-exported from [src/index.ts](./src/index.ts).

## Install

```bash
pnpm add @status-im/colors
```

## Usage

```ts
import { danger, neutral } from '@status-im/colors'

neutral['50'] // 'rgba(100 112 132 / 100%)'
```

Nine palettes: `blur`, `customisation`, `danger`, `networks`, `neutral`, `security`, `social`, `success` and `white`. Keys are strings and several contain a slash or a dot (`'2.5'`, `'80/5'`), so use brackets. `customisation` has one level more than the others: a family such as `army`, `sky` or `yellow`, then its shades.

[`@status-im/components`](../components) spreads the palettes into the Tailwind preset it ships as `@status-im/components/config`, which is how the apps get these colors as classes. Browse the whole palette in Storybook: https://status-components.vercel.app/?path=/story/colors

## Updating the palette

```bash
pnpm --filter @status-im/colors sync
```

The script ([scripts/sync.ts](./scripts/sync.ts)) asks for a Figma personal access token, reads the color styles in the [Foundations](https://www.figma.com/design/v98g9ZiaSHYUdKWrbFg9eM/Foundations?node-id=619-5995&node-type=canvas&m=dev) file, deletes `src/` and writes one file per palette plus a new `src/index.ts`. Anything you change in `src/` by hand is overwritten, so edit the Figma file or the script instead.

There is no publish flow: releases happen by hand and have no owner. See [docs/deployment.md](../../docs/deployment.md#npm-packages).
