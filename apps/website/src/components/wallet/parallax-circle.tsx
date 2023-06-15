import { useParalax } from '@/hooks/use-parallax'

type ParalaxProps = {
  initialLeft?: number
  initialTop?: number
  initialRight?: number
  initialBottom?: number
}

const ParalaxCircle = (props: ParalaxProps) => {
  const { top, bottom } = useParalax(props)

  return (
    <div
      className=" bg-customisation-yellow-50 absolute z-[0] h-[676px] w-[676px] rounded-full opacity-[0.08] blur-[260px]"
      style={{
        left: `${props.initialLeft}px`,
        top: `${top}px`,
        right: `${props.initialRight}px`,
        bottom: `${bottom}px`,
      }}
    />
  )
}

export { ParalaxCircle }
