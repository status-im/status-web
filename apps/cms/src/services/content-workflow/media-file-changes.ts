import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { FileChange } from '@status-im/content/github'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_PUBLIC_ROOT = path.resolve(
  dirname,
  '../../../../get.status.app/public'
)
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024
const CMS_UPLOAD_PREFIX = '/cms/uploads/'

const isWriteChange = (
  change: FileChange
): change is Extract<FileChange, { content: string | Uint8Array }> =>
  'content' in change

const collectStrings = (value: unknown, out: Set<string>): void => {
  if (typeof value === 'string') {
    if (value.startsWith(CMS_UPLOAD_PREFIX)) out.add(value)
    return
  }

  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out)
    return
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectStrings(item, out)
  }
}

const getReferencedUploadPaths = (changes: readonly FileChange[]): string[] => {
  const paths = new Set<string>()
  for (const change of changes) {
    if (!isWriteChange(change) || typeof change.content !== 'string') continue

    try {
      collectStrings(JSON.parse(change.content), paths)
    } catch {
      continue
    }
  }
  return [...paths].sort((a, b) => a.localeCompare(b))
}

const toSafeRelativePublicPath = (publicPath: string): string => {
  const relativePath = publicPath.replace(/^\/+/, '')
  const normalized = path.posix.normalize(relativePath)
  if (
    normalized !== relativePath ||
    normalized.startsWith('../') ||
    normalized.includes('/../') ||
    !normalized.startsWith('cms/uploads/')
  ) {
    throw new Error(`invalid CMS upload path "${publicPath}"`)
  }
  return normalized
}

export const collectReferencedCmsUploadChanges = async ({
  changes,
  publicRoot = DEFAULT_PUBLIC_ROOT,
}: {
  changes: readonly FileChange[]
  publicRoot?: string
}): Promise<FileChange[]> => {
  const existingPaths = new Set(changes.map((change) => change.path))
  const uploadPaths = getReferencedUploadPaths(changes)
  const fileChanges: FileChange[] = []

  for (const uploadPath of uploadPaths) {
    const relativePublicPath = toSafeRelativePublicPath(uploadPath)
    const repoPath = `apps/get.status.app/public/${relativePublicPath}`
    if (existingPaths.has(repoPath)) continue

    const localPath = path.join(publicRoot, relativePublicPath)
    let info: Awaited<ReturnType<typeof stat>>
    try {
      info = await stat(localPath)
    } catch (error) {
      throw new Error(
        `referenced CMS upload is missing: ${uploadPath} (${localPath})`,
        { cause: error }
      )
    }
    if (!info.isFile()) {
      throw new Error(`referenced CMS upload is not a file: ${uploadPath}`)
    }
    if (info.size > MAX_UPLOAD_BYTES) {
      throw new Error(
        `referenced CMS upload exceeds 2 MB: ${uploadPath} (${info.size} bytes)`
      )
    }

    fileChanges.push({
      path: repoPath,
      content: await readFile(localPath),
    })
  }

  return fileChanges
}
