type WorkInProgressDoc = {
  body: {
    raw: string
  }
}

/**
 * Placeholder ("work in progress") help docs ship with an empty body and only
 * render a "We're working on this content" notice. They carry no indexable
 * content, so they are kept out of the sitemap and marked `noindex` to prevent
 * thin pages from showing up as excluded/crawled-not-indexed in Search Console.
 */
export function isHelpDocWorkInProgress(doc: WorkInProgressDoc): boolean {
  return doc.body.raw === ''
}
