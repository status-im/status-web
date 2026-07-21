import 'server-only'
import legalLastEdited from '~/generated/legal-last-edited.json'
import type { DocumentName } from './legal-documents'

export function getLegalLastEdited(documentName: DocumentName): Date {
  const iso = legalLastEdited[documentName as keyof typeof legalLastEdited]

  if (!iso) {
    throw new Error(
      `No last edited date for "${documentName}" in legal-last-edited.json. Run \`pnpm --filter status.network generate:legal-dates\`.`,
    )
  }

  return new Date(iso)
}
