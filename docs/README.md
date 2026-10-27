# status-web docs

Reference for the parts of [status-web](..) that span more than one app or package. Anything owned by a single workspace lives in that workspace's `README.md` and in its `docs/` folder when it has one; the root [README.md](../README.md) lists every app and package.

- [architecture.md](architecture.md): apps vs packages, which app uses which package, the Status API, and how content reaches each site.
- [deployment.md](deployment.md): the Jenkins pipelines, the `deploy-*` branches, Vercel previews, extension releases and where npm publishing stands.
- [hardware-wallet-qr-signing.md](hardware-wallet-qr-signing.md): how hardware wallets sign over ERC-4527 QR codes, in the extension and for dApps, and how their nonces are held across the exchange.

## Writing docs

READMEs are for people, `AGENTS.md` files hold rules for coding agents, and reference material goes in a `docs/` folder. Put a doc in the narrowest workspace that owns all the code it describes; use this folder only when the topic spans workspaces. Start each doc with a `# Title` and one sentence of scope that links the code it covers, keep every fact in one place, and change the doc in the same PR as the behaviour. The full rules are in the Documentation section of the root [AGENTS.md](../AGENTS.md).

## AI tooling

Agent context comes only from `AGENTS.md` files, the root one plus one per workspace that has non-obvious rules. There is no `CLAUDE.md`, because Claude Code skips every `AGENTS.md` when one exists. Three limits are worth knowing:

- Claude Code below v2.1.277 reads no `AGENTS.md` at all.
- A personal `CLAUDE.local.md` switches `AGENTS.md` off for that user; set `instructionFiles: claude-md-and-agents-md` in `~/.claude/settings.json` to turn it back on.
- VS Code Copilot reads nested `AGENTS.md` files only when `chat.useNestedAgentsMdFiles` is on.
