import fs from 'fs/promises'
import path from 'path'
import { BlogHeader } from '~app/_components/blog/blog-header'
import { Divider } from '~app/_components/divider'
import { Footer } from '~app/_components/footer'
import { Metadata } from '~app/_metadata'
import { jsonLD, JSONLDScript } from '~app/_utils/json-ld'
import { Link } from '~components/link'
import { cx } from 'cva'
import { compileMDX } from 'next-mdx-remote/rsc'
import { Children, isValidElement, type ComponentProps } from 'react'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { z } from 'zod'

const TITLE = "Karma Tokenomics: Status Network's Reputation Layer"
const DESCRIPTION =
  "Karma is Status Network's soulbound reputation token. Earn it through staking, liquidity, and app usage to unlock gasless transactions and governance."
const PATHNAME = '/karma-tokenomics'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params

  return Metadata({
    title: TITLE,
    description: DESCRIPTION,
    pathname: PATHNAME,
    locale,
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      images: '/karma-tokenomics/flowchart.png',
    },
  })
}

const frontmatterSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
})

async function getKarmaTokenomicsContent() {
  const source = await fs.readFile(
    path.resolve('content/karma-tokenomics.md'),
    'utf8',
  )

  const { frontmatter, content } = await compileMDX<
    z.infer<typeof frontmatterSchema>
  >({
    source,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  })

  const result = frontmatterSchema.safeParse(frontmatter)

  if (!result.success) {
    const errorMessage = result.error.issues
      .map(issue => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ')

    throw new Error(`Invalid Karma tokenomics metadata: ${errorMessage}`)
  }

  return {
    meta: result.data,
    content,
  }
}

const webpageSchema = jsonLD.webpage({
  name: TITLE,
  description: DESCRIPTION,
  url: 'https://status.network/karma-tokenomics',
})

export default async function KarmaTokenomicsPage() {
  const { meta, content } = await getKarmaTokenomicsContent()

  return (
    <>
      <JSONLDScript schema={webpageSchema} />
      <div className="relative flex min-h-screen justify-center overflow-clip px-2 2xl:px-0">
        <div className="relative w-full max-w-[1418px] border-x border-neutral-20">
          <div className="absolute -left-2 top-0 z-50 h-full w-2 bg-gradient-to-r from-white-100 to-[transparent] 2xl:-left-12 2xl:w-12" />
          <div className="absolute -right-2 top-0 z-50 h-full w-2 bg-gradient-to-l from-white-100 to-[transparent] 2xl:-right-12 2xl:w-12" />
          <BlogHeader />
          <main className="px-5 pb-16 pt-10 xl:pb-24 xl:pt-16">
            <div className="mx-auto w-full max-w-[1184px]">
              <div className="mx-auto mb-10 max-w-[860px]">
                <div className="mb-6 text-13 text-neutral-50">
                  <Link href="/" className="hover:text-neutral-100">
                    Home
                  </Link>
                  <span className="mx-2">/</span>
                  <span>{meta.title}</span>
                </div>
                <h1 className="text-40 font-700 xl:text-64">{meta.title}</h1>
                <p className="mt-4 text-19 text-neutral-80/60">
                  {meta.subtitle}
                </p>
              </div>
              <article
                className={[
                  'text-19 text-neutral-100',
                  '[&_strong]:font-600',
                  '[&_em]:italic',
                  '[&_a]:text-purple hover:[&_a]:underline',
                ].join(' ')}
              >
                {content}
              </article>
            </div>
          </main>
          <Divider />
          <Footer />
        </div>
      </div>
    </>
  )
}

const components = {
  a: ({ href, children, ...props }: ComponentProps<'a'>) => {
    if (!href) {
      return <a {...props}>{children}</a>
    }

    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  },
  p: ({ children, className, ...props }: ComponentProps<'p'>) => {
    const childItems = Children.toArray(children).filter(
      child => child !== '\n',
    )
    const onlyChild = childItems[0]
    const isImageOnly =
      childItems.length === 1 &&
      isValidElement<{ src?: unknown }>(onlyChild) &&
      typeof onlyChild.props.src === 'string'

    if (isImageOnly) {
      return <div className="my-10">{children}</div>
    }

    return (
      <p
        {...props}
        className={cx('mx-auto mt-5 max-w-[860px] leading-[1.7]', className)}
      >
        {children}
      </p>
    )
  },
  h2: ({ className, ...props }: ComponentProps<'h2'>) => (
    <h2
      {...props}
      className={cx(
        'mx-auto mb-3 mt-12 max-w-[860px] scroll-m-[100px] text-27 font-600',
        className,
      )}
    />
  ),
  ol: ({ className, ...props }: ComponentProps<'ol'>) => (
    <ol
      {...props}
      className={cx('mx-auto mt-5 max-w-[860px] list-decimal pl-6', className)}
    />
  ),
  ul: ({ className, ...props }: ComponentProps<'ul'>) => (
    <ul
      {...props}
      className={cx('mx-auto mt-5 max-w-[860px] list-disc pl-6', className)}
    />
  ),
  li: ({ className, ...props }: ComponentProps<'li'>) => (
    <li {...props} className={cx('mt-2 leading-[1.7]', className)} />
  ),
  table: ({ className, ...props }: ComponentProps<'table'>) => (
    <div className="mx-auto my-6 max-w-[860px] overflow-x-auto rounded-16 border border-neutral-20">
      <table
        {...props}
        className={cx(
          'min-w-full border-collapse text-left text-15',
          className,
        )}
      />
    </div>
  ),
  th: ({ className, ...props }: ComponentProps<'th'>) => (
    <th
      {...props}
      className={cx(
        'border-b border-neutral-20 bg-neutral-10 px-4 py-3 font-600',
        className,
      )}
    />
  ),
  td: ({ className, ...props }: ComponentProps<'td'>) => (
    <td
      {...props}
      className={cx(
        'border-t border-neutral-20 px-4 py-3 align-top',
        className,
      )}
    />
  ),
  img: ({ alt = '', className, src, ...props }: ComponentProps<'img'>) => {
    const image = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        src={src}
        alt={alt}
        className={cx('w-full min-w-[760px] max-w-none', className)}
      />
    )

    if (typeof src !== 'string') {
      return image
    }

    return (
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${alt || 'Image'} (opens full-size image)`}
        className="relative left-1/2 block w-[calc(100vw-40px)] max-w-[1184px] -translate-x-1/2 overflow-x-auto rounded-20 border border-neutral-20 bg-neutral-10"
      >
        {image}
      </a>
    )
  },
}
