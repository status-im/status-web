export function truncateId(id: string): string {
  const maxDisplayIdLength = 6

  return id.length > maxDisplayIdLength
    ? `${id.slice(0, maxDisplayIdLength)}...`
    : id
}

export function resolveName(
  nftName: string | null,
  contractName: string | null,
  tokenId: string,
): string {
  const trimmed = (nftName || '').trim()
  const isIdOnly = /^#\d+$/.test(trimmed)
  const raw = isIdOnly ? contractName || '' : trimmed || contractName || ''

  return raw.replace(new RegExp(`\\s*#${tokenId}$`), '').trim()
}

export function formatDisplayName(name: string, displayId: string): string {
  if (!name) return `#${displayId}`
  if (/#\d+/.test(name)) return name
  return `${name} #${displayId}`
}

export function isOpenSeaVerified(status?: string): boolean {
  return status === 'verified' || status === 'approved'
}

export function formatOpenSeaTokenId(tokenId: string): string {
  if (tokenId.startsWith('0x')) {
    try {
      return BigInt(tokenId).toString(10)
    } catch {
      return tokenId
    }
  }

  return tokenId
}
