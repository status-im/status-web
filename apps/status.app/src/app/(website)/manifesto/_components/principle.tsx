type Props = {
  number: string
  title: string
  description: string
}

export const Principle = (props: Props) => {
  const { number, title, description } = props

  return (
    <div className="relative z-20">
      <div className="relative flex items-center pb-2">
        <span className="left-[-68px] w-auto pr-4 text-right font-caveat text-27 font-semibold text-neutral-80/40 lg:absolute lg:w-16">
          {number}
        </span>
        <p className="text-27 font-semibold">{title}</p>
      </div>
      <p className="text-19 text-blur-neutral-80/80">{description}</p>
    </div>
  )
}
