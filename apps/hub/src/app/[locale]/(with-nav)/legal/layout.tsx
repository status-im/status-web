type Props = {
  children: React.ReactNode
}

export default function LegalLayout({ children }: Props) {
  return (
    <div className="mx-auto w-full max-w-[702px] px-5 pb-24 pt-16 xl:pb-40 xl:pt-32">
      {children}
    </div>
  )
}
