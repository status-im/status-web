// import { customisation } from '@status-im/colors'

import { useParalax } from '@/hooks/use-parallax'

type ParalaxProps = {
  left?: number
  top?: number
  right?: number
  bottom?: number
  color: string
}

const ParalaxCircle = (props: ParalaxProps) => {
  const { color, ...position } = props
  const parallax = useParalax(props)

  return (
    <div
      style={{
        // '--feature-color': customisation['blue-50'],
        // Fixes the performance issue on safari with filter: blur() to force the browser use GPU acceleration for that particular element instead of the CPU.
        transform: 'translate3d(0, 0, 0)',
        ...position,
        ...parallax,
      }}
      className={
        'pointer-events-none absolute z-[0] h-[676px] w-[676px] rounded-full bg-[var(--feature-color)] opacity-10 blur-[250px] ' +
        color
      }
    />
  )
}

export { ParalaxCircle }
