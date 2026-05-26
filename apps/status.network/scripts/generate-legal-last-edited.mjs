import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputPath = path.join(appRoot, 'src/generated/legal-last-edited.json')

/** Keep in sync with get-legal-document-content.ts */
const LEGAL_DOCUMENTS = [
  { name: 'privacy-policy', external: false },
  { name: 'terms-of-use', external: false },
  { name: 'status-network-pre-deposit-disclaimer', external: true },
  { name: 'status-network-pre-deposit-withdrawal-disclaimer', external: true },
]

async function getGitFileLastEdited(relativePath, { gitDir } = {}) {
  const cwd = gitDir ?? appRoot

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

async function main() {
  const dates = {}

  for (const { name, external } of LEGAL_DOCUMENTS) {
    const relativePath = external ? `${name}.md` : `content/legal/${name}.md`
    const gitDir = external
      ? path.join(appRoot, 'content/legal-external')
      : undefined

    const date = await getGitFileLastEdited(relativePath, { gitDir })

    if (!date) {
      console.error(
        `Could not resolve last edited date from git for "${relativePath}"`,
      )
      process.exit(1)
    }

    dates[name] = date.toISOString()
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, `${JSON.stringify(dates, null, 2)}\n`)
  console.log(`Wrote ${outputPath}`)
}

main()
