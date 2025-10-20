type Props = {
  children: React.ReactNode
}

export default function LegalLayout({ children }: Props) {
  return (
    <main className="flex justify-center px-5 pb-24 pt-16 xl:pb-40 xl:pt-32">
      <div className="max-w-[702px]">{children}</div>
    </main>
  )
}
