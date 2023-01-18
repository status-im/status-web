import type { IconProps } from './types'

export function ReactionIcon(props: IconProps) {
  const { color = 'currentColor', size = 20, ...rest } = props

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle cx="10" cy="10" r="6.75" stroke={color} strokeWidth="1.3" />
      <path
        d="M7.525 12a3.5 3.5 0 0 0 4.95 0"
        stroke={color}
        strokeWidth="1.3"
      />
      <circle cx="8" cy="8.5" r="1" fill={color} />
      <circle cx="12" cy="8.5" r="1" fill={color} />
    </svg>
  )
}
