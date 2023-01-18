import type { IconProps } from './types'

export function OptionsIcon(props: IconProps) {
  const { color = 'currentColor', size = 20, ...rest } = props

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle cx={4.5} cy={10} r={1.5} fill={color} />
      <circle cx={10} cy={10} r={1.5} fill={color} />
      <circle cx={15.5} cy={10} r={1.5} fill={color} />
    </svg>
  )
}
