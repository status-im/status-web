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
// import type { TreeNode } from 'types/TreeNode'

type TreeNode = any

export const buildDocsTree = (
  docs: Doc[],
  parentSlug: string[] = []
): TreeNode[] => {
  const level = parentSlug.length

  return docs
    .filter(
      doc =>
        doc.pathSegments.length === level + 1 &&
        doc.slug.join('/').startsWith(parentSlug.join('/'))
    )
    .sort((a, b) => a.pathSegments[level].order - b.pathSegments[level].order)
    .map<TreeNode>(doc => ({
      // nav_title: doc.nav_title ?? null,
      label: doc.title,
      href: doc.url,
      // label: doc.label ?? null,
      // excerpt: doc.excerpt ?? null,
      // urlPath: doc.url_path,
      // collapsible: doc.collapsible ?? null,
      // collapsed: doc.collapsed ?? null,
      links: buildDocsTree(docs, doc.slug),
    }))
}
