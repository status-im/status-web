type SectionLike = { componentType: string; key: string }

export type SectionFinder = <T extends SectionLike>(
  sections: ReadonlyArray<SectionLike>,
  componentType: T['componentType'],
  key: string
) => T

/**
 * Build a `findSection` lookup bound to a page name. Throws when the section
 * is missing so CMS-backed routes fail fast at build time.
 */
export function createSectionFinder(pageName: string): SectionFinder {
  return <T extends SectionLike>(
    sections: ReadonlyArray<SectionLike>,
    componentType: T['componentType'],
    key: string
  ): T => {
    const found = sections.find(
      section => section.componentType === componentType && section.key === key
    )
    if (!found) {
      throw new Error(
        `${pageName} page section not found: ${componentType} "${key}"`
      )
    }
    return found as T
  }
}
