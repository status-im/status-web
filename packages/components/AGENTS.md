# AGENTS.md

Rules for agents working in `packages/components`. The root [AGENTS.md](../../AGENTS.md) also applies.

## Role

`@status-im/components` is the shared, published component library for Status apps and websites. It is
built on Radix UI and React Aria primitives, styled with Tailwind CSS and `@status-im/colors`, and
exported from [src/index.tsx](./src/index.tsx). Never add app-specific logic here; that belongs in the
consuming app.

## Commands

- `pnpm --filter @status-im/components storybook`: run Storybook on port 3001.
- `pnpm --filter @status-im/components build`: build the library and types (`vite build` + `tsc`).
- `pnpm --filter @status-im/components typecheck` and `... lint`: typecheck and lint `src`.

## Rules

- Compose primitives from Radix UI (`@radix-ui/react-*`) and React Aria (`react-aria-components`).
  Do not hand-roll accessibility behaviour they already provide.
- Style with Tailwind classes via `cva` variants and `cx`. Colors come from `@status-im/colors`,
  never hard-coded hex values.
- Every component gets a colocated `*.stories.tsx`. Stories cover variants, sizes, states and dark
  mode (Storybook backgrounds switch light/dark).
- Add new components to [src/index.tsx](./src/index.tsx) or they do not ship.
- Keep [tailwind.config.ts](./tailwind.config.ts) in sync with design tokens; apps consume it as a
  preset via `@status-im/components/config`.
- The package is published (`@status-im/components` on npm): public props and exports are API. Do not
  rename or remove them without a deprecation path.

## Caveats

- Apps must list `./node_modules/@status-im/components/dist/**/*.js` in their Tailwind `content`, or
  component classes are purged. See [apps/status.app/tailwind.config.ts](../../apps/status.app/tailwind.config.ts).
- The `sideEffects: ["*.css"]` setting and the `preserveDirectives` build plugin keep `use client`
  directives and CSS working; do not remove them.
- `StatusProvider` requires a `config.link` element (defaults to `a`); Next.js apps pass their `Link`.
- Storybook is the source of visual truth; run it before opening a PR for visual changes.

## Docs

- [README.md](./README.md): install and usage for consumers.
- [../../docs/deployment.md](../../docs/deployment.md): npm publishing state and manual flow.
