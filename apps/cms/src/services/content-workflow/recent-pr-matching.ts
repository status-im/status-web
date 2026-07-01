type RecentPrMatchInput = {
  slug?: string | null
  targetPath?: string | null
}

export type RecentPrMatchableDocument = {
  branchName?: string | null
  targetPath?: string | null
}

export const matchesRecentPullRequestScope = (
  doc: RecentPrMatchableDocument,
  { slug, targetPath }: RecentPrMatchInput
): boolean => {
  if (targetPath) return doc.targetPath === targetPath
  if (!slug) return true

  const branchName = doc.branchName ?? ''
  const docTargetPath = doc.targetPath ?? ''
  return branchName.includes(slug) || docTargetPath.includes(`/${slug}/`)
}
