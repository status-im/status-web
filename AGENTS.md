# AGENTS.md

Operating guide for AI agents in this pnpm + Turborepo monorepo; human docs are in [README.md](README.md).

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
