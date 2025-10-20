import { Avatar, Tag, Text } from '@status-im/components'
import { CrownIcon, GavelIcon, TokenMasterIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import config from '~/config/help/config.json'
import { METADATA } from '~/config/help/metadata'
import { Metadata } from '~app/_metadata'
import { formatDate } from '~app/_utils/format-time'
import { Icon } from '~components/assets'
import { Breadcrumbs } from '~components/breadcrumbs'
import { Admonition } from '~components/content/admonition'
import { Link } from '~components/link'
import { allHelpDocs } from '~content'
import { AnchorLink } from '~website/(content)/_components/anchor-link'
import { SearchButton } from '~website/(content)/_components/search-button'
import { TOC } from '~website/(content)/_components/toc'
import { getLegalDocumentContent } from '~website/legal/_utils/get-legal-document-content'

import { FeedbackSection } from './_components/feedback-section'
import { getCategory } from './_utils/get-category'

import type { IconElement } from '@status-im/components'

// const GITHUB_REPO_CONTENT_URL = 'https://github.com/status-im/status-website/tree/main/content'

type Role = 'Admins' | 'TokenMasters' | 'Owners'

const roleIcons: Record<Role, IconElement> = {
  Admins: <GavelIcon />,
  TokenMasters: <TokenMasterIcon />,
  Owners: <CrownIcon />,
}

type Params = { slug: string[] }

export const dynamicParams = false

export async function generateStaticParams() {
  return allHelpDocs.map(doc => ({
    slug: doc.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug
  const doc = allHelpDocs.find(d => d.slug.join('/') === slug.join('/'))!

  return Metadata({
    title: doc.title,
    description: 'Short-form guides on how to set up and use the app.',
  })
}

type Props = {
  params: Promise<Params>
}

const MAX_VISIBLE_AUTHORS = 4

export default async function HelpDetailPage(props: Props) {
  const { params } = props
  const slug = (await params).slug
  const doc = allHelpDocs.find(d => d.slug.join('/') === slug.join('/'))

  if (!doc) {
    return notFound()
  }

  // root
  const breadcrumbs = [
    {
      label: 'Help',
      href: '/help',
    },
  ]

  // last slug is the current page
  for (const parentSlug of doc.slug.slice(0, -1)) {
    // const parentDoc = allDocs.find(d => d.slug.join('/') === parentSlug.join("/"))!

    breadcrumbs.push({
      label: getCategory(config, doc.url) ?? '',
      href: `/help/${parentSlug}`,
    })
  }

  // current page
  breadcrumbs.push({
    label: doc.title,
    href: doc.url,
  })

  const basePath = `/${doc['_raw'].sourceFileDir}`
  const isIndex = doc['_raw'].sourceFileName.includes('index.md')
  const { content } = await getLegalDocumentContent(doc['_raw'].sourceFilePath)

  const workInProgress = doc.body.raw === ''

  const authors = (doc.author ?? '')
    .split(',')
    .map(author => author.trim())
    .filter(Boolean)

  const hasMultipleAuthors = authors.length > 1
  const mainAuthor = authors[0]
  const otherAuthors = authors.slice(1, MAX_VISIBLE_AUTHORS)

  return (
    <>
      <Breadcrumbs
        items={breadcrumbs}
        action={<SearchButton type="help" size={32} />}
      />
      <div className="flex min-w-0 flex-1 justify-center gap-[113px] px-5 py-12 lg:pl-[340px] xl:pb-30 xl:pt-20">
        {/* Content */}
        <div className="container-help w-full">
          {/* header */}
          {isIndex === false && workInProgress === false && mainAuthor && (
            <div className="mb-3 flex flex-col-reverse items-start gap-3 2md:flex-row 2md:items-center 2md:justify-between">
              <div className="flex items-center gap-1">
                <Link
                  href={`https://github.com/${mainAuthor}`}
                  className="flex items-center gap-1"
                >
                  <Avatar
                    type="user"
                    size="20"
                    name={mainAuthor || ''}
                    src={`https://github.com/${mainAuthor}.png`}
                  />
                  <Text size={15} weight="semibold">
                    {mainAuthor}
                  </Text>
                </Link>
                {hasMultipleAuthors && (
                  <div className="flex items-center">
                    <div className="mr-[14px] cursor-default select-none">
                      <Text size={15} color="$neutral-50">
                        and
                      </Text>
                    </div>
                    {/* Map authors array removing the first element */}
                    {otherAuthors.length > 0 &&
                      otherAuthors.map((author, index) => (
                        <Link
                          key={index}
                          href={`https://github.com/${author}`}
                          className="-ml-2 flex items-center"
                        >
                          <div
                            style={{
                              zIndex: index,
                            }}
                            className="flex items-center rounded-full border-2 border-white-100 bg-white-100"
                          >
                            <Avatar
                              type="user"
                              size="20"
                              name={author}
                              src={`https://github.com/${author}.png`}
                            />
                          </div>
                        </Link>
                      ))}
                    {authors.length > MAX_VISIBLE_AUTHORS && (
                      <div className="z-10 -ml-2 flex size-[23px] cursor-default select-none items-center justify-center rounded-full border border-white-100 bg-neutral-20">
                        <Text size={11} color="$neutral-50">
                          +{authors.length - MAX_VISIBLE_AUTHORS}
                        </Text>
                      </div>
                    )}
                  </div>
                )}

                <div className="cursor-default select-none">
                  <Text size={15} color="$neutral-50">
                    on {formatDate(new Date(doc.lastEdited))}
                  </Text>
                </div>
              </div>

              {/* <Button
            variant="outline"
            size="24"
            iconBefore={<EditIcon />}
            href={`${GITHUB_REPO_CONTENT_URL}/${doc._raw.sourceFilePath}`}
          >
            Edit on GitHub
          </Button> */}
            </div>
          )}

          <div className="root-content">
            {isIndex && (
              <div className="mb-3">
                <Icon
                  size={64}
                  priority
                  id={
                    Object.values(METADATA).find(
                      ({ href }) => basePath === href
                    )!.icon
                  }
                />
              </div>
            )}

            <h1
              className={cx(
                'flex items-center gap-2 text-40 font-bold',
                isIndex ? 'mb-2' : 'mb-5'
              )}
            >
              <AnchorLink id={doc.titleSlug}>{doc.title}</AnchorLink>
              {doc.beta && <Tag size="32" label="Beta" />}
            </h1>
            {doc.roles && doc.roles.length > 0 && (
              <div className="-mt-1 mb-5 flex items-center gap-2">
                <span className="text-13 font-medium text-neutral-50">
                  Only relevant to:
                </span>
                <div className="flex items-center justify-center gap-1 align-middle">
                  {doc.roles.map(role => (
                    <Tag
                      key={role}
                      size="24"
                      label={role}
                      icon={roleIcons[role]}
                    />
                  ))}
                </div>
              </div>
            )}
            {doc.image && (
              <Image
                src={doc.image.src}
                alt={doc.image.alt}
                className="mb-10"
              />
            )}
            {workInProgress ? (
              <Admonition type="info">
                {`We're working on this content.`}
              </Admonition>
            ) : (
              <>{content}</>
            )}
          </div>
          {!(isIndex || workInProgress) && (
            <>
              {doc.lastEditedAuthor && (
                <div className="flex flex-col gap-2 border-b border-dashed border-neutral-20 py-5">
                  <Text size={13} weight="medium" color="$neutral-50">
                    Updated by
                  </Text>
                  <div className="flex flex-row gap-1">
                    {doc.lastEditedAuthor.githubUsername ? (
                      <Link
                        href={`https://github.com/${doc.lastEditedAuthor.githubUsername}`}
                        className="flex items-center gap-1"
                      >
                        <Avatar
                          type="user"
                          size="20"
                          name={doc.lastEditedAuthor.githubUsername}
                          src={`https://github.com/${doc.lastEditedAuthor.githubUsername}.png`}
                        />
                        <Text size={15} weight="semibold">
                          {doc.lastEditedAuthor.githubUsername}
                        </Text>
                      </Link>
                    ) : (
                      <>
                        <Avatar
                          type="user"
                          size="20"
                          name={doc.lastEditedAuthor.displayName}
                        />
                        <Text size={15} weight="semibold">
                          {doc.lastEditedAuthor.displayName}
                        </Text>
                      </>
                    )}
                    <Text size={15} color="$neutral-50">
                      on {formatDate(new Date(doc.lastEdited))}
                    </Text>
                  </div>
                </div>
              )}
              <FeedbackSection articleUrl={doc.url.replace('/help', '')} />
            </>
          )}
        </div>

        {/* Table of contents */}
        <div className="hidden w-[260px] 2xl:block">
          {(!isIndex || workInProgress) && (
            <div className="sticky top-10">
              <TOC headings={doc.headings} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
