import { Avatar, Button, Text } from '@status-im/components'
import { EditIcon } from '@status-im/icons/12'
import { cx } from 'class-variance-authority'
import { notFound } from 'next/navigation'

import { Metadata } from '~app/_metadata'
import { formatDate } from '~app/_utils/format-time'
import { allSpecsDocs } from '~content'
import { AnchorLink } from '~website/(content)/_components/anchor-link'
import { TOC } from '~website/(content)/_components/toc'
import { getLegalDocumentContent } from '~website/legal/_utils/get-legal-document-content'

const GITHUB_REPO_RFC_URL = 'https://github.com/vacp2p/rfc-index/tree/main'

export const dynamicParams = false

export function generateStaticParams() {
  return allSpecsDocs.map(doc => ({
    slug: doc.slug as unknown as string[], // SpecsDoc#computedFields.slug
  })) satisfies Array<Awaited<Promise<Props['params']>>>
}

export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug
  const doc = allSpecsDocs.find(
    d => (d.slug as unknown as string[]).join('/') === slug.join('/')
  )!

  return Metadata({
    title: doc.title,
    description:
      'Technical deep dives into the inner workings of the Status apps.',
  })
}

// todo: reuse
const MAX_VISIBLE_AUTHORS = 4

type Props = {
  params: Promise<{
    slug: string[]
  }>
}

export default async function SpecsDetailPage(props: Props) {
  const { params } = props
  const slug = (await params).slug
  //   doc: SpecsDoc // | undefined if "Link to unknown file: `../remove-a-status-profile.mdx`remark-validate-links"
  const doc = allSpecsDocs.find(
    d => (d.slug as unknown as string[]).join('/') === slug.join('/')
  )

  if (!doc) {
    return notFound()
  }

  const authors = doc.authors as string[]
  const hasMultipleAuthors = authors.length > 1
  const mainAuthor = authors[0]!
  const otherAuthors = authors.slice(1, MAX_VISIBLE_AUTHORS)

  const { content } = await getLegalDocumentContent(doc['_raw'].sourceFilePath)

  return (
    <div className="flex min-w-0 flex-1 justify-center gap-[113px] px-5 py-12 xl:pb-30 xl:pt-20">
      {/* Content */}
      <div className="container-specs w-full">
        {/* header */}
        <div className="mb-3 flex flex-col-reverse items-start gap-3 2md:flex-row 2md:items-center 2md:justify-between">
          <div className="flex items-center gap-1">
            {/* <Link
                  href={`https://github.com/${mainAuthor}`}
                  className="flex items-center gap-1"
                > */}
            <Avatar
              type="user"
              size="20"
              name={mainAuthor}
              // fixme: upstream does not use GitHub usernames
              // src={`https://github.com/${mainAuthor}.png`}
            />
            <Text size={15} weight="semibold">
              {mainAuthor}
            </Text>
            {/* </Link> */}
            {hasMultipleAuthors && (
              <div className="flex items-center gap-1">
                <div className="cursor-default select-none">
                  <Text size={15} color="$neutral-50">
                    and
                  </Text>
                </div>
                {/* Map authors array removing the first element */}
                <div className="flex">
                  {otherAuthors.length > 0 &&
                    otherAuthors.map((author, index) => (
                      // fixme: upstream does not use GitHub usernames
                      // <Link
                      //   key={index}
                      //   href={`https://github.com/${author}`}
                      //   className="-ml-2 flex items-center"
                      // >
                      <div
                        key={index}
                        className={cx(
                          index > 0 && '-ml-2',
                          'flex items-center'
                        )}
                      >
                        <div
                          style={{
                            zIndex: index,
                          }}
                          className="flex items-center rounded-full border border-white-100 bg-white-100"
                        >
                          <Avatar
                            type="user"
                            size="20"
                            name={author}
                            // src={`https://github.com/${author}.png`}
                          />
                        </div>
                      </div>
                      // </Link>
                    ))}
                  {authors.length > MAX_VISIBLE_AUTHORS && (
                    <div className="z-10 -ml-2 flex size-[23px] cursor-default select-none items-center justify-center rounded-full border border-white-100 bg-neutral-20">
                      <Text size={11} color="$neutral-50">
                        +{authors.length - MAX_VISIBLE_AUTHORS}
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="cursor-default select-none">
              <Text size={15} color="$neutral-50">
                on {formatDate(new Date(doc.lastEdited))}
              </Text>
            </div>
          </div>

          <Button
            variant="outline"
            size="24"
            iconBefore={<EditIcon />}
            href={`${GITHUB_REPO_RFC_URL}/${doc._raw.sourceFilePath.replace(
              'specs',
              ''
            )}`}
          >
            Edit on GitHub
          </Button>
        </div>

        <div className="root-content">
          <hgroup className="mb-5">
            <h1 className="text-40 font-bold">
              <AnchorLink id={doc.titleSlug}>{doc.title}</AnchorLink>
            </h1>
            {/* <p className="text-15 font-bold">{doc.name}</p> */}
          </hgroup>

          {/* <article
                className="root-content"
                dangerouslySetInnerHTML={{ __html: html }}
              /> */}
          <article className="root-content">{content}</article>
        </div>
      </div>

      {/* Table of contents */}
      <div className="hidden w-[260px] 2xl:block">
        <div className="sticky top-10">
          <TOC headings={doc.headings} />
        </div>
      </div>
    </div>
  )
}
