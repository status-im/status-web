const getSeconds = (s: number): number => s % 60
const getMinutes = (s: number): number => Math.floor((s % 3600) / 60)

const pad = (n: number): string => n.toString().padStart(2, '0')

export function formatTimer(seconds: number): string {
  const s: number = getSeconds(seconds)
  const m: number = getMinutes(seconds)

  return `${pad(m)}:${pad(s)}`
}
