export function downloadUrl(dataurl: string) {
  const link = document.createElement('a')
  link.href = dataurl
  link.click()
}
