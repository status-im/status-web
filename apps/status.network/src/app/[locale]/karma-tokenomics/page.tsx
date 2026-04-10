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
import type { ComponentProps } from 'react'
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
            <div className="mx-auto w-full max-w-[860px]">
              <div className="mb-10">
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
                  '[&_h2]:mb-3 [&_h2]:mt-12 [&_h2]:scroll-m-[100px] [&_h2]:text-27 [&_h2]:font-600',
                  '[&_p]:mt-5 [&_p]:leading-[1.7]',
                  '[&_strong]:font-600',
                  '[&_em]:italic',
                  '[&_a]:text-purple hover:[&_a]:underline',
                  '[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-6',
                  '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-6',
                  '[&_li]:mt-2 [&_li]:leading-[1.7]',
                  '[&_img]:my-10 [&_img]:w-full [&_img]:rounded-20 [&_img]:border [&_img]:border-neutral-20 [&_img]:bg-neutral-10',
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
  table: ({ className, ...props }: ComponentProps<'table'>) => (
    <div className="my-6 overflow-x-auto rounded-16 border border-neutral-20">
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
  img: ({ alt = '', className, ...props }: ComponentProps<'img'>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={alt} className={className} />
  ),
}
