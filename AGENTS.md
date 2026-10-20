# AGENTS.md

Operating guide for AI agents in this pnpm + Turborepo monorepo. Human docs are in [README.md](README.md).

## Repo shape

| Path                           | Role                                   | Dev port |
| ------------------------------ | -------------------------------------- | -------- |
| `apps/api`                     | Status API tRPC backend                | 3030     |
| `apps/community-dapp`          | Community curator dapp (webpack)       | 8080     |
| `apps/connector`               | Connector extension (Plasmo)           | -        |
| `apps/get.status.app`          | Download subset of status.app          | 3005     |
| `apps/hub`                     | Status Network Hub dapp                | 3003     |
| `apps/portfolio`               | Portfolio tracker dapp                 | 3004     |
| `apps/status.app`              | Main Status website (Contentlayer)     | 3001     |
| `apps/status.network`          | Status Network website (Ghost)         | 3002     |
| `apps/wallet`                  | Crypto wallet extension (WXT)          | 4000     |
| `packages/colors`              | Color design tokens                    | -        |
| `packages/icons`               | Icon design tokens                     | -        |
| `packages/components`          | UI component library                   | -        |
| `packages/status-js`           | Status JS SDK (`@status-im/js`)        | -        |
| `packages/wallet`              | Shared wallet UI and tRPC data layer   | -        |
| `packages/status-network`      | Shared code for status.network and hub | -        |
| `packages/ethereum-provider`   | EIP-1193 provider (wallet, connector)  | -        |
| `packages/eslint-config`       | Shared ESLint configuration            | -        |
| `packages/sitemap-utils`       | Sitemap helpers for static exports     | -        |
| `packages/community-contracts` | Solidity contracts (Foundry)           | -        |
| `e2e`                          | Playwright end-to-end tests            | -        |

## Commands

Run from the repo root. Node 22 (`engines`, `.node-version`) and pnpm 9.12.3 (`packageManager`) are required.

- `pnpm dev` runs `predev` first, which runs `pnpm install`, then `turbo run dev dev:next dev:content` across every app and package.
- `pnpm build`, `pnpm test`, `pnpm lint`, `pnpm typecheck` run the same task across every workspace via Turbo.
- `pnpm storybook` starts the components Storybook.
- `pnpm --filter <name> <script>` targets one workspace (for example `pnpm --filter hub dev`).

## Submodules

Initialize once with `git submodule update --init --recursive`. The apps and packages that need them:

- `apps/status.app/content/specs` (status-im/status-specs): required by status.app builds.
- `apps/status.network/content/legal-external`: required by status.network builds.
- `packages/community-contracts/lib/*` (forge-std, minime, openzeppelin-contracts): required by the Foundry build.

## Dependencies

- `patches/` holds pnpm `patchedDependencies`. `package.json` `pnpm.overrides` pins React and several transitive versions. Do not remove a patch or override without checking why it exists.
- Changesets are gone. Do not add changesets or bump versions to publish; there is no release automation. See [docs/deployment.md](docs/deployment.md).

## UI work

When implementing designs and building UI:

- Reuse existing UI components and Tailwind configuration from `packages/components/`.
- Reuse colors from `packages/colors/`.
- Reuse icons from `packages/icons/`.
- Search for components in `apps/`. If none solves the problem, extract one or create a new one by composing UI components.
- Ask the human how to proceed when components or designs are missing.

## Site content is not code documentation

These paths are published to end users on the websites. Do not treat them as documentation of the codebase, and do not edit them as part of docs work:

- `apps/status.app/content/` (help centre, legal, `specs` submodule, style-guide)
- `apps/status.network/content/` (legal, `legal-external` submodule, `karma-tokenomics.md`)
- `apps/portfolio/content/`
- `apps/get.status.app/content/`
- `apps/get.status.app/llms.txt`

## Git

- Never add AI attribution or `Co-Authored-By` trailers to commits, PRs or docs.
- The PR base branch is `develop`.

## Documentation

Docs are maintained by hand and by the ai-docs-sync workflow on every merge to `develop`. Follow
this layout so both stay in step:

- `README.md` (root and every app or package): for humans. What it is, how to run it, where to go
  next. Short. No agent rules.
- `AGENTS.md` (root and app or package roots only): rules and gotchas for agents. Imperative, no
  reference material. Root at most 6,000 characters, others at most 3,500.
- `docs/` at the root: topics that span more than one app or package. `docs/README.md` is the index.
- `apps/<name>/docs/`, `packages/<name>/docs/`: detailed reference owned by one app or package,
  indexed by its own `docs/README.md`. Dated research notes go in `docs/research/` and are frozen.
- No `CLAUDE.md`: Claude Code ignores every `AGENTS.md` when one exists.

A doc lives in the narrowest app or package that owns all the code it describes. Each doc starts
with `# Title`, then one sentence of scope that links the code paths it covers. State each fact in
one place and link to it elsewhere. Use relative links, no en or em dashes, no AI attribution.
Update the matching doc in the same PR when you change behaviour, commands, env vars or routes.

## Docs map

- [docs/README.md](docs/README.md): index of the cross-cutting docs.
- [docs/architecture.md](docs/architecture.md): apps vs packages, consumers, content pipelines, extensions.
- [docs/deployment.md](docs/deployment.md): CI, Vercel, extension releases, npm packages.
- Each workspace has its own `README.md` and, where rules exist, `AGENTS.md`.
