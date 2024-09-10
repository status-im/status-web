import type { SVGProps } from 'react'

const SvgPositiveStateIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      stroke="#23ADA0"
      strokeWidth={1.2}
      d="M1.6 8a6.4 6.4 0 1 1 12.8 0A6.4 6.4 0 0 1 1.6 8Z"
      opacity={0.4}
    />
    <path stroke="#23ADA0" strokeWidth={1.2} d="m5 8 2 2 4-4" />
  </svg>
)
export default SvgPositiveStateIcon
