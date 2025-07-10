import type { ComponentProps } from 'react'

type Props = {
  color: string
} & Pick<ComponentProps<'div'>, 'className'>

const BlurredCircle = ({ color, className }: Props) => {
  return (
    <div data-customisation={color} className={className}>
      <div className="size-[468px] rounded-full bg-customisation-50 opacity-[6%] blur-[100px]" />
    </div>
  )
}

export { BlurredCircle }
