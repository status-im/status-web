import { allDocs } from '@docs'
import { Avatar, Button, Text } from '@status-im/components'
import { EditIcon } from '@status-im/icons'
// import Image from 'next/image'
import Link from 'next/link'
import { useLiveReload, useMDXComponent } from 'next-contentlayer/hooks'

import { Breadcrumbs, SidebarMenu } from '@/components'
import { InformationBox } from '@/components/information-box'
import { SearchButton } from '@/components/search-button'
import { AppLayout, PageBody } from '@/layouts/app-layout'
import { slugify } from '@/utils/slugify'

import type { Doc } from '@docs'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  Page,
} from 'next'
// import Test from './test.md'
// import type { ImageProps } from 'next/image'
import type { ComponentProps } from 'react'

type Params = { slug: string[] }

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths = allDocs.map(doc => ({
    params: { slug: doc.slug },
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<
  { doc: Doc },
  Params
> = async context => {
  const doc = allDocs.find(
    doc => doc._raw.flattenedPath === context.params!.slug.join('/')
  )!

  if (!doc) {
    return {
      // notFound: true,
      redirect: { destination: '/learn', permanent: false },
    }
  }

  return { props: { doc } }
}

const getNodeText = (node: React.ReactNode): string => {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return node.toString()
  if (node instanceof Array) return node.map(getNodeText).join('')

  if (typeof node === 'object' && (node as any)?.props?.children)
    return getNodeText((node as any).props.children)

  // console.log(node)
  // console.error(`Should be never reached`)
  // debugger

  return ''
}

export const components = {
  h1: (props: ComponentProps<'h1'>) => {
    const slug = slugify(getNodeText(props.children))
    return (
      <h1
        id={slug}
        className="group relative cursor-pointer text-[40px] font-bold"
        {...props}
      >
        {props.children}
      </h1>
    )
  },
  h2: (props: ComponentProps<'h2'>) => {
    const slug = slugify(getNodeText(props.children))
    return (
      <h2
        id={slug}
        className="group relative mb-4 mt-8 cursor-pointer scroll-m-[100px] text-[27px] font-semibold"
        {...props}
      >
        <span className="absolute -left-6 hidden text-slate-400 dark:text-slate-600 lg:group-hover:inline">
          #
        </span>
        <Link href={`#${slug}`}>{props.children}</Link>
      </h2>
    )
  },
  h3: (props: ComponentProps<'h3'>) => {
    const slug = slugify(getNodeText(props.children))
    return (
      <h3
        id={slug}
        className="group relative mb-2 cursor-pointer text-[19px] font-semibold"
        {...props}
      >
        {props.children}
      </h3>
    )
  },
  a: (props: ComponentProps<'a'>) => (
    // @ts-expect-error something with ref
    <Link href={props.href!} {...props}>
      <Text size={15} color="$primary-50" weight="semibold">
        {props.children}
      </Text>
    </Link>
  ),
  p: (props: ComponentProps<'p'>) => <Text size={15}>{props.children}</Text>,
  // img: (props: ImageProps) => (
  //   <Image
  //     alt={props.alt}
  //     sizes="100vw"
  //     style={{ width: '100%', height: 'auto' }}
  //     {...props}
  //   />
  // ),
  // pre: Pre,
  // code: InlineCode,
  blockquote: (props: ComponentProps<'blockquote'>) => {
    return <InformationBox type="tip" message="hi" />
  },
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

type TOCProps = {
  headings: Doc['headings']
}

const TOC = (props: TOCProps) => {
  const { headings } = props
  return (
    <div className="sticky top-0 flex flex-col gap-3 pt-20">
      <Text size={13} weight="medium" color="$neutral-50">
        On this page
      </Text>
      <div className="flex flex-col gap-2">
        {headings.map((heading, index) => (
          <Link key={heading.value + index} href={`#${slugify(heading.value)}`}>
            <Text size={15} weight="medium">
              {heading.value}
            </Text>
          </Link>
        ))}
      </div>
    </div>
  )
}

const MENU_LINKS = [
  {
    label: 'Epics',
    links: [
      {
        label: 'Overview',
        href: '/insights/epics',
      },
      {
        label: 'Community Protocol',
        href: '/insights/epics/community-protocol',
      },
      {
        label: 'Keycard',
        href: '/insights/epics/keycard',
      },
      {
        label: 'Notifications Settings',
        href: '/insights/epics/notifications-settings',
      },
      {
        label: 'Wallet',
        href: '/insights/epics/wallet',
      },
      {
        label: 'Communities',
        href: '/insights/epics/communities',
      },
      {
        label: 'Acitivity Center',
        href: '/insights/epics/activity-center',
      },
    ],
  },
  {
    label: 'Workstreams',
    links: [
      {
        label: 'Overview',
        href: '/insights/workstreams',
      },
      {
        label: 'Community Protocol 2',
        href: '/insights/workstreams/community-protocol-2',
      },
      {
        label: 'Keycard 2',
        href: '/insights/workstreams/keycard-2',
      },
      {
        label: 'Notifications Settings 2',
        href: '/insights/workstreams/notifications-settings-2',
      },
      {
        label: 'Wallet 2',
        href: '/insights/workstreams/wallet-2',
      },
      {
        label: 'Communities 2',
        href: '/insights/workstreams/communities-2',
      },
      {
        label: 'Acitivity Center 2',
        href: '/insights/workstreams/activity-center-2',
      },
    ],
  },
  {
    label: 'Orphans',
    href: '/insights/orphans',
  },
  {
    label: 'Repos',
    href: '/insights/repos',
  },
]

const DocsDetailPage: Page<Props> = ({ doc }) => {
  useLiveReload()
  const Content = useMDXComponent(doc.body.code)

  console.log(generateTree(allDocs.map(doc => doc._raw.flattenedPath)), allDocs)
  return (
    <PageBody>
      <div className="flex">
        <div className="flex-1">
          <Breadcrumbs cutFirstSegment={false} />
        </div>
        <SearchButton size={32} />
      </div>
      <div className="grid grid-cols-[320px_1fr_380px]">
        <SidebarMenu data={MENU_LINKS} />
        <div className="mx-auto max-w-[542px] py-20">
          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <Avatar
                type="user"
                name="Jorge Campo"
                size={20}
                src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
              />
              <Text size={15} weight="semibold">
                Jorge Campo
              </Text>
              <Text size={15} color="$neutral-50">
                on Aug 31, 2022
              </Text>
            </div>

            <Button
              variant="outline"
              size={24}
              icon={<EditIcon size={12} color="$neutral-50" />}
            >
              Edit on GitHub
            </Button>
          </div>

          <h1 className="mb-10 text-[40px] font-bold">{doc.title}</h1>
          {doc.image && (
            <img src={doc.image.src} alt={doc.image.alt} className="mb-10" />
          )}
          <Content components={components} />
          {/* <div
          className="text-sm [&>*:last-child]:mb-0 [&>*]:mb-3"
          dangerouslySetInnerHTML={{ __html: doc.body.html }}
        /> */}
        </div>

        <TOC headings={doc.headings} />
      </div>
    </PageBody>
  )
}

DocsDetailPage.getLayout = AppLayout

export default DocsDetailPage

// import { Doc } from 'contentlayer/generated'
// import { TreeNode } from 'types/TreeNode'

// type TreeNode = {
//   title: string
//   // nav_title: string | null
//   // label: string | null
//   // excerpt: string | null
//   urlPath: string
//   children: TreeNode[]
//   // collapsible: boolean | null
//   // collapsed: boolean | null
// }
// type PathSegment = { order: number; pathName: string }

// export const buildDocsTree = (
//   docs: Doc[],
//   parentPathNames: string[] = []
// ): TreeNode[] => {
//   const level = parentPathNames.length

//   return docs
//     .filter(
//       _ =>
//         _.pathSegments.length === level + 1 &&
//         _.pathSegments
//           .map((_: PathSegment) => _.pathName)
//           .join('/')
//           .startsWith(parentPathNames.join('/'))
//     )
//     .sort((a, b) => a.pathSegments[level].order - b.pathSegments[level].order)
//     .map<TreeNode>(doc => ({
//       // nav_title: doc.nav_title ?? null,
//       title: doc.title,
//       // label: doc.label ?? null,
//       // excerpt: doc.excerpt ?? null,
//       urlPath:
//         '/docs/' +
//         doc.pathSegments.map((_: PathSegment) => _.pathName).join('/'),
//       // collapsible: doc.collapsible ?? null,
//       // collapsed: doc.collapsed ?? null,
//       children: buildDocsTree(
//         docs,
//         doc.pathSegments.map((_: PathSegment) => _.pathName)
//       ),
//     }))
// }

interface TreeNode {
  name: string
  children: TreeNode[]
}

function generateTree(paths: string[]): TreeNode {
  const root: TreeNode = { name: '', children: [] }

  for (const path of paths) {
    const parts = path.split('/')
    let currentNode = root

    for (const part of parts) {
      const existingNode = currentNode.children.find(node => node.name === part)

      if (existingNode) {
        currentNode = existingNode
      } else {
        const newNode: TreeNode = { name: part, children: [] }
        currentNode.children.push(newNode)
        currentNode = newNode
      }
    }
  }

  return root
}
