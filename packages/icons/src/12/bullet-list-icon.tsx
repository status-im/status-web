import type { SVGProps } from 'react'

const SvgBulletListIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="M3 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      clipRule="evenodd"
    />
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="M4 1.45h7v1.1H4v-1.1Zm0 4h7v1.1H4v-1.1Zm7 4H4v1.1h7v-1.1Z"
      clipRule="evenodd"
      opacity={0.4}
    />
  </svg>
)
export default SvgBulletListIcon
