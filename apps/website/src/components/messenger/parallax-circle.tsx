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
      className=" bg-customisation-yellow-50 absolute z-[0] h-[676px] w-[676px] rounded-full opacity-[0.10] blur-[260px] "
      style={{
        // Fixes the performance issue on safari with filter: blur() to force the browser use GPU acceleration for that particular element instead of the CPU.
        transform: 'translate3d(0, 0, 0)',
        left: `${props.initialLeft}px`,
        top: `${top}px`,
        right: `${props.initialRight}px`,
        bottom: `${bottom}px`,
      }}
    />
  )
}

export { ParalaxCircle }
