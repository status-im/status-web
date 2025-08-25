const blockedApiKeys = new Map<string, { count: number; until: number }>()

export function getRandomApiKey(keys: string): string {
  const list = keys
    .split(',')
    .map(k => k.trim())
    .filter(Boolean)
  if (!list.length) throw new Error('Missing API keys.')

  const now = Date.now()
  const availableApiKeys = list.filter(key => {
    const info = blockedApiKeys.get(key)
    if (info && now < info.until) {
      return false
    }
    return true
  })

  if (!availableApiKeys.length) {
    return list[0] // fallback
  }

  return availableApiKeys[Math.floor(Math.random() * availableApiKeys.length)]
}

export function markApiKeyAsRateLimited(key: string): void {
  const existing = blockedApiKeys.get(key)
  const count = existing ? existing.count + 1 : 1
  const minutes = Math.min(Math.pow(2, count - 1), 15)
  const until = Date.now() + minutes * 60 * 1000

  blockedApiKeys.set(key, { count, until })
}

export function markApiKeyAsSuccessful(key: string): void {
  if (blockedApiKeys.has(key)) {
    blockedApiKeys.delete(key)
  }
}
