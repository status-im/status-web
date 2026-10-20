# @status-im/icons

The Status icon set as generated React components plus the raw SVGs. Icons are split into five sets,
each imported from its own subpath. Source SVGs live in [svg/](./svg); the components in `src/` are
generated from them by [scripts/sync.ts](./scripts/sync.ts) and SVGR.

## Install

    pnpm add @status-im/icons

## Usage

    import { AddIcon, ArrowLeftIcon } from '@status-im/icons/20'

The root entry `@status-im/icons` throws on import. Import from `@status-im/icons/12`, `/16`, `/20`,
`/reactions` or `/social` instead. Raw SVGs are also published, e.g. `@status-im/icons/20/add-icon.svg`.

Browse all icons in Storybook: https://status-components.vercel.app/?path=/story/icons

## Updating icons

Two scripts, run in order:

    pnpm --filter @status-im/icons sync       # Figma -> svg/
    pnpm --filter @status-im/icons generate   # svg/ -> src/ (svgr)

`sync` fetches SVGs from the Figma
[Iconset](https://www.figma.com/design/qLLuMLfpGxK9OfpIavwsmK/Iconset?node-id=3239-987&node-type=frame&m=dev)
file into `svg/` and prompts for a Figma personal access token. `generate` runs SVGR
([svgr.config.js](./svgr.config.js)) to build the React components in `src/`. `src/` is generated
output: never hand-edit it. Change the Figma file, the `svg/` source, or the scripts instead.

Publishing is currently manual with no automated flow; see
[../../docs/deployment.md#npm-packages](../../docs/deployment.md#npm-packages).
