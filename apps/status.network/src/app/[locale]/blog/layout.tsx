import { Divider } from '~app/_components/divider'
import { Footer } from '~app/_components/footer'
import { BlogHeader } from '../../_components/blog/blog-header'

type Props = {
  children: React.ReactNode
}

export default function BlogLayout({ children }: Props) {
  return (
    <div className="relative flex min-h-screen justify-center overflow-clip px-2 2xl:px-0">
      <div className="relative w-full max-w-[1418px] border-x border-neutral-20">
        <div className="absolute -left-2 top-0 z-50 h-full w-2 bg-gradient-to-r from-white-100 to-[transparent] 2xl:-left-12 2xl:w-12" />
        <div className="absolute -right-2 top-0 z-50 h-full w-2 bg-gradient-to-l from-white-100 to-[transparent] 2xl:-right-12 2xl:w-12" />
        <BlogHeader />
        <main>{children}</main>
        <Divider />
        <Footer />
      </div>
    </div>
  )
}
