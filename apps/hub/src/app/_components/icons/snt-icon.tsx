import Image from 'next/image'

export default function SNTIcon() {
  return (
    <div className="relative size-8">
      <Image
        src="/vaults/snt.png"
        alt="SNT"
        width="64"
        height="64"
        quality="100"
      />
      <Image
        src="/tokens/karma.png"
        width="24"
        height="24"
        alt="Karma"
        className="absolute -bottom-0.5 -right-1 size-[14px] rounded-full border-2 border-white-100"
      />
    </div>
  )
}
