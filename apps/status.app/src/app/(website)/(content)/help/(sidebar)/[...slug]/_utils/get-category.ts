import type config from '~/config/help/config.json'

export function getCategory(
  configObj: typeof config,
  path: string
): string | undefined {
  for (const category of configObj.nav) {
    const [categoryName, subcategories] = Object.entries(category)[0]
    const [, subcategorySlug] = Object.entries(subcategories[0])[0]

    if (path.includes(subcategorySlug as string)) {
      return categoryName
    }
  }
}
