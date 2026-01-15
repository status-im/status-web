import { About } from '../_components/about'
import { Blog } from '../_components/blog'
import { Divider } from '../_components/divider'
import { Features } from '../_components/features'
import { Footer } from '../_components/footer'
import { Hero } from '../_components/hero'
import { NavBar } from '../_components/navbar'
import { NavBarMobile } from '../_components/navbar-mobile'
import { Network } from '../_components/network'
import { Partners } from '../_components/partners'
import { PreFooter } from '../_components/pre-footer'
import { PromoBar } from '../_components/promo-bar'
import { Tokenomics } from '../_components/tokenomics'
import { generateMetadata as generateMetadataUtil } from '../_utils/generate-metadata'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(props: Props) {
  return generateMetadataUtil(props, {
    titleKey: 'hero.title',
    descriptionKey: 'hero.description',
  })
}

export default async function Homepage({ params }: Props) {
  await params

  return (
    <>
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
