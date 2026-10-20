# status-web docs

Reference for topics that span more than one app or package in [status-web](..). Workspace-specific reference lives in `apps/<name>/docs/` and `packages/<name>/docs/`, indexed by each folder's own README.

| Doc                                | Read it when                                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| [architecture.md](architecture.md) | You need the big picture: apps vs packages, who consumes what, content pipelines, extensions. |
| [deployment.md](deployment.md)     | You are working on CI, Vercel, extension releases or npm publishing.                          |

## AI tooling note

This repo uses `AGENTS.md` only and never a `CLAUDE.md` (Claude Code skips every `AGENTS.md` when a `CLAUDE.md` exists). Known tool limits:

- Claude Code below v2.1.277 reads no `AGENTS.md`.
- A personal `CLAUDE.local.md` disables `AGENTS.md` for that user; the fix is `instructionFiles: claude-md-and-agents-md` in `~/.claude/settings.json`.
- VS Code Copilot reads nested `AGENTS.md` files only with `chat.useNestedAgentsMdFiles`.
