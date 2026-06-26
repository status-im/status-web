import { getPageCopy } from '@status-im/content/loaders'
import type { HeroSection } from '@status-im/content/schemas'

type Messages = Record<string, unknown>

const mergeHeroIntoNamespace = async (
  messages: Messages,
  namespace: string,
  route: string,
  fieldMap: { headline: string; body?: string }
): Promise<Messages> => {
  try {
    const page = await getPageCopy(route, 'en')
    const hero = page.sections.find(
      (section): section is HeroSection => section.componentType === 'hero'
    )
    if (!hero) return messages

    const namespaceMessages = (messages[namespace] as Messages | undefined) ?? {}

    return {
      ...messages,
      [namespace]: {
        ...namespaceMessages,
        [fieldMap.headline]: hero.headline,
        ...(fieldMap.body && hero.body
          ? { [fieldMap.body]: hero.body }
          : {}),
      },
    }
  } catch {
    return messages
  }
}

export const mergeCmsMessages = async (
  messages: Messages
): Promise<Messages> => {
  let merged = messages

  merged = await mergeHeroIntoNamespace(merged, 'home', '/', {
    headline: 'heroTitle',
    body: 'heroDescription',
  })

  merged = await mergeHeroIntoNamespace(merged, 'apps', '/apps', {
    headline: 'title',
    body: 'description',
  })

  try {
    const homePage = await getPageCopy('/', 'en')
    if (homePage.title) {
      const metadata = (merged.metadata as Messages | undefined) ?? {}
      merged = {
        ...merged,
        metadata: {
          ...metadata,
          title: homePage.title,
          ...(homePage.description
            ? { description: homePage.description }
            : {}),
        },
      }
    }
  } catch {
    // Keep static messages when CMS content is unavailable.
  }

  return merged
}
