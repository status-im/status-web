/**
 * CMS branch naming, plan §9.
 *
 * Examples:
 *   content/nav-main-20260427-1530
 *   content/builders-hub-rfp-secure-decentralised-frontends-20260427-1530
 *   content/circles-event-los-angeles-circle-4-20260427-1530
 *
 * The trailing timestamp keeps re-edits unique even if the editor cancels and
 * starts again before the previous PR closes. The branch lint workflow
 * accepts anything starting with `content/` so the suffix can evolve.
 */

const padTwo = (value: number): string => value.toString().padStart(2, '0')

const formatTimestamp = (date: Date): string => {
  const yyyy = date.getUTCFullYear().toString()
  const mm = padTwo(date.getUTCMonth() + 1)
  const dd = padTwo(date.getUTCDate())
  const hh = padTwo(date.getUTCHours())
  const mi = padTwo(date.getUTCMinutes())
  return `${yyyy}${mm}${dd}-${hh}${mi}`
}

/**
 * Slugify a free-form record identifier (slug, route, or label) into a
 * branch-safe segment: lowercase, kebab-case, alphanumeric + dashes only,
 * collapsed.
 */
const slugifyForBranch = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

export type BranchNameInput = {
  /** Logical content type — drives the leading namespace. */
  contentType: string
  /**
   * Identifier for the record being edited. Slug for collections; route for
   * page-level records (e.g. "/builders-hub" → "builders-hub").
   */
  identifier: string
  /** Override for tests. Defaults to `new Date()`. */
  now?: Date
}

export const buildContentBranchName = ({
  contentType,
  identifier,
  now,
}: BranchNameInput): string => {
  const namespace = slugifyForBranch(contentType)
  const slug = slugifyForBranch(identifier)
  const timestamp = formatTimestamp(now ?? new Date())
  if (!namespace || !slug) {
    throw new Error(
      `branch name requires non-empty contentType and identifier (got contentType="${contentType}", identifier="${identifier}")`
    )
  }
  return `content/${namespace}-${slug}-${timestamp}`
}
