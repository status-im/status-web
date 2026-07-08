import path from 'node:path'
import process from 'node:process'

import { type DocumentName, externalDocumentSet } from './legal-documents'

const statusNetworkRoot = path.join(process.cwd(), '../status.network')

export function getLegalDocumentPath(documentName: DocumentName) {
  const isExternal = externalDocumentSet.has(documentName)

  return isExternal
    ? path.join(
        statusNetworkRoot,
        'content/legal-external',
        `${documentName}.md`
      )
    : path.join(statusNetworkRoot, 'content/legal', `${documentName}.md`)
}
