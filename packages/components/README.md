# @status-im/components

Accessible React components for Status apps and websites, built on Radix UI and React Aria, styled
with Tailwind CSS and `@status-im/colors`. Entry point [src/index.tsx](./src/index.tsx).

## Install

    pnpm add @status-im/components

React 18 is a peer dependency; `@status-im/colors` and `@status-im/icons` ship as dependencies.

## Usage

    import { Button, StatusProvider } from '@status-im/components'

    function App() {
      return (
        <StatusProvider config={{ link: 'a' }}>
          <Button variant="primary">Hello</Button>
        </StatusProvider>
      )
    }

`StatusProvider` supplies app-level config such as the link element used by link-style components.

The package also exports a Tailwind preset under a subpath:

    import config from '@status-im/components/config'

    export default {
      presets: [config],
      content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@status-im/components/dist/**/*.js',
      ],
    }

The `content` entry is required so Tailwind picks up classes from the compiled components.

## Storybook

Components are developed and browsed in Storybook: https://status-components.vercel.app

    pnpm --filter @status-im/components storybook

Publishing is currently manual with no automated flow; see
[../../docs/deployment.md#npm-packages](../../docs/deployment.md#npm-packages).
