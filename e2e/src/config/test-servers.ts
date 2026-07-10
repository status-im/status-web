/**
 * Decide which projects run and which dev servers Playwright's webServer must
 * start. Shared by playwright.config.ts and global-setup.ts.
 *
 * The wallet-extension projects (wallet-send/-swap) are OPT-IN: they need the
 * local status-api backend (apps/api, which the shared CI can't run) plus a
 * built wallet extension, so a plain `pnpm test` (as CI runs) must NOT include
 * them. They are defined only when RUN_WALLET_E2E is set (the test:wallet-* CI
 * flows). This MUST be env-based, not argv-based: Playwright re-evaluates the
 * config in worker processes where `--project` is NOT in argv, so an argv-based
 * gate would define a different project set in workers ("project not found").
 */

const HUB_PROJECTS = ['smoke', 'wallet-flows', 'anvil']

/** Projects passed via `--project`/`--project=` on the CLI (empty = all defined). */
export function selectedProjects(): string[] {
  const args = process.argv.slice(2)
  return args.flatMap((arg, i) => {
    if (arg.startsWith('--project=')) return [arg.slice('--project='.length)]
    if (arg === '--project' && args[i + 1]) return [args[i + 1]]
    return []
  })
}

/**
 * Whether the wallet-extension projects are defined for this run. Env-based so
 * the project list is identical in the main and worker processes.
 */
export function runsWalletProjects(): boolean {
  return !!process.env.RUN_WALLET_E2E
}

/** Whether any Hub-backed project runs (default when no explicit selection). */
export function runsHubProjects(): boolean {
  const projects = selectedProjects()
  if (projects.length === 0) return true // default run = the core (Hub) suite
  return projects.some(p => HUB_PROJECTS.includes(p))
}
