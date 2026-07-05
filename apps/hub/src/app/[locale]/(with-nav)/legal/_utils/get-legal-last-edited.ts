import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import type { DocumentName } from './legal-documents'

const legalLastEditedPath = path.join(
  process.cwd(),
  '../status.network/src/generated/legal-last-edited.json'
)

const legalLastEdited = JSON.parse(
  fs.readFileSync(legalLastEditedPath, 'utf8')
) as Record<string, string>

export function getLegalLastEdited(documentName: DocumentName): Date {
  const iso = legalLastEdited[documentName]

  if (!iso) {
    throw new Error(
      `No last edited date for "${documentName}" in legal-last-edited.json. Run \`pnpm --filter status.network generate:legal-dates\`.`
    )
  }

  return new Date(iso)
}
