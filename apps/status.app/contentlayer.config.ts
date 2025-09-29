import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from '@contentlayer/source-files'
// note: https://github.com/contentlayerdev/contentlayer/issues/84 – support for multiple sources
// import { makeSource } from '@contentlayer/source-remote-files'
import remarkHeadings from '@vcarl/remark-headings'
import { slug as slugify } from 'github-slugger'
import { toString } from 'mdast-util-to-string'
import { spawn } from 'node:child_process'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import { stderr } from 'node:process'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
// note: https://github.com/mdx-js/mdx/issues/1042#issuecomment-1027059063
import remarkComment from 'remark-comment'
// import { remark } from 'remark'
import remarkDirective from 'remark-directive'
// import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm-v3'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import strip from 'strip-markdown'
import title from 'title'
import { type Plugin, unified } from 'unified'
import { visit } from 'unist-util-visit'

import { remarkRewriteLinks } from './src/app/(website)/(content)/_lib/plugins/remark-rewrite-links'
import { METADATA } from './src/config/specs/metadata'

import type { Node } from 'unist'
import type { VFile } from 'vfile'

const CONTENT_DIR_PATH = 'content'

export type DocHeading = {
  level: 1 | 2
  value: string
}

export type DocIndex = {
  path: string
  title: string
  content: {
    [key in string]: string[]
  }
}

const HeroImage = defineNestedType(() => ({
  name: 'HeroImage',
  fields: {
    src: { type: 'string', required: true },
    alt: { type: 'string', required: true },
  },
}))

export const HelpDoc = defineDocumentType(() => ({
  name: 'HelpDoc',
  filePathPattern: 'help/**/*.md{,x}',
  contentType: 'mdx',

  fields: {
    id: { type: 'number', required: false },
    revision: { type: 'string', required: false },
    language: { type: 'string', required: false },
    title: { type: 'string', required: true },
    author: { type: 'string', required: false },
    image: { type: 'nested', of: HeroImage, required: false },
    roles: {
      type: 'list',
      of: {
        type: 'enum',
        options: ['Owners', 'TokenMasters', 'Admins'],
      },
      required: false,
    },
    beta: { type: 'boolean', required: false },
  },

  computedFields: {
    slug: {
      // @ts-expect-error TODO
      type: 'string[]',
      resolve: doc => doc._raw.flattenedPath.replace('help/', '').split('/'),
      // resolve: doc => {
      //   return getPathSegments(doc._raw.flattenedPath).map(
      //     ({ pathName }) => pathName
      //   )
      // },
    },
    url: {
      type: 'string',
      resolve: doc => '/' + doc._raw.flattenedPath,

      // resolve: doc => {
      //   const slug = getPathSegments(doc._raw.flattenedPath).map(
      //     ({ pathName }) => pathName
      //   )

      //   return `/help/${slug.join('/')}`
      // },
    },
    pathSegments: {
      // @ts-expect-error TODO
      type: '{ order: number; pathName: string }[]',
      resolve: doc => getPathSegments(doc._raw.flattenedPath),
    },
    titleSlug: {
      type: 'string',
      resolve: doc => slugify(doc.title),
    },
    headings: {
      // @ts-expect-error TODO
      type: '{ level: 1 | 2; value: string, slug: string }[]',
      resolve: async doc => {
        // note: https://github.com/remarkjs/remark/blob/618a9ad1d44aa106bd2a8c61ebf8589cfe97fa16/readme.md?plain=1#L148-L150 remark()
        // note: https://github.com/orgs/unifiedjs/discussions/113#discussioncomment-515636 parse() and run()
        const processor = unified()
          .use(remarkParse)
          // .use(remarkComment)
          .use(remarkHeadings)
        const tree = await processor.parse(doc.body.raw)
        const file = await new Promise<VFile | undefined>(resolve => {
          processor.run(tree, (_error, _tree, file) => {
            resolve(file)
          })
        })

        return (file!.data['headings'] as { depth: number; value: string }[])
          .filter(({ depth }) => [1, 2].includes(depth))
          .map<DocHeading>(({ depth, value }) => ({
            level: depth as 1 | 2,
            value,
            slug: slugify(value),
          }))
      },
    },
    lastEdited: {
      type: 'date',
      resolve: async (doc): Promise<Date> => {
        const stats = await fs.stat(
          path.join(CONTENT_DIR_PATH, doc._raw.sourceFilePath)
        )

        return stats.mtime
      },
    },
    lastEditedAuthor: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      type: '{ displayName: string; githubUsername: string | undefined } | undefined',
      of: defineNestedType(() => ({
        fields: {
          displayName: { type: 'string', required: true },
          githubUsername: { type: 'string', required: false },
        },
      })),
      resolve: async doc => {
        const author = await runBashCommand(
          `(cd ${CONTENT_DIR_PATH} && git log -1 --format="%ae|%an" -- ${doc._raw.sourceFilePath} | tr -d '\n')`
        )

        const [email, name] = author.split('|')

        const match = email.match(
          /^(?:\d+\+)?([a-zA-Z0-9-]+)@users\.noreply\.github\.com$/
        )

        if (!author) {
          return
        }

        return {
          displayName: name,
          githubUsername: match ? match[1] : undefined,
        }
      },
    },
  },
}))

export const LegalDoc = defineDocumentType(() => ({
  name: 'LegalDoc',
  filePathPattern: 'legal/**/*.md',
  contentType: 'markdown',

  fields: {
    title: { type: 'string', required: true },
  },

  computedFields: {
    slug: {
      // @ts-expect-error TODO
      type: 'string[]',
      resolve: doc => doc._raw.flattenedPath.replace('help/', '').split('/'),
      // resolve: doc => {
      //   return getPathSegments(doc._raw.flattenedPath).map(
      //     ({ pathName }) => pathName
      //   )
      // },
    },
    lastEdited: {
      type: 'date',
      resolve: async (doc): Promise<Date> => {
        const stats = await fs.stat(
          path.join(CONTENT_DIR_PATH, doc._raw.sourceFilePath)
        )
        return stats.mtime
      },
    },
  },
}))

const specsDocContentDir = `specs/status/{${Object.values(METADATA)
  .map(({ id }) => id)
  .join(',')}}`
const specsDocFilePathPattern = `${specsDocContentDir}/{${Object.values(
  METADATA
)
  .map(({ fileName }) => fileName)
  .join(',')}}`
export const SpecsDoc = defineDocumentType(() => ({
  name: 'SpecsDoc',
  // note: does not exclude other files, those will be evaluated and skipped because of `makeSource()#contentDirPath` regardless
  filePathPattern: specsDocFilePathPattern,
  // contentType: 'markdown',
  contentType: 'mdx',

  fields: {
    slug: { type: 'number', required: false },
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    name: { type: 'string', required: false },
    status: { type: 'string', required: true },
    category: { type: 'string', required: false },
    tags: { type: 'string', required: false },
    editor: { type: 'string', required: true },
    contributors: { type: 'list', of: { type: 'string' }, required: false },
  },

  // todo: reuse fields when possible
  computedFields: {
    // _raw: {
    //   // type: 'json',
    //   // @ts-expect-error TODO
    //   // type: 'object',
    //   type: '{ sourceFilePath: string; sourceFileName: string, sourceFileDir: string, contentType: string; flattenedPath: string; title: string}',
    //   resolve: doc => {
    //     return {
    //       ...doc._raw,
    //       title: doc.title,
    //     }
    //   },
    // },
    key: {
      type: 'string',
      resolve: doc => doc.title,
    },
    // note: first because `slug` field is later overwritten
    id: {
      type: 'number',
      // resolve: doc => +doc._raw.sourceFileDir.split('/').pop()!,
      resolve: doc => doc.slug as unknown as number,
    },
    slug: {
      // @ts-expect-error TODO
      type: 'string[]',
      // resolve: doc => [
      //   slugify(METADATA[doc.title as keyof typeof METADATA].title),
      resolve: doc => [slugify(doc.title.split('/')[1])],
    },
    title: {
      type: 'string',
      // todo: fallback to parsed original/upstream slug if more spec than those in overview
      // resolve: doc => METADATA[doc.title as keyof typeof METADATA].title,
      // resolve: doc => doc.title.split('/')[1]
      resolve: doc => {
        const metadata = METADATA[doc.title as keyof typeof METADATA]

        if (!metadata || !metadata.title) {
          return title(doc.title.split('/')[1].replaceAll('-', ' '))
        }

        return metadata.title
      },
    },
    // todo?: rename to href
    url: {
      type: 'string',
      // resolve: doc => METADATA[doc.title as keyof typeof METADATA].href,
      resolve: doc => '/specs/' + slugify(doc.title.split('/')[1]),
    },
    authors: {
      type: 'list',
      resolve: doc => {
        const authors = [doc.editor.split(' <')[0]]

        ;(doc.contributors as unknown as { _array: string[] })?._array.forEach(
          (contributor: string) => {
            authors.push(contributor.split(' <')[0])
          }
        )

        return authors
      },
    },
    titleSlug: {
      type: 'string',
      resolve: doc => slugify(doc.title.split('/')[1]),
    },
    headings: {
      // @ts-expect-error TODO
      type: '{ level: 1 | 2; value: string, slug: string }[]',
      resolve: async doc => {
        // note: https://github.com/remarkjs/remark/blob/618a9ad1d44aa106bd2a8c61ebf8589cfe97fa16/readme.md?plain=1#L148-L150 remark()
        // note: https://github.com/orgs/unifiedjs/discussions/113#discussioncomment-515636 parse() and run()
        const processor = unified()
          .use(remarkParse)
          // .use(remarkComment)
          .use(remarkHeadings)
        const tree = await processor.parse(doc.body.raw)
        const file = await new Promise<VFile | undefined>(resolve => {
          processor.run(tree, (_error, _tree, file) => {
            resolve(file)
          })
        })

        // note: filtering for only heading level 1 is also temporary until Vac dis/approves change in source and template
        return (file!.data['headings'] as { depth: number; value: string }[])
          .filter(({ depth }) => [1].includes(depth))
          .map<DocHeading>(({ depth, value }) => ({
            level: depth as 1,
            value,
            slug: slugify(value),
          }))
      },
    },
    lastEdited: {
      type: 'date',
      resolve: async (doc): Promise<Date> => {
        const date = await runBashCommand(
          `(cd ${CONTENT_DIR_PATH}/specs && git log -1 --format=%cd --date=iso-strict -- ${doc._raw.sourceFilePath.replace(
            'specs/',
            ''
          )} | tr -d '\n')`
        )

        return new Date(date)
      },
    },
  },
}))

function getPathSegments(filePath: string) {
  return (
    filePath
      .split('/')
      // .slice(1) // skip content dir path – `/help`
      .map(fileName => {
        const re = /^((\d+)-)?(.*)$/
        const [, , orderStr, pathName] = fileName.match(re) ?? []
        const order = orderStr ? parseInt(orderStr) : 0
        return { order, pathName }
      })
  )
}

// note: https://github.com/contentlayerdev/contentlayer/blob/2f491c540e1d3667577f57fa368b150bff427aaf/examples/node-script-remote-content/contentlayer.config.ts – original source
// const syncContentFromGit = async (contentDir: string) => {
//   const syncRun = async () => {
//     const gitUrl = 'https://github.com/vacp2p/rfc.git'
//     await runBashCommand(`
//       if [ -d  "${contentDir}" ];
//         then
//           cd "${contentDir}"; git pull;
//         else
//           git clone --depth 1 --single-branch ${gitUrl} '${contentDir}/specs';
//       fi
//     `)
//   }

//   let wasCancelled = false
//   let syncInterval: NodeJS.Timeout

//   const syncLoop = async () => {
//     console.log('Syncing content files from git')

//     await syncRun()

//     if (wasCancelled) return

//     syncInterval = setTimeout(syncLoop, 1000 * 60)
//   }

//   // Block until the first sync is done
//   await syncLoop()

//   return () => {
//     wasCancelled = true
//     clearTimeout(syncInterval)
//   }
// }

// note: https://github.com/contentlayerdev/contentlayer/blob/2f491c540e1d3667577f57fa368b150bff427aaf/examples/node-script-remote-content/contentlayer.config.ts – original source
const runBashCommand = (command: string) =>
  new Promise<string>((resolve, reject) => {
    const child = spawn(command, [], { shell: true })

    let out = ''
    child.stdout.setEncoding('utf8')
    child.stdout.on('data', data => {
      out += data.toString()
      // process.stdout.write(data)
    })

    child.stderr.setEncoding('utf8')
    child.stderr.on('data', data => stderr.write(data))

    child.on('close', function (code) {
      if (code === 0) {
        resolve(out)
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })
  })

const remarkIndexer: Plugin = () => (root, file) => {
  file.data['index'] = indexer(root)
}

function indexer(root: Node) {
  const index: DocIndex['content'] = {}

  let parentHeading = ''
  visit(root, ['paragraph', 'heading'], node => {
    if (node.type === 'heading') {
      const text = toString(node, { includeImageAlt: false })
      parentHeading = text
      return
    }

    const text = toString(node, { includeImageAlt: false })
    index[parentHeading] ??= []
    index[parentHeading].push(text)
  })

  return index
}

export default makeSource({
  // syncFiles: syncContentFromGit,
  onMissingOrIncompatibleData: 'fail',
  contentDirPath: CONTENT_DIR_PATH,
  contentDirInclude: ['help', 'legal', specsDocContentDir],
  documentTypes: [HelpDoc, LegalDoc, SpecsDoc],
  mdx: {
    // esbuildOptions: options => {
    //   return {
    //     ...options,
    //     // todo?: alias as false
    //     // external: [
    //     //   // 'react-native-svg',
    //     //   // 'expo-modules-core',
    //     // ],
    //     // alias: {
    //     //   'react-native': 'react-native-web',
    //     //   // 'react-native-svg': 'react-native-svg/src',
    //     // },
    //     // resolveExtensions: [
    //     //   '.web.js',
    //     //   '.web.ts',
    //     //   '.web.tsx',
    //     //   '.js',
    //     //   '.jsx',
    //     //   '.json',
    //     //   '.ts',
    //     //   '.tsx',
    //     //   '.mjs',
    //     // ],
    //     // jsx: 'transform',
    //     // note: https://github.com/contentlayerdev/contentlayer/issues/334#issuecomment-1384233358
    //     // note: https://github.com/contentlayerdev/contentlayer/issues/309#issuecomment-1266539902
    //     // note: https://github.com/evanw/esbuild/issues/2634#issuecomment-1301547236
    //     tsconfigRaw: {
    //       compilerOptions: {
    //         // jsx: 'react',
    //         jsx: 'react-jsx',
    //       },
    //     },
    //   }
    // },
    // cwd: process.cwd(),
    remarkPlugins: [
      // note: https://github.com/mdx-js/mdx/issues/1042#issuecomment-1027059063
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      remarkComment,
      remarkGfm,
      remarkDirective,
      // [remarkMessageControl, { name: 'hello' }],
      remarkRewriteLinks,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          // Use one of Shiki's packaged themes
          // theme: 'github-light',
          theme: 'github-dark',
          // Keep the background or use a custom background color?
          keepBackground: false,
          // // Callback hooks to add custom logic to nodes when visiting
          // // them.
          // onVisitLine(node: any) {
          //   // Prevent lines from collapsing in `display: grid` mode, and
          //   // allow empty lines to be copy/pasted
          //   if (node.children.length === 0) {
          //     node.children = [{ type: 'text', value: ' ' }]
          //   }
          // },
          // onVisitHighlightedLine(node: any) {
          //   // Each line node by default has `class="line"`.
          //   node.properties.className.push('highlighted')
          // },
          // onVisitHighlightedWord(node: any) {
          //   // Each word node has no className by default.
          //   node.properties.className = ['word']
          // },
        },
      ],
    ],
  },
  markdown: {
    remarkPlugins: [
      // remarkComment,
      remarkGfm,
      //  remarkFrontmatter,
      remarkRewriteLinks,
    ],
    rehypePlugins: [
      rehypeSlug,
      // [
      //   rehypePrettyCode,
      //   {
      //     // Use one of Shiki's packaged themes
      //     // theme: 'github-light',
      //     theme: 'github-dark',
      //     // // Keep the background or use a custom background color?
      //     keepBackground: false,
      //     // // Callback hooks to add custom logic to nodes when visiting
      //     // // them.
      //     // onVisitLine(node: any) {
      //     //   // Prevent lines from collapsing in `display: grid` mode, and
      //     //   // allow empty lines to be copy/pasted
      //     //   if (node.children.length === 0) {
      //     //     node.children = [{ type: 'text', value: ' ' }]
      //     //   }
      //     // },
      //     // onVisitHighlightedLine(node: any) {
      //     //   // Each line node by default has `class="line"`.
      //     //   node.properties.className.push('highlighted')
      //     // },
      //     // onVisitHighlightedWord(node: any) {
      //     //   // Each word node has no className by default.
      //     //   node.properties.className = ['word']
      //     // },
      //   },
      // ],
    ],
  },
  onSuccess: async importData => {
    const { allHelpDocs } = await importData()

    const index: DocIndex[] = []

    for (const helpDoc of allHelpDocs) {
      // todo?: use mdx and markdown fields instead
      const processor = unified()
        .use(remarkParse)
        // .use(remarkComment)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .use(remarkMdx)
        .use(strip, {
          keep: ['heading'],
        })
        .use(remarkGfm)
        .use(remarkIndexer, { path: '/' + helpDoc._raw.flattenedPath })
      const tree = await processor.parse(helpDoc.body.raw)
      const file = await new Promise<VFile | undefined>(resolve => {
        processor.run(tree, (_error, _tree, file) => {
          resolve(file)
        })
      })

      if (helpDoc._raw.sourceFileName === 'index.mdx') {
        continue
      }

      index.push({
        title: helpDoc.title,
        path: '/' + helpDoc._raw.flattenedPath,
        content: file!.data['index'] as DocIndex['content'],
      })
    }

    const filePath = path.resolve('./.contentlayer/en.json')

    fs.writeFile(filePath, JSON.stringify(index))

    const { allSpecsDocs } = await importData()

    const specMetadata: Record<
      string,
      {
        id: number
        title: string
        description?: string
        href: string
        status: string
      }
    > = {}
    const specIndex: DocIndex[] = []

    for (const specsDoc of allSpecsDocs) {
      const key = specsDoc.key
      specMetadata[key] = {
        id: specsDoc.id,
        title: specsDoc.title,
        description: specsDoc.description,
        href: specsDoc.url,
        status: specsDoc.status,
      }

      // todo?: use mdx and markdown fields instead
      const processor = unified()
        .use(remarkParse)
        // .use(remarkComment)
        // .use(remarkMdx)
        .use(strip, {
          keep: ['heading'],
        })
        .use(remarkGfm)
        .use(remarkIndexer, { path: '/' + specsDoc._raw.flattenedPath })
      const tree = await processor.parse(specsDoc.body.raw)
      const file = await new Promise<VFile | undefined>(resolve => {
        processor.run(tree, (_error, _tree, file) => {
          resolve(file)
        })
      })

      specIndex.push({
        title: specsDoc.title!,
        path: specsDoc.url,
        content: file!.data['index'] as DocIndex['content'],
      })
    }

    const specMetadataFilePath = path.resolve(
      './.contentlayer/specs.metadata.json'
    )
    fs.writeFile(specMetadataFilePath, JSON.stringify(specMetadata))

    const specFilePath = path.resolve('./.contentlayer/specs.en.json')
    fs.writeFile(specFilePath, JSON.stringify(specIndex))
  },
})
