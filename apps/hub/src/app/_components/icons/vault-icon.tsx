import Image from 'next/image'

export type VaultIconType = {
  vault: string
  token: string
}

export default function VaultIcon({ token, vault }: VaultIconType) {
  return (
    <div className="relative size-8">
      <Image
        src={`/tokens/${vault}.png`}
        alt={vault}
        width="64"
        height="64"
        quality="100"
      />
      <Image
        src={`/vaults/${token}.png`}
        alt={token}
        width="24"
        height="24"
        className="absolute -bottom-0.5 -right-1 size-[14px] rounded-full border-2 border-white-100"
      />
    </div>
  )
}
