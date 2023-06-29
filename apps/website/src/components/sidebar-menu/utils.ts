export function decodeUriComponent(str: string): string {
  return decodeURIComponent(str.replace(/\+/g, '%20'))
}
