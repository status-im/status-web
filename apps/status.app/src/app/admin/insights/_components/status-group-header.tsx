type Props = {
  title: string
  description: string
  children: React.ReactNode
}

export const StatusGroupHeader = (props: Props) => {
  const { title, description, children } = props

  return (
    <div className="mb-2">
      <div className="mb-3">
        <h2 className="text-15 font-semibold">{title}</h2>
        <p className="text-13 text-neutral-50">{description}</p>
      </div>
      {children}
    </div>
  )
}
