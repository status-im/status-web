import { allDocs } from '@docs'
import { Avatar, Button, Text } from '@status-im/components'
import { EditIcon } from '@status-im/icons'
// import Image from 'next/image'
import Link from 'next/link'
import { useLiveReload, useMDXComponent } from 'next-contentlayer/hooks'

import { InformationBox } from '@/components/information-box'
import { SearchButton } from '@/components/search-button'
import { AppLayout, Breadcrumbs, PageBody } from '@/layouts/app-layout'

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

export const components = {
  h1: (props: ComponentProps<'h1'>) => (
    <h1 className="text-[40px] font-bold" {...props}>
      {props.children}
    </h1>
  ),
  h2: (props: ComponentProps<'h2'>) => (
    <h2 className="mb-4 mt-8 text-[27px] font-semibold" {...props}>
      {props.children}
    </h2>
  ),
  h3: (props: ComponentProps<'h3'>) => (
    <h3 className="mb-2 text-[19px] font-semibold" {...props}>
      {props.children}
    </h3>
  ),
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

const TOC = () => {
  return (
    <div className="sticky top-0 flex flex-col gap-3 pt-20">
      <Text size={13} weight="medium" color="$neutral-50">
        On this page
      </Text>
      <div className="flex flex-col gap-2">
        <Text size={15} weight="medium">
          Create a new Status profile
        </Text>
        <Text size={15} weight="medium">
          Create a new Status
        </Text>
        <Text size={15} weight="medium">
          Create Status profile
        </Text>
        <Text size={15} weight="medium">
          Create a new Status profile
        </Text>
      </div>
    </div>
  )
}

const DocsDetailPage: Page<Props> = ({ doc }) => {
  useLiveReload()
  const Content = useMDXComponent(doc.body.code)

  return (
    <PageBody>
      <Breadcrumbs action={<SearchButton size={32} />} />
      <div className="grid grid-cols-[auto,790px,auto]">
        <div>sidebar</div>
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

        <TOC />
      </div>
    </PageBody>
  )
}

DocsDetailPage.getLayout = AppLayout

export default DocsDetailPage
