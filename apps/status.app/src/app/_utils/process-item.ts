function stripHtml(content: string, lineBreak: string) {
  return content
    .split(/<\/p>/i)
    .map((part: string) => part.replace(/<[^>]+>/g, '').trim())
    .filter(
      (part: string, index: number, arr: string[]) =>
        part || index < arr.length - 1
    )
    .join(lineBreak)
}

function processField(item: any, field: string, lineBreak: string) {
  let content = stripHtml(item[field], lineBreak)
  if (item.newsLinkLabel) {
    content = content.replace(item.newsLinkLabel, '')
  }
  if (content.endsWith(lineBreak)) {
    content = content.slice(0, -lineBreak.length)
  }

  return content
}

export function processItem(item: any, lineBreak: string) {
  const newsLink = item['content:encoded'].match(
    /<a[^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/
  )
  item.newsLink = newsLink?.[1]
  item.newsLinkLabel = newsLink?.[2]

  item['content:encoded'] = processField(item, 'content:encoded', lineBreak)
  item.description = processField(item, 'description', lineBreak)
}
