export type ChartDays = '1' | '7' | '30' | '90' | '365' | 'all'

/**
 * Returns the spacing between chart data points for a given time range.
 */
export function chartIntervalSeconds(days: ChartDays | undefined): number {
  const n = days === 'all' ? 3650 : Number(days ?? 1)
  if (n <= 7) return 3600
  if (n <= 30) return 4 * 3600
  if (n <= 90) return 12 * 3600
  if (n <= 365) return 24 * 3600
  return 7 * 24 * 3600
}

export function buildCanonicalTimestamps(
  days: ChartDays | undefined,
  anchorTime: number,
): number[] {
  const requestedDays = days === 'all' ? 3650 : Number(days ?? 1)
  const intervalSeconds = chartIntervalSeconds(days)
  const startTime = anchorTime - requestedDays * 24 * 3600
  const timestamps: number[] = []
  for (let t = anchorTime; t >= startTime; t -= intervalSeconds) {
    timestamps.push(t)
  }
  return timestamps // newest-first
}
