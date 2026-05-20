import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

/**
 * Last commit date for a file from git history.
 *
 * For submodule content, pass `gitDir` pointing at the submodule root and a
 * path relative to that directory (e.g. `document.md`).
 */
export async function getGitFileLastEdited(
  relativePath: string,
  options?: { gitDir?: string },
): Promise<Date | null> {
  const cwd = options?.gitDir ?? process.cwd()

  try {
    const { stdout } = await execFileAsync(
      'git',
      ['log', '-1', '--format=%cd', '--date=iso-strict', '--', relativePath],
      { cwd, encoding: 'utf8' },
    )

    const trimmed = stdout.trim()
    if (!trimmed) {
      return null
    }

    const date = new Date(trimmed)
    return Number.isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}
