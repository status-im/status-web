import { About } from '~app/_components/about'
import { Blog } from '~app/_components/blog/blog-section'
import { Divider } from '~app/_components/divider'
import { Features } from '~app/_components/features'
import { Footer } from '~app/_components/footer'
import { Hero } from '~app/_components/hero'
import { NavBar } from '~app/_components/navbar'
import { NavBarMobile } from '~app/_components/navbar-mobile'
import { Network } from '~app/_components/network'
import { Partners } from '~app/_components/partners'
import { PreFooter } from '~app/_components/pre-footer'
import { PromoBar } from '~app/_components/promo-bar'
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
      <PromoBar />
      <div className="relative flex min-h-screen justify-center overflow-clip px-2 2xl:px-0">
        <div className="relative w-full max-w-[1418px] border-x border-neutral-20">
          <div className="absolute -left-2 top-0 z-50 h-full w-2 bg-gradient-to-r from-white-100 to-[transparent] 2xl:-left-12 2xl:w-12" />
          <div className="absolute -right-2 top-0 z-50 h-full w-2 bg-gradient-to-l from-white-100 to-[transparent] 2xl:-right-12 2xl:w-12" />
          <NavBar />
          <NavBarMobile />
          <main className="flex w-full flex-col items-center">
            <Hero />
            <About />
            <Features />
            <Partners />
            <Network />
            <Tokenomics />
            <Blog />
            <PreFooter />
          </main>{' '}
          <Divider />
          <Footer />
        </div>
      </div>
    </>
  )
}
