# AGENTS.md

Rules for agents working in this pnpm + Turborepo monorepo. The human overview is in
[README.md](README.md). Workspaces with their own `AGENTS.md` add rules on top of this file, so
read both.

## Repo shape

Apps, with the dev port each one uses:

| Path                  | What it is                        | Port |
| --------------------- | --------------------------------- | ---- |
| `apps/api`            | tRPC API plus a JSON-RPC proxy    | 3030 |
| `apps/community-dapp` | Community curator dapp, webpack   | 8080 |
| `apps/connector`      | Dapp connector extension, Plasmo  | -    |
| `apps/get.status.app` | Download subset of status.app     | 3005 |
| `apps/hub`            | Status Network Hub dapp           | 3003 |
| `apps/portfolio`      | Portfolio tracker dapp            | 3004 |
| `apps/status.app`     | Main Status website, Contentlayer | 3001 |
| `apps/status.network` | Status Network website, Ghost     | 3002 |
| `apps/wallet`         | Wallet extension, WXT             | 4000 |

The packages hold the libraries the apps share: `colors` and `icons` are the design tokens,
`components` is the UI library, `status-js` is the SDK (`@status-im/js`), `wallet` has the wallet UI
and tRPC data layer, `status-network` is shared by status.network and hub, `ethereum-provider` is the
EIP-1193 provider, `eslint-config` is the shared lint config, `sitemap-utils` writes the sitemaps for
the static exports, and `community-contracts` holds the Solidity contracts (Foundry). `e2e` is the
Playwright workspace.

## Commands

Run everything from the repo root on Node 22 and pnpm 9.12.3. Use
`pnpm --filter <name> <script>` for a single workspace, for example `pnpm --filter hub dev`.

`pnpm dev` runs `pnpm install` first (the `predev` hook), then the `dev`, `dev:next` and
`dev:content` tasks of every app and `@status-im/*` package. `pnpm build` and `pnpm test` skip
`e2e`; `pnpm lint` includes it; `pnpm typecheck` runs every workspace's `typecheck` script. CI runs
build, typecheck, lint, `pnpm format --check` and test, so format any file you touch, Markdown
included.

## Submodules

Run `git submodule update --init --recursive` before building. status.app builds need
`apps/status.app/content/specs` (status-im/status-specs), status.network builds need
`apps/status.network/content/legal-external`, and the Foundry build needs
`packages/community-contracts/lib/*` (forge-std, minime, openzeppelin-contracts).

## Dependencies

- Do not remove a patch in `patches/` (pnpm `patchedDependencies`) or an entry in `pnpm.overrides` (React and several transitive pins) without finding out why it is there.
- Do not add changesets or bump versions to publish. Changesets were removed and nothing publishes; see [docs/deployment.md](docs/deployment.md).

## UI work

- Reuse components and the Tailwind configuration from `packages/components/`, colors from `packages/colors/` and icons from `packages/icons/`.
- Search `apps/` for an existing component before writing one. If none fits, extract it or compose a new one from the UI components.
- Ask the human how to proceed when a component or design is missing.

## Site content is not code documentation

These paths are published to end users on the websites. Do not treat them as documentation of the codebase, and do not edit them as part of docs work:

- `apps/status.app/content/` (help centre, legal, `specs` submodule, style-guide)
- `apps/status.network/content/` (legal, `legal-external` submodule, `karma-tokenomics.md`)
- `apps/portfolio/content/`
- `apps/get.status.app/content/`
- `apps/get.status.app/llms.txt`

## Git

- Never add AI attribution or `Co-Authored-By` trailers to commits, PRs or docs.
- Open PRs against `develop`.

## Documentation

Docs are maintained by hand and by the ai-docs-sync workflow on every merge to `develop`. Follow
this layout so both stay in step:

- `README.md` (root and every app or package): for humans. What it is, how to run it, where to go
  next. Short. No agent rules.
- `AGENTS.md` (root and app or package roots only): rules and caveats for agents. Imperative, no
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
- [docs/architecture.md](docs/architecture.md): which app uses which package, content pipelines, extensions.
- [docs/deployment.md](docs/deployment.md): Jenkins, Vercel, extension releases, npm packages.
- Each workspace has its own `README.md` and, where rules exist, `AGENTS.md`.
