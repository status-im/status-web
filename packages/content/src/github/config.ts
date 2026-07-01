/**
 * GitHub integration config.
 *
 * Resolved from env vars per plan §6. The CMS reads this once at boot and
 * passes it into the mutation primitives. Test code can call `setGithubConfig`
 * to inject a fixture.
 */

const DEFAULT_STAGING_BRANCH = 'develop'
const DEFAULT_PRODUCTION_BRANCH = 'master'
const DEFAULT_BASE_BRANCH = 'develop'
const DEFAULT_BRANCH_PREFIX = 'content/'

export type GithubConfig = {
  owner: string
  repo: string
  /** Long-lived branch where CMS PRs are merged into first. Default: develop. */
  stagingBranch: string
  /** Production branch — promoted to via a separate develop→master PR. */
  productionBranch: string
  /** Base branch for new content PRs (defaults to staging). */
  prBaseBranch: string
  /** Prefix on every CMS-managed branch (e.g. "content/rfp-foo-2026-04"). */
  contentBranchPrefix: string
  /** GitHub App installation credentials. Personal tokens are not supported. */
  appId: string
  appPrivateKey: string
  installationId: number
  /**
   * When `false` (default) the mutation service refuses to commit straight
   * to staging or production branches; only branches with the content prefix
   * are writable. Set to `true` to allow direct commits in development.
   */
  directCommitEnabled: boolean
}

let configured: GithubConfig | null = null

const required = (name: string, value: string | undefined): string => {
  if (!value || value.trim() === '') {
    throw new Error(`${name} env var is required for GitHub integration`)
  }
  return value
}

const normalizePrivateKey = (value: string): string => {
  const trimmed = value.trim()
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed
  const normalized = unquoted.replace(/\\n/g, '\n')

  if (
    !normalized.includes('-----BEGIN') ||
    !normalized.includes('PRIVATE KEY-----') ||
    !normalized.includes('-----END')
  ) {
    throw new Error(
      'GITHUB_APP_PRIVATE_KEY must include the full PEM value with BEGIN and END lines'
    )
  }

  return normalized
}

const optional = (value: string | undefined): string | undefined => {
  if (!value || value.trim() === '') return undefined
  return value
}

const parseInstallationId = (value: string | undefined): number | undefined => {
  if (!value) return undefined
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(
      `GITHUB_INSTALLATION_ID must be a positive integer; got "${value}"`
    )
  }
  return parsed
}

const requiredInstallationId = (value: string | undefined): number => {
  const parsed = parseInstallationId(value)
  if (!parsed) {
    throw new Error(
      'GITHUB_INSTALLATION_ID env var is required for GitHub App authentication'
    )
  }
  return parsed
}

const assertNoPersonalToken = (): void => {
  if (optional(process.env.GITHUB_TOKEN)) {
    throw new Error(
      'GITHUB_TOKEN is not supported. Use GitHub App authentication so CMS GitHub actions are attributed to the app, not a personal account.'
    )
  }
}

/**
 * Read config from env. Throws if `GITHUB_OWNER` / `GITHUB_REPO` are unset
 * — the integration cannot function without a target repo.
 */
export const loadGithubConfigFromEnv = (): GithubConfig => {
  assertNoPersonalToken()

  return {
    owner: required('GITHUB_OWNER', process.env.GITHUB_OWNER),
    repo: required('GITHUB_REPO', process.env.GITHUB_REPO),
    stagingBranch: process.env.GITHUB_STAGING_BRANCH || DEFAULT_STAGING_BRANCH,
    productionBranch:
      process.env.GITHUB_PRODUCTION_BRANCH || DEFAULT_PRODUCTION_BRANCH,
    prBaseBranch: process.env.GITHUB_PR_BASE_BRANCH || DEFAULT_BASE_BRANCH,
    contentBranchPrefix:
      process.env.GITHUB_CONTENT_BRANCH_PREFIX || DEFAULT_BRANCH_PREFIX,
    appId: required('GITHUB_APP_ID', process.env.GITHUB_APP_ID),
    appPrivateKey: normalizePrivateKey(
      required('GITHUB_APP_PRIVATE_KEY', process.env.GITHUB_APP_PRIVATE_KEY)
    ),
    installationId: requiredInstallationId(process.env.GITHUB_INSTALLATION_ID),
    directCommitEnabled:
      (process.env.CONTENT_DIRECT_COMMIT_ENABLED || '').toLowerCase() ===
      'true',
  }
}

export const setGithubConfig = (config: GithubConfig): void => {
  configured = config
}

export const getGithubConfig = (): GithubConfig => {
  if (!configured) {
    configured = loadGithubConfigFromEnv()
  }
  return configured
}

/**
 * Test-only helper. Production code should not reset config at runtime.
 */
export const __resetGithubConfigForTests = (): void => {
  configured = null
}
