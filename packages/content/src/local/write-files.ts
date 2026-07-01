import { mkdir, unlink, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { existsSync } from 'node:fs'

import type { FileChange } from '../github/mutations'
import { GET_SITE_CONTENT_DIR } from '../site'

const WORKSPACE_MARKERS = ['pnpm-workspace.yaml', 'turbo.json'] as const

const isWorkspaceRoot = (dir: string): boolean =>
  WORKSPACE_MARKERS.some((marker) => existsSync(resolve(dir, marker)))

const resolveRepoPath = (relativePath: string): string => {
  let dir = process.cwd()
  for (let i = 0; i <= 4; i++) {
    if (isWorkspaceRoot(dir)) {
      return resolve(dir, relativePath)
    }
    const parent = resolve(dir, '..')
    if (parent === dir) break
    dir = parent
  }
  throw new Error(
    `could not resolve repo path for "${relativePath}" from cwd "${process.cwd()}"`
  )
}

const writeChange = async (change: FileChange): Promise<void> => {
  const absolutePath = resolveRepoPath(change.path)

  if ('deleted' in change && change.deleted) {
    await unlink(absolutePath).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') throw error
    })
    return
  }

  if (!('content' in change)) {
    throw new Error(`unsupported file change at ${change.path}`)
  }

  await mkdir(dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, change.content)
}

export const isLocalContentWriteEnabled = (): boolean =>
  (process.env.CONTENT_LOCAL_WRITE || '').toLowerCase() === 'true'

export const writeFileChangesLocally = async (
  changes: FileChange[]
): Promise<void> => {
  for (const change of changes) {
    if (!change.path.startsWith(`${GET_SITE_CONTENT_DIR}/`)) {
      throw new Error(
        `refusing to write outside ${GET_SITE_CONTENT_DIR}: ${change.path}`
      )
    }
    await writeChange(change)
  }
}
