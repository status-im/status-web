export function getWeek(date: Date) {
  return Math.floor((date.getTime() - 345600000) / 604800000)
}
