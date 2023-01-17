import type { IconProps } from './types'

export function MembersIcon(props: IconProps) {
  const { color = 'currentColor', ...rest } = props

  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.15 6a1.85 1.85 0 113.7 0 1.85 1.85 0 01-3.7 0zM8 2.85a3.15 3.15 0 100 6.3 3.15 3.15 0 000-6.3zm-1.25 7.5a4.4 4.4 0 00-4.4 4.4c0 1.049.85 1.9 1.9 1.9h7.5a1.9 1.9 0 001.9-1.9 4.4 4.4 0 00-4.4-4.4h-2.5zm-3.1 4.4a3.1 3.1 0 013.1-3.1h2.5a3.1 3.1 0 013.1 3.1.6.6 0 01-.6.6h-7.5a.6.6 0 01-.6-.6z"
        fill={color}
      />
      <path
        d="M13.5 11h.25a3.75 3.75 0 013.75 3.75v0c0 .69-.56 1.25-1.25 1.25H14.5M11.809 8c1.153 0 2.087-.895 2.087-2s-.934-2-2.087-2"
        stroke={color}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
    </svg>
  )
}
