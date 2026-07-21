export const EXTERNAL_DOCUMENTS = [
  'status-network-pre-deposit-disclaimer',
  'status-network-pre-deposit-withdrawal-disclaimer',
] as const

export type ExternalDocument = (typeof EXTERNAL_DOCUMENTS)[number]

export type LocalDocument = 'privacy-policy' | 'terms-of-use'

export type DocumentName = LocalDocument | ExternalDocument

export const externalDocumentSet = new Set<string>(EXTERNAL_DOCUMENTS)
