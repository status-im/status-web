import { About } from './_components/about'
import { Blog } from './_components/blog'
import { Features } from './_components/features'
import { Hero } from './_components/hero'
import { Network } from './_components/network'
import { Partners } from './_components/partners'
import { PreFooter } from './_components/pre-footer'
import { Tokenomics } from './_components/tokenomics'

export default function Homepage() {
  return (
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
  )
}
