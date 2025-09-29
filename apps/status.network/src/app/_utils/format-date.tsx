export function formatDate(
  date: Date | string,
  style: Intl.DateTimeFormatOptions['dateStyle'] = 'medium',
): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: style,
  }).format(new Date(date))
}
