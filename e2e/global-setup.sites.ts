import {
  BYPASS_HEADER,
  BYPASS_TOKEN,
  isLocalTarget,
  STATUS_APP_URL,
} from './src/config/site.js'
import { selectedProjects } from './src/config/test-servers.js'
import { assertTargetsAnswer } from './src/helpers/target-check.js'

import type { FullConfig } from '@playwright/test'

/** `--project` accepts `*` wildcards and ignores case. */
function matchesProject(name: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`^${escaped.replaceAll('*', '.*')}$`, 'i').test(name)
  })
}

/**
 * Deployed base URLs of the projects in this run. Local targets are left out:
 * `webServer` waits for those, and a server that is not running refuses the
 * connection, so each test fails on that at once.
 */
export function remoteBaseURLs(config: FullConfig): string[] {
  const selected = selectedProjects()
  return config.projects
    .filter(
      project =>
        selected.length === 0 || matchesProject(project.name, selected),
    )
    .flatMap(project => project.use.baseURL ?? [])
    .filter(baseURL => !isLocalTarget(baseURL))
}

/**
 * Global setup of the website suites (status.app, static exports). Stops
 * before the first test when a deployed target does not answer.
 */
export default async function globalSetup(config: FullConfig): Promise<void> {
  await assertTargetsAnswer(remoteBaseURLs(config), bypassHeader)
}

/**
 * The bypass header goes to status.app only, as in `site.fixture.ts`: the token
 * must never leave the origin it was issued for.
 */
function bypassHeader(url: string): Record<string, string> {
  const sameOrigin = new URL(url).origin === new URL(STATUS_APP_URL).origin
  return BYPASS_TOKEN && sameOrigin ? { [BYPASS_HEADER]: BYPASS_TOKEN } : {}
}
