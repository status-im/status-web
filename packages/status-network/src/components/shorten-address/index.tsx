type Props = {
  address: string
}

export const shortenAddress = (address: string) => {
  const prefix = address.slice(0, 5)
  const suffix = address.slice(-4)

  return `${prefix}...${suffix}`
}

const ShortenAddress = ({ address }: Props) => {
  const shortenedAddress = shortenAddress(address)

  return (
    <div className="max-w-[54px] truncate md:max-w-full">
      {shortenedAddress}
    </div>
  )
}

export { ShortenAddress }
export type { Props as ShortenAddressProps }
