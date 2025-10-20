import { Text } from '@status-im/components'

import { Icon, Video } from '~components/assets'

import type { ImageId } from '~components/assets'

const HandsSection = () => {
  return (
    <div className="relative z-20 bg-white-100">
      <div className="container-lg relative pb-24 pt-40 xl:pb-40 xl:pt-20">
        <div className="relative grid aspect-[0.44] place-content-center 2md:aspect-[1.715]">
          {/* MOBILE VIDEO */}
          <div className="absolute -inset-x-6 top-10 scale-[1.7] sm:scale-150 2md:hidden">
            <Video
              id="Non Beta Release/Animations/Wallet_01_Mobile:990:1467"
              posterId="Non Beta Release/Animations/Frames/Wallet_01_Mobile_Frame:990:1467"
            />
          </div>
          {/* DESKTOP VIDEO  */}
          <div className="absolute -inset-x-10 top-10 z-0 hidden h-full scale-[1.15] 2md:block">
            <Video
              id="Non Beta Release/Animations/Wallet_01:2256:1178"
              posterId="Non Beta Release/Animations/Frames/Wallet_01_Frame:2256:1178"
            />
          </div>

          <div className="relative z-10 -mt-20 max-w-[582px] text-center sm:-mt-40 2md:mt-0">
            <h2 className="mb-2 text-27 font-bold">Own your crypto</h2>
            <span className="text-27 font-regular">
              No one can freeze, lock out or stop you from accessing or
              transacting your tokens.
            </span>
          </div>
        </div>
        {/* Gradient effect with texture */}
        <div className="mask-image absolute bottom-0 left-1/2 h-[1200px] w-screen -translate-x-1/2 bg-[url('/texture-gradient.png')] bg-[length:420px]" />
        <div className="absolute bottom-0 left-1/2 z-[2] h-[1000px] w-screen -translate-x-1/2 bg-gradient-to-t from-default-customisation-yellow-50/5 to-transparent" />

        <div className="relative z-[2] flex flex-col items-center justify-center gap-12 pt-30 2md:flex-row 2md:gap-5">
          {FOOTER_DATA.map(item => (
            <div
              key={item.title}
              className="flex flex-col items-center gap-4 xl:max-w-[460px] xl:px-10"
            >
              <Icon id={item.icon} />
              <div className="flex flex-col items-center gap-1 text-center">
                <Text size={27} weight="semibold">
                  {item.title}
                </Text>
                <Text size={19}>{item.description}</Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const FOOTER_DATA = [
  {
    icon: 'Non Beta Release/Icons/03:145:144' satisfies ImageId,
    title: 'Multi-chain token support',
    description:
      'Access a live-updating token list synced from top DEXes across multiple chains.',
  },
  {
    icon: 'Non Beta Release/Icons/04:145:144' satisfies ImageId,
    title: 'NFTs and collectibles',
    description:
      'Collect and showcase any NFT or digital collectible listed on OpenSea and other major NFT platforms.',
  },
] as const

export { HandsSection }
