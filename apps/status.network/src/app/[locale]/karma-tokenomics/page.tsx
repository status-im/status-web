import fs from 'fs/promises'
import path from 'path'
import { BlogHeader } from '~app/_components/blog/blog-header'
import { baseComponents } from '~app/_components/content'
import { Divider } from '~app/_components/divider'
import { Footer } from '~app/_components/footer'
import { Metadata } from '~app/_metadata'
import { jsonLD, JSONLDScript } from '~app/_utils/json-ld'
import { Link } from '~components/link'
import { compileMDX } from 'next-mdx-remote/rsc'
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
    components: baseComponents,
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
            <div className="mx-auto w-full max-w-6xl">
              <div className="mx-auto mb-10">
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
