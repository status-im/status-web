export function getEpicDisplayName(epicName?: string) {
  return epicName ? epicName.replace(/^E:/, '') : '-'
}
