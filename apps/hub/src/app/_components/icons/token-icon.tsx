import Image from 'next/image'

export type TokenIconType = {
  token: string
}

export default function TokenIcon({ token }: TokenIconType) {
  return (
    <div className="relative size-8">
      <Image
        src={`/tokens/${token}.png`}
        alt={token}
        width="64"
        height="64"
        quality="100"
      />
    </div>
  )
}
