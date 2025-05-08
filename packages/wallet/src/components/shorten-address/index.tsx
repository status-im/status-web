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

  return shortenedAddress
}

export { ShortenAddress }
export type { Props as ShortenAddressProps }
