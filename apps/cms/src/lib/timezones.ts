import type { IanaTimeZone, TimeZoneOption } from '@/types/timezones'

export const IANA_TIME_ZONE_OPTIONS: TimeZoneOption[] = [
  'UTC',
  ...Intl.supportedValuesOf('timeZone'),
].map((timeZone) => ({
  label: timeZone,
  value: timeZone,
}))

export const isValidIanaTimeZone = (value: string): value is IanaTimeZone => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format(new Date())
    return true
  } catch {
    return false
  }
}
