import { type Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { matter } from 'vfile-matter'

import { METADATA } from '../../../../../config/specs/metadata'
import { resolvePathname } from '../../../../_utils/resolve-pathname'
import { slugify } from '../../../../_utils/slugify'

export function remarkRewriteLinks(): Plugin {
  return function (root, file) {
    visit(root, 'yaml', () => {
      // todo?: use unified
      // unified().use(remarkFrontmatter)

      // todo?: wrap in a new preceeding plugin
      matter(file)
    })

    // todo?: visit(root, 'link', node)
    visit(root, node => {
      // todo: use switches
      if (node.type === 'link') {
        if (node.url.startsWith('http')) {
          return
        }

        if (node.url.startsWith('mailto:')) {
          return
        }

        // Help
        if (
          (file.data as any).rawDocumentData.sourceFilePath.startsWith('help/')
        ) {
          const basePath = node.url.startsWith('#')
            ? `/${(file.data as any).rawDocumentData.flattenedPath}`
            : `/${(file.data as any).rawDocumentData.sourceFileDir}`
          const relativePath = node.url
            .replace(/\/index\.mdx/g, '')
            .replace(/\.mdx/g, '')

          node.url = resolvePathname(relativePath, basePath)

          return
        }

        // Specs
        if (
          (file.data as any).rawDocumentData.sourceFilePath.startsWith('specs/')
        ) {
          const [pathname, hash] = node.url.split('#')
          const match = pathname.match(/\/(?<id>[^/]+)\/(?<filename>[^/]+\.md)/)

          if (!match) {
            return
          }

          const id = match[1]
          const filename = match[2]
          const metadata = Object.values(METADATA).find(
            ({ id: _id, fileName: _fileName }) =>
              _id === +id && _fileName === filename
          )

          if (!metadata) {
            node.url = `https://rfc.vac.dev/${(pathname as string)
              .replaceAll('../', '')
              .replaceAll('.md', '')}`
            return
          }

          const url = '/specs/' + slugify(node.children[0].value.split('/')[1])
          node.url = url + (hash ? `#${hash}` : '')

          return
        }
      }
    })
  }
}
