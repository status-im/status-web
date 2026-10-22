# components

Rules for agents working in `packages/components`. The root [AGENTS.md](../../AGENTS.md) applies too. `@status-im/components` is the shared component library for the Status apps and sites, consumed through the workspace and also on npm as a public package.

## Commands

- `pnpm --filter @status-im/components storybook`: Storybook on port 3001. Run it before a visual change.
- `pnpm --filter @status-im/components build`: Vite build plus `tsc` declarations.
- `pnpm --filter @status-im/components typecheck` and `... lint`.

## Rules

- Build on Radix UI (`@radix-ui/react-*`) and React Aria. Do not hand-roll focus, dismissal or keyboard behaviour they already give you.
- Style with Tailwind classes through `cva` variants, and take colors from `@status-im/colors`, never a hex literal.
- Export every component from [src/index.tsx](./src/index.tsx) or consumers cannot import it.
- Add a colocated `*.stories.tsx` with the variants and sizes, and check it under the Storybook customisation and dark mode toolbars.
- Keep app logic out. If only one app needs the behaviour, it belongs in that app.
- Treat public props and exports as API: the package is on npm, so rename or remove them only with a deprecation path.

## Caveats

- Consumers must list `./node_modules/@status-im/components/dist/**/*.js` in their Tailwind `content`, or the component classes are purged. See [apps/status.app/tailwind.config.ts](../../apps/status.app/tailwind.config.ts).
- The build keeps `use client` directives through `rollup-plugin-preserve-directives`, and `sideEffects: ["*.css"]` keeps any CSS the package imports from being tree-shaken. Do not remove either.
- `StatusProvider` carries the link element in `config.link` (`a` by default); Next.js apps pass their `Link`.
- [tailwind.config.ts](./tailwind.config.ts) is the preset apps import as `@status-im/components/config`. Change theme values there rather than in each app.

## Docs

- [README.md](./README.md): install and usage for consumers.
- [../../docs/deployment.md](../../docs/deployment.md#npm-packages): where npm publishing stands.
