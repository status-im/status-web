# @status-im/icons

The Status icon set as React components plus the raw SVGs they were built from. Icons come in five sets, and each set is its own import path. The components in [src](./src) are generated from [svg](./svg) by SVGR.

## Install

```bash
pnpm add @status-im/icons
```

React 16, 17 or 18 and `react-dom` are peer dependencies.

## Usage

```tsx
import { AddIcon, ArrowLeftIcon } from '@status-im/icons/20'
```

The sets are `12`, `16`, `20`, `reactions` and `social`, and names follow the file name in PascalCase:

| Import path                  | Set                         |
| ---------------------------- | --------------------------- |
| `@status-im/icons/12`        | 12px UI icons               |
| `@status-im/icons/16`        | 16px UI icons               |
| `@status-im/icons/20`        | 20px UI icons, the main set |
| `@status-im/icons/reactions` | Message reactions           |
| `@status-im/icons/social`    | Social network logos        |

Importing from `@status-im/icons` itself throws, so always name the set. The SVGs are published too: `@status-im/icons/20/add-icon.svg` and so on, if you need one as a file instead of a component.

The sync script turns the Figma `#09101C` fill into `currentColor`, so most icons take their color from the parent's text color. A few keep their own fills. Browse them at https://status-components.vercel.app/?path=/story/icons

## Updating the icons

```bash
pnpm --filter @status-im/icons sync       # Figma -> svg/
pnpm --filter @status-im/icons generate   # svg/ -> src/
```

`sync` asks for a Figma personal access token and pulls the frames of the [Iconset](https://www.figma.com/design/qLLuMLfpGxK9OfpIavwsmK/Iconset?node-id=3239-987&node-type=frame&m=dev) file into `svg/`, one folder per set. `generate` deletes `src/` and runs SVGR with [svgr.config.js](./svgr.config.js), then lints and formats the result.

Change the Figma file, the SVGs in `svg/` or the two scripts. Never edit `src/` by hand: the next `generate` throws it away.

There is no publish flow: releases happen by hand and have no owner. See [docs/deployment.md](../../docs/deployment.md#npm-packages).
