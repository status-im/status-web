import capitalize from 'title'

import type { Doc } from '@docs'

const setNestedKey = (
  obj: Record<string, unknown>,
  path: string[],
  value: unknown
) => {
  if (path.length === 1) {
    obj[path[0]] = value
    return
  }

  obj[path[0]] ??= {}
  setNestedKey(obj[path[0]] as Record<string, unknown>, path.slice(1), value)
}

type Links = {
  label: string
  href?: string
  links?: Links
}[]

function createLinks(tree: Tree): Links {
  return Object.entries(tree).map(([key, value]) => {
    const { title, href, ...pages } = value
    return {
      label: (title ?? capitalize(key)) as string,
      href: href,
      links: createLinks(pages),
    }
  })
}

type Tree = {
  [key: string]: {
    title?: string
    href?: string
    // _nested: Tree
  }
}

export const buildLinkTree = (docs: Doc[]) => {
  const tree: Tree = {}

  for (const doc of docs) {
    const value = {
      title: doc.title,
      href: doc.url,
      // _nested: {},
    }

    if (doc.slug.length === 1) {
      tree[doc.slug[0]] = value
    } else {
      setNestedKey(
        tree,
        [
          ...doc.slug.slice(0, doc.slug.length - 1),
          // '_nested',
          doc.slug[doc.slug.length - 1],
        ],
        value
      )
    }
  }

  return createLinks(tree)
}
