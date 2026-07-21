import { Body } from '~components/body'

type Props = {
  children: React.ReactNode
}

export default function LegalLayout({ children }: Props) {
  return (
    <Body className="pb-24 pt-16 xl:pb-40 xl:pt-32">
      <div className="container max-w-[742px]">{children}</div>
    </Body>
  )
}
