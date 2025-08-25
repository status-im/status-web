export function getRandomApiKey(keys: string): string {
  const list = keys
    .split(',')
    .map(k => k.trim())
    .filter(Boolean)
  if (!list.length) throw new Error('Missing API keys.')

  return list[Math.floor(Math.random() * list.length)]
}
