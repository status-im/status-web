# @status-im/colors

The Status design system color palette as plain object exports, generated from Figma. Tokens are
`rgba()` strings consumed by Tailwind configs and the component library. See [src/index.ts](./src/index.ts).

## Install

    pnpm add @status-im/colors

## Usage

    import { danger, neutral } from '@status-im/colors'

    console.log(neutral['50']) // 'rgba(100 112 132 / 100%)'

Namespaces exported: `blur`, `customisation`, `danger`, `networks`, `neutral`, `security`, `social`,
`success`, `white`. Components spread these into their Tailwind config, see
[../components](../components).

Browse the palette in Storybook: https://status-components.vercel.app/?path=/story/colors

## Updating tokens

Tokens are generated from the Figma
[Foundations](https://www.figma.com/design/v98g9ZiaSHYUdKWrbFg9eM/Foundations?node-id=619-5995&node-type=canvas&m=dev)
file:

    pnpm --filter @status-im/colors sync

The script ([scripts/sync.ts](./scripts/sync.ts)) reads Figma color styles, writes one file per
namespace into `src/` and regenerates `src/index.ts`. It prompts for a Figma personal access token.
`src/` is generated output: edit the Figma file or the sync script, not the generated files.

Publishing is currently manual with no automated flow; see
[../../docs/deployment.md#npm-packages](../../docs/deployment.md#npm-packages).
