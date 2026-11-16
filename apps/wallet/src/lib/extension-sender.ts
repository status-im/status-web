type Sender = Pick<chrome.runtime.MessageSender, 'id' | 'url'>

/**
 * Whether a message or port comes from one of this extension's own pages
 * (page, approval window). Content scripts run in web pages, so their
 * sender URL is the web page URL and they are rejected.
 */
export function isExtensionPageSender(
  sender: Sender | undefined,
  extensionId: string,
  extensionBaseUrl: string,
): boolean {
  if (!sender || !extensionId || !extensionBaseUrl) return false
  if (sender.id !== extensionId) return false
  return (
    typeof sender.url === 'string' && sender.url.startsWith(extensionBaseUrl)
  )
}
