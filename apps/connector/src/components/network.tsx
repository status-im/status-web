import arbitrumImage from 'url:../../assets/network/arbitrum.webp'
import mainnetImage from 'url:../../assets/network/mainnet.webp'
import optimismImage from 'url:../../assets/network/optimism.webp'

const Network = () => {
  return (
    <div className="flex h-[64px] items-center rounded-2xl border border-neutral-10 bg-white-100 px-4">
      <div className="flex w-full items-center">
        <div className="flex flex-1 flex-col">
          <div className="text-13 font-regular text-neutral-50">
            Supported networks
          </div>
          <div className="text-15 font-medium text-neutral-100">
            Mainnet, Optimism, Arbitrum
          </div>
        </div>
        <div className="flex">
          <img
            className="box-content size-6 rounded-full border border-white-100"
            src={mainnetImage}
            alt="Mainnet"
          />
          <img
            className="ml-[-5px] box-content size-6 rounded-full border border-white-100"
            src={optimismImage}
            alt="Optimism"
          />
          <img
            className="ml-[-5px] box-content size-6 rounded-full border border-white-100"
            src={arbitrumImage}
            alt="Arbitrum"
          />
        </div>
      </div>
    </div>
  )
}

export { Network }
