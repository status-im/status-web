import capitalize from 'title'

import { allDocs, allDocs } from './.contentlayer/generated/index.mjs'

import type { Doc } from './.contentlayer/generated/types.js'

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
    const { title, href, _nested } = value
    return {
      label: (title ?? capitalize(key)) as string,
      href: href,
      links: createLinks(_nested),
    }
  })
}

type Tree = {
  [key: string]: {
    title?: string
    href?: string
    _nested: Tree
  }
}

const createTree = (docs: Doc[]) => {
  const tree: Tree = {}

  for (const doc of docs) {
    const value = {
      title: doc.title,
      href: doc.url,
      _nested: {},
    }

    if (doc.slug.length === 1) {
      tree[doc.slug[0]] = value
    } else {
      setNestedKey(
        tree,
        [
          ...doc.slug.slice(0, doc.slug.length - 1),
          '_nested',
          doc.slug[doc.slug.length - 1],
        ],
        value
      )
    }
  }

  return tree
}

const tree = createTree(allDocs)
console.log(JSON.stringify(tree, null, 2))
console.log(JSON.stringify(createLinks(tree), null, 2))

// type TreeNode = any

// export const buildDocsTree = (
//   docs: Doc[],
//   parentPathNames: string[] = []
// ): TreeNode[] => {
//   const level = parentPathNames.length

//   // Remove ID from parent path
//   // parentPathNames = parentPathNames
//   //   .join('/')
//   //   .split('-')
//   //   .slice(0, -1)
//   //   .join('-')
//   //   .split('/')

//   return (
//     docs
//       .filter(
//         _ =>
//           _.slug.length === level + 1 &&
//           _.slug.join('/').startsWith(parentPathNames.join('/'))
//       )
//       // .sort((a, b) => a.pathSegments[level].order - b.pathSegments[level].order)
//       .map<TreeNode>(doc => ({
//         // nav_title: doc.nav_title ?? null,
//         url: doc.url,
//         title: doc.title,
//         // label: doc.label ?? null,
//         // excerpt: doc.excerpt ?? null,
//         // urlPath: doc.url_path,
//         // collapsible: doc.collapsible ?? null,
//         // collapsed: doc.collapsed ?? null,
//         children: buildDocsTree(docs, doc.slug),
//       }))
//   )
// }
// console.log('====')
// console.log(JSON.stringify(buildDocsTree(allDocs), null, 2))

// [
//   rehypePrettyCode,
//   {
//     // Use one of Shiki's packaged themes
//     theme: 'github-light',
//     // Keep the background or use a custom background color?
//     // keepBackground: true,
//     // Callback hooks to add custom logic to nodes when visiting
//     // them.
//     onVisitLine(node) {
//       // Prevent lines from collapsing in `display: grid` mode, and
//       // allow empty lines to be copy/pasted
//       if (node.children.length === 0) {
//         node.children = [{ type: 'text', value: ' ' }]
//       }
//     },
//     onVisitHighlightedLine(node) {
//       // Each line node by default has `class="line"`.
//       node.properties.className.push('highlighted')
//     },
//     onVisitHighlightedWord(node) {
//       // Each word node has no className by default.
//       node.properties.className = ['word']
//     },
//   },
// ],
