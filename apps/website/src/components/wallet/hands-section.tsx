import { Text } from '@status-im/components'

const HandsSection = () => {
  return (
    <div className="relative bg-[url('/assets/wallet/background-pattern.png')] bg-[length:100%_100%] bg-no-repeat py-[322px]">
      <div className="mx-40 mb-24">
        <div className="flex flex-col items-center justify-center">
          <h2 className="max-w-[600px] py-4 pb-5 text-center text-64">
            Take control
            <br />
            of your crypto
          </h2>
          <span className="max-w-xl text-center font-bold">
            <Text size={27}>
              No one (including Status!) has the power to freeze, lock-out or
              stop a Status user from accessing and transacting their tokens.
            </Text>
          </span>
        </div>
      </div>
      <div className="relative z-[2] flex justify-center pt-[320px]">
        <div className="mr-24 flex max-w-[381px] flex-col items-center">
          <img src="/assets/wallet/skull.png" alt="skull" width="48px" />
          <div className="flex flex-col items-center pt-4 text-center">
            <Text size={27} weight="semibold">
              Ethereum based assets
            </Text>
            <Text size={19}>
              We support all assets in the Uniswap Labs default tokenlist and
              those minted by communities using Status.
            </Text>
          </div>
        </div>
        <div className="flex max-w-[381px] flex-col items-center">
          <img src="/assets/wallet/nft.png" alt="nft" width="48px" />
          <div className="flex flex-col items-center pt-4 text-center">
            <Text size={27} weight="semibold">
              NFTs and collectibles
            </Text>
            <Text size={19}>
              We will display any NFTs or collectibles listed on OpenSea plus
              those minted by communities using Status.
            </Text>
          </div>
        </div>
      </div>
      <img
        src="/assets/wallet/hands.png"
        alt="hands"
        className="absolute left-0 top-0 w-full"
      />
      <img
        src="/assets/wallet/gentleman.png"
        alt="gentleman"
        className="absolute bottom-0 left-0 mix-blend-multiply"
        width={403}
      />
    </div>
  )
}

export { HandsSection }
