import { About } from '~app/_components/about'
import { Blog } from '~app/_components/blog/blog-section'
import { Features } from '~app/_components/features'
import { Hero } from '~app/_components/hero'
import { Network } from '~app/_components/network'
import { Partners } from '~app/_components/partners'
import { PreFooter } from '~app/_components/pre-footer'
import { Tokenomics } from '~app/_components/tokenomics'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, Metadata } from '~app/_metadata'
import { jsonLD, JSONLDScript } from '~app/_utils/json-ld'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(props: Props) {
  const { locale } = await props.params

  return Metadata({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    pathname: '/',
    locale,
  })
}

const webpageSchema = jsonLD.webpage({
  name: 'A Privacy-First Gasless Ethereum Layer 2 Powered by Native Yield',
  description:
    'Status Network is a privacy-first, fully gasless Ethereum Layer 2. It replaces per-transaction gas with reputation-based coordination and uses native yield and network activity to cover execution costs.',
  url: 'https://status.network/',
})

export default async function Homepage({ params }: Props) {
  await params

  return (
    <>
      <JSONLDScript schema={webpageSchema} />
      <main className="flex w-full flex-col items-center">
        <Hero />
        <About />
        <Features />
        <Partners />
        <Network />
        <Tokenomics />
        <Blog />
        <PreFooter />
      </main>
    </>
  )
}
