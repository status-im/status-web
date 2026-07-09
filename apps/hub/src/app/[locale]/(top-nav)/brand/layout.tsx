type Props = {
  children: React.ReactNode
}

export default function BrandLayout({ children }: Props) {
  return <div className="mx-auto w-full max-w-[1418px]">{children}</div>
}
